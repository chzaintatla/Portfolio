"""Site-wide data: settings, SEO lookup, sitemap feed, analytics ingestion, search-free counters."""

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import select, update

from app.core.deps import DB, audit, require
from app.core.ratelimit import limiter
from app.models import (
    SEO, AnalyticsEvent, BlogPost, Industry, Project, Service, SiteSetting, SocialLink, User,
)
from app.schemas import EventIn, SeoIn, SeoOut, SettingsPatch
from app.services.revalidate import revalidate
from app.services.sanitize import clean_html

router = APIRouter(tags=["site"])


@router.get("/api/site")
def site(db: DB) -> dict:
    """Everything the global layout needs in one request."""
    settings = {s.key: s.value for s in db.scalars(select(SiteSetting).where(SiteSetting.is_public.is_(True)))}
    socials = db.scalars(select(SocialLink).where(SocialLink.published.is_(True)).order_by(SocialLink.order)).all()
    nav_services = db.execute(
        select(Service.title, Service.slug, Service.group).where(Service.published.is_(True)).order_by(Service.order)
    ).all()
    return {
        "settings": settings,
        "socials": [{"platform": s.platform, "url": s.url} for s in socials],
        "services": [{"title": t, "slug": s, "group": g} for t, s, g in nav_services],
    }


@router.get("/api/seo", response_model=SeoOut | None)
def seo_for_path(path: str, db: DB):
    return db.scalar(select(SEO).where(SEO.path == path))


@router.get("/api/sitemap")
def sitemap(db: DB) -> dict:
    def rows(model, cond):
        return [{"slug": s, "updated_at": u} for s, u in db.execute(select(model.slug, model.updated_at).where(cond))]

    return {
        "projects": rows(Project, Project.published.is_(True)),
        "services": rows(Service, Service.published.is_(True)),
        "industries": rows(Industry, Industry.published.is_(True)),
        "blog": rows(BlogPost, BlogPost.status == "published"),
        "noindex": [p for (p,) in db.execute(select(SEO.path).where(SEO.noindex.is_(True)))],
    }


VIEW_COUNTERS = {"project": Project, "service": Service, "blog": BlogPost}


@router.post("/api/events", status_code=204)
@limiter.limit("120/minute")
def track(request: Request, payload: EventIn, db: DB):
    db.add(AnalyticsEvent(**payload.model_dump()))
    model = VIEW_COUNTERS.get(payload.entity_type or "")
    if payload.name == "entity_view" and model and payload.entity_slug:
        db.execute(update(model).where(model.slug == payload.entity_slug).values(view_count=model.view_count + 1))
    db.commit()


# ------------------------------------------------------------------ admin: settings
@router.get("/api/admin/settings", dependencies=[Depends(require("settings:read"))])
def get_settings(db: DB) -> list[dict]:
    return [
        {"key": s.key, "value": s.value, "group": s.group, "is_public": s.is_public}
        for s in db.scalars(select(SiteSetting).order_by(SiteSetting.group, SiteSetting.key))
    ]


@router.put("/api/admin/settings", status_code=204)
def patch_settings(
    payload: SettingsPatch, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("settings:write")),
):
    for key, value in payload.values.items():
        if key.endswith("_html") and isinstance(value, str):
            value = clean_html(value)
        row = db.scalar(select(SiteSetting).where(SiteSetting.key == key))
        if row:
            row.value = value
        else:
            db.add(SiteSetting(key=key, value=value))
    audit(db, request, user, "update", "settings", None, ", ".join(payload.values))
    db.commit()
    revalidate(background, "site")


# ------------------------------------------------------------------ admin: SEO by path
seo_admin = APIRouter(prefix="/api/admin/seo", tags=["admin:seo"])


@seo_admin.get("", response_model=list[SeoOut], dependencies=[Depends(require("seo:read"))])
def list_seo(db: DB):
    return db.scalars(select(SEO).order_by(SEO.path)).all()


@seo_admin.put("", response_model=SeoOut)
def upsert_seo(
    payload: SeoIn, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("seo:write")),
):
    data = payload.model_dump(exclude_unset=True)
    path = data.get("path")
    if not path:
        raise HTTPException(422, "path is required")
    row = db.scalar(select(SEO).where(SEO.path == path)) or SEO(path=path)
    for key, value in data.items():
        setattr(row, key, value)
    db.add(row)
    audit(db, request, user, "update", "seo", path)
    db.commit()
    revalidate(background, "seo")
    return row


@seo_admin.delete("/{seo_id}", status_code=204)
def delete_seo(seo_id: int, db: DB, _: User = Depends(require("seo:delete"))):
    row = db.get(SEO, seo_id)
    if row:
        db.delete(row)
        db.commit()
