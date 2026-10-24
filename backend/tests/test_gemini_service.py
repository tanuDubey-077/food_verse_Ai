import pytest
from unittest.mock import MagicMock, patch
from PIL import Image
import io

from app.ai.gemini_service import (
    GeminiService,
    GeminiConfigurationError,
    GeminiQuotaError,
    GeminiTimeoutError,
    ImageValidationError,
    GeminiFoodAnalysis,
    GeminiFreshnessAnalysis,
    GeminiHygieneAnalysis,
    GeminiCookingChatOutput,
    GeminiSubstituteResult,
    GeminiMealPlanOutput,
)
from tests.conftest import create_test_image_bytes


def test_validate_and_preprocess_image_valid():
    service = GeminiService()
    valid_bytes = create_test_image_bytes(color=(100, 200, 100), size=(300, 200))
    clean_bytes, mime, w, h = service.validate_and_preprocess_image(valid_bytes)
    assert mime == "image/jpeg"
    assert len(clean_bytes) > 0
    assert w <= 2048 and h <= 2048


def test_validate_and_preprocess_image_invalid():
    service = GeminiService()
    corrupt_bytes = b"not-a-valid-image-stream-content"
    with pytest.raises(ImageValidationError):
        service.validate_and_preprocess_image(corrupt_bytes)


def test_unconfigured_gemini_raises():
    service = GeminiService()
    with patch.object(service, "get_client", side_effect=GeminiConfigurationError("Key missing")):
        valid_bytes = create_test_image_bytes()
        with pytest.raises(GeminiConfigurationError):
            service.analyze_food_image(valid_bytes)


def test_analyze_food_image_mocked(mock_gemini_food_analysis):
    service = GeminiService()
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.parsed = mock_gemini_food_analysis
    mock_client.models.generate_content.return_value = mock_resp

    with patch.object(service, "get_client", return_value=mock_client):
        valid_bytes = create_test_image_bytes()
        result = service.analyze_food_image(valid_bytes, user_query="salmon")

        assert isinstance(result, GeminiFoodAnalysis)
        assert result.is_food is True
        assert result.dish_name == "Grilled Salmon with Asparagus"
        assert result.cuisine == "Mediterranean"
        assert "Salmon fillet" in result.visible_ingredients
        assert result.estimated_confidence > 0.9


def test_analyze_food_image_non_food(mock_gemini_non_food_analysis):
    service = GeminiService()
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.parsed = mock_gemini_non_food_analysis
    mock_client.models.generate_content.return_value = mock_resp

    with patch.object(service, "get_client", return_value=mock_client):
        valid_bytes = create_test_image_bytes()
        result = service.analyze_food_image(valid_bytes)

        assert isinstance(result, GeminiFoodAnalysis)
        assert result.is_food is False
        assert result.dish_name == "Mechanical Wristwatch"
        assert result.food_category == "Non-Food"


def test_analyze_freshness_mocked(mock_gemini_freshness_analysis):
    service = GeminiService()
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.parsed = mock_gemini_freshness_analysis
    mock_client.models.generate_content.return_value = mock_resp

    with patch.object(service, "get_client", return_value=mock_client):
        valid_bytes = create_test_image_bytes()
        result = service.analyze_freshness_image(
            image_bytes=valid_bytes,
            category="Produce",
            storage_location="refrigerator",
            days_stored=2
        )

        assert isinstance(result, GeminiFreshnessAnalysis)
        assert result.freshness_score == 88.0
        assert result.shelf_life_remaining_days == 5
        assert len(result.observed_indicators) == 2


def test_analyze_hygiene_mocked(mock_gemini_hygiene_analysis):
    service = GeminiService()
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.parsed = mock_gemini_hygiene_analysis
    mock_client.models.generate_content.return_value = mock_resp

    with patch.object(service, "get_client", return_value=mock_client):
        valid_bytes = create_test_image_bytes()
        result = service.analyze_hygiene_frames(
            frames=[(0.0, valid_bytes, "image/jpeg")],
            environment_type="commercial_kitchen"
        )

        assert isinstance(result, GeminiHygieneAnalysis)
        assert result.overall_score == 85
        assert "Grade A" in result.inspection_tier
        assert len(result.findings) == 2


def test_cooking_chat_mocked(mock_gemini_cooking_chat):
    service = GeminiService()
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.parsed = mock_gemini_cooking_chat
    mock_client.models.generate_content.return_value = mock_resp

    with patch.object(service, "get_client", return_value=mock_client):
        result = service.cooking_assistant_chat(
            message="Give me a chicken dinner recipe",
            preferences={"diet": "High-Protein"}
        )

        assert isinstance(result, GeminiCookingChatOutput)
        assert "Lemon Herb" in result.recipe.title
        assert len(result.suggested_questions) == 3


def test_substitute_mocked(mock_gemini_substitute):
    service = GeminiService()
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.parsed = mock_gemini_substitute
    mock_client.models.generate_content.return_value = mock_resp

    with patch.object(service, "get_client", return_value=mock_client):
        result = service.get_ingredient_substitution(ingredient="buttermilk")

        assert isinstance(result, GeminiSubstituteResult)
        assert result.ingredient == "buttermilk"
        assert len(result.substitutes) == 2


def test_meal_plan_mocked(mock_gemini_meal_plan):
    service = GeminiService()
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.parsed = mock_gemini_meal_plan
    mock_client.models.generate_content.return_value = mock_resp

    with patch.object(service, "get_client", return_value=mock_client):
        result = service.generate_meal_plan(
            duration_days=7,
            diet_pattern="Mediterranean",
            allergens_to_avoid=["Dairy", "Fish"],
            target_daily_calories=2100
        )

        assert isinstance(result, GeminiMealPlanOutput)
        assert result.duration_days == 7
        assert len(result.days) == 1
        assert "Dairy" in result.allergens_excluded
