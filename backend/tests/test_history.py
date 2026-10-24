from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_history_list_and_export():
    # Make a recognition call to populate history
    client.post("/api/v1/food/recognize", data={"query": "Avocado Toast", "portion_grams": 100})

    # List history
    response = client.get("/api/v1/history?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] >= 1
    assert len(data["items"]) >= 1

    first_item = data["items"][0]
    detail_res = client.get(f"/api/v1/history/{first_item['id']}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == first_item["id"]

    # Export
    export_res = client.get("/api/v1/history/export")
    assert export_res.status_code == 200
    assert export_res.json()["export_count"] >= 1
