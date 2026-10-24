import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.session import get_db
from app.models.user_profile import UserProfileRecord
from app.schemas.settings import UserProfileSettings, SystemSettingsResponse

router = APIRouter(prefix="/settings", tags=["User Preferences & System Settings"])


def _get_or_create_profile(db: Session) -> UserProfileRecord:
    profile = db.query(UserProfileRecord).filter(UserProfileRecord.id == "default_user").first()
    if not profile:
        profile = UserProfileRecord(
            id="default_user",
            username="Chef Guest",
            display_name="FoodVerse Explorer",
            dietary_pattern="Omnivore",
            allergens_json="[]",
            daily_calorie_target=2000,
            macro_ratios_json='{"protein": 25, "carbs": 50, "fat": 25}'
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("", response_model=SystemSettingsResponse)
def get_system_settings(db: Session = Depends(get_db)):
    profile_record = _get_or_create_profile(db)

    profile = UserProfileSettings(
        username=profile_record.username,
        display_name=profile_record.display_name,
        dietary_pattern=profile_record.dietary_pattern,
        allergens=json.loads(profile_record.allergens_json) if profile_record.allergens_json else [],
        daily_calorie_target=profile_record.daily_calorie_target,
        macro_ratios=json.loads(profile_record.macro_ratios_json) if profile_record.macro_ratios_json else {"protein": 25, "carbs": 50, "fat": 25}
    )

    return SystemSettingsResponse(
        profile=profile,
        environment=settings.ENVIRONMENT,
        providers={
            "llm": f"gemini ({settings.GEMINI_MODEL})" if settings.is_gemini_configured() else "gemini (unconfigured)",
            "vision": f"gemini ({settings.GEMINI_MODEL})" if settings.is_gemini_configured() else "gemini (unconfigured)",
            "nutrition": settings.NUTRITION_PROVIDER
        },
        version=settings.VERSION,
        max_upload_size_mb=settings.MAX_UPLOAD_SIZE_MB,
        gemini_configured=settings.is_gemini_configured(),
        gemini_model=settings.GEMINI_MODEL
    )


@router.put("/profile", response_model=UserProfileSettings)
def update_user_profile(
    new_profile: UserProfileSettings,
    db: Session = Depends(get_db)
):
    profile_record = _get_or_create_profile(db)
    profile_record.username = new_profile.username
    profile_record.display_name = new_profile.display_name
    profile_record.dietary_pattern = new_profile.dietary_pattern
    profile_record.allergens_json = json.dumps(new_profile.allergens)
    profile_record.daily_calorie_target = new_profile.daily_calorie_target
    profile_record.macro_ratios_json = json.dumps(new_profile.macro_ratios)

    db.commit()
    db.refresh(profile_record)

    return new_profile
