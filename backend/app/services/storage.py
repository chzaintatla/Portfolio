"""Pluggable file storage: local disk (dev), Cloudinary or S3 (production)."""

import io
import secrets
from dataclasses import dataclass
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image

from app.core.config import settings

ALLOWED_TYPES = {
    "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif",
    "image/gif": ".gif", "image/svg+xml": ".svg", "video/mp4": ".mp4", "video/webm": ".webm",
    "application/pdf": ".pdf",
}
# Magic-byte prefixes, so a renamed executable can't slip through on its Content-Type alone.
SIGNATURES = {
    "image/jpeg": [b"\xff\xd8\xff"], "image/png": [b"\x89PNG"], "image/gif": [b"GIF8"],
    "image/webp": [b"RIFF"], "application/pdf": [b"%PDF"], "video/webm": [b"\x1a\x45\xdf\xa3"],
}


@dataclass
class Stored:
    url: str
    key: str
    size: int
    width: int | None
    height: int | None


def _validate(data: bytes, content_type: str) -> None:
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(415, f"Unsupported file type: {content_type}")
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f"File exceeds {settings.max_upload_mb} MB")
    sigs = SIGNATURES.get(content_type)
    if sigs and not any(data.startswith(s) for s in sigs):
        raise HTTPException(400, "File content does not match its type")
    if content_type == "image/svg+xml" and (b"<script" in data.lower() or b"onload=" in data.lower()):
        raise HTTPException(400, "SVG contains scripts")


def _dimensions(data: bytes, content_type: str) -> tuple[int | None, int | None]:
    if not content_type.startswith("image/") or content_type == "image/svg+xml":
        return None, None
    try:
        with Image.open(io.BytesIO(data)) as img:
            return img.width, img.height
    except Exception:
        return None, None


async def store_upload(file: UploadFile, folder: str) -> Stored:
    data = await file.read()
    content_type = file.content_type or "application/octet-stream"
    _validate(data, content_type)
    width, height = _dimensions(data, content_type)
    safe_folder = "".join(c for c in folder if c.isalnum() or c in "-_") or "general"
    key = f"{safe_folder}/{secrets.token_hex(8)}{ALLOWED_TYPES[content_type]}"

    backend = settings.storage_backend
    if backend == "cloudinary":
        import cloudinary.uploader

        res = cloudinary.uploader.upload(
            data, folder=f"sparkwave/{safe_folder}", resource_type="auto", public_id=key.split("/")[-1].split(".")[0]
        )
        return Stored(res["secure_url"], res["public_id"], len(data), width, height)
    if backend == "s3":
        import boto3

        boto3.client("s3", region_name=settings.s3_region).put_object(
            Bucket=settings.s3_bucket, Key=key, Body=data, ContentType=content_type,
            CacheControl="public, max-age=31536000, immutable",
        )
        return Stored(f"{settings.s3_public_base_url.rstrip('/')}/{key}", key, len(data), width, height)

    path = Path(settings.upload_dir) / key
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return Stored(f"/uploads/{key}", key, len(data), width, height)


def delete_stored(key: str) -> None:
    backend = settings.storage_backend
    if backend == "cloudinary":
        import cloudinary.uploader

        cloudinary.uploader.destroy(key)
    elif backend == "s3":
        import boto3

        boto3.client("s3", region_name=settings.s3_region).delete_object(Bucket=settings.s3_bucket, Key=key)
    else:
        path = Path(settings.upload_dir) / key
        if path.resolve().is_relative_to(Path(settings.upload_dir).resolve()):
            path.unlink(missing_ok=True)
