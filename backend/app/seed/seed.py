"""Idempotent seeder: `python -m app.seed.seed` (add `--reset` to wipe content tables first).

Creates roles, the first admin user (from ADMIN_EMAIL / ADMIN_PASSWORD) and development content.
Blog posts are marked is_demo for copy review; concept-build projects carry is_demo=True (shown as "Concept").
Demo testimonials are created unpublished and never appear on the public site by default.
"""

import json
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path

from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import (
    FAQ, SEO, BlogCategory, BlogPost, BlogTag, EngagementModel, Industry, Permission, ProcessStage, Project,
    ProjectImage, Role, Service, ServiceFeature, SiteSetting, SocialLink, Technology, TechnologyCategory, Testimonial, User,
)
from app.services.sanitize import plain_text, reading_minutes, slugify

DATA = json.loads((Path(__file__).parent / "data.json").read_text(encoding="utf-8"))


def get_or_create(db, model, lookup: dict, /, **values):
    obj = db.scalar(select(model).filter_by(**lookup))
    if obj:
        return obj, False
    obj = model(**lookup, **values)
    db.add(obj)
    db.flush()
    return obj, True


def seed_roles_and_admin(db) -> None:
    for spec in DATA["roles"]:
        role, _ = get_or_create(db, Role, {"name": spec["name"]}, description=spec["description"])
        if not role.permissions:
            role.permissions = [get_or_create(db, Permission, {"code": c})[0] for c in spec["permissions"]]
    admin_role = db.scalar(select(Role).where(Role.name == "Admin"))
    if not db.scalar(select(User).where(User.email == settings.admin_email.lower())):
        db.add(User(email=settings.admin_email.lower(), name="SparkWave Admin",
                    password_hash=hash_password(settings.admin_password), role=admin_role))
        print(f"Created admin user {settings.admin_email}")


def seed_content(db) -> None:
    for s in DATA["settings"]:
        get_or_create(db, SiteSetting, {"key": s["key"]}, value=s["value"], group=s["group"])
    for i, s in enumerate(DATA["socials"]):
        get_or_create(db, SocialLink, {"platform": s["platform"]}, url=s["url"], order=i)

    cats = {}
    for i, c in enumerate(DATA["technology_categories"]):
        cats[c["slug"]], _ = get_or_create(db, TechnologyCategory, {"slug": c["slug"]}, name=c["name"], order=i)
    techs = {}
    for i, t in enumerate(DATA["technologies"]):
        techs[t["name"]], _ = get_or_create(
            db, Technology, {"slug": slugify(t["name"])}, name=t["name"], category=cats[t["category"]],
            description=t.get("description"), website=t.get("website"), featured=t.get("featured", False), order=i,
        )

    services = {}
    for i, s in enumerate(DATA["services"]):
        svc, created = get_or_create(
            db, Service, {"slug": s["slug"]}, title=s["title"], number=s["number"], group=s["group"],
            icon=s["icon"], tagline=s["tagline"], description=s["description"], benefits=s["benefits"],
            deliverables=s["deliverables"], platforms=s.get("platforms", []),
            show_on_home=s.get("show_on_home", True), seo_title=s.get("seo_title"),
            seo_description=s.get("seo_description"), hero_image=s.get("hero_image"), order=i,
        )
        if created:
            svc.features = [ServiceFeature(title=f["title"], description=f["description"], order=j)
                            for j, f in enumerate(s["features"])]
            svc.technologies = [techs[n] for n in s["technologies"] if n in techs]
        services[s["slug"]] = svc

    for i, p in enumerate(DATA["process"]):
        get_or_create(db, ProcessStage, {"number": p["number"]}, **{k: v for k, v in p.items() if k != "number"},
                      order=i)
    for i, ind in enumerate(DATA["industries"]):
        get_or_create(db, Industry, {"slug": slugify(ind["name"])}, **ind, order=i)

    for i, p in enumerate(DATA["projects"]):
        values = {k: v for k, v in p.items() if k not in ("slug", "technologies", "services", "images")}
        proj, created = get_or_create(db, Project, {"slug": p["slug"]}, **values, order=i)
        if created:
            proj.images = [ProjectImage(**img, order=j) for j, img in enumerate(p.get("images", []))]
            proj.technologies = [techs[n] for n in p["technologies"] if n in techs]
            proj.services = [services[s] for s in p["services"] if s in services]

    for i, e in enumerate(DATA["engagement_models"]):
        get_or_create(db, EngagementModel, {"slug": e["slug"]}, **{k: v for k, v in e.items() if k != "slug"},
                      order=i)
    for i, f in enumerate(DATA["faqs"]):
        get_or_create(db, FAQ, {"question": f["question"]}, answer=f["answer"], category=f["category"], order=i)
    for i, t in enumerate(DATA["testimonials"]):
        get_or_create(db, Testimonial, {"client_name": t["client_name"]}, **{k: v for k, v in t.items()
                      if k != "client_name"}, order=i, is_demo=True, published=False)

    blog_cats = {}
    for i, c in enumerate(DATA["blog_categories"]):
        blog_cats[c["slug"]], _ = get_or_create(db, BlogCategory, {"slug": c["slug"]}, name=c["name"], order=i)
    now = datetime.now(UTC)
    for i, post in enumerate(DATA["blog_posts"]):
        slug = slugify(post["title"])
        obj, created = get_or_create(
            db, BlogPost, {"slug": slug}, title=post["title"], excerpt=post["excerpt"], content=post["content"],
            category=blog_cats[post["category"]], author_name="SparkWave Team", status="published",
            published_at=now - timedelta(days=i, hours=2), featured_image=post.get("featured_image"), reading_minutes=reading_minutes(post["content"]),
            seo_description=plain_text(post["excerpt"], 300), is_demo=True,
        )
        if created:
            obj.tags = [get_or_create(db, BlogTag, {"slug": slugify(t)}, name=t)[0] for t in post["tags"]]

    for s in DATA["seo"]:
        get_or_create(db, SEO, {"path": s["path"]}, title=s["title"], description=s["description"])


def main() -> None:
    if "--create-tables" in sys.argv:
        Base.metadata.create_all(engine)
    with SessionLocal() as db:
        if "--reset" in sys.argv:
            if settings.is_production:
                raise SystemExit("Refusing to reset in production")
            for table in reversed(Base.metadata.sorted_tables):
                if table.name not in ("users", "roles", "permissions", "role_permissions", "leads", "lead_notes"):
                    db.execute(table.delete())
        seed_roles_and_admin(db)
        seed_content(db)
        db.commit()
    print("Seed complete.")


if __name__ == "__main__":
    main()
