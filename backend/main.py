from typing import Dict, Any, Tuple
import os
import logging
import numpy as np # type: ignore
import joblib # type: ignore
import pandas as pd # type: ignore
import google.generativeai as genai # type: ignore
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, WebSocket # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel, Field # type: ignore
import crud, models, schemas
from db import engine, get_db
from sqlalchemy import text # type: ignore
import io, asyncio
from services.response_service import (
    format_upload_response,
    format_explorer_response,
    format_analysis_response
)

# sklearn utilities for potential use with metrics
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay, classification_report, accuracy_score # type: ignore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("exoplanet_api")

models.Base.metadata.create_all(bind=engine)

# ------------------------------
# 1. Load Model & Config (paths preserved)
# ------------------------------
MODEL_PATH = "models_store/koi_classifier.pkl"
STATS_PATH = "models_store/feature_stats.pkl"
PLANET_MODEL_PATH = "models_store/planet_classifier.pkl"
KOI_METRICS_PATH = "models_store/koi_model_metrics.pkl"
PLANET_METRICS_PATH = "models_store/planet_model_metrics.pkl"

# defensive loads with clear errors
try:
    model = joblib.load(MODEL_PATH)
    logger.info("Loaded KOI classifier from %s", MODEL_PATH)
except Exception as e:
    logger.exception("Failed to load KOI model")
    raise

try:
    stats = joblib.load(STATS_PATH)
    logger.info("Loaded stats from %s", STATS_PATH)
except Exception as e:
    logger.exception("Failed to load stats")
    raise

try:
    planet_model = joblib.load(PLANET_MODEL_PATH)
    logger.info("Loaded planet-type model from %s", PLANET_MODEL_PATH)
except Exception as e:
    logger.exception("Failed to load planet model")
    raise

# Configure Gemini via environment variable (keeps your original Gemini calls intact)
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    logger.warning("GEMINI_API_KEY not set in environment. Gemini calls will fail until set.")
else:
    genai.configure(api_key=GEMINI_KEY)
    logger.info("Configured Gemini API")

