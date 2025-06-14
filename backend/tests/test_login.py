from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def setup_module(module):
    client.post("/register", json={
        "email": "test@example.com",
        "password": "123456"
    })

def test_login_valid_credentials():
    res = client.post("/login", json={
        "email": "test@example.com",
        "password": "123456"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
