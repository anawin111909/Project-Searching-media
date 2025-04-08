from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app


client = TestClient(app)

def test_register_and_login():
    # ทดสอบ Register
    res = client.post("/register", json={
        "email": "testuser@example.com",
        "password": "testpass"
    })
    assert res.status_code in [200, 400]  # 400 ถ้าเคยสมัครไว้แล้ว

    # ทดสอบ Login
    res = client.post("/login", json={
        "email": "testuser@example.com",
        "password": "testpass"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