# ------------------------------
# 2. App & metadata
# ------------------------------
app = FastAPI(title="Exoplanet AI API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feature mapping (kept same as your Streamlit names, but model expects koi_* keys)
FEATURE_ORDER = [
    "koi_period",    # Orbital Period (days)
    "koi_duration",  # Transit Duration (hrs)
    "koi_depth",     # Transit Depth (ppm)
    "koi_prad",      # Planet Radius (Earth radii)
    "koi_sma",       # Semi-Major Axis (AU)
    "koi_incl",      # Inclination (deg)
    "koi_teq",       # Equilibrium Temp (K)
    "koi_model_snr"  # Signal-to-Noise Ratio
]

FEATURE_PRETTY = [
    "Orbital Period (days)",
    "Transit Duration (hrs)",
    "Transit Depth (ppm)",
    "Planet Radius (Earth radii)",
    "Semi-Major Axis (AU)",
    "Inclination (deg)",
    "Equilibrium Temp (K)",
    "Signal-to-Noise Ratio"
]

planet_class_map = {
    0: "Super-Earth",
    1: "Mini-Neptune",
    2: "Neptune-like",
    3: "Gas Giant",
    4: "Hot Jupiter"
}

class_map = {0: "Exoplanet", 1: "Candidate", 2: "False Positive"}

means = stats["means"]
stds = stats["stds"]

# ------------------------------
# 3. Fuzzy membership + class specs (copied verbatim)
# ------------------------------
def membership(value, prim_min=None, prim_max=None, soft_min=None, soft_max=None):
    if pd.isna(value):
        return 0.0
    if (prim_min is not None) and (prim_max is not None):
        if prim_min <= value <= prim_max:
            return 1.0
        if (soft_min is not None) and (soft_min <= value < prim_min):
            return (value - soft_min) / (prim_min - soft_min)
        if (soft_max is not None) and (prim_max < value <= soft_max):
            return (soft_max - value) / (soft_max - prim_max)
        return 0.0
    if (prim_min is not None) and (prim_max is None):
        if value >= prim_min:
            return 1.0
        if soft_min and (soft_min <= value < prim_min):
            return (value - soft_min) / (prim_min - soft_min)
        return 0.0
    if (prim_min is None) and (prim_max is not None):
        if value <= prim_max:
            return 1.0
        if soft_max and (prim_max < value <= soft_max):
            return (soft_max - value) / (soft_max - prim_max)
        return 0.0
    if (soft_min is not None) and (soft_max is not None):
        if not (soft_min <= value <= soft_max):
            return 0.0
        mid = 0.5 * (soft_min + soft_max)
        return 1 - abs(value - mid) / (mid - soft_min)
    return 0.0

CLASS_SPECS = {
    "Super-Earth": {
        "koi_prad":   {"prim": (1.5, 2.5), "soft": (1.2, 3.0), "w": 0.50},
        "koi_depth":  {"prim": (500, 2000), "soft": (300, 3000), "w": 0.15},
        "koi_duration":{"prim": (2.0, 6.0), "soft": (1.0, 8.0), "w": 0.10},
        "koi_teq":    {"prim": (None, None), "soft": (100, 1200), "w": 0.15},
        "koi_period": {"prim": (None, None), "soft": (None, None), "w": 0.10}
    },
    "Mini-Neptune": {
        "koi_prad":   {"prim": (2.5, 4.0), "soft": (2.2, 5.0), "w": 0.45},
        "koi_depth":  {"prim": (1500, 5000), "soft": (1000, 8000), "w": 0.20},
        "koi_duration":{"prim": (3.0, 7.0), "soft": (2.0, 9.0), "w": 0.10},
        "koi_teq":    {"prim": (None, None), "soft": (50, 1500), "w": 0.15},
        "koi_sma":    {"prim": (None, None), "soft": (0.03, 0.6), "w": 0.10}
    },
    "Neptune-like": {
        "koi_prad":   {"prim": (4.0, 6.0), "soft": (3.5, 7.0), "w": 0.45},
        "koi_depth":  {"prim": (4000, 10000), "soft": (3000, 14000), "w": 0.20},
        "koi_duration":{"prim": (4.0, 10.0), "soft": (3.0, 12.0), "w": 0.10},
        "koi_sma":    {"prim": (None, None), "soft": (0.1, 10.0), "w": 0.10},
        "koi_teq":    {"prim": (None, None), "soft": (50, 1000), "w": 0.15}
    },
    "Gas Giant": {
        "koi_prad":   {"prim": (6.0, 11.0), "soft": (5.0, 13.0), "w": 0.45},
        "koi_depth":  {"prim": (5000, None), "soft": (4000, None), "w": 0.15},
        "koi_duration":{"prim": (6.0, 12.0), "soft": (5.0, 15.0), "w": 0.10},
        "koi_teq":    {"prim": (None, 500), "soft": (None, 1000), "w": 0.15},
        "koi_sma":    {"prim": (0.5, None), "soft": (0.1, 10.0), "w": 0.15}
    },
    "Hot Jupiter": {
        "koi_prad":   {"prim": (8.0, None), "soft": (6.5, None), "w": 0.40},
        "koi_period": {"prim": (None, 10.0), "soft": (None, 20.0), "w": 0.25},
        "koi_teq":    {"prim": (1000, None), "soft": (800, None), "w": 0.15},
        "koi_depth":  {"prim": (10000, None), "soft": (8000, None), "w": 0.10},
        "koi_duration":{"prim": (2.0, 5.0), "soft": (1.5, 6.0), "w": 0.10}
    }
}

def assign_planet_type_multi(row: Dict[str, Any]) -> Tuple[str, Dict[str, float]]:
    scores: Dict[str, float] = {}
    for cls, spec in CLASS_SPECS.items():
        total = 0.0
        for feat, conf in spec.items():
            val = row.get(feat, np.nan)
            prim = conf.get("prim")
            soft = conf.get("soft")
            w = conf.get("w", 1.0)
            score = membership(val,
                               prim_min=prim[0] if prim else None,
                               prim_max=prim[1] if prim else None,
                               soft_min=soft[0] if soft else None,
                               soft_max=soft[1] if soft else None)
            total += w * score
        scores[cls] = float(total)
    best_cls = max(scores, key=scores.get)
    return best_cls, scores

# ------------------------------
# 4. Request model (Pydantic)
# ------------------------------
class PredictRequest(BaseModel):
    koi_period: float = Field(..., description="Orbital period (days)")
    koi_duration: float = Field(..., description="Transit duration (hrs)")
    koi_depth: float = Field(..., description="Transit depth (ppm)")
    koi_prad: float = Field(..., description="Planet radius (Earth radii)")
    koi_sma: float = Field(..., description="Semi-major axis (AU)")
    koi_incl: float = Field(..., description="Inclination (deg)")
    koi_teq: float = Field(..., description="Equilibrium temperature (K)")
    koi_model_snr: float = Field(..., description="Signal-to-noise ratio")

# ------------------------------
# 5. Utility helpers (kept logic same)
# ------------------------------
def compute_zscores(sample: np.ndarray, feature_keys: list) -> Tuple[Dict[str, float], Dict[str, float]]:
    z_scores = {}
    stats_out = {}
    for i, key in enumerate(feature_keys):
        val = float(sample[0][i])
        mean_val = float(means[key])
        std_val = float(stds[key]) if stds[key] != 0 else 1.0
        z = (val - mean_val) / std_val
        z_scores[key] = z
        stats_out[key] = {"value": val, "mean": mean_val, "std": std_val, "z": z}
    return z_scores, stats_out

def reliability_label_from_score(score: float) -> str:
    if score > 0.8:
        return "High"
    elif score > 0.5:
        return "Medium"
    else:
        return "Low"

def safe_generate_gemini(prompt: str, model_name: str = "gemini-2.0-flash") -> str:
    """Call Gemini and return text. If Gemini is not configured, return a placeholder."""
    if not GEMINI_KEY:
        return "(Gemini API key not configured — no text available)"
    try:
        gm = genai.GenerativeModel(model_name)
        resp = gm.generate_content(prompt)
        return getattr(resp, "text", str(resp))
    except Exception as e:
        logger.exception("Gemini call failed")
        return f"(Gemini call failed: {str(e)})"

# ------------------------------
# 6. Main predict endpoint (keeps both Gemini calls)
# ------------------------------

@app.get("/")
async def home():
    return {"message": "Welcome to Prismiq API!"}

@app.post("/predict")
async def predict(req: PredictRequest):
    # Build sample in the same order as training
    sample = np.array([[
        req.koi_period,
        req.koi_duration,
        req.koi_depth,
        req.koi_prad,
        req.koi_sma,
        req.koi_incl,
        req.koi_teq,
        req.koi_model_snr
    ]])

    # KOI model prediction
    try:
        pred = int(model.predict(sample)[0])
        proba = model.predict_proba(sample)[0].tolist()
        pred_label = class_map.get(pred, f"Unknown ({pred})")
        confidence = float(max(proba))
    except Exception as e:
        logger.exception("KOI model prediction failed")
        raise HTTPException(status_code=500, detail=str(e))

    # Statistical analysis (KOI features)
    z_scores, stats_out = compute_zscores(sample, FEATURE_ORDER)
    flags = [(k, v) for k, v in z_scores.items() if abs(v) > 3]
    extreme = any(abs(v) > 5 for v in z_scores.values())

    n_outliers = len(flags)
    reliability_score = confidence * float(np.exp(-0.15 * n_outliers))
    reliability_label = reliability_label_from_score(reliability_score)

    # Global importance mapping (try to preserve original mapping behavior)
    try:
        importance = model.get_booster().get_score(importance_type="weight")
    except Exception:
        # fallback if model is not xgboost or missing booster
        importance = {}
    importance_pretty = {}
    for k, v in importance.items():
        if str(k).startswith("f"):
            idx = int(k[1:])
            fname = FEATURE_PRETTY[idx] if idx < len(FEATURE_PRETTY) else k
        else:
            fname = k
        importance_pretty[fname] = float(v)

    # First Gemini explanation (KOI classification)
    outlier_summary = "None"
    if flags:
        outlier_summary = "; ".join([f"{k} (Z={v:.2f})" for k, v in flags])

    prompt_koi = f"""
You are an astrophysicist.
The XGBoost classifier predicted: {pred_label}.
Input features: {dict(zip(FEATURE_PRETTY, sample[0].tolist()))}.
Class probabilities: {dict(zip(class_map.values(), proba))}.
Global feature importance: {importance_pretty}.
Input z-scores: {stats_out}.
Outlier flags: {outlier_summary}.
Reliability score: {reliability_label} ({reliability_score:.2%}).

Please provide a scientific explanation for why this object was classified as {pred_label}. Discuss:
1. Which input features align with known exoplanet/candidate/false positive patterns.
2. How the probability distribution indicates model certainty.
3. How unusual (z-score) feature values may have influenced the prediction.
4. If outlier flags are present, explicitly mention how they may reduce reliability.
5. If reliability is not High, explain why and how outliers reduced it.
Keep it clear, technical, and astronomy-focused.
"""

    gemini_koi_text = safe_generate_gemini(prompt_koi)

    response_payload: Dict[str, Any] = {
        "prediction": pred_label,
        "prediction_code": pred,
        "probabilities": dict(zip(class_map.values(), map(float, proba))),
        "confidence": confidence,
        "reliability": {"score": reliability_score, "label": reliability_label},
        "z_scores": {k: float(v) for k, v in z_scores.items()},
        "stats": stats_out,
        "outliers": [{"feature": k, "z": float(v)} for k, v in flags],
        "extreme_outlier": extreme,
        "feature_importance": importance_pretty,
        "gemini_koi_explanation": gemini_koi_text
    }

    # ------------------------------
    # Planet type stage (only if Exoplanet)
    # ------------------------------
    if pred_label == "Exoplanet":
        planet_features = [
            float(sample[0][0]),  # koi_period
            float(sample[0][1]),  # koi_duration
            float(sample[0][2]),  # koi_depth
            float(sample[0][3]),  # koi_prad
            float(sample[0][4]),  # koi_sma
            float(sample[0][6])   # koi_teq (skip inclination/index 5)
        ]
        planet_sample = np.array([planet_features])

        try:
            planet_pred = int(planet_model.predict(planet_sample)[0])
            planet_proba = planet_model.predict_proba(planet_sample)[0].tolist()
            ml_planet_type = planet_class_map.get(planet_pred, f"Unknown({planet_pred})")
        except Exception as e:
            logger.exception("Planet model prediction failed")
            raise HTTPException(status_code=500, detail=str(e))

        # Rule-based classification (identical logic)
        row_dict = {
            "koi_period": float(sample[0][0]),
            "koi_duration": float(sample[0][1]),
            "koi_depth": float(sample[0][2]),
            "koi_prad": float(sample[0][3]),
            "koi_sma": float(sample[0][4]),
            "koi_teq": float(sample[0][6])
        }
        rule_type, rule_scores = assign_planet_type_multi(row_dict)

        # Planet z-scores
        planet_keys = ["koi_period", "koi_duration", "koi_depth", "koi_prad", "koi_sma", "koi_teq"]
        z_scores_planet, stats_planet = compute_zscores(np.array([planet_features]), planet_keys)
        flags_planet = [(k, v) for k, v in z_scores_planet.items() if abs(v) > 3]
        extreme_planet = any(abs(v) > 5 for v in z_scores_planet.values())

        n_out_planet = len(flags_planet)
        reliability_planet = float(max(planet_proba)) * float(rule_scores.get(ml_planet_type, 0.0)) * float(np.exp(-0.15 * n_out_planet))
        rel_label = reliability_label_from_score(reliability_planet)

        # Second Gemini call: planet-type explanation (kept intact)
        prompt_planet = f"""
The Exoplanet was detected. Two systems classified its type:
- ML Model → {ml_planet_type}, probabilities {dict(zip(planet_class_map.values(), planet_proba))}.
- Rule-based fuzzy system → {rule_type}, scores {rule_scores}.
Features used: {row_dict}.
Please give a clear astronomy-focused explanation of why they agree/disagree, which features influenced both systems, and what type is more likely.
"""

        gemini_planet_text = safe_generate_gemini(prompt_planet)

        response_payload["planet_type"] = {
            "ml_prediction": ml_planet_type,
            "ml_code": planet_pred,
            "ml_probabilities": dict(zip(planet_class_map.values(), map(float, planet_proba))),
            "rule_based_prediction": rule_type,
            "rule_scores": rule_scores,
            "agreement": ml_planet_type == rule_type,
            "gemini_planet_explanation": gemini_planet_text,
            "planet_z_scores": {k: float(v) for k, v in z_scores_planet.items()},
            "planet_stats": stats_planet,
            "planet_outliers": [{"feature": k, "z": float(v)} for k, v in flags_planet],
            "planet_extreme_outlier": extreme_planet,
            "planet_reliability": {"score": reliability_planet, "label": rel_label}
        }

    return response_payload

# ------------------------------
# 7. Metrics endpoints (preserve behaviour)
# ------------------------------
@app.get("/metrics/koi")
async def get_koi_metrics():
    try:
        data = joblib.load(KOI_METRICS_PATH)
        # ensure serializable formats (numpy -> list)
        if isinstance(data, dict):
            # convert numpy arrays in confusion matrix
            cm = data.get("confusion_matrix")
            if cm is not None:
                data["confusion_matrix"] = (cm.tolist() if hasattr(cm, "tolist") else cm)
        return data
    except Exception as e:
        logger.exception("Failed to load KOI metrics")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics/planet")
async def get_planet_metrics():
    try:
        data = joblib.load(PLANET_METRICS_PATH)
        if isinstance(data, dict):
            cm = data.get("confusion_matrix")
            if cm is not None:
                data["confusion_matrix"] = (cm.tolist() if hasattr(cm, "tolist") else cm)
        return data
    except Exception as e:
        logger.exception("Failed to load planet metrics")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload", response_model=schemas.UploadResponse)
async def upload_file(file: UploadFile = File(...), db=Depends(get_db)):
    contents = await file.read()

    # --- Parse file ---
    if file.filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(contents))
    elif file.filename.endswith(".json"):
        df = pd.read_json(io.BytesIO(contents))
    else:
        raise HTTPException(400, "Only CSV/JSON supported")

    # --- Take first row as features ---
    features = df.iloc[0].to_dict()

    # --- Run prediction ---
    raw_result = await predict(PredictRequest(**features))  # reuse predict endpoint

    # --- Extract Gemini explanation (if any) ---
    explanation = raw_result.get("gemini_koi_explanation", "")

    # --- Save to DB (ensure your CRUD accepts these args) ---
    db_obj = crud.create_analysis(db, features, raw_result, explanation)

    # --- Shape response ---
    shaped = format_upload_response(raw_result, db_obj.id)

    return shaped

