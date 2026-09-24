import hmac
from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models import AuditLog, User

DB = Annotated[Session, Depends(get_db)]

SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


def get_current_user(request: Request, db: DB) -> User:
    token = request.cookies.get(settings.cookie_name)
    # Bearer tokens are accepted for scripts/CI; they are not subject to CSRF.
    auth = request.headers.get("authorization", "")
    via_cookie = bool(token)
    if not token and auth.lower().startswith("bearer "):
        token = auth[7:]
    user_id = decode_access_token(token) if token else None
    if not user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")

    if via_cookie and request.method not in SAFE_METHODS:
        cookie_csrf = request.cookies.get(settings.csrf_cookie_name, "")
        header_csrf = request.headers.get("x-csrf-token", "")
        if not cookie_csrf or not hmac.compare_digest(cookie_csrf, header_csrf):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "CSRF token missing or invalid")

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Account unavailable")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require(permission: str) -> Callable[..., User]:
    """Dependency factory: `Depends(require("projects:write"))`."""

    def checker(user: CurrentUser) -> User:
        if not user.can(permission):
            raise HTTPException(status.HTTP_403_FORBIDDEN, f"Missing permission: {permission}")
        return user

    return checker


def client_ip(request: Request) -> str | None:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else None


def audit(
    db: Session, request: Request, user: User | None, action: str, entity: str,
    entity_id: object = None, summary: str | None = None,
) -> None:
    db.add(AuditLog(
        user_id=user.id if user else None,
        user_email=user.email if user else None,
        action=action,
        entity=entity,
        entity_id=str(entity_id) if entity_id is not None else None,
        summary=summary,
        ip=client_ip(request),
    ))
