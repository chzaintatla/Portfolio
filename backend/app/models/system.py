from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, JSONType, TimestampMixin


class Media(IdMixin, TimestampMixin, Base):
    __tablename__ = "media"
    filename: Mapped[str] = mapped_column(String(260))
    url: Mapped[str] = mapped_column(String(600))
    storage_key: Mapped[str] = mapped_column(String(400))
    folder: Mapped[str] = mapped_column(String(120), default="general", index=True)
    mime_type: Mapped[str] = mapped_column(String(100))
    size: Mapped[int] = mapped_column(Integer)
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    alt: Mapped[str | None] = mapped_column(String(200))
    uploaded_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))


class SEO(IdMixin, TimestampMixin, Base):
    """SEO metadata for static routes (/, /about, /services …). Dynamic records carry their own."""

    __tablename__ = "seo"
    path: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str | None] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(String(400))
    keywords: Mapped[str | None] = mapped_column(String(400))
    canonical_url: Mapped[str | None] = mapped_column(String(600))
    og_title: Mapped[str | None] = mapped_column(String(200))
    og_description: Mapped[str | None] = mapped_column(String(400))
    og_image: Mapped[str | None] = mapped_column(String(600))
    twitter_card: Mapped[str] = mapped_column(String(40), default="summary_large_image")
    structured_data: Mapped[dict | None] = mapped_column(JSONType)
    noindex: Mapped[bool] = mapped_column(default=False)


class SiteSetting(IdMixin, TimestampMixin, Base):
    """Key/value settings. Values are JSON so a key can hold text, lists or objects."""

    __tablename__ = "site_settings"
    key: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    value: Mapped[object] = mapped_column(JSONType)
    group: Mapped[str] = mapped_column(String(40), default="general")
    is_public: Mapped[bool] = mapped_column(default=True)


class SocialLink(IdMixin, TimestampMixin, Base):
    __tablename__ = "social_links"
    platform: Mapped[str] = mapped_column(String(40))
    url: Mapped[str] = mapped_column(String(400))
    order: Mapped[int] = mapped_column(Integer, default=0)
    published: Mapped[bool] = mapped_column(default=True)


class AnalyticsEvent(IdMixin, Base):
    __tablename__ = "analytics_events"
    name: Mapped[str] = mapped_column(String(60), index=True)  # page_view | cta_click | lead_submit | ...
    path: Mapped[str | None] = mapped_column(String(300), index=True)
    entity_type: Mapped[str | None] = mapped_column(String(40))
    entity_slug: Mapped[str | None] = mapped_column(String(200))
    referrer: Mapped[str | None] = mapped_column(String(400))
    session_id: Mapped[str | None] = mapped_column(String(64))
    props: Mapped[dict | None] = mapped_column(JSONType)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class AuditLog(IdMixin, Base):
    __tablename__ = "audit_logs"
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    user_email: Mapped[str | None] = mapped_column(String(200))
    action: Mapped[str] = mapped_column(String(40))  # create | update | delete | login | ...
    entity: Mapped[str] = mapped_column(String(60))
    entity_id: Mapped[str | None] = mapped_column(String(60))
    summary: Mapped[str | None] = mapped_column(Text)
    ip: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
