from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.ai.gemini_service import gemini_service

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "version" in data
    assert "providers" in data
    assert "gemini" in data["providers"]
    assert data["database"] == "connected"


def test_readiness_endpoint_unconfigured():
    with patch.object(gemini_service, "is_configured", return_value=False):
        response = client.get("/api/v1/health/readiness")
        assert response.status_code == 200
        data = response.json()
        assert data["ready"] is False
        assert data["models_ready"] is False
        assert data["storage_writable"] is True
        assert data["database_ready"] is True
        assert data["details"]["gemini_configured"] == "False"


def test_readiness_endpoint_configured():
    with patch.object(gemini_service, "is_configured", return_value=True):
        response = client.get("/api/v1/health/readiness")
        assert response.status_code == 200
        data = response.json()
        assert data["ready"] is True
        assert data["models_ready"] is True
        assert data["storage_writable"] is True
        assert data["database_ready"] is True
        assert data["details"]["gemini_configured"] == "True"
