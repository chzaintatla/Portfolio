"""Dashboard analytics, users, roles and audit log."""

from collections import Counter
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func, select

from app.core.deps import DB, CurrentUser, audit, require
from app.core.security import hash_password
from app.models import (
    AnalyticsEvent, AuditLog, BlogPost, Lead, Permission, Project, Role, Service, Testimonial, User,
)
from app.models.crm import LEAD_STATUSES
from app.schemas import AuditLogOut, Page, RoleIn, RoleOut, UserIn, UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"])

PERMISSION_RESOURCES = [
    "projects", "services", "industries", "technologies", "process", "engagement-models", "testimonials",
    "blog", "faqs", "team", "media", "leads", "seo", "settings", "users", "roles", "analytics",
]


@router.get("/dashboard", dependencies=[Depends(require("analytics:read"))])
def dashboard(db: DB, days: int = 30) -> dict:
    days = max(7, min(days, 365))
    since = datetime.now(UTC) - timedelta(days=days)
    if db.bind.dialect.name == "sqlite":  # SQLite stores naive datetimes
        since = since.replace(tzinfo=None)

    def count(stmt):
        return db.scalar(stmt) or 0

    def daily(column, *conds) -> list[dict]:
        # Bucket in Python so the query stays portable across Postgres and SQLite.
        counts: Counter = Counter(ts.date() for ts in db.scalars(select(column).where(column >= since, *conds)) if ts)
        start = since.date()
        return [{"date": (start + timedelta(days=i)).isoformat(), "count": counts.get(start + timedelta(days=i), 0)}
                for i in range(days + 1)]

    by_status = dict(db.execute(select(Lead.status, func.count()).group_by(Lead.status)).all())
    by_source = db.execute(
        select(Lead.source, func.count()).where(Lead.created_at >= since).group_by(Lead.source)
        .order_by(func.count().desc())
    ).all()
    top_projects = db.execute(
        select(Project.title, Project.slug, Project.view_count).order_by(Project.view_count.desc()).limit(5)
    ).all()
    top_services = db.execute(
        select(Service.title, Service.slug, Service.view_count).order_by(Service.view_count.desc()).limit(5)
    ).all()
    cta_label = AnalyticsEvent.props["label"].as_string().label("cta_label")
    cta_clicks = db.execute(
        select(cta_label, func.count())
        .where(AnalyticsEvent.name == "cta_click", AnalyticsEvent.created_at >= since)
        .group_by("cta_label").order_by(func.count().desc()).limit(8)
    ).all()
    total_leads = count(select(func.count(Lead.id)))
    won = by_status.get("won", 0)

    return {
        "totals": {
            "leads": total_leads,
            "new_leads": by_status.get("new", 0),
            "projects": count(select(func.count(Project.id))),
            "services": count(select(func.count(Service.id))),
            "blog_posts": count(select(func.count(BlogPost.id))),
            "testimonials": count(select(func.count(Testimonial.id)).where(Testimonial.is_demo.is_(False))),
            "page_views": count(select(func.count(AnalyticsEvent.id)).where(
                AnalyticsEvent.name == "page_view", AnalyticsEvent.created_at >= since)),
            "win_rate": round(won / total_leads * 100, 1) if total_leads else 0,
        },
        "lead_trend": daily(Lead.created_at),
        "view_trend": daily(AnalyticsEvent.created_at, AnalyticsEvent.name == "page_view"),
        "pipeline": [{"status": s, "count": by_status.get(s, 0)} for s in LEAD_STATUSES],
        "lead_sources": [{"source": s, "count": n} for s, n in by_source],
        "popular_projects": [{"title": t, "slug": s, "views": v} for t, s, v in top_projects],
        "popular_services": [{"title": t, "slug": s, "views": v} for t, s, v in top_services],
        "cta_clicks": [{"label": label or "unknown", "count": n} for label, n in cta_clicks],
        "upcoming_follow_ups": [
            {"id": lead.id, "name": lead.name, "date": lead.follow_up_date.isoformat(), "status": lead.status}
            for lead in db.scalars(
                select(Lead).where(Lead.follow_up_date.is_not(None), Lead.status.not_in(("won", "lost")))
                .order_by(Lead.follow_up_date).limit(6)
            )
        ],
        "days": days,
    }


# ------------------------------------------------------------------ users
@router.get("/users", response_model=list[UserOut], dependencies=[Depends(require("users:read"))])
def list_users(db: DB):
    return [UserOut.of(u) for u in db.scalars(select(User).order_by(User.name))]


