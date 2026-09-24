from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import func, or_, select

from app.api.crud import apply_payload, commit_or_409, flush_or_409
from app.core.deps import DB, audit, require
from app.models import BlogCategory, BlogPost, BlogTag, User
from app.schemas import BlogPostCard, BlogPostIn, BlogPostOut, Page
from app.services.revalidate import revalidate
from app.services.sanitize import plain_text, reading_minutes, slugify

router = APIRouter(prefix="/api/blog", tags=["blog"])
admin = APIRouter(prefix="/api/admin/blog", tags=["admin:blog"])


def _live():
    now = datetime.now(UTC)
    return (BlogPost.status.in_(("published", "scheduled"))) & (BlogPost.published_at <= now)


@router.get("", response_model=Page[BlogPostCard])
def list_posts(
    db: DB, page: int = 1, page_size: int = 9, category: str | None = None, tag: str | None = None,
    q: str | None = None,
):
    page_size = max(1, min(page_size, 50))
    query = select(BlogPost).where(_live())
    if category:
        query = query.join(BlogCategory).where(BlogCategory.slug == category)
    if tag:
        query = query.where(BlogPost.tags.any(BlogTag.slug == tag))
    if q:
        like = f"%{q[:80]}%"
        query = query.where(or_(BlogPost.title.ilike(like), BlogPost.excerpt.ilike(like)))
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(
        query.order_by(BlogPost.published_at.desc()).offset((max(page, 1) - 1) * page_size).limit(page_size)
    ).all()
    return Page(items=items, total=total, page=page, page_size=page_size)


@router.get("/categories")
def list_categories(db: DB):
    rows = db.execute(
        select(BlogCategory, func.count(BlogPost.id))
        .outerjoin(BlogPost, (BlogPost.category_id == BlogCategory.id) & _live())
        .group_by(BlogCategory.id).order_by(BlogCategory.order)
    ).all()
    return [{"id": c.id, "name": c.name, "slug": c.slug, "description": c.description, "count": n} for c, n in rows]


@router.get("/daily")
def daily_feed(db: DB, days: int = 14) -> list[dict]:
    """Published posts grouped by publish day (newest first) for the "Daily insights" feed."""
    days = max(1, min(days, 60))
    since = datetime.now(UTC) - timedelta(days=days)
    posts = db.scalars(
        select(BlogPost).where(_live(), BlogPost.published_at >= since).order_by(BlogPost.published_at.desc())
    ).all()
    grouped: dict[str, list] = {}
    for p in posts:
        grouped.setdefault(p.published_at.date().isoformat(), []).append(BlogPostCard.model_validate(p).model_dump(mode="json"))
    return [{"date": d, "posts": items} for d, items in grouped.items()]


@router.get("/{slug}", response_model=BlogPostOut)
def get_post(slug: str, db: DB):
    post = db.scalar(select(BlogPost).where(BlogPost.slug == slug, _live()))
    if not post:
        raise HTTPException(404, "Post not found")
    return post


@router.get("/{slug}/related", response_model=list[BlogPostCard])
def related(slug: str, db: DB):
    post = db.scalar(select(BlogPost).where(BlogPost.slug == slug))
    if not post:
        return []
    q = select(BlogPost).where(_live(), BlogPost.id != post.id)
    if post.category_id:
        q = q.where(BlogPost.category_id == post.category_id)
    return db.scalars(q.order_by(BlogPost.published_at.desc()).limit(3)).all()


def _apply(db, post: BlogPost, payload: BlogPostIn) -> dict:
    data = payload.model_dump(exclude_unset=True)
    tags = data.pop("tags", None)
    apply_payload(db, post, data, html_fields=("content",), title_field="title")
    if "content" in data:
        post.reading_minutes = reading_minutes(post.content or "")
        if not post.excerpt:
            post.excerpt = plain_text(post.content, 220)
    if post.status == "published" and not post.published_at:
        post.published_at = datetime.now(UTC)
    if tags is not None:
        resolved = []
        for name in {t.strip() for t in tags if t.strip()}:
            tag = db.scalar(select(BlogTag).where(BlogTag.slug == slugify(name)))
            if not tag:
                tag = BlogTag(name=name, slug=slugify(name))
                db.add(tag)
            resolved.append(tag)
        post.tags = resolved
    return data


@admin.get("", response_model=list[BlogPostOut], dependencies=[Depends(require("blog:read"))])
def admin_list(db: DB):
    return db.scalars(select(BlogPost).order_by(BlogPost.updated_at.desc())).all()


@admin.get("/calendar", dependencies=[Depends(require("blog:read"))])
def calendar(db: DB, back: int = 7, ahead: int = 14) -> list[dict]:
    """Per-day posting plan around today: published, scheduled and drafts dated to that day."""
    today = datetime.now(UTC).date()
    start, end = today - timedelta(days=back), today + timedelta(days=ahead)
    rows = db.scalars(select(BlogPost).where(BlogPost.published_at.is_not(None))).all()
    by_day: dict = {}
    for p in rows:
        day = p.published_at.date()
        if start <= day <= end:
            by_day.setdefault(day, []).append({"id": p.id, "title": p.title, "status": p.status})
    return [
        {"date": (start + timedelta(days=i)).isoformat(), "posts": by_day.get(start + timedelta(days=i), [])}
        for i in range((end - start).days + 1)
    ]


@admin.get("/{post_id}", response_model=BlogPostOut, dependencies=[Depends(require("blog:read"))])
def admin_get(post_id: int, db: DB):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    return post


@router.post("", response_model=BlogPostOut, status_code=201)
def create_post(
    payload: BlogPostIn, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("blog:write")),
):
    if not payload.title:
        raise HTTPException(422, "Title is required")
    post = BlogPost(author_name=user.name)
    _apply(db, post, payload)
    db.add(post)
    flush_or_409(db)
    audit(db, request, user, "create", "blog", post.id, post.title)
    commit_or_409(db)
    revalidate(background, "blog")
    return post


@router.put("/{post_id}", response_model=BlogPostOut)
def update_post(
    post_id: int, payload: BlogPostIn, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("blog:write")),
):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    changed = _apply(db, post, payload)
    audit(db, request, user, "update", "blog", post.id, ", ".join(sorted(changed)))
    commit_or_409(db)
    revalidate(background, "blog", f"post:{post.slug}")
    return post


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: int, request: Request, background: BackgroundTasks, db: DB,
    user: User = Depends(require("blog:delete")),
):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    audit(db, request, user, "delete", "blog", post.id, post.title)
    db.delete(post)
    db.commit()
    revalidate(background, "blog", f"post:{post.slug}")
