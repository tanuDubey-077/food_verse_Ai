from typing import List, Dict
from pydantic import BaseModel, Field


class UserProfileSettings(BaseModel):
    username: str = "Chef Guest"
    display_name: str = "FoodVerse Explorer"
    dietary_pattern: str = "Omnivore"
    allergens: List[str] = Field(default_factory=list)
    daily_calorie_target: int = 2000
    macro_ratios: Dict[str, int] = Field(default_factory=lambda: {"protein": 25, "carbs": 50, "fat": 25})


class SystemSettingsResponse(BaseModel):
    profile: UserProfileSettings
    environment: str
    providers: Dict[str, str]
    version: str
    max_upload_size_mb: int
    gemini_configured: bool = False
    gemini_model: str = "gemini-2.5-flash"
