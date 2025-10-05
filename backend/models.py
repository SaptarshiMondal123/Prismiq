# models.py
from sqlalchemy import Column, Integer, String, JSON, DateTime, func # type: ignore
from db import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    features = Column(JSON, nullable=False)
    result = Column(JSON, nullable=False)
    explanation = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())