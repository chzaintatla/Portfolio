import logging
import smtplib
from email.message import EmailMessage
from html import escape

from app.core.config import settings
from app.models import Lead

log = logging.getLogger("sparkwave.email")


def send_email(to: str, subject: str, text: str, html: str | None = None, reply_to: str | None = None) -> None:
    """Send via SMTP. With no SMTP_HOST configured (local dev) the message is logged instead."""
    if not settings.smtp_host:
        log.info("Email (not sent, SMTP disabled) to=%s subject=%s\n%s", to, subject, text)
        return
    msg = EmailMessage()
    msg["From"] = settings.smtp_from
    msg["To"] = to
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(text)
    if html:
        msg.add_alternative(html, subtype="html")
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(msg)
    except Exception:  # never fail a lead submission because email is down
        log.exception("Failed to send email to %s", to)


def _rows(lead: Lead) -> list[tuple[str, str]]:
    return [
        ("Name", lead.name), ("Email", lead.email), ("Company", lead.company or "—"),
        ("Phone", lead.phone or "—"), ("Service", lead.service or "—"), ("Budget", lead.budget or "—"),
        ("Timeline", lead.timeline or "—"), ("Heard via", lead.referral or "—"), ("Source", lead.source),
    ]


def notify_admin_of_lead(lead: Lead) -> None:
    rows = _rows(lead)
    text = "\n".join(f"{k}: {v}" for k, v in rows) + f"\n\n{lead.message}"
    html = (
        "<h2>New project request</h2><table>"
        + "".join(f"<tr><td><b>{escape(k)}</b></td><td>{escape(v)}</td></tr>" for k, v in rows)
        + f"</table><p>{escape(lead.message)}</p>"
        + f'<p><a href="{settings.frontend_url}/admin/leads/{lead.id}">Open in admin</a></p>'
    )
    send_email(settings.admin_notify_email, f"New lead: {lead.name} — {lead.service or 'General'}",
               text, html, reply_to=lead.email)


def confirm_to_lead(lead: Lead) -> None:
    first = lead.name.split(" ")[0]
    text = (
        f"Hi {first},\n\nThanks for reaching out to SparkWave Digital Systems. "
        "We've received your request and someone from our team will reply within one business day.\n\n"
        "— SparkWave Digital Systems"
    )
    html = (
        f"<p>Hi {escape(first)},</p><p>Thanks for reaching out to <b>SparkWave Digital Systems</b>. "
        "We've received your request and someone from our team will reply within one business day.</p>"
        "<p>— SparkWave Digital Systems</p>"
    )
    send_email(lead.email, "We received your project request", text, html)
