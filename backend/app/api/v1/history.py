import os
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.session import get_db
from app.models.analysis import AnalysisRecord
from app.schemas.history import (
    HistoryListResponse,
    AnalysisDetailResponse,
    AnalysisSummaryItem
)

router = APIRouter(prefix="/history", tags=["Analysis History & Saved Reports"])


@router.get("", response_model=HistoryListResponse)
def get_history(
    module_type: Optional[str] = Query(None, description="Filter by module"),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(AnalysisRecord)
    if module_type and module_type != "all":
        query = query.filter(AnalysisRecord.module_type == module_type)

    total_count = query.count()
    offset = (page - 1) * page_size
    records = query.order_by(desc(AnalysisRecord.created_at)).offset(offset).limit(page_size).all()

    items = [
        AnalysisSummaryItem(
            id=r.id,
            module_type=r.module_type,
            title=r.title,
            summary=r.summary,
            confidence=r.confidence,
            input_type=r.input_type,
            file_path=r.file_path,
            created_at=r.created_at.isoformat() if r.created_at else ""
        )
        for r in records
    ]

    return HistoryListResponse(
        total_count=total_count,
        page=page,
        page_size=page_size,
        items=items
    )


@router.get("/export")
def export_history(
    module_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(AnalysisRecord)
    if module_type and module_type != "all":
        query = query.filter(AnalysisRecord.module_type == module_type)

    records = query.order_by(desc(AnalysisRecord.created_at)).all()
    export_data = []
    for r in records:
        try:
            res = json.loads(r.results_json)
        except Exception:
            res = r.results_json

        export_data.append({
            "id": r.id,
            "module_type": r.module_type,
            "title": r.title,
            "summary": r.summary,
            "confidence": r.confidence,
            "input_type": r.input_type,
            "created_at": r.created_at.isoformat() if r.created_at else "",
            "results": res
        })
    return {"export_count": len(export_data), "analyses": export_data}


@router.get("/{analysis_id}", response_model=AnalysisDetailResponse)
def get_analysis_detail(analysis_id: str, db: Session = Depends(get_db)):
    r = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    try:
        results = json.loads(r.results_json)
    except Exception:
        results = {"raw": r.results_json}

    try:
        metadata = json.loads(r.metadata_json) if r.metadata_json else None
    except Exception:
        metadata = None

    return AnalysisDetailResponse(
        id=r.id,
        module_type=r.module_type,
        title=r.title,
        summary=r.summary,
        confidence=r.confidence,
        input_type=r.input_type,
        file_path=r.file_path,
        results=results,
        metadata=metadata,
        created_at=r.created_at.isoformat() if r.created_at else ""
    )


@router.delete("/{analysis_id}")
def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    r = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    # Remove file on disk if exists
    if r.file_path and os.path.exists(r.file_path):
        try:
            os.remove(r.file_path)
        except OSError:
            pass

    db.delete(r)
    db.commit()
    return {"status": "deleted", "id": analysis_id}
