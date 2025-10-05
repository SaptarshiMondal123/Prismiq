# schemas.py
from pydantic import BaseModel # type: ignore
from typing import Dict, Any, List, Optional
from datetime import datetime

class AnalysisBase(BaseModel):
    features: Dict[str, Any]
    result: Dict[str, Any]
    explanation: str | None = None

class AnalysisResponse(AnalysisBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class UploadResponse(BaseModel):
    analysis_id: int
    prediction: str
    confidence: float
    reliability: str
    planet_type: Optional[str] = None
    extreme_outlier: bool
    logs: List[str]

class ExplorerResponse(BaseModel):
    analysis_id: int
    prediction: str
    confidence: float
    reliability: str
    planet_type: Optional[str] = None
    outlier_count: int

class AnalysisDetailResponse(BaseModel):
    prediction: str
    probabilities: Dict[str, float]
    confidence: float
    reliability: Dict[str, Any]
    z_scores: Dict[str, float]
    outliers: List[Dict[str, Any]]
    feature_importance: Dict[str, float]
    gemini_koi_explanation: Optional[str]
    planet_type: Optional[Dict[str, Any]] = None
    likely_atmosphere: Dict[str, Any]
    extreme_outlier: bool
    logs: List[str]
