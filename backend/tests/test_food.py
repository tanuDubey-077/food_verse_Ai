import io
from PIL import Image
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.ai.gemini_service import gemini_service
from tests.conftest import create_test_image_bytes

client = TestClient(app)


def test_food_nutrition_lookup():
    response = client.get("/api/v1/food/nutrition?item_name=avocado_toast&portion_grams=150")
    assert response.status_code == 200
    data = response.json()
    assert "nutrition" in data
    assert data["portion"]["grams"] == 150.0
    assert data["nutrition"]["calories"] > 0


def test_food_recognize_text_query(mock_gemini_food_analysis):
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "analyze_food_text", return_value=mock_gemini_food_analysis):
            response = client.post(
                "/api/v1/food/recognize",
                data={"query": "Grilled Salmon", "portion_grams": 170}
            )
            assert response.status_code == 200
            data = response.json()
            assert data["is_food"] is True
            assert "Salmon" in data["top_prediction"]["name"]
            assert data["dish_name"] == "Grilled Salmon with Asparagus"
            assert data["cuisine"] == "Mediterranean"
            assert len(data["visible_ingredients"]) > 0
            assert data["nutrition"]["protein_g"] > 0
            assert "disclaimer" in data


def test_food_recognize_image_upload(mock_gemini_food_analysis):
    img_bytes = create_test_image_bytes(color=(200, 50, 50))
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "analyze_food_image", return_value=mock_gemini_food_analysis):
            response = client.post(
                "/api/v1/food/recognize",
                files={"file": ("test_food.jpg", io.BytesIO(img_bytes), "image/jpeg")},
                data={"portion_grams": 120}
            )
            assert response.status_code == 200
            data = response.json()
            assert data["is_food"] is True
            assert "top_prediction" in data
            assert data["portion"]["grams"] == 120.0
            assert len(data["visible_ingredients"]) > 0
            assert "disclaimer" in data


def test_food_recognize_non_food_upload(mock_gemini_non_food_analysis):
    img_bytes = create_test_image_bytes(color=(120, 120, 120))
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "analyze_food_image", return_value=mock_gemini_non_food_analysis):
            response = client.post(
                "/api/v1/food/recognize",
                files={"file": ("watch.jpg", io.BytesIO(img_bytes), "image/jpeg")},
                data={"portion_grams": 100}
            )
            assert response.status_code == 200
            data = response.json()
            assert data["is_food"] is False
            assert "Wristwatch" in data["dish_name"]
            assert data["nutrition"]["calories"] == 0.0


def test_food_recognize_invalid_empty():
    response = client.post("/api/v1/food/recognize", data={})
    assert response.status_code == 400
