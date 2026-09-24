import logging
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.crud import crud_router
from app.api.routes import admin, auth, blog, leads, media, projects, services, site
from app.core.config import settings
from app.core.ratelimit import limiter
from app.models import (
    FAQ, BlogCategory, EngagementModel, Industry, ProcessStage, SocialLink, TeamMember, Technology,
    TechnologyCategory, Testimonial,
)
from app.schemas import (
    BlogCategoryIn, BlogCategoryOut, EngagementModelIn, EngagementModelOut, FAQIn, FAQOut, IndustryIn,
    IndustryOut, ProcessStageIn, ProcessStageOut, SocialLinkIn, SocialLinkOut, TeamMemberIn, TeamMemberOut,
    TechCategoryIn, TechCategoryOut, TechnologyIn, TechnologyOut, TestimonialIn, TestimonialOut,
)
from app.services.storage import ALLOWED_TYPES

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="SparkWave Digital Systems API",
    version="1.0.0",
    docs_url=None if settings.is_production else "/api/docs",
    openapi_url=None if settings.is_production else "/api/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRF-Token", "Authorization"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    if request.url.path.startswith("/api/admin") or request.url.path.startswith("/api/auth"):
        response.headers["Cache-Control"] = "no-store"
    return response


@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    logging.getLogger("sparkwave").exception("Unhandled error on %s", request.url.path)
    return JSONResponse({"detail": "Internal server error"}, status_code=500)


for module in (auth, site, leads, media, admin):
    app.include_router(module.router)
app.include_router(site.seo_admin)
for module in (projects, services, blog):
    app.include_router(module.admin)
    app.include_router(module.router)

SIMPLE_RESOURCES = [
    dict(name="industries", model=Industry, out=IndustryOut, create=IndustryIn, permission="industries",
         title_field="name"),
    dict(name="technologies", model=Technology, out=TechnologyOut, create=TechnologyIn, permission="technologies",
         title_field="name"),
    dict(name="technology-categories", model=TechnologyCategory, out=TechCategoryOut, create=TechCategoryIn,
         permission="technologies", title_field="name", publish_field=None, tags=["technologies"]),
    dict(name="process", model=ProcessStage, out=ProcessStageOut, create=ProcessStageIn, permission="process"),
    dict(name="engagement-models", model=EngagementModel, out=EngagementModelOut, create=EngagementModelIn,
         permission="engagement-models"),
    dict(name="testimonials", model=Testimonial, out=TestimonialOut, create=TestimonialIn,
         permission="testimonials", title_field="client_name"),
    dict(name="faqs", model=FAQ, out=FAQOut, create=FAQIn, permission="faqs", title_field="question"),
    dict(name="team", model=TeamMember, out=TeamMemberOut, create=TeamMemberIn, permission="team",
         title_field="name"),
    dict(name="blog-categories", model=BlogCategory, out=BlogCategoryOut, create=BlogCategoryIn, permission="blog",
         title_field="name", public=False, publish_field=None, tags=["blog"]),
    dict(name="social-links", model=SocialLink, out=SocialLinkOut, create=SocialLinkIn, permission="settings",
         title_field="platform", public=False, tags=["site"]),
]
for spec in SIMPLE_RESOURCES:
    public_router, admin_router = crud_router(**spec)
    app.include_router(admin_router)
    app.include_router(public_router)

class UploadFiles(StaticFiles):
    """Serves local uploads with explicit content types (the OS mimetypes table may lack webp/avif)."""

    TYPES = {ext: mime for mime, ext in ALLOWED_TYPES.items()}

    def file_response(self, full_path, stat_result, scope, status_code=200):
        response = super().file_response(full_path, stat_result, scope, status_code)
        mime = self.TYPES.get(Path(full_path).suffix.lower())
        if mime:
            response.media_type = mime
            response.headers["content-type"] = mime
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response


upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", UploadFiles(directory=upload_dir), name="uploads")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
