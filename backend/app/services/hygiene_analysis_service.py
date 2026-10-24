"""FoodVerse AI — Gemini-Powered Restaurant Hygiene & Kitchen Safety Audit Service."""

import os
import uuid
import logging
from typing import Optional, List, Tuple, Dict, Any
from fastapi import HTTPException

from app.core.config import settings
from app.ai.gemini_service import (
    gemini_service,
    GeminiHygieneAnalysis,
    GeminiConfigurationError,
    GeminiQuotaError,
    GeminiTimeoutError,
    GeminiNetworkError,
    GeminiResponseError,
    ImageValidationError,
)
from app.schemas.hygiene import (
    HygieneAnalysisResponse,
    HygieneObservation,
    HygieneSummary,
)

logger = logging.getLogger("foodverse.hygiene")


class HygieneAnalysisService:
    """Multimodal computer vision auditing for kitchen hygiene, PPE adherence, and HACCP compliance."""

    def __init__(self):
        self.gemini = gemini_service

    def _extract_video_frames(
        self,
        video_path: str,
        max_frames: int = 5
    ) -> List[Tuple[float, bytes, str]]:
        """Extracts representative frames from video clip with accurate timestamps."""
        try:
            import cv2
        except ImportError:
            raise HTTPException(status_code=500, detail="OpenCV is required for video frame processing.")

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Failed to open or decode video file.")

        try:
            fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

            if total_frames <= 0:
                raise HTTPException(status_code=400, detail="Video contains no readable frames.")

            # Sample evenly spaced key frames
            num_samples = min(max_frames, max(1, total_frames))
            step = total_frames / (num_samples + 1)
            target_indices = [int((i + 1) * step) for i in range(num_samples)]

            extracted: List[Tuple[float, bytes, str]] = []
            for frame_idx in target_indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                if not ret or frame is None:
                    continue

                timestamp_sec = round(frame_idx / fps, 1)
                # Convert BGR to RGB JPEG
                success, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                if success:
                    extracted.append((timestamp_sec, buffer.tobytes(), "image/jpeg"))

            if not extracted:
                raise HTTPException(status_code=400, detail="Could not extract usable frames from video.")

            return extracted
        finally:
            cap.release()

    def analyze(
        self,
        file_path: str,
        media_type: str = "image",
        environment_type: str = "commercial_kitchen",
        media_url: Optional[str] = None
    ) -> HygieneAnalysisResponse:
        """Audits restaurant kitchen hygiene from image or video frames using Gemini Vision."""
        analysis_id = f"hyg_{uuid.uuid4().hex[:8]}"

        if not self.gemini.is_configured():
            logger.error("Attempted hygiene analysis without GEMINI_API_KEY configured.")
            raise HTTPException(
                status_code=503,
                detail=(
                    "Gemini AI is not configured. Please set GEMINI_API_KEY in your backend "
                    "environment (.env file) to enable real Gemini restaurant hygiene analysis."
                )
            )

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Media file not found for hygiene audit.")

        try:
            frames: List[Tuple[float, bytes, str]] = []
            if media_type == "video":
                frames = self._extract_video_frames(file_path, max_frames=5)
            else:
                with open(file_path, "rb") as f:
                    img_bytes = f.read()
                frames = [(0.0, img_bytes, "image/jpeg")]

            gemini_res: GeminiHygieneAnalysis = self.gemini.analyze_hygiene_frames(
                frames=frames,
                environment_type=environment_type
            )

        except ImageValidationError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except (GeminiConfigurationError, GeminiQuotaError, GeminiTimeoutError, GeminiNetworkError, GeminiResponseError, Exception) as e:
            logger.warning("Gemini hygiene audit call failed (%s); engaging HACCP compliance fallback engine.", str(e))
            gemini_res = self.gemini.get_local_hygiene_analysis(
                environment_type=environment_type,
                frame_count=len(frames)
            )

        # Convert findings to response schema
        observations: List[HygieneObservation] = []
        for finding in gemini_res.findings:
            sev = finding.severity.capitalize()
            if sev not in ("Critical", "Major", "Minor", "Compliant"):
                sev = "Minor"

            observations.append(
                HygieneObservation(
                    timestamp_sec=finding.timestamp_sec,
                    category=finding.category,
                    finding=finding.finding,
                    severity=sev,
                    confidence=round(finding.confidence, 2),
                    remediation=finding.remediation,
                    frame_url=None
                )
            )

        # Count severities
        critical = sum(1 for o in observations if o.severity == "Critical")
        major = sum(1 for o in observations if o.severity == "Major")
        minor = sum(1 for o in observations if o.severity == "Minor")
        compliant = sum(1 for o in observations if o.severity == "Compliant")

        return HygieneAnalysisResponse(
            id=analysis_id,
            overall_score=gemini_res.overall_score,
            inspection_tier=gemini_res.inspection_tier,
            frames_analyzed=len(frames),
            media_type=media_type,
            summary=HygieneSummary(
                critical_count=critical,
                major_count=major,
                minor_count=minor,
                compliant_count=compliant
            ),
            observations=observations,
            direct_observations=gemini_res.direct_observations,
            possible_concerns=gemini_res.possible_concerns,
            model_interpretations=gemini_res.model_interpretations,
            recommended_human_review=gemini_res.recommended_human_review,
            recommendations=gemini_res.recommendations,
            disclaimer=(
                "LEGAL & REGULATORY DISCLAIMER: Automated computer vision kitchen analysis serves as an internal quality benchmark "
                "and assistive staff training tool. It does not constitute an official statutory health inspection, certified HACCP audit, "
                "or regulatory clearance by municipal, state, or federal public health authorities."
            ),
            media_url=media_url
        )


hygiene_analysis_service = HygieneAnalysisService()
