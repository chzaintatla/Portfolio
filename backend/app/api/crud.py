"""Generic CMS router factory.

For a resource it produces:
  public:  GET  /api/{name}            published records, ordered
           GET  /api/{name}/{slug}     one published record (when the model has a slug)
  admin:   GET  /api/admin/{name}      every record
           GET  /api/admin/{name}/{id}
           POST /api/{name}            create      (permission "{perm}:write")
           PUT  /api/{name}/{id}       update      (partial; unset fields untouched)
           DELETE /api/{name}/{id}     delete      (permission "{perm}:delete")
           PUT  /api/{name}/reorder    bulk order update
"""

from collections.abc import Callable, Sequence
from typing import Any

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.deps import DB, audit, require
from app.models import User
from app.services.revalidate import revalidate
from app.services.sanitize import clean_html, slugify


class OrderItem(BaseModel):
    id: int
    order: int


def unique_slug(db: Session, model: Any, base: str, exclude_id: int | None = None) -> str:
    slug, n = slugify(base), 2
    candidate = slug
    while True:
        q = select(model.id).where(model.slug == candidate)
        if exclude_id:
            q = q.where(model.id != exclude_id)
        if not db.scalar(q):
            return candidate
        candidate, n = f"{slug}-{n}", n + 1


def apply_payload(
    db: Session, obj: Any, data: dict, *, html_fields: Sequence[str] = (), title_field: str | None = None,
) -> None:
    model = type(obj)
    for field in html_fields:
        if field in data:
            data[field] = clean_html(data[field])
    if hasattr(model, "slug"):
        if data.get("slug"):
            data["slug"] = unique_slug(db, model, data["slug"], getattr(obj, "id", None))
        elif not getattr(obj, "slug", None) and title_field and data.get(title_field):
            data["slug"] = unique_slug(db, model, data[title_field])
    for key, value in data.items():
        if hasattr(obj, key):
            setattr(obj, key, value)


def _integrity(exc: IntegrityError) -> HTTPException:
    msg = str(exc.orig).lower()
    if "foreign key" in msg:
        return HTTPException(422, "A referenced record (e.g. category or service) does not exist")
    return HTTPException(409, "A record with the same unique value already exists")


def commit_or_409(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise _integrity(exc) from exc


def flush_or_409(db: Session) -> None:
    try:
        db.flush()
    except IntegrityError as exc:
        db.rollback()
        raise _integrity(exc) from exc


def crud_router(
    *,
    name: str,
    model: Any,
    out: type[BaseModel],
    create: type[BaseModel],
    permission: str,
    title_field: str = "title",
    html_fields: Sequence[str] = (),
    public: bool = True,
    publish_field: str | None = "published",
    order_by: Callable[[Any], Sequence[Any]] | None = None,
    tags: Sequence[str] = (),
) -> tuple[APIRouter, APIRouter]:
    pub = APIRouter(prefix=f"/api/{name}", tags=[name])
    adm = APIRouter(prefix=f"/api/admin/{name}", tags=[f"admin:{name}"])
    ordering = order_by(model) if order_by else ([model.order, model.id] if hasattr(model, "order") else [model.id])
    cache_tags = tuple(tags) or (name,)

    if public:
        @pub.get("", response_model=list[out])
        def list_public(db: DB):
            q = select(model)
            if publish_field:
                q = q.where(getattr(model, publish_field).is_(True))
            return db.scalars(q.order_by(*ordering)).all()

        if hasattr(model, "slug"):
            @pub.get("/{slug}", response_model=out)
            def get_public(slug: str, db: DB):
                q = select(model).where(model.slug == slug)
                if publish_field:
                    q = q.where(getattr(model, publish_field).is_(True))
                obj = db.scalar(q)
                if not obj:
                    raise HTTPException(404, "Not found")
                return obj

    @adm.get("", response_model=list[out], dependencies=[Depends(require(f"{permission}:read"))])
    def list_admin(db: DB):
        return db.scalars(select(model).order_by(*ordering)).all()

    @adm.get("/{item_id}", response_model=out, dependencies=[Depends(require(f"{permission}:read"))])
    def get_admin(item_id: int, db: DB):
        obj = db.get(model, item_id)
        if not obj:
            raise HTTPException(404, "Not found")
        return obj

    @pub.post("", response_model=out, status_code=201)
    def create_item(
        payload: create, request: Request, background: BackgroundTasks, db: DB,  # type: ignore[valid-type]
        user: User = Depends(require(f"{permission}:write")),
    ):
        obj = model()
        apply_payload(db, obj, payload.model_dump(exclude_unset=True), html_fields=html_fields, title_field=title_field)
        db.add(obj)
        flush_or_409(db)
        audit(db, request, user, "create", name, obj.id, getattr(obj, title_field, None))
        commit_or_409(db)
        db.refresh(obj)
        revalidate(background, *cache_tags)
        return obj

    if hasattr(model, "order"):
        @pub.put("/reorder", status_code=204)
        def reorder(
            items: list[OrderItem], request: Request, background: BackgroundTasks, db: DB,
            user: User = Depends(require(f"{permission}:write")),
        ):
            for item in items:
                obj = db.get(model, item.id)
                if obj:
                    obj.order = item.order
            audit(db, request, user, "reorder", name, None, f"{len(items)} items")
            db.commit()
            revalidate(background, *cache_tags)

    @pub.put("/{item_id}", response_model=out)
    def update_item(
        item_id: int, payload: create, request: Request, background: BackgroundTasks, db: DB,  # type: ignore[valid-type]
        user: User = Depends(require(f"{permission}:write")),
    ):
        obj = db.get(model, item_id)
        if not obj:
            raise HTTPException(404, "Not found")
        data = payload.model_dump(exclude_unset=True)
        apply_payload(db, obj, data, html_fields=html_fields, title_field=title_field)
        audit(db, request, user, "update", name, obj.id, ", ".join(sorted(data)))
        commit_or_409(db)
        db.refresh(obj)
        revalidate(background, *cache_tags)
        return obj

    @pub.delete("/{item_id}", status_code=204)
    def delete_item(
        item_id: int, request: Request, background: BackgroundTasks, db: DB,
        user: User = Depends(require(f"{permission}:delete")),
    ):
        obj = db.get(model, item_id)
        if not obj:
            raise HTTPException(404, "Not found")
        audit(db, request, user, "delete", name, obj.id, getattr(obj, title_field, None))
        db.delete(obj)
        db.commit()
        revalidate(background, *cache_tags)

    return pub, adm
