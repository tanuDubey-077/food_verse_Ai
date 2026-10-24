from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Float, DateTime, Text
from app.database.session import Base


class AnalysisRecord(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    module_type = Column(String(50), nullable=False, index=True)  # food_recognition, freshness, hygiene, cooking, meal_planning
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True)
    input_type = Column(String(50), nullable=False)  # image, video, text, audio
    file_path = Column(String(500), nullable=True)
    results_json = Column(Text, nullable=False)  # JSON string of structured results
    metadata_json = Column(Text, nullable=True)  # JSON string of contextual parameters
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
