import io
from PIL import Image
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.ai.gemini_service import gemini_service
from tests.conftest import create_test_image_bytes

client = TestClient(app)


def test_hygiene_analysis_image(mock_gemini_hygiene_analysis):
    img_bytes = create_test_image_bytes(color=(180, 180, 180), size=(150, 150))

    with patch.object(gemini_service, "is_configured", return_value=True):
        with patch.object(gemini_service, "analyze_hygiene_frames", return_value=mock_gemini_hygiene_analysis):
            response = client.post(
                "/api/v1/hygiene/analyze",
                files={"file": ("kitchen.jpg", io.BytesIO(img_bytes), "image/jpeg")},
                data={"environment_type": "commercial_kitchen"}
            )
            assert response.status_code == 200
            data = response.json()
            assert 0 <= data["overall_score"] <= 100
            assert "Grade" in data["inspection_tier"]
            assert len(data["observations"]) > 0
            assert len(data["direct_observations"]) > 0
            assert "disclaimer" in data
