from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, IdMixin, TimestampMixin

LEAD_STATUSES = ("new", "contacted", "qualified", "proposal", "won", "lost")
LEAD_PRIORITIES = ("low", "medium", "high")


class LeadNote(IdMixin, Base):
    __tablename__ = "lead_notes"
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"), index=True)
    author_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    author_name: Mapped[str | None] = mapped_column(String(120))
    body: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Lead(IdMixin, TimestampMixin, Base):
    __tablename__ = "leads"
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(200), index=True)
    company: Mapped[str | None] = mapped_column(String(160))
    phone: Mapped[str | None] = mapped_column(String(40))
    service: Mapped[str | None] = mapped_column(String(160))
    budget: Mapped[str | None] = mapped_column(String(60))
    timeline: Mapped[str | None] = mapped_column(String(60))
    message: Mapped[str] = mapped_column(Text)
    referral: Mapped[str | None] = mapped_column(String(120))  # "How did you hear about us?"
    source: Mapped[str] = mapped_column(String(60), default="website")  # website | consultation | referral | manual
    utm: Mapped[str | None] = mapped_column(String(400))
    page: Mapped[str | None] = mapped_column(String(300))

    status: Mapped[str] = mapped_column(String(20), default="new", index=True)
    priority: Mapped[str] = mapped_column(String(10), default="medium")
    follow_up_date: Mapped[date | None] = mapped_column(Date)
    assigned_to_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    assigned_to = relationship("User", lazy="selectin")

    notes: Mapped[list[LeadNote]] = relationship(
        order_by=LeadNote.created_at.desc(), cascade="all, delete-orphan", lazy="selectin"
    )
