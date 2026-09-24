from datetime import date, datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl  # noqa: F401

T = TypeVar("T")


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int


class SeoFields(BaseModel):
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: str | None = None
    og_image: str | None = None
    canonical_url: str | None = None


class Result(BaseModel):
    label: str
    value: str


class Step(BaseModel):
    title: str
    description: str | None = None


# ---------------------------------------------------------------- auth
class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class RoleOut(ORM):
    id: int
    name: str
    description: str | None = None
    permissions: list[str] = []

    @classmethod
    def of(cls, role: Any) -> "RoleOut":
        return cls(id=role.id, name=role.name, description=role.description,
                   permissions=sorted(role.permission_codes))


class RoleIn(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    description: str | None = None
    permissions: list[str] = []


class UserOut(ORM):
    id: int
    email: str
    name: str
    is_active: bool
    role: RoleOut | None = None
    last_login_at: datetime | None = None

    @classmethod
    def of(cls, user: Any) -> "UserOut":
        return cls(id=user.id, email=user.email, name=user.name, is_active=user.is_active,
                   role=RoleOut.of(user.role) if user.role else None, last_login_at=user.last_login_at)


class UserIn(BaseModel):
    email: EmailStr | None = None
    name: str | None = Field(None, max_length=120)
    password: str | None = Field(None, min_length=10, max_length=200)
    role_id: int | None = None
    is_active: bool | None = None


# ---------------------------------------------------------------- taxonomy
class TechCategoryOut(ORM):
    id: int
    name: str
    slug: str
    order: int


class TechCategoryIn(BaseModel):
    name: str
    slug: str | None = None
    order: int = 0


class TechnologyOut(ORM):
    id: int
    name: str
    slug: str
    category: TechCategoryOut | None = None
    icon: str | None = None
    description: str | None = None
    website: str | None = None
    featured: bool
    published: bool
    order: int


class TechnologyRef(ORM):
    id: int
    name: str
    slug: str
    icon: str | None = None


class TechnologyIn(BaseModel):
    name: str | None = None
    slug: str | None = None
    category_id: int | None = None
    icon: str | None = None
    description: str | None = None
    website: str | None = None
    featured: bool | None = None
    published: bool | None = None
    order: int | None = None


# ---------------------------------------------------------------- services
class ServiceFeatureSchema(ORM):
    title: str
    description: str | None = None


class ServiceRef(ORM):
    id: int
    title: str
    slug: str
    icon: str | None = None


class ProjectRef(ORM):
    id: int
    title: str
    slug: str
    category: str | None = None
    thumbnail: str | None = None
    short_description: str | None = None


class ServiceOut(ORM, SeoFields):
    id: int
    title: str
    slug: str
    number: str | None = None
    group: str
    tagline: str | None = None
    description: str | None = None
    body: str | None = None
    icon: str | None = None
    hero_image: str | None = None
    benefits: list[str] = []
    process: list[Step] = []
    deliverables: list[str] = []
    platforms: list[str] = []
    features: list[ServiceFeatureSchema] = []
    technologies: list[TechnologyRef] = []
    projects: list[ProjectRef] = []
    show_on_home: bool
    published: bool
    order: int


class ServiceIn(SeoFields):
    title: str | None = None
    slug: str | None = None
    number: str | None = None
    group: str | None = None
    tagline: str | None = None
    description: str | None = None
    body: str | None = None
    icon: str | None = None
    hero_image: str | None = None
    benefits: list[str] | None = None
    process: list[Step] | None = None
    deliverables: list[str] | None = None
    platforms: list[str] | None = None
    features: list[ServiceFeatureSchema] | None = None
    technology_ids: list[int] | None = None
    show_on_home: bool | None = None
    published: bool | None = None
    order: int | None = None


# ---------------------------------------------------------------- projects
class ProjectImageSchema(ORM):
    url: str
    alt: str | None = None
    caption: str | None = None
    kind: str = "gallery"


class ProjectCard(ORM):
    id: int
    title: str
    slug: str
    category: str | None = None
    industry: str | None = None
    short_description: str | None = None
    thumbnail: str | None = None
    accent: str | None = None
    featured: bool
    is_demo: bool = False
    platforms: list[str] = []
    technologies: list[TechnologyRef] = []
    results: list[Result] = []


class ProjectOut(ProjectCard, SeoFields):
    client: str | None = None
    role: str | None = None
    long_description: str | None = None
    challenge: str | None = None
    solution: str | None = None
    design_notes: str | None = None
    development_notes: str | None = None
    architecture: str | None = None
    features: list[str] = []
    hero_image: str | None = None
    video_url: str | None = None
    external_url: str | None = None
    images: list[ProjectImageSchema] = []
    services: list[ServiceRef] = []
    published: bool
    order: int


class ProjectIn(SeoFields):
    title: str | None = None
    role: str | None = None
    platforms: list[str] | None = None
    slug: str | None = None
    category: str | None = None
    industry: str | None = None
    client: str | None = None
    short_description: str | None = None
    long_description: str | None = None
    challenge: str | None = None
    solution: str | None = None
    design_notes: str | None = None
    development_notes: str | None = None
    architecture: str | None = None
    features: list[str] | None = None
    results: list[Result] | None = None
    thumbnail: str | None = None
    hero_image: str | None = None
    video_url: str | None = None
    external_url: str | None = None
    accent: str | None = None
    images: list[ProjectImageSchema] | None = None
    technology_ids: list[int] | None = None
    service_ids: list[int] | None = None
    featured: bool | None = None
    published: bool | None = None
    order: int | None = None
    is_demo: bool | None = None


# ---------------------------------------------------------------- simple content
class IndustryOut(ORM, SeoFields):
    id: int
    name: str
    slug: str
    icon: str | None = None
    image: str | None = None
    description: str | None = None
    solutions: list[str] = []
    challenges: list[str] = []
    published: bool
    order: int


class IndustryIn(SeoFields):
    name: str | None = None
    slug: str | None = None
    icon: str | None = None
    image: str | None = None
    description: str | None = None
    solutions: list[str] | None = None
    challenges: list[str] | None = None
    published: bool | None = None
    order: int | None = None


class ProcessStageOut(ORM):
    id: int
    number: str
    stage: str
    title: str
    description: str | None = None
    duration: str | None = None
    icon: str | None = None
    activities: list[str] = []
    deliverables: list[str] = []
    team: list[str] = []
    technologies: list[str] = []
    published: bool
    order: int


class ProcessStageIn(BaseModel):
    number: str | None = None
    stage: str | None = None
    title: str | None = None
    description: str | None = None
    duration: str | None = None
    icon: str | None = None
    activities: list[str] | None = None
    deliverables: list[str] | None = None
    team: list[str] | None = None
    technologies: list[str] | None = None
    published: bool | None = None
    order: int | None = None


class EngagementModelOut(ORM):
    id: int
    title: str
    slug: str
    summary: str | None = None
    best_for: list[str] = []
    included: list[str] = []
    model: str | None = None
    cta_label: str
    highlighted: bool
    published: bool
    order: int


class EngagementModelIn(BaseModel):
    title: str | None = None
    slug: str | None = None
    summary: str | None = None
    best_for: list[str] | None = None
    included: list[str] | None = None
    model: str | None = None
    cta_label: str | None = None
    highlighted: bool | None = None
    published: bool | None = None
    order: int | None = None


class TestimonialOut(ORM):
    id: int
    client_name: str
    designation: str | None = None
    company: str | None = None
    photo: str | None = None
    quote: str
    video_url: str | None = None
    rating: int | None = None
    published: bool
    order: int
    is_demo: bool


class TestimonialIn(BaseModel):
    client_name: str | None = None
    designation: str | None = None
    company: str | None = None
    photo: str | None = None
    quote: str | None = None
    video_url: str | None = None
    rating: int | None = Field(None, ge=1, le=5)
    published: bool | None = None
    order: int | None = None
    is_demo: bool | None = None


class FAQOut(ORM):
    id: int
    question: str
    answer: str
    category: str | None = None
    published: bool
    order: int


class FAQIn(BaseModel):
    question: str | None = None
    answer: str | None = None
    category: str | None = None
    published: bool | None = None
    order: int | None = None


class TeamMemberOut(ORM):
    id: int
    name: str
    position: str
    photo: str | None = None
    bio: str | None = None
    skills: list[str] = []
    linkedin: str | None = None
    github: str | None = None
    email: str | None = None
    published: bool
    order: int


class TeamMemberIn(BaseModel):
    name: str | None = None
    position: str | None = None
    photo: str | None = None
    bio: str | None = None
    skills: list[str] | None = None
    linkedin: str | None = None
    github: str | None = None
    email: EmailStr | None = None
    published: bool | None = None
    order: int | None = None


# ---------------------------------------------------------------- blog
class BlogCategoryOut(ORM):
    id: int
    name: str
    slug: str
    description: str | None = None
    order: int


class BlogCategoryIn(BaseModel):
    name: str
    slug: str | None = None
    description: str | None = None
    order: int = 0


class BlogTagOut(ORM):
    id: int
    name: str
    slug: str


class BlogPostCard(ORM):
    id: int
    title: str
    slug: str
    excerpt: str | None = None
    featured_image: str | None = None
    author_name: str | None = None
    category: BlogCategoryOut | None = None
    tags: list[BlogTagOut] = []
    published_at: datetime | None = None
    reading_minutes: int
    status: str


class BlogPostOut(BlogPostCard, SeoFields):
    content: str
    is_demo: bool


class BlogPostIn(SeoFields):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    featured_image: str | None = None
    author_name: str | None = None
    category_id: int | None = None
    tags: list[str] | None = None
    status: str | None = Field(None, pattern="^(draft|published|scheduled)$")
    published_at: datetime | None = None
    is_demo: bool | None = None


# ---------------------------------------------------------------- leads
class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: str | None = Field(None, max_length=160)
    phone: str | None = Field(None, max_length=40, pattern=r"^[0-9+()\-\s.]*$")
    service: str | None = Field(None, max_length=160)
    budget: str | None = Field(None, max_length=60)
    timeline: str | None = Field(None, max_length=60)
    message: str = Field(min_length=10, max_length=5000)
    referral: str | None = Field(None, max_length=120)
    source: str | None = Field(None, max_length=60)
    page: str | None = Field(None, max_length=300)
    utm: str | None = Field(None, max_length=400)
    # Honeypot: real users never see or fill this field.
    website: str | None = None


class LeadNoteOut(ORM):
    id: int
    body: str
    author_name: str | None = None
    created_at: datetime


class LeadOut(ORM):
    id: int
    name: str
    email: str
    company: str | None = None
    phone: str | None = None
    service: str | None = None
    budget: str | None = None
    timeline: str | None = None
    message: str
    referral: str | None = None
    source: str
    page: str | None = None
    status: str
    priority: str
    follow_up_date: date | None = None
    assigned_to_id: int | None = None
    notes: list[LeadNoteOut] = []
    created_at: datetime
    updated_at: datetime


class LeadUpdate(BaseModel):
    status: str | None = Field(None, pattern="^(new|contacted|qualified|proposal|won|lost)$")
    priority: str | None = Field(None, pattern="^(low|medium|high)$")
    follow_up_date: date | None = None
    assigned_to_id: int | None = None
    source: str | None = None


class LeadNoteIn(BaseModel):
    body: str = Field(min_length=1, max_length=5000)


# ---------------------------------------------------------------- system
class MediaOut(ORM):
    id: int
    filename: str
    url: str
    folder: str
    mime_type: str
    size: int
    width: int | None = None
    height: int | None = None
    alt: str | None = None
    created_at: datetime


class MediaUpdate(BaseModel):
    folder: str | None = None
    alt: str | None = None
    filename: str | None = None


class SeoOut(ORM):
    id: int
    path: str
    title: str | None = None
    description: str | None = None
    keywords: str | None = None
    canonical_url: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None
    twitter_card: str
    structured_data: dict | None = None
    noindex: bool


class SeoIn(BaseModel):
    path: str | None = Field(None, pattern=r"^/[\w\-/]*$")
    title: str | None = None
    description: str | None = None
    keywords: str | None = None
    canonical_url: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None
    twitter_card: str | None = None
    structured_data: dict | None = None
    noindex: bool | None = None


class SocialLinkOut(ORM):
    id: int
    platform: str
    url: str
    order: int
    published: bool


class SocialLinkIn(BaseModel):
    platform: str | None = None
    url: str | None = None
    order: int | None = None
    published: bool | None = None


class SettingsPatch(BaseModel):
    values: dict[str, Any]


class EventIn(BaseModel):
    name: str = Field(max_length=60, pattern=r"^[a-z_]+$")
    path: str | None = Field(None, max_length=300)
    entity_type: str | None = Field(None, max_length=40)
    entity_slug: str | None = Field(None, max_length=200)
    referrer: str | None = Field(None, max_length=400)
    session_id: str | None = Field(None, max_length=64)
    props: dict[str, Any] | None = None


class AuditLogOut(ORM):
    id: int
    user_email: str | None = None
    action: str
    entity: str
    entity_id: str | None = None
    summary: str | None = None
    ip: str | None = None
    created_at: datetime
