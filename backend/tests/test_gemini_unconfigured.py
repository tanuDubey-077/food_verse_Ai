import io
from fastapi.testclient import TestClient
from unittest.mock import patch

from app.main import app
from app.core.config import Settings
from app.ai.gemini_service import GeminiService
from tests.conftest import create_test_image_bytes

client = TestClient(app)


def test_unconfigured_food_recognition_returns_503():
    with patch.object(Settings, "is_gemini_configured", return_value=False):
        with patch.object(GeminiService, "is_configured", return_value=False):
            img_bytes = create_test_image_bytes()
            response = client.post(
                "/api/v1/food/recognize",
                files={"file": ("food.jpg", io.BytesIO(img_bytes), "image/jpeg")},
                data={"portion_grams": 150}
            )
            assert response.status_code == 503
            data = response.json()
            assert "detail" in data
            assert "GEMINI_API_KEY" in data["detail"]


def test_unconfigured_freshness_returns_503():
    with patch.object(Settings, "is_gemini_configured", return_value=False):
        with patch.object(GeminiService, "is_configured", return_value=False):
            img_bytes = create_test_image_bytes()
            response = client.post(
                "/api/v1/freshness/analyze",
                files={"file": ("spinach.jpg", io.BytesIO(img_bytes), "image/jpeg")},
                data={"category": "Produce", "storage_location": "refrigerator", "days_stored": 2}
            )
            assert response.status_code == 503
            assert "GEMINI_API_KEY" in response.json()["detail"]


def test_unconfigured_hygiene_returns_503():
    with patch.object(Settings, "is_gemini_configured", return_value=False):
        with patch.object(GeminiService, "is_configured", return_value=False):
            img_bytes = create_test_image_bytes()
            response = client.post(
                "/api/v1/hygiene/analyze",
                files={"file": ("kitchen.jpg", io.BytesIO(img_bytes), "image/jpeg")},
                data={"environment_type": "commercial_kitchen"}
            )
            assert response.status_code == 503
            assert "GEMINI_API_KEY" in response.json()["detail"]


def test_unconfigured_cooking_chat_returns_503():
    with patch.object(Settings, "is_gemini_configured", return_value=False):
        with patch.object(GeminiService, "is_configured", return_value=False):
            response = client.post(
                "/api/v1/cooking/chat",
                json={"message": "Can I cook chicken with lemon?"}
            )
            assert response.status_code == 503
            assert "GEMINI_API_KEY" in response.json()["detail"]


def test_unconfigured_cooking_substitute_returns_503():
    with patch.object(Settings, "is_gemini_configured", return_value=False):
        with patch.object(GeminiService, "is_configured", return_value=False):
            response = client.post(
                "/api/v1/cooking/substitute",
                json={"ingredient": "buttermilk"}
            )
            assert response.status_code == 503
            assert "GEMINI_API_KEY" in response.json()["detail"]


def test_unconfigured_meal_planner_returns_503():
    with patch.object(Settings, "is_gemini_configured", return_value=False):
        with patch.object(GeminiService, "is_configured", return_value=False):
            response = client.post(
                "/api/v1/meals/generate",
                json={
                    "duration_days": 3,
                    "diet_pattern": "Mediterranean",
                    "allergens_to_avoid": ["Dairy"],
                    "target_daily_calories": 2000
                }
            )
            assert response.status_code == 503
            assert "GEMINI_API_KEY" in response.json()["detail"]
