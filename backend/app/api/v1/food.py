import json
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, Query, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.analysis import AnalysisRecord
from app.services.file_service import file_service
from app.services.food_recognition_service import food_recognition_service
from app.services.nutrition_service import nutrition_service
from app.schemas.food import FoodRecognitionResponse

router = APIRouter(prefix="/food", tags=["Food Recognition & Nutrition"])


@router.post("/recognize", response_model=FoodRecognitionResponse)
async def recognize_food(
    file: Optional[UploadFile] = File(None),
    query: Optional[str] = Form(None),
    portion_grams: float = Form(100.0),
    db: Session = Depends(get_db)
):
    if not file and not query:
        raise HTTPException(
            status_code=400,
            detail="Either a food image file or a text description must be provided."
        )

    file_record = None
    image_path = None
    image_url = None

    if file and file.filename:
        file_record = await file_service.save_upload_file(file, db, allowed_types="image")
        image_path = file_record.file_path
        image_url = f"/api/v1/uploads/{file_record.stored_filename}"

    result = food_recognition_service.recognize(
        image_path=image_path,
        query=query,
        portion_grams=portion_grams,
        image_url=image_url
    )

    # Persist analysis record
    record = AnalysisRecord(
        id=result.id,
        module_type="food_recognition",
        title=f"Recognized: {result.top_prediction.name}",
        summary=f"{result.nutrition.calories} kcal | {result.nutrition.protein_g}g Protein | {result.portion.description}",
        confidence=result.top_prediction.confidence,
        input_type="image" if file_record else "text",
        file_path=image_path,
        results_json=result.model_dump_json(),
        metadata_json=json.dumps({"portion_grams": portion_grams, "query": query})
    )
    db.add(record)
    db.commit()

    return result


@router.get("/nutrition")
def get_nutrition_info(
    item_name: str = Query(..., description="Food item name to look up"),
    portion_grams: float = Query(100.0, gt=0, le=2000, description="Serving portion in grams")
):
    calc = nutrition_service.calculate_nutrition(item_name, portion_grams)
    return {
        "food_name": calc["food_name"],
        "category": calc["category"],
        "portion": calc["portion"],
        "nutrition": calc["macros"],
        "micronutrients": calc["micros"],
        "data_source": calc["data_source"]
    }
