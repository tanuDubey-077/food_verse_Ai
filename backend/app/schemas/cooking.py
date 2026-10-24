from typing import List, Optional
from pydantic import BaseModel, Field


class RecipeIngredient(BaseModel):
    name: str
    amount: str
    notes: Optional[str] = None


class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    timer_sec: int = 0
    technique_tip: Optional[str] = None


class Recipe(BaseModel):
    title: str
    prep_time_min: int
    cook_time_min: int
    servings: int
    difficulty: str  # Beginner, Intermediate, Advanced
    calories_per_serving: Optional[int] = None
    ingredients: List[RecipeIngredient]
    steps: List[RecipeStep]
    chef_tips: str
    allergens: List[str] = []


class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str


class CookingPreferences(BaseModel):
    diet: Optional[str] = "All"
    skill_level: Optional[str] = "Intermediate"
    max_time_min: Optional[int] = 30
    allergens: Optional[List[str]] = []


class CookingChatRequest(BaseModel):
    message: str
    preferences: Optional[CookingPreferences] = Field(default_factory=CookingPreferences)
    history: Optional[List[ChatMessage]] = Field(default_factory=list)


class CookingChatResponse(BaseModel):
    reply: str
    recipe: Optional[Recipe] = None
    suggested_questions: List[str] = []


class SubstituteRequest(BaseModel):
    ingredient: str
    context: Optional[str] = None


class SubstituteOption(BaseModel):
    name: str
    ratio: str
    notes: str


class SubstituteResponse(BaseModel):
    ingredient: str
    substitutes: List[SubstituteOption]
    culinary_explanation: str
