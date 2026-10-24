from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class MealItem(BaseModel):
    id: str
    meal_type: str  # Breakfast, Lunch, Dinner, Snack
    name: str
    calories: int
    protein_g: int
    carbs_g: int
    fat_g: int
    prep_time_min: int
    ingredients: List[str]
    rationale: str


class DayMealPlan(BaseModel):
    day_number: int
    day_name: str
    target_calories: int
    estimated_calories: int
    total_protein_g: int
    total_carbs_g: int
    total_fat_g: int
    meals: List[MealItem]


class MealPlanGenerateRequest(BaseModel):
    duration_days: int = Field(default=7, ge=1, le=14)
    diet_pattern: str = "Mediterranean"
    allergens_to_avoid: List[str] = Field(default_factory=list)
    target_daily_calories: int = Field(default=2000, ge=1000, le=4500)
    macro_ratio: Dict[str, int] = Field(default_factory=lambda: {"protein": 25, "carbs": 50, "fat": 25})
    meals_per_day: int = Field(default=3, ge=2, le=5)
    include_snacks: bool = True
    budget_tier: str = "moderate"  # budget, moderate, premium


class MealPlanResponse(BaseModel):
    id: str
    title: str
    duration_days: int
    diet_pattern: str
    allergens_excluded: List[str]
    target_daily_calories: int
    days: List[DayMealPlan]
    shopping_list: Dict[str, List[str]]  # Category -> list of ingredients
    disclaimer: str
