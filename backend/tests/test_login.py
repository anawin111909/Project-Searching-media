from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def create_test_user():
    client.post("/register", json={
        "email": "test@example.com",
        "password": "123456"
    })
    assert res.status_code == 200
    return res.json()["access_token"]