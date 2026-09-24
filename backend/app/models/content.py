from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import (
    Base, DemoMixin, IdMixin, JSONType, PublishMixin, SeoMixin, TimestampMixin,
)

project_services = Table(
    "project_services",
    Base.metadata,
    Column("project_id", ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("service_id", ForeignKey("services.id", ondelete="CASCADE"), primary_key=True),
)

service_technologies = Table(
    "service_technologies",
    Base.metadata,
    Column("service_id", ForeignKey("services.id", ondelete="CASCADE"), primary_key=True),
    Column("technology_id", ForeignKey("technologies.id", ondelete="CASCADE"), primary_key=True),
)


class TechnologyCategory(IdMixin, TimestampMixin, Base):
    __tablename__ = "technology_categories"
    name: Mapped[str] = mapped_column(String(80), unique=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    order: Mapped[int] = mapped_column(Integer, default=0)


class Technology(IdMixin, TimestampMixin, PublishMixin, Base):
    __tablename__ = "technologies"
    name: Mapped[str] = mapped_column(String(80), unique=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    category_id: Mapped[int | None] = mapped_column(ForeignKey("technology_categories.id", ondelete="SET NULL"))
    category: Mapped[TechnologyCategory | None] = relationship(lazy="selectin")
    icon: Mapped[str | None] = mapped_column(String(600))
    description: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(String(300))
    featured: Mapped[bool] = mapped_column(Boolean, default=False)


class ProjectTechnology(Base):
    __tablename__ = "project_technologies"
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True)
    technology_id: Mapped[int] = mapped_column(ForeignKey("technologies.id", ondelete="CASCADE"), primary_key=True)


class ProjectImage(IdMixin, Base):
    __tablename__ = "project_images"
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(600))
    alt: Mapped[str | None] = mapped_column(String(200))
    caption: Mapped[str | None] = mapped_column(String(300))
    kind: Mapped[str] = mapped_column(String(20), default="gallery")  # gallery | screenshot | design
    order: Mapped[int] = mapped_column(Integer, default=0)


class Project(IdMixin, TimestampMixin, PublishMixin, SeoMixin, DemoMixin, Base):
    __tablename__ = "projects"
    title: Mapped[str] = mapped_column(String(160))
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    category: Mapped[str | None] = mapped_column(String(80))
    industry: Mapped[str | None] = mapped_column(String(80))
    client: Mapped[str | None] = mapped_column(String(160))
    role: Mapped[str | None] = mapped_column(String(120))  # our role on the project
    platforms: Mapped[list] = mapped_column(JSONType, default=list)  # Android, iOS, Web, Desktop
    short_description: Mapped[str | None] = mapped_column(String(400))
    long_description: Mapped[str | None] = mapped_column(Text)  # sanitized HTML
    challenge: Mapped[str | None] = mapped_column(Text)
    solution: Mapped[str | None] = mapped_column(Text)
    design_notes: Mapped[str | None] = mapped_column(Text)
    development_notes: Mapped[str | None] = mapped_column(Text)
    architecture: Mapped[str | None] = mapped_column(Text)
    features: Mapped[list] = mapped_column(JSONType, default=list)  # [str]
    results: Mapped[list] = mapped_column(JSONType, default=list)  # [{label, value}]
    thumbnail: Mapped[str | None] = mapped_column(String(600))
    hero_image: Mapped[str | None] = mapped_column(String(600))
    video_url: Mapped[str | None] = mapped_column(String(600))
    external_url: Mapped[str | None] = mapped_column(String(600))
    accent: Mapped[str | None] = mapped_column(String(20))  # optional brand tint for the card
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    view_count: Mapped[int] = mapped_column(Integer, default=0)

    images: Mapped[list[ProjectImage]] = relationship(
        order_by=ProjectImage.order, cascade="all, delete-orphan", lazy="selectin"
    )
    technologies: Mapped[list[Technology]] = relationship(
        secondary="project_technologies", lazy="selectin", order_by=Technology.order
    )
    services: Mapped[list["Service"]] = relationship(
        secondary=project_services, back_populates="projects", lazy="selectin"
    )


class ServiceFeature(IdMixin, Base):
    __tablename__ = "service_features"
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str | None] = mapped_column(Text)
    order: Mapped[int] = mapped_column(Integer, default=0)


