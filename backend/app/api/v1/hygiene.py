import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.analysis import AnalysisRecord
from app.services.file_service import file_service
from app.services.hygiene_analysis_service import hygiene_analysis_service
from app.schemas.hygiene import HygieneAnalysisResponse

router = APIRouter(prefix="/hygiene", tags=["Restaurant Hygiene & Safety"])


@router.post("/analyze", response_model=HygieneAnalysisResponse)
async def analyze_hygiene(
    file: UploadFile = File(...),
    environment_type: str = Form("commercial_kitchen"),
    db: Session = Depends(get_db)
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="A kitchen image or video file must be uploaded.")

    file_record = await file_service.save_upload_file(file, db, allowed_types="all")
    media_type = "video" if "video" in file_record.mime_type else "image"
    media_url = f"/api/v1/uploads/{file_record.stored_filename}"

    result = hygiene_analysis_service.analyze(
        file_path=file_record.file_path,
        media_type=media_type,
        environment_type=environment_type,
        media_url=media_url
    )

    # Persist in DB
    record = AnalysisRecord(
        id=result.id,
        module_type="hygiene",
        title=f"Hygiene Audit ({result.inspection_tier})",
        summary=f"Score: {result.overall_score}/100 | Critical: {result.summary.critical_count} | Major: {result.summary.major_count} | Frames: {result.frames_analyzed}",
        confidence=result.overall_score / 100.0,
        input_type=media_type,
        file_path=file_record.file_path,
        results_json=result.model_dump_json(),
        metadata_json=json.dumps({"environment_type": environment_type, "media_type": media_type})
    )
    db.add(record)
    db.commit()

    return result
