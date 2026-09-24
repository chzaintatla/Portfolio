from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import select

from app.api.crud import apply_payload, commit_or_409, flush_or_409
from app.core.deps import DB, audit, require
from app.models import Project, ProjectImage, Service, Technology, User
from app.schemas import ProjectCard, ProjectIn, ProjectOut
from app.services.revalidate import revalidate

router = APIRouter(prefix="/api/projects", tags=["projects"])
admin = APIRouter(prefix="/api/admin/projects", tags=["admin:projects"])

HTML_FIELDS = ("long_description", "challenge", "solution", "design_notes", "development_notes", "architecture")
ORDER = (Project.featured.desc(), Project.order, Project.id)


@router.get("", response_model=list[ProjectCard])
def list_projects(db: DB, featured: bool | None = None, category: str | None = None):
    q = select(Project).where(Project.published.is_(True))
    if featured is not None:
        q = q.where(Project.featured.is_(featured))
    if category:
        q = q.where(Project.category == category)
    return db.scalars(q.order_by(*ORDER)).all()


@router.get("/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: DB):
    project = db.scalar(select(Project).where(Project.slug == slug, Project.published.is_(True)))
    if not project:
        raise HTTPException(404, "Project not found")
    return project


def _apply(db, project: Project, payload: ProjectIn) -> dict:
    data = payload.model_dump(exclude_unset=True)
    images = data.pop("images", None)
    tech_ids = data.pop("technology_ids", None)
    service_ids = data.pop("service_ids", None)
    apply_payload(db, project, data, html_fields=HTML_FIELDS, title_field="title")
    if images is not None:
        project.images = [ProjectImage(**img, order=i) for i, img in enumerate(images)]
    if tech_ids is not None:
        project.technologies = list(db.scalars(select(Technology).where(Technology.id.in_(tech_ids))))
    if service_ids is not None:
        project.services = list(db.scalars(select(Service).where(Service.id.in_(service_ids))))
    return data


@admin.get("", response_model=list[ProjectOut], dependencies=[Depends(require("projects:read"))])
def admin_list(db: DB):
    return db.scalars(select(Project).order_by(*ORDER)).all()


@admin.get("/{project_id}", response_model=ProjectOut, dependencies=[Depends(require("projects:read"))])
def admin_get(project_id: int, db: DB):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    return project


@router.post("", response_model=ProjectOut, status_code=201)
def create_project(
    payload: ProjectIn, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("projects:write")),
):
    if not payload.title:
        raise HTTPException(422, "Title is required")
    project = Project()
    _apply(db, project, payload)
    db.add(project)
    flush_or_409(db)
    audit(db, request, user, "create", "projects", project.id, project.title)
    commit_or_409(db)
    revalidate(background, "projects", "services")
    return project


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int, payload: ProjectIn, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("projects:write")),
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    old_slug = project.slug
    changed = _apply(db, project, payload)
    audit(db, request, user, "update", "projects", project.id, ", ".join(sorted(changed)))
    commit_or_409(db)
    revalidate(background, "projects", f"project:{old_slug}", f"project:{project.slug}", "services")
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("projects:delete")),
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    audit(db, request, user, "delete", "projects", project.id, project.title)
    db.delete(project)
    db.commit()
    revalidate(background, "projects", f"project:{project.slug}", "services")
