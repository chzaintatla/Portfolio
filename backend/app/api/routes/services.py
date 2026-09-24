from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import select

from app.api.crud import apply_payload, commit_or_409, flush_or_409
from app.core.deps import DB, audit, require
from app.models import Service, ServiceFeature, Technology, User
from app.schemas import ServiceIn, ServiceOut
from app.services.revalidate import revalidate

router = APIRouter(prefix="/api/services", tags=["services"])
admin = APIRouter(prefix="/api/admin/services", tags=["admin:services"])

ORDER = (Service.order, Service.id)


@router.get("", response_model=list[ServiceOut])
def list_services(db: DB, group: str | None = None, home: bool | None = None):
    q = select(Service).where(Service.published.is_(True))
    if group:
        q = q.where(Service.group == group)
    if home is not None:
        q = q.where(Service.show_on_home.is_(home))
    return db.scalars(q.order_by(*ORDER)).all()


@router.get("/{slug}", response_model=ServiceOut)
def get_service(slug: str, db: DB):
    service = db.scalar(select(Service).where(Service.slug == slug, Service.published.is_(True)))
    if not service:
        raise HTTPException(404, "Service not found")
    out = ServiceOut.model_validate(service)
    # Only surface published related projects on the public site.
    published_ids = {p.id for p in service.projects if p.published}
    out.projects = [p for p in out.projects if p.id in published_ids]
    return out


def _apply(db, service: Service, payload: ServiceIn) -> dict:
    data = payload.model_dump(exclude_unset=True)
    features = data.pop("features", None)
    tech_ids = data.pop("technology_ids", None)
    apply_payload(db, service, data, html_fields=("body",), title_field="title")
    if features is not None:
        service.features = [ServiceFeature(**f, order=i) for i, f in enumerate(features)]
    if tech_ids is not None:
        service.technologies = list(db.scalars(select(Technology).where(Technology.id.in_(tech_ids))))
    return data


@admin.get("", response_model=list[ServiceOut], dependencies=[Depends(require("services:read"))])
def admin_list(db: DB):
    return db.scalars(select(Service).order_by(*ORDER)).all()


@admin.get("/{service_id}", response_model=ServiceOut, dependencies=[Depends(require("services:read"))])
def admin_get(service_id: int, db: DB):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(404, "Service not found")
    return service


@router.post("", response_model=ServiceOut, status_code=201)
def create_service(
    payload: ServiceIn, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("services:write")),
):
    if not payload.title:
        raise HTTPException(422, "Title is required")
    service = Service()
    _apply(db, service, payload)
    db.add(service)
    flush_or_409(db)
    audit(db, request, user, "create", "services", service.id, service.title)
    commit_or_409(db)
    revalidate(background, "services")
    return service


@router.put("/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: int, payload: ServiceIn, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("services:write")),
):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(404, "Service not found")
    changed = _apply(db, service, payload)
    audit(db, request, user, "update", "services", service.id, ", ".join(sorted(changed)))
    commit_or_409(db)
    revalidate(background, "services")
    return service


@router.delete("/{service_id}", status_code=204)
def delete_service(
    service_id: int, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("services:delete")),
):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(404, "Service not found")
    audit(db, request, user, "delete", "services", service.id, service.title)
    db.delete(service)
    db.commit()
    revalidate(background, "services")
