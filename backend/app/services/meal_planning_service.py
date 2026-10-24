"""FoodVerse AI — Gemini-Powered Personalized Meal Planning & Grocery Logistics Service."""

import uuid
import logging
from typing import List, Dict, Any
from fastapi import HTTPException

from app.core.config import settings
from app.ai.gemini_service import (
    gemini_service,
    GeminiMealPlanOutput,
    GeminiConfigurationError,
    GeminiQuotaError,
    GeminiTimeoutError,
    GeminiNetworkError,
    GeminiResponseError,
)
from app.schemas.meal_planner import (
    MealPlanGenerateRequest,
    MealPlanResponse,
    DayMealPlan,
    MealItem,
)

logger = logging.getLogger("foodverse.meal_planner")

ALLERGEN_KEYWORD_MAP: Dict[str, List[str]] = {
    "peanuts": ["peanut", "groundnut", "peanut butter", "arachis"],
    "tree nuts": ["almond", "walnut", "cashew", "pecan", "pistachio", "macadamia", "hazelnut", "brazil nut"],
    "dairy": ["milk", "cheese", "yogurt", "butter", "cream", "whey", "casein", "ghee"],
    "gluten": ["wheat", "barley", "rye", "flour", "bread", "pasta", "couscous", "seitan"],
    "shellfish": ["shrimp", "prawn", "crab", "lobster", "clam", "mussel", "oyster", "scallop"],
    "eggs": ["egg", "mayonnaise", "meringue", "albumin"],
    "soy": ["soy", "tofu", "edamame", "tempeh", "miso", "tamari"],
    "fish": ["salmon", "tuna", "cod", "tilapia", "halibut", "anchovy", "sardine", "trout"],
    "sesame": ["sesame", "tahini", "gomasio"],
}


class MealPlanningService:
    """Personalized nutrition schedule optimization and grocery compiler backed by Google Gemini AI."""

    def __init__(self):
        self.gemini = gemini_service

    def _validate_allergens(
        self,
        days: List[DayMealPlan],
        allergens_to_avoid: List[str]
    ) -> None:
        """Strictly validates that generated meals do not contain declared allergens."""
        if not allergens_to_avoid:
            return

        normalized_allergens = [a.strip().lower() for a in allergens_to_avoid]

        for day in days:
            for meal in day.meals:
                meal_text = f"{meal.name} {' '.join(meal.ingredients)} {meal.rationale}".lower()
                for allergen in normalized_allergens:
                    # Check exact name match
                    if allergen in meal_text:
                        logger.warning("Detected declared allergen '%s' in meal '%s'", allergen, meal.name)
                        raise HTTPException(
                            status_code=422,
                            detail=f"Safety Violation: Generated meal plan contained declared allergen '{allergen}' in '{meal.name}'. Please regenerate."
                        )
                    # Check keyword synonyms
                    synonyms = ALLERGEN_KEYWORD_MAP.get(allergen, [])
                    for syn in synonyms:
                        if syn in meal_text:
                            logger.warning("Detected declared allergen synonym '%s' (%s) in meal '%s'", syn, allergen, meal.name)
                            raise HTTPException(
                                status_code=422,
                                detail=f"Safety Violation: Generated meal plan contained allergen ingredient '{syn}' ({allergen}) in '{meal.name}'. Please regenerate."
                            )

    def generate_plan(self, request: MealPlanGenerateRequest) -> MealPlanResponse:
        """Synthesizes structured multi-day meal plans and aisle-sorted grocery lists using Gemini."""
        plan_id = f"plan_{uuid.uuid4().hex[:8]}"

        if not self.gemini.is_configured():
            logger.error("Meal planning invoked without GEMINI_API_KEY configured.")
            raise HTTPException(
                status_code=503,
                detail=(
                    "Gemini AI is not configured. Please set GEMINI_API_KEY in your backend "
                    "environment (.env file) to generate personalized meal plans."
                )
            )

        try:
            gemini_out: GeminiMealPlanOutput = self.gemini.generate_meal_plan(
                duration_days=request.duration_days,
                diet_pattern=request.diet_pattern,
                allergens_to_avoid=request.allergens_to_avoid,
                target_daily_calories=request.target_daily_calories,
                include_snacks=request.include_snacks,
                budget_tier=request.budget_tier
            )
        except GeminiQuotaError as e:
            raise HTTPException(status_code=429, detail=str(e))
        except GeminiTimeoutError as e:
            raise HTTPException(status_code=504, detail=str(e))
        except GeminiConfigurationError as e:
            raise HTTPException(status_code=503, detail=str(e))
        except (GeminiNetworkError, GeminiResponseError) as e:
            raise HTTPException(status_code=502, detail=str(e))
        except HTTPException:
            raise
        except Exception as e:
            logger.exception("Unexpected error during meal planning: %s", str(e))
            raise HTTPException(status_code=500, detail=f"Meal plan generation failed: {str(e)}")

        # Convert Gemini Day Plans to response models
        days_response: List[DayMealPlan] = []
        for d in gemini_out.days:
            meals = [
                MealItem(
                    id=m.id or f"m_{uuid.uuid4().hex[:6]}",
                    meal_type=m.meal_type,
                    name=m.name,
                    calories=m.calories,
                    protein_g=m.protein_g,
                    carbs_g=m.carbs_g,
                    fat_g=m.fat_g,
                    prep_time_min=m.prep_time_min,
                    ingredients=m.ingredients,
                    rationale=m.rationale
                )
                for m in d.meals
            ]
            days_response.append(
                DayMealPlan(
                    day_number=d.day_number,
                    day_name=d.day_name,
                    target_calories=d.target_calories or request.target_daily_calories,
                    estimated_calories=d.estimated_calories or sum(m.calories for m in meals),
                    total_protein_g=d.total_protein_g or sum(m.protein_g for m in meals),
                    total_carbs_g=d.total_carbs_g or sum(m.carbs_g for m in meals),
                    total_fat_g=d.total_fat_g or sum(m.fat_g for m in meals),
                    meals=meals
                )
            )

        # Enforce Allergen Guardrail Validation
        self._validate_allergens(days_response, request.allergens_to_avoid)

        return MealPlanResponse(
            id=plan_id,
            title=gemini_out.title or f"{request.duration_days}-Day {request.diet_pattern} Nutrition Protocol",
            duration_days=request.duration_days,
            diet_pattern=request.diet_pattern,
            allergens_excluded=request.allergens_to_avoid,
            target_daily_calories=request.target_daily_calories,
            days=days_response,
            shopping_list=gemini_out.shopping_list or {},
            disclaimer=(
                "NUTRITIONAL AI ESTIMATE: Meal plans and macronutrient breakdowns are algorithmically synthesized by Google Gemini AI. "
                "Portion sizing and preparation methods can cause actual intake to vary. Consult a registered dietitian or licensed "
                "medical professional before initiating significant dietary modifications or caloric restrictions."
            )
        )


meal_planning_service = MealPlanningService()
