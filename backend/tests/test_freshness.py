import io
from PIL import Image
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.ai.gemini_service import gemini_service
from tests.conftest import create_test_image_bytes

client = TestClient(app)


def test_freshness_analysis(mock_gemini_freshness_analysis):
    img_bytes = create_test_image_bytes(color=(50, 180, 50))

    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "analyze_freshness_image", return_value=mock_gemini_freshness_analysis):
            response = client.post(
                "/api/v1/freshness/analyze",
                files={"file": ("spinach.jpg", io.BytesIO(img_bytes), "image/jpeg")},
                data={
                    "category": "Produce",
                    "storage_location": "refrigerator",
                    "days_stored": 2
                }
            )
            assert response.status_code == 200
            data = response.json()
            assert 0.0 <= data["freshness_score"] <= 100.0
            assert data["food_name"] == "Fresh Baby Spinach"
            assert len(data["observed_indicators"]) > 0
            assert "safety_disclaimer" in data
            assert "SCIENTIFIC SAFETY GUARDRAIL" in data["safety_disclaimer"]


def test_freshness_rejects_missing_file():
    response = client.post("/api/v1/freshness/analyze", data={"category": "Produce"})
    assert response.status_code == 422  # Validation error