@router.post("/users", response_model=UserOut, status_code=201)
def create_user(payload: UserIn, request: Request, db: DB, user: User = Depends(require("users:write"))):
    if not (payload.email and payload.name and payload.password):
        raise HTTPException(422, "Name, email and password are required")
    if db.scalar(select(User).where(func.lower(User.email) == payload.email.lower())):
        raise HTTPException(409, "Email already in use")
    new = User(email=payload.email.lower(), name=payload.name, password_hash=hash_password(payload.password),
               role_id=payload.role_id, is_active=payload.is_active if payload.is_active is not None else True)
    db.add(new)
    db.flush()
    audit(db, request, user, "create", "users", new.id, new.email)
    db.commit()
    return UserOut.of(new)


@router.put("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int, payload: UserIn, request: Request, db: DB, user: User = Depends(require("users:write")),
):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(404, "User not found")
    data = payload.model_dump(exclude_unset=True)
    if target.id == user.id and (data.get("is_active") is False or "role_id" in data):
        raise HTTPException(400, "You cannot deactivate yourself or change your own role")
    if "password" in data:
        target.password_hash = hash_password(data.pop("password"))
    for key, value in data.items():
        setattr(target, key, value.lower() if key == "email" else value)
    audit(db, request, user, "update", "users", target.id, ", ".join(sorted(payload.model_fields_set)))
    db.commit()
    db.refresh(target)
    return UserOut.of(target)


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, request: Request, db: DB, user: User = Depends(require("users:delete"))):
    if user_id == user.id:
        raise HTTPException(400, "You cannot delete yourself")
    target = db.get(User, user_id)
    if target:
        audit(db, request, user, "delete", "users", target.id, target.email)
        db.delete(target)
        db.commit()


# ------------------------------------------------------------------ roles
@router.get("/permissions", dependencies=[Depends(require("roles:read"))])
def list_permissions() -> dict:
    return {"resources": PERMISSION_RESOURCES, "actions": ["read", "write", "delete"]}


def _permissions(db, codes: list[str]) -> list[Permission]:
    result = []
    for code in sorted(set(codes)):
        perm = db.scalar(select(Permission).where(Permission.code == code))
        if not perm:
            perm = Permission(code=code)
            db.add(perm)
        result.append(perm)
    return result


@router.get("/roles", response_model=list[RoleOut], dependencies=[Depends(require("roles:read"))])
def list_roles(db: DB):
    return [RoleOut.of(r) for r in db.scalars(select(Role).order_by(Role.name))]


@router.post("/roles", response_model=RoleOut, status_code=201)
def create_role(payload: RoleIn, request: Request, db: DB, user: User = Depends(require("roles:write"))):
    role = Role(name=payload.name, description=payload.description, permissions=_permissions(db, payload.permissions))
    db.add(role)
    db.flush()
    audit(db, request, user, "create", "roles", role.id, role.name)
    db.commit()
    return RoleOut.of(role)


@router.put("/roles/{role_id}", response_model=RoleOut)
def update_role(
    role_id: int, payload: RoleIn, request: Request, db: DB, user: CurrentUser,
    _: User = Depends(require("roles:write")),
):
    role = db.get(Role, role_id)
    if not role:
        raise HTTPException(404, "Role not found")
    if role.id == user.role_id and "*" in role.permission_codes and "*" not in payload.permissions:
        raise HTTPException(400, "You cannot remove full access from your own role")
    role.name, role.description = payload.name, payload.description
    role.permissions = _permissions(db, payload.permissions)
    audit(db, request, user, "update", "roles", role.id, ", ".join(payload.permissions))
    db.commit()
    return RoleOut.of(role)


@router.delete("/roles/{role_id}", status_code=204)
def delete_role(role_id: int, request: Request, db: DB, user: User = Depends(require("roles:delete"))):
    role = db.get(Role, role_id)
    if not role:
        return
    if role.id == user.role_id:
        raise HTTPException(400, "You cannot delete your own role")
    audit(db, request, user, "delete", "roles", role.id, role.name)
    db.delete(role)
    db.commit()


@router.get("/audit-logs", response_model=Page[AuditLogOut], dependencies=[Depends(require("users:read"))])
def audit_logs(db: DB, page: int = 1, page_size: int = 50):
    total = db.scalar(select(func.count(AuditLog.id))) or 0
    items = db.scalars(select(AuditLog).order_by(AuditLog.created_at.desc())
                       .offset((max(page, 1) - 1) * page_size).limit(min(page_size, 200))).all()
    return Page(items=items, total=total, page=page, page_size=page_size)