class Service(IdMixin, TimestampMixin, PublishMixin, SeoMixin, Base):
    __tablename__ = "services"
    title: Mapped[str] = mapped_column(String(160))
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    number: Mapped[str | None] = mapped_column(String(4))
    group: Mapped[str] = mapped_column(String(40), default="engineering")  # engineering | ai | growth
    tagline: Mapped[str | None] = mapped_column(String(240))
    description: Mapped[str | None] = mapped_column(Text)
    body: Mapped[str | None] = mapped_column(Text)  # sanitized HTML for the service page
    icon: Mapped[str | None] = mapped_column(String(60))  # lucide icon name
    hero_image: Mapped[str | None] = mapped_column(String(600))
    benefits: Mapped[list] = mapped_column(JSONType, default=list)  # [str]
    process: Mapped[list] = mapped_column(JSONType, default=list)  # [{title, description}]
    deliverables: Mapped[list] = mapped_column(JSONType, default=list)  # [str]
    platforms: Mapped[list] = mapped_column(JSONType, default=list)  # e.g. social platforms offered
    show_on_home: Mapped[bool] = mapped_column(Boolean, default=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0)

    features: Mapped[list[ServiceFeature]] = relationship(
        order_by=ServiceFeature.order, cascade="all, delete-orphan", lazy="selectin"
    )
    technologies: Mapped[list[Technology]] = relationship(secondary=service_technologies, lazy="selectin")
    projects: Mapped[list[Project]] = relationship(
        secondary=project_services, back_populates="services", lazy="selectin"
    )


class Industry(IdMixin, TimestampMixin, PublishMixin, SeoMixin, Base):
    __tablename__ = "industries"
    name: Mapped[str] = mapped_column(String(120))
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    icon: Mapped[str | None] = mapped_column(String(60))
    image: Mapped[str | None] = mapped_column(String(600))
    description: Mapped[str | None] = mapped_column(Text)
    solutions: Mapped[list] = mapped_column(JSONType, default=list)  # [str]
    challenges: Mapped[list] = mapped_column(JSONType, default=list)  # [str]


class ProcessStage(IdMixin, TimestampMixin, PublishMixin, Base):
    __tablename__ = "process_stages"
    number: Mapped[str] = mapped_column(String(4))
    stage: Mapped[str] = mapped_column(String(60))  # short label, e.g. DISCOVER
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str | None] = mapped_column(Text)
    duration: Mapped[str | None] = mapped_column(String(60))
    icon: Mapped[str | None] = mapped_column(String(60))
    activities: Mapped[list] = mapped_column(JSONType, default=list)
    deliverables: Mapped[list] = mapped_column(JSONType, default=list)
    team: Mapped[list] = mapped_column(JSONType, default=list)
    technologies: Mapped[list] = mapped_column(JSONType, default=list)


class EngagementModel(IdMixin, TimestampMixin, PublishMixin, Base):
    __tablename__ = "engagement_models"
    title: Mapped[str] = mapped_column(String(120))
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    summary: Mapped[str | None] = mapped_column(Text)
    best_for: Mapped[list] = mapped_column(JSONType, default=list)
    included: Mapped[list] = mapped_column(JSONType, default=list)
    model: Mapped[str | None] = mapped_column(String(240))  # how billing/engagement works
    cta_label: Mapped[str] = mapped_column(String(60), default="Discuss this model")
    highlighted: Mapped[bool] = mapped_column(Boolean, default=False)


class Testimonial(IdMixin, TimestampMixin, PublishMixin, DemoMixin, Base):
    __tablename__ = "testimonials"
    client_name: Mapped[str] = mapped_column(String(120))
    designation: Mapped[str | None] = mapped_column(String(120))
    company: Mapped[str | None] = mapped_column(String(160))
    photo: Mapped[str | None] = mapped_column(String(600))
    quote: Mapped[str] = mapped_column(Text)
    video_url: Mapped[str | None] = mapped_column(String(600))
    rating: Mapped[int | None] = mapped_column(Integer)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))


class FAQ(IdMixin, TimestampMixin, PublishMixin, Base):
    __tablename__ = "faqs"
    question: Mapped[str] = mapped_column(String(300))
    answer: Mapped[str] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(String(60))


class TeamMember(IdMixin, TimestampMixin, PublishMixin, Base):
    __tablename__ = "team_members"
    name: Mapped[str] = mapped_column(String(120))
    position: Mapped[str] = mapped_column(String(120))
    photo: Mapped[str | None] = mapped_column(String(600))
    bio: Mapped[str | None] = mapped_column(Text)
    skills: Mapped[list] = mapped_column(JSONType, default=list)
    linkedin: Mapped[str | None] = mapped_column(String(300))
    github: Mapped[str | None] = mapped_column(String(300))
    email: Mapped[str | None] = mapped_column(String(200))
