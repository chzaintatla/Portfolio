from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, DemoMixin, IdMixin, SeoMixin, TimestampMixin

post_tags = Table(
    "blog_post_tags",
    Base.metadata,
    Column("post_id", ForeignKey("blog_posts.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("blog_tags.id", ondelete="CASCADE"), primary_key=True),
)


class BlogCategory(IdMixin, TimestampMixin, Base):
    __tablename__ = "blog_categories"
    name: Mapped[str] = mapped_column(String(80), unique=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(String(300))
    order: Mapped[int] = mapped_column(Integer, default=0)


class BlogTag(IdMixin, Base):
    __tablename__ = "blog_tags"
    name: Mapped[str] = mapped_column(String(60), unique=True)
    slug: Mapped[str] = mapped_column(String(60), unique=True, index=True)


class BlogPost(IdMixin, TimestampMixin, SeoMixin, DemoMixin, Base):
    __tablename__ = "blog_posts"
    title: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    excerpt: Mapped[str | None] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(Text, default="")  # sanitized HTML from the rich-text editor
    featured_image: Mapped[str | None] = mapped_column(String(600))
    author_name: Mapped[str | None] = mapped_column(String(120))
    author_id: Mapped[int | None] = mapped_column(ForeignKey("team_members.id", ondelete="SET NULL"))
    category_id: Mapped[int | None] = mapped_column(ForeignKey("blog_categories.id", ondelete="SET NULL"))
    category: Mapped[BlogCategory | None] = relationship(lazy="selectin")
    tags: Mapped[list[BlogTag]] = relationship(secondary=post_tags, lazy="selectin")
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)  # draft | published | scheduled
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)
    reading_minutes: Mapped[int] = mapped_column(Integer, default=1)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
