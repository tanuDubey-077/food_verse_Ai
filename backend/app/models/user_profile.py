from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database.session import Base


class UserProfileRecord(Base):
    __tablename__ = "user_profiles"

    id = Column(String(50), primary_key=True, default="default_user")
    username = Column(String(100), nullable=False, default="Guest Chef")
    display_name = Column(String(100), nullable=False, default="FoodVerse Explorer")
    dietary_pattern = Column(String(100), nullable=False, default="Omnivore")
    allergens_json = Column(Text, nullable=False, default="[]")  # List of allergen strings
    daily_calorie_target = Column(Integer, nullable=False, default=2000)
    macro_ratios_json = Column(Text, nullable=False, default='{"protein": 25, "carbs": 50, "fat": 25}')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
