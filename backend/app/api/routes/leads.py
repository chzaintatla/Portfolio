import csv
import io

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import func, or_, select

from app.core.deps import DB, CurrentUser, audit, require
from app.core.ratelimit import limiter
from app.models import AnalyticsEvent, Lead, LeadNote, User
from app.schemas import LeadCreate, LeadNoteIn, LeadOut, LeadUpdate, Page
from app.services.email import confirm_to_lead, notify_admin_of_lead
from app.services.sanitize import plain_text

router = APIRouter(tags=["leads"])


def _create_lead(payload: LeadCreate, request: Request, background: BackgroundTasks, db, default_source: str):
    if payload.website:  # honeypot tripped: pretend success, store nothing
        return {"ok": True}
    data = payload.model_dump(exclude={"website"})
    for key, value in data.items():
        if isinstance(value, str):
            data[key] = plain_text(value)
    data["source"] = data.get("source") or default_source
    lead = Lead(**data)
    db.add(lead)
    db.add(AnalyticsEvent(name="lead_submit", path=payload.page, props={"source": lead.source,
                                                                       "service": lead.service}))
    db.commit()
    background.add_task(notify_admin_of_lead, lead)
    background.add_task(confirm_to_lead, lead)
    return {"ok": True}


@router.post("/api/leads", status_code=201)
@limiter.limit("5/minute;20/day")
def create_lead(request: Request, payload: LeadCreate, background: BackgroundTasks, db: DB):
    return _create_lead(payload, request, background, db, "website")


@router.post("/api/contact", status_code=201)
@limiter.limit("5/minute;20/day")
def contact(request: Request, payload: LeadCreate, background: BackgroundTasks, db: DB):
    """Alias of /api/leads kept for the contact page and third-party forms."""
    return _create_lead(payload, request, background, db, "contact-page")


@router.get("/api/admin/leads", response_model=Page[LeadOut], dependencies=[Depends(require("leads:read"))])
def list_leads(
    db: DB, page: int = 1, page_size: int = 25, status: str | None = None, priority: str | None = None,
    q: str | None = None, assigned_to_id: int | None = None,
):
    page_size = max(1, min(page_size, 100))
    query = select(Lead)
    if status:
        query = query.where(Lead.status == status)
    if priority:
        query = query.where(Lead.priority == priority)
    if assigned_to_id:
        query = query.where(Lead.assigned_to_id == assigned_to_id)
    if q:
        like = f"%{q[:80]}%"
        query = query.where(or_(Lead.name.ilike(like), Lead.email.ilike(like), Lead.company.ilike(like)))
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(query.order_by(Lead.created_at.desc()).offset((max(page, 1) - 1) * page_size)
                       .limit(page_size)).all()
    return Page(items=items, total=total, page=page, page_size=page_size)


@router.get("/api/admin/leads/export", dependencies=[Depends(require("leads:read"))])
def export_leads(db: DB):
    buf = io.StringIO()
    writer = csv.writer(buf)
    cols = ["id", "created_at", "name", "email", "company", "phone", "service", "budget", "timeline",
            "status", "priority", "source", "referral", "follow_up_date", "message"]
    writer.writerow(cols)
    for lead in db.scalars(select(Lead).order_by(Lead.created_at.desc())):
        # Prefix formula-looking cells so spreadsheets don't execute them.
        writer.writerow([("'" + v if isinstance(v, str) and v[:1] in "=+-@" else v)
                         for v in (getattr(lead, c) for c in cols)])
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=leads.csv"})


@router.get("/api/admin/leads/{lead_id}", response_model=LeadOut, dependencies=[Depends(require("leads:read"))])
def get_lead(lead_id: int, db: DB):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    return lead


@router.put("/api/admin/leads/{lead_id}", response_model=LeadOut)
def update_lead(
    lead_id: int, payload: LeadUpdate, request: Request, db: DB, user: User = Depends(require("leads:write")),
):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(lead, key, value)
    audit(db, request, user, "update", "leads", lead.id, ", ".join(f"{k}={v}" for k, v in data.items()))
    db.commit()
    db.refresh(lead)
    return lead


@router.post("/api/admin/leads/{lead_id}/notes", response_model=LeadOut)
def add_note(
    lead_id: int, payload: LeadNoteIn, db: DB, user: CurrentUser, _: User = Depends(require("leads:write")),
):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    db.add(LeadNote(lead_id=lead.id, author_id=user.id, author_name=user.name, body=plain_text(payload.body)))
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/api/admin/leads/{lead_id}", status_code=204)
def delete_lead(lead_id: int, request: Request, db: DB, user: User = Depends(require("leads:delete"))):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(404, "Lead not found")
    audit(db, request, user, "delete", "leads", lead.id, lead.email)
    db.delete(lead)
    db.commit()
