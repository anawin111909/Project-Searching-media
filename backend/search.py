import requests

def search_openverse(query: str):
    url = f"https://api.openverse.org/v1/images?q={query}"
    response = requests.get(url)
    return response.json()
