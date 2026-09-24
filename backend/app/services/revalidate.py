"""Tell the Next.js frontend to drop cached pages after CMS edits (on-demand ISR)."""

import logging

import httpx
from fastapi import BackgroundTasks

from app.core.config import settings

log = logging.getLogger("sparkwave.revalidate")


def _call(tags: list[str]) -> None:
    if not settings.revalidate_secret:
        return
    try:
        httpx.post(
            f"{settings.frontend_url.rstrip('/')}/revalidate",
            json={"tags": tags},
            headers={"x-revalidate-secret": settings.revalidate_secret},
            timeout=5,
        )
    except httpx.HTTPError:
        log.warning("Revalidation request failed for tags=%s", tags)


def revalidate(background: BackgroundTasks, *tags: str) -> None:
    background.add_task(_call, list(tags))
