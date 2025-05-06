from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app


client = TestClient(app)

def test_register_and_login():
    # Register Testing
    res = client.post("/register", json={
        "email": "testuser@example.com",
        "password": "testpass"
    })
    assert res.status_code in [200, 400]

    #Login Tessing
    res = client.post("/login", json={
        "email": "testuser@example.com",
        "password": "testpass"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
