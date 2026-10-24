import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.session import get_db
from app.models.meal_plan import MealPlanRecord
from app.models.analysis import AnalysisRecord
from app.services.meal_planning_service import meal_planning_service
from app.schemas.meal_planner import MealPlanGenerateRequest, MealPlanResponse

router = APIRouter(prefix="/meals", tags=["Personalized Meal Planner"])


@router.post("/generate", response_model=MealPlanResponse)
def generate_meal_plan(
    request: MealPlanGenerateRequest,
    db: Session = Depends(get_db)
):
    plan = meal_planning_service.generate_plan(request)

    # Persist in MealPlanRecord
    plan_record = MealPlanRecord(
        id=plan.id,
        title=plan.title,
        duration_days=plan.duration_days,
        diet_pattern=plan.diet_pattern,
        allergens_excluded=json.dumps(plan.allergens_excluded),
        target_daily_calories=plan.target_daily_calories,
        plan_data_json=json.dumps([day.model_dump() for day in plan.days]),
        shopping_list_json=json.dumps(plan.shopping_list)
    )
    db.add(plan_record)

    # Also log to AnalysisRecord for global unified history
    analysis_record = AnalysisRecord(
        id=plan.id,
        module_type="meal_planning",
        title=plan.title,
        summary=f"{plan.duration_days} Days | {plan.target_daily_calories} kcal/day | {len(plan.shopping_list)} grocery aisles",
        confidence=0.98,
        input_type="parameters",
        file_path=None,
        results_json=plan.model_dump_json(),
        metadata_json=json.dumps({"diet_pattern": plan.diet_pattern, "allergens": plan.allergens_excluded})
    )
    db.add(analysis_record)
    db.commit()

    return plan


@router.get("", response_model=List[dict])
def list_saved_meal_plans(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    records = db.query(MealPlanRecord).order_by(desc(MealPlanRecord.created_at)).limit(limit).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "duration_days": r.duration_days,
            "diet_pattern": r.diet_pattern,
            "target_daily_calories": r.target_daily_calories,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in records
    ]


@router.get("/{plan_id}", response_model=MealPlanResponse)
def get_meal_plan(plan_id: str, db: Session = Depends(get_db)):
    r = db.query(MealPlanRecord).filter(MealPlanRecord.id == plan_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Meal plan not found.")

    return MealPlanResponse(
        id=r.id,
        title=r.title,
        duration_days=r.duration_days,
        diet_pattern=r.diet_pattern,
        allergens_excluded=json.loads(r.allergens_excluded) if r.allergens_excluded else [],
        target_daily_calories=r.target_daily_calories,
        days=json.loads(r.plan_data_json),
        shopping_list=json.loads(r.shopping_list_json),
        disclaimer="Personalized nutrition meal plan retrieved from persistent storage."
    )


@router.delete("/{plan_id}")
def delete_meal_plan(plan_id: str, db: Session = Depends(get_db)):
    r = db.query(MealPlanRecord).filter(MealPlanRecord.id == plan_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Meal plan not found.")
    db.delete(r)
    db.commit()
    return {"status": "deleted", "id": plan_id}
