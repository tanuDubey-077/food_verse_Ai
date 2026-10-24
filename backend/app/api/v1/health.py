import os
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.database.session import get_db
from app.schemas.health import HealthResponse, ReadinessResponse
from app.ai.gemini_service import gemini_service

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
def get_health(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    gemini_ready = gemini_service.is_configured()

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        version=settings.VERSION,
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        providers={
            "gemini": "configured" if gemini_ready else "missing_api_key",
            "gemini_model": settings.GEMINI_MODEL,
            "llm": f"gemini ({settings.GEMINI_MODEL})" if gemini_ready else "gemini (missing_api_key)",
            "vision": f"gemini ({settings.GEMINI_MODEL})" if gemini_ready else "gemini (missing_api_key)",
            "nutrition": settings.NUTRITION_PROVIDER
        },
        database=db_status
    )


@router.get("/readiness", response_model=ReadinessResponse)
def get_readiness(db: Session = Depends(get_db)):
    storage_ok = os.path.exists(settings.UPLOAD_DIR) and os.access(settings.UPLOAD_DIR, os.W_OK)
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    gemini_ready = gemini_service.is_configured()

    return ReadinessResponse(
        ready=storage_ok and db_ok and gemini_ready,
        storage_writable=storage_ok,
        database_ready=db_ok,
        models_ready=gemini_ready,
        details={
            "storage_path": settings.UPLOAD_DIR,
            "database_url": settings.DATABASE_URL.split("@")[-1],  # Sanitized
            "environment": settings.ENVIRONMENT,
            "gemini_configured": str(gemini_ready),
            "gemini_model": settings.GEMINI_MODEL
        }
    )
