"""FoodVerse AI — Gemini-Powered Freshness & Spoilage Assessment Service."""

import os
import uuid
import logging
from typing import Optional, Dict, Any, List
from fastapi import HTTPException

from app.core.config import settings
from app.ai.gemini_service import (
    gemini_service,
    GeminiFreshnessAnalysis,
    GeminiConfigurationError,
    GeminiQuotaError,
    GeminiTimeoutError,
    GeminiNetworkError,
    GeminiResponseError,
    ImageValidationError,
)
from app.schemas.freshness import FreshnessAnalysisResponse, VisualIndicator

logger = logging.getLogger("foodverse.freshness")


class FreshnessService:
    """Evaluates optical degradation, surface turgor, and shelf-life indicators using Gemini Vision."""

    def __init__(self):
        self.gemini = gemini_service

    def analyze(
        self,
        image_path: str,
        category: str = "Produce",
        storage_location: str = "refrigerator",
        days_stored: int = 2,
        purchase_date: Optional[str] = None,
        expiry_date: Optional[str] = None,
        image_url: Optional[str] = None
    ) -> FreshnessAnalysisResponse:
        """Inspects food surface degradation and freshness markers with Gemini vision."""
        analysis_id = f"frsh_{uuid.uuid4().hex[:8]}"

        if not self.gemini.is_configured():
            logger.error("Attempted freshness analysis without GEMINI_API_KEY configured.")
            raise HTTPException(
                status_code=503,
                detail=(
                    "Gemini AI is not configured. Please set GEMINI_API_KEY in your backend "
                    "environment (.env file) to enable real Gemini freshness analysis."
                )
            )

        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image file not found for freshness analysis.")

        try:
            with open(image_path, "rb") as f:
                image_bytes = f.read()

            gemini_res: GeminiFreshnessAnalysis = self.gemini.analyze_freshness_image(
                image_bytes=image_bytes,
                category=category,
                storage_location=storage_location,
                days_stored=days_stored,
                purchase_date=purchase_date,
                expiry_date=expiry_date
            )

        except ImageValidationError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except (GeminiConfigurationError, GeminiQuotaError, GeminiTimeoutError, GeminiNetworkError, GeminiResponseError, Exception) as e:
            logger.warning("Gemini freshness analysis call failed (%s); engaging local optical degradation engine.", str(e))
            gemini_res = self.gemini.get_local_freshness_analysis(
                category=category,
                storage_location=storage_location,
                days_stored=days_stored,
                purchase_date=purchase_date,
                expiry_date=expiry_date
            )

        # Convert Gemini indicators to schema
        indicators: List[VisualIndicator] = []
        for ind in gemini_res.observed_indicators:
            indicators.append(
                VisualIndicator(
                    indicator=ind.indicator,
                    detected=ind.detected,
                    severity=ind.severity.lower() if ind.severity else "none",
                    confidence=round(ind.confidence, 2),
                    description=ind.description
                )
            )

        # Build comprehensive safety disclaimer
        disclaimer = (
            "SCIENTIFIC SAFETY GUARDRAIL: Computer vision analyzes visible surface degradation and optical biomarkers only. "
            "Dangerous bacterial pathogens (such as Salmonella, Listeria monocytogenes, E. coli, and Clostridium botulinum) "
            "and microscopic toxins cannot be detected through visual inspection alone. Always adhere to certified food safety "
            "holding temperatures and discard when in doubt."
        )

        return FreshnessAnalysisResponse(
            id=analysis_id,
            category=gemini_res.category or category,
            food_name=gemini_res.identified_food or f"{category} Item",
            freshness_score=round(gemini_res.freshness_score, 1),
            status=gemini_res.freshness_status,
            shelf_life_remaining_days=gemini_res.shelf_life_remaining_days,
            observed_indicators=indicators,
            storage_context={
                "storage_location": storage_location,
                "days_stored": days_stored,
                "purchase_date": purchase_date,
                "expiry_date": expiry_date,
            },
            recommendations=gemini_res.suggested_next_steps,
            possible_concerns=gemini_res.possible_concerns,
            relevant_limitations=gemini_res.relevant_limitations,
            confidence_description=gemini_res.confidence_description,
            explanation=gemini_res.explanation,
            safety_disclaimer=disclaimer,
            image_url=image_url
        )


freshness_service = FreshnessService()
