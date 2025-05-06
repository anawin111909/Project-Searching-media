from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_search_image():
    token = client.post("/login", json={
        "email": "test@example.com",
        "password": "123456"
    }).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/openverse?query=cat", headers=headers)
    assert res.status_code == 200
    assert "results" in res.json()

