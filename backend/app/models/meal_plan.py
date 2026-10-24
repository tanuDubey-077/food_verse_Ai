from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database.session import Base


class MealPlanRecord(Base):
    __tablename__ = "meal_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    duration_days = Column(Integer, nullable=False, default=7)
    diet_pattern = Column(String(100), nullable=False)
    allergens_excluded = Column(Text, nullable=True)  # JSON list
    target_daily_calories = Column(Integer, nullable=False)
    plan_data_json = Column(Text, nullable=False)  # JSON structure of daily meals
    shopping_list_json = Column(Text, nullable=False)  # JSON structure of grocery items
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
