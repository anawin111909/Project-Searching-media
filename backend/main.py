from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from pydantic import BaseModel
import requests

from database import SessionLocal, engine, Base
from models.user import User
from models.history import SearchHistory
from auth.hash import hash_password, verify_password
from auth.jwt import create_access_token, SECRET_KEY, ALGORITHM

# ------------------ CONFIGURATION ------------------

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ------------------ SCHEMAS ------------------

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class QueryInput(BaseModel):
    query: str

# ------------------ DEPENDENCIES ------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Invalid authentication credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ------------------ AUTH ROUTES ------------------

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(email=user.email, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

# ------------------ HISTORY ROUTES ------------------

@app.post("/search-history")
def save_search(input: QueryInput, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = SearchHistory(query=input.query, user_id=current_user.id)
    db.add(history)
    db.commit()
    db.refresh(history)
    return {"message": "Search saved successfully"}

@app.get("/search-history")
def get_search_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SearchHistory).filter(SearchHistory.user_id == current_user.id).all()

@app.delete("/search-history/{history_id}")
def delete_history(history_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(SearchHistory).filter(SearchHistory.id == history_id, SearchHistory.user_id == current_user.id).first()
    if not history:
        raise HTTPException(status_code=404, detail="History not found")
    db.delete(history)
    db.commit()
    return {"message": "Search history deleted"}

# ------------------ PROXY ROUTE FOR OPENVERSE ------------------

@app.get("/openverse")
def proxy_openverse(query: str = Query(...)):
    try:
        response = requests.get(f"https://api.openverse.engineering/v1/images?q={query}")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

