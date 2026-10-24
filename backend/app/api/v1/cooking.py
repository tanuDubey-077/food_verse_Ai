import json
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.analysis import AnalysisRecord
from app.services.cooking_assistant_service import cooking_assistant_service
from app.schemas.cooking import (
    CookingChatRequest,
    CookingChatResponse,
    SubstituteRequest,
    SubstituteResponse
)

router = APIRouter(prefix="/cooking", tags=["Smart Cooking Assistant"])


@router.post("/chat", response_model=CookingChatResponse)
def cooking_chat(
    request: CookingChatRequest,
    db: Session = Depends(get_db)
):
    response = cooking_assistant_service.chat(request)

    # If a full recipe was synthesized, log it into history
    if response.recipe:
        record = AnalysisRecord(
            id=f"cook_{uuid.uuid4().hex[:8]}",
            module_type="cooking",
            title=f"Recipe: {response.recipe.title}",
            summary=f"{response.recipe.prep_time_min + response.recipe.cook_time_min} mins | {len(response.recipe.ingredients)} ingredients | {response.recipe.difficulty}",
            confidence=0.95,
            input_type="text",
            file_path=None,
            results_json=response.model_dump_json(),
            metadata_json=json.dumps({"prompt": request.message})
        )
        db.add(record)
        db.commit()

    return response


@router.post("/substitute", response_model=SubstituteResponse)
def get_ingredient_substitution(request: SubstituteRequest):
    return cooking_assistant_service.substitute(request.ingredient, request.context)
