# crud.py
from sqlalchemy.orm import Session # type: ignore
import models, schemas


def create_analysis(db: Session, features: dict, result: dict, explanation: str | None = None):
    db_obj = models.Analysis(
        features=features,
        result=result,
        explanation=explanation
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_analyses(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.Analysis).offset(skip).limit(limit).all()

def get_analysis(db: Session, analysis_id: int):
    return db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()