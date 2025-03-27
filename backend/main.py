from fastapi import FastAPI
from search import search_openverse

app = FastAPI()

@app.get("/search")
def search(q: str):
    return search_openverse(q)
