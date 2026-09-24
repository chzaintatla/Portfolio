from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException, Request, Response
from sqlalchemy import func, select

from app.core.deps import DB, CurrentUser, audit
from app.core.ratelimit import limiter
from app.core.security import (
    clear_auth_cookies, create_access_token, hash_password, set_auth_cookies, verify_password,
)
from app.models import User
from app.schemas import LoginIn, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Equalise timing for unknown emails so the endpoint doesn't reveal which accounts exist.
_DUMMY_HASH = hash_password("timing-equaliser")


@router.post("/login", response_model=UserOut)
@limiter.limit("8/minute")
def login(request: Request, payload: LoginIn, response: Response, db: DB):
    user = db.scalar(select(User).where(func.lower(User.email) == payload.email.lower()))
    ok = verify_password(payload.password, user.password_hash if user else _DUMMY_HASH)
    if not user or not ok or not user.is_active:
        audit(db, request, None, "login_failed", "auth", None, payload.email)
        db.commit()
        raise HTTPException(401, "Invalid email or password")
    user.last_login_at = datetime.now(UTC)
    set_auth_cookies(response, create_access_token(user.id))
    audit(db, request, user, "login", "auth", user.id)
    db.commit()
    return UserOut.of(user)


@router.post("/logout", status_code=204)
def logout(response: Response):
    clear_auth_cookies(response)


@router.get("/me", response_model=UserOut)
def me(user: CurrentUser):
    return UserOut.of(user)
