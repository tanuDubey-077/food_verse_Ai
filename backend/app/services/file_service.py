import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.file import UploadedFileRecord

ALLOWED_IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic", "image/heif"}
ALLOWED_VIDEO_MIMES = {"video/mp4", "video/webm", "video/quicktime"}
ALL_ALLOWED_MIMES = ALLOWED_IMAGE_MIMES | ALLOWED_VIDEO_MIMES


class FileService:
    @staticmethod
    async def save_upload_file(file: UploadFile, db: Session, allowed_types: str = "all") -> UploadedFileRecord:
        content_type = (file.content_type or "").lower()
        filename_lower = (file.filename or "").lower()

        # Fallback MIME deduction if client sends octet-stream
        if content_type in ("application/octet-stream", ""):
            if filename_lower.endswith((".jpg", ".jpeg")):
                content_type = "image/jpeg"
            elif filename_lower.endswith(".png"):
                content_type = "image/png"
            elif filename_lower.endswith(".webp"):
                content_type = "image/webp"
            elif filename_lower.endswith((".mp4", ".m4v")):
                content_type = "video/mp4"
            elif filename_lower.endswith(".webm"):
                content_type = "video/webm"
            elif filename_lower.endswith(".mov"):
                content_type = "video/quicktime"

        if allowed_types == "image" and content_type not in ALLOWED_IMAGE_MIMES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image type: {content_type}. Allowed: JPEG, PNG, WebP."
            )
        elif allowed_types == "video" and content_type not in ALLOWED_VIDEO_MIMES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported video type: {content_type}. Allowed: MP4, WebM, MOV."
            )
        elif allowed_types == "all" and content_type not in ALL_ALLOWED_MIMES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported media type: {content_type}. Allowed: JPEG, PNG, WebP, MP4, WebM."
            )

        # Generate unique safe filename
        ext = os.path.splitext(file.filename or "")[1].lower()
        if not ext:
            ext = ".jpg" if "image" in content_type else ".mp4"
            
        file_uuid = str(uuid.uuid4())
        stored_filename = f"{file_uuid}{ext}"
        target_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

        # Read and check size
        size = 0
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

        async with aiofiles.open(target_path, "wb") as out_file:
            while content := await file.read(1024 * 1024):  # 1MB chunks
                size += len(content)
                if size > max_bytes:
                    out_file.close()
                    if os.path.exists(target_path):
                        os.remove(target_path)
                    raise HTTPException(
                        status_code=413,
                        detail=f"File exceeds maximum size limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
                    )
                await out_file.write(content)

        # Persist record
        record = UploadedFileRecord(
            id=file_uuid,
            original_filename=file.filename or "uploaded_media",
            stored_filename=stored_filename,
            file_path=target_path,
            file_size_bytes=size,
            mime_type=content_type
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record


file_service = FileService()
