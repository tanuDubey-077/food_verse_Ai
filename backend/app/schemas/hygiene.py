from typing import List, Optional
from pydantic import BaseModel, Field


class HygieneObservation(BaseModel):
    timestamp_sec: float
    category: str  # Personal Protective Equipment, Surface Sanitation, Cross-Contamination, Food Storage, Equipment Maintenance
    finding: str
    severity: str  # Critical, Major, Minor, Compliant
    confidence: float
    remediation: str
    frame_url: Optional[str] = None


class HygieneSummary(BaseModel):
    critical_count: int
    major_count: int
    minor_count: int
    compliant_count: int


class HygieneAnalysisResponse(BaseModel):
    id: str
    overall_score: int = Field(..., ge=0, le=100)
    inspection_tier: str  # Grade A, Grade B, Grade C, Fail / Immediate Action
    frames_analyzed: int
    media_type: str  # image, video
    summary: HygieneSummary
    observations: List[HygieneObservation]
    direct_observations: List[str] = Field(default_factory=list)
    possible_concerns: List[str] = Field(default_factory=list)
    model_interpretations: List[str] = Field(default_factory=list)
    recommended_human_review: List[str] = Field(default_factory=list)
    recommendations: List[str]
    disclaimer: str
    media_url: Optional[str] = None
