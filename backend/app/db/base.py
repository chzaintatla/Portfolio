from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# JSONB on Postgres, plain JSON elsewhere (keeps tests runnable on SQLite).
JSONType = JSON().with_variant(JSONB(), "postgresql")


class Base(DeclarativeBase):
    pass


class IdMixin:
    id: Mapped[int] = mapped_column(Integer, primary_key=True)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class PublishMixin:
    published: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    order: Mapped[int] = mapped_column(Integer, default=0, index=True)


class SeoMixin:
    """Per-record SEO fields. Static pages use the `SEO` table keyed by path."""

    seo_title: Mapped[str | None] = mapped_column(String(200))
    seo_description: Mapped[str | None] = mapped_column(String(400))
    seo_keywords: Mapped[str | None] = mapped_column(String(400))
    og_image: Mapped[str | None] = mapped_column(String(600))
    canonical_url: Mapped[str | None] = mapped_column(String(600))


class DemoMixin:
    """Marks seed content that must be reviewed before being presented as real."""

    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)


__all__ = [
    "Base", "IdMixin", "TimestampMixin", "PublishMixin", "SeoMixin", "DemoMixin",
    "JSONType", "Text", "String",
]
