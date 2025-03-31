from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models.user import User
from auth.hash import hash_password, verify_password
from auth.jwt import create_access_token
from pydantic import BaseModel
from models.history import SearchHistory
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from auth.jwt import SECRET_KEY, ALGORITHM
from fastapi import Header

# DB setup
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency: ใช้ Session ในแต่ละ API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# REGISTER
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    new_user = User(email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

# LOGIN
@app.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid authentication credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# เพิ่มประวัติ
@app.post("/search-history")
def save_search(query: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = SearchHistory(query=query, user_id=current_user.id)
    db.add(history)
    db.commit()
    db.refresh(history)
    return {"message": "Search saved successfully"}

# ดูประวัติ
@app.get("/search-history")
def get_search_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SearchHistory).filter(SearchHistory.user_id == current_user.id).all()

# ลบประวัติ
@app.delete("/search-history/{history_id}")
def delete_history(history_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(SearchHistory).filter(SearchHistory.id == history_id, SearchHistory.user_id == current_user.id).first()
    if not history:
        raise HTTPException(status_code=404, detail="History not found")
    db.delete(history)
    db.commit()
    return {"message": "Search history deleted"}
