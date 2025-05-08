from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def get_token():
    client.post("/register", json={
        "email": "test@example.com",
        "password": "123456"
    })
    res = client.post("/login", json={
        "email": "test@example.com",
        "password": "123456"
    })
    assert res.status_code == 200
    return res.json()["access_token"]

def test_search_history_flow():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Save
    res = client.post("/search-history", json={"query": "cat"}, headers=headers)
    assert res.status_code == 200

    # Get
    res = client.get("/search-history", headers=headers)
    assert res.status_code == 200
    history = res.json()
    assert any(item["query"] == "cat" for item in history)

    # Delete
    item_id = history[0]["id"]
    res = client.delete(f"/search-history/{item_id}", headers=headers)
    assert res.status_code == 200
