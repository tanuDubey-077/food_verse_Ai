from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.ai.gemini_service import gemini_service

client = TestClient(app)


def test_meal_plan_generation_with_allergen_exclusion(mock_gemini_meal_plan):
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "generate_meal_plan", return_value=mock_gemini_meal_plan):
            response = client.post(
                "/api/v1/meals/generate",
                json={
                    "duration_days": 7,
                    "diet_pattern": "Mediterranean",
                    "allergens_to_avoid": ["Dairy", "Fish"],
                    "target_daily_calories": 2100,
                    "meals_per_day": 3,
                    "include_snacks": True
                }
            )
            assert response.status_code == 200
            data = response.json()
            assert len(data["days"]) > 0
            assert len(data["shopping_list"]) > 0
            assert "Dairy" in data["allergens_excluded"]

            # Verify strict allergen exclusion in meals
            for day in data["days"]:
                for meal in day["meals"]:
                    for ing in meal["ingredients"]:
                        assert "dairy" not in ing.lower()
                        assert "fish" not in ing.lower()


def test_meal_plan_retrieval_and_deletion(mock_gemini_meal_plan):
    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "generate_meal_plan", return_value=mock_gemini_meal_plan):
            # Generate a plan
            gen_res = client.post(
                "/api/v1/meals/generate",
                json={
                    "duration_days": 1,
                    "diet_pattern": "Mediterranean",
                    "allergens_to_avoid": ["Dairy"],
                    "target_daily_calories": 1800
                }
            )
            assert gen_res.status_code == 200
            plan_id = gen_res.json()["id"]

            # Retrieve
            get_res = client.get(f"/api/v1/meals/{plan_id}")
            assert get_res.status_code == 200
            assert get_res.json()["id"] == plan_id

            # Delete
            del_res = client.delete(f"/api/v1/meals/{plan_id}")
            assert del_res.status_code == 200
            assert del_res.json()["status"] == "deleted"
