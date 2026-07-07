from app.tests.conftest import client


def test_health():

    response = client.get("/api/v1/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"

    assert data["application"] == "EcoVision API"

    assert data["version"] == "1.0.0"