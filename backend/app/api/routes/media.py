from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from sqlalchemy import func, or_, select

from app.core.deps import DB, audit, require
from app.models import Media, User
from app.schemas import MediaOut, MediaUpdate, Page
from app.services.storage import delete_stored, store_upload

router = APIRouter(prefix="/api/admin/media", tags=["admin:media"])


@router.get("", response_model=Page[MediaOut], dependencies=[Depends(require("media:read"))])
def list_media(
    db: DB, page: int = 1, page_size: int = 48, folder: str | None = None, q: str | None = None,
    kind: str | None = None,
):
    query = select(Media)
    if folder:
        query = query.where(Media.folder == folder)
    if kind:  # image | video | document
        prefix = {"image": "image/", "video": "video/", "document": "application/"}.get(kind, "")
        query = query.where(Media.mime_type.startswith(prefix))
    if q:
        like = f"%{q[:80]}%"
        query = query.where(or_(Media.filename.ilike(like), Media.alt.ilike(like)))
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(query.order_by(Media.created_at.desc()).offset((max(page, 1) - 1) * page_size)
                       .limit(min(page_size, 100))).all()
    return Page(items=items, total=total, page=page, page_size=page_size)


@router.get("/folders", dependencies=[Depends(require("media:read"))])
def folders(db: DB) -> list[dict]:
    rows = db.execute(select(Media.folder, func.count()).group_by(Media.folder).order_by(Media.folder)).all()
    return [{"name": f, "count": n} for f, n in rows]


@router.post("", response_model=list[MediaOut], status_code=201)
async def upload(
    request: Request, db: DB, files: list[UploadFile] = File(...), folder: str = Form("general"),
    user: User = Depends(require("media:write")),
):
    if len(files) > 20:
        raise HTTPException(400, "Upload at most 20 files at once")
    created = []
    for file in files:
        stored = await store_upload(file, folder)
        media = Media(
            filename=(file.filename or "file")[:250], url=stored.url, storage_key=stored.key,
            folder=folder, mime_type=file.content_type or "", size=stored.size,
            width=stored.width, height=stored.height, uploaded_by_id=user.id,
        )
        db.add(media)
        created.append(media)
    audit(db, request, user, "upload", "media", None, f"{len(files)} file(s) → {folder}")
    db.commit()
    return created


@router.put("/{media_id}", response_model=MediaOut)
def update_media(media_id: int, payload: MediaUpdate, db: DB, _: User = Depends(require("media:write"))):
    media = db.get(Media, media_id)
    if not media:
        raise HTTPException(404, "Not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(media, key, value)
    db.commit()
    return media


@router.delete("/{media_id}", status_code=204)
def delete_media(media_id: int, request: Request, db: DB, user: User = Depends(require("media:delete"))):
    media = db.get(Media, media_id)
    if not media:
        raise HTTPException(404, "Not found")
    delete_stored(media.storage_key)
    audit(db, request, user, "delete", "media", media.id, media.filename)
    db.delete(media)
    db.commit()
