from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_user():
    res = client.post("/register", json={"email": "test@example.com", "password": "test123"})
    assert res.status_code == 200 or res.status_code == 400  # 400 ถ้า email ซ้ำ
