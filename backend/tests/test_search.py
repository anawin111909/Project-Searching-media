from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def setup_module(module):
    # Ensure test user is registered
    client.post("/register", json={
        "email": "test@example.com",
        "password": "123456"
    })

def test_search_image():
    res = client.post("/login", json={
        "email": "test@example.com",
        "password": "123456"
    })
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/openverse?query=cat", headers=headers)
    assert res.status_code == 200
    assert "results" in res.json()
