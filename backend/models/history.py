from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime 
from database import Base

class SearchHistory(Base):
    __tablename__ = "search_history"
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow) 
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="history")