@app.post("/predict_manual", response_model=schemas.UploadResponse)
async def predict_manual(req: PredictRequest, db=Depends(get_db)):
    # 🔥 Run prediction logic using existing function
    raw_result = await predict(req)

    # --- Extract Gemini explanation (if any) ---
    explanation = raw_result.get("gemini_koi_explanation", "")

    # --- Save to DB (same as upload) ---
    db_obj = crud.create_analysis(db, req.dict(), raw_result, explanation)

    # --- Shape response (same format as /upload) ---
    shaped = format_upload_response(raw_result, db_obj.id)

    return shaped


@app.get("/explorer")
def get_explorer(page: int = 1, limit: int = 30, db=Depends(get_db)):
    skip = (page - 1) * limit
    db_objs = crud.get_analyses(db, skip=skip, limit=limit)
    shaped = format_explorer_response(db_objs)

    return shaped

@app.get("/analysis/{analysis_id}")
def get_analysis_detail(analysis_id: int, db=Depends(get_db)):
    db_obj = crud.get_analysis(db, analysis_id)
    if not db_obj:
        raise HTTPException(404, "Not found")

    raw = db_obj.result  # stored JSON
    print("DEBUG RAW planet_type:", raw.get("planet_type"))

    return format_analysis_response(raw)

@app.get("/history", response_model=list[schemas.AnalysisResponse])
def get_history(skip: int = 0, limit: int = 20, db=Depends(get_db)):
    return crud.get_analyses(db, skip=skip, limit=limit)


@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    steps = [
        "Validating input...",
        "Preprocessing features...",
        "Running KOI classifier...",
        "Running Planet classifier...",
        "Fetching Gemini explanation...",
        "Finalizing results..."
    ]
    for step in steps:
        await websocket.send_text(step)
        await asyncio.sleep(1)
    await websocket.send_text("Analysis complete ✅")
    await websocket.close()

# 🔹 WebSocket for real-time explorer updates
@app.websocket("/ws/explorer")
async def ws_explorer(websocket: WebSocket, db=Depends(get_db)):
    await websocket.accept()
    while True:
        db_objs = crud.get_analyses(db, skip=0, limit=20)
        shaped = format_explorer_response(db_objs)
        await websocket.send_json(shaped)

@app.post("/reset_db")
def reset_db():
    try:
        with engine.begin() as conn:
            conn.execute(text("TRUNCATE TABLE analyses RESTART IDENTITY CASCADE;"))
        return {"status": "success", "message": "Analysis table reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))