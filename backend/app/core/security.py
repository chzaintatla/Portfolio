import secrets
from datetime import UTC, datetime, timedelta

import bcrypt
import jwt
from fastapi import Response

from app.core.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), password_hash.encode())
    except ValueError:
        return False


def create_access_token(user_id: int) -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=settings.jwt_expires_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None


def set_auth_cookies(response: Response, token: str) -> str:
    """Session JWT in an HttpOnly cookie + a readable CSRF token (double-submit pattern)."""
    csrf = secrets.token_urlsafe(32)
    max_age = settings.jwt_expires_minutes * 60
    common = dict(
        max_age=max_age,
        secure=settings.cookie_secure,
        samesite="lax",
        domain=settings.cookie_domain or None,
        path="/",
    )
    response.set_cookie(settings.cookie_name, token, httponly=True, **common)
    response.set_cookie(settings.csrf_cookie_name, csrf, httponly=False, **common)
    return csrf


def clear_auth_cookies(response: Response) -> None:
    for name in (settings.cookie_name, settings.csrf_cookie_name):
        response.delete_cookie(name, path="/", domain=settings.cookie_domain or None)
