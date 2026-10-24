from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.ai.gemini_service import gemini_service

client = TestClient(app)


def test_cooking_chat_general(mock_gemini_cooking_chat):
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "cooking_assistant_chat", return_value=mock_gemini_cooking_chat):
            response = client.post(
                "/api/v1/cooking/chat",
                json={"message": "Hello chef! What can you help me with?"}
            )
            assert response.status_code == 200
            data = response.json()
            assert "reply" in data
            assert len(data["suggested_questions"]) > 0


def test_cooking_recipe_generation(mock_gemini_cooking_chat):
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "cooking_assistant_chat", return_value=mock_gemini_cooking_chat):
            response = client.post(
                "/api/v1/cooking/chat",
                json={
                    "message": "I have chicken, lemon, and spinach. Give me a recipe for dinner.",
                    "preferences": {"diet": "High-Protein", "skill_level": "Intermediate", "max_time_min": 25}
                }
            )
            assert response.status_code == 200
            data = response.json()
            assert data["recipe"] is not None
            assert "Chicken" in data["recipe"]["title"]
            assert len(data["recipe"]["steps"]) > 0
            assert len(data["recipe"]["ingredients"]) > 0


def test_ingredient_substitution(mock_gemini_substitute):
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "get_ingredient_substitution", return_value=mock_gemini_substitute):
            response = client.post(
                "/api/v1/cooking/substitute",
                json={"ingredient": "buttermilk"}
            )
            assert response.status_code == 200
            data = response.json()
            assert len(data["substitutes"]) > 0
            assert "culinary_explanation" in data
