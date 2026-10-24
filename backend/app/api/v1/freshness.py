import json
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.analysis import AnalysisRecord
from app.services.file_service import file_service
from app.services.freshness_service import freshness_service
from app.schemas.freshness import FreshnessAnalysisResponse

router = APIRouter(prefix="/freshness", tags=["Food Freshness & Spoilage Detection"])


@router.post("/analyze", response_model=FreshnessAnalysisResponse)
async def analyze_freshness(
    file: UploadFile = File(...),
    category: str = Form("Produce"),
    storage_location: str = Form("refrigerator"),
    days_stored: int = Form(2),
    purchase_date: Optional[str] = Form(None),
    expiry_date: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="A food image file must be uploaded for freshness inspection.")

    file_record = await file_service.save_upload_file(file, db, allowed_types="image")
    image_url = f"/api/v1/uploads/{file_record.stored_filename}"

    result = freshness_service.analyze(
        image_path=file_record.file_path,
        category=category,
        storage_location=storage_location,
        days_stored=days_stored,
        purchase_date=purchase_date,
        expiry_date=expiry_date,
        image_url=image_url
    )

    # Persist in DB
    record = AnalysisRecord(
        id=result.id,
        module_type="freshness",
        title=f"Freshness: {category} ({result.status})",
        summary=f"Score: {result.freshness_score}/100 | Est. remaining: {result.shelf_life_remaining_days} days | Stored in {storage_location}",
        confidence=result.freshness_score / 100.0,
        input_type="image",
        file_path=file_record.file_path,
        results_json=result.model_dump_json(),
        metadata_json=json.dumps({
            "category": category,
            "storage_location": storage_location,
            "days_stored": days_stored
        })
    )
    db.add(record)
    db.commit()

    return result
