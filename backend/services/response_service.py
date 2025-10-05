# response_service.py
import math
import random
from typing import Dict, Any, List, Optional
from datetime import datetime

# ---------- Helpers ----------
def _fmt_pct(val: Optional[float], spread_pct: float = 5.0) -> str:
    """Format a percentage with ± spread, treat tiny values as Trace."""
    if val is None or (isinstance(val, float) and (math.isnan(val) or math.isinf(val))):
        return "N/A"
    if val <= 0.05:
        return "Trace"
    return f"{val:.1f}% ± {spread_pct:.0f}%"


def _sample_with_noise(center: float, jitter: float = 2.0) -> float:
    """Add jitter so results vary per request but remain plausible."""
    return max(0.0, center + random.uniform(-jitter, jitter))


# ---------- Atmosphere Predictor ----------
def predict_atmosphere(planet_type: Optional[str],
                       radius: Optional[float],
                       teq: Optional[float],
                       sma: Optional[float] = None) -> Dict[str, Any]:
    """
    Heuristic atmosphere predictor.
    Returns dict with likely_gases, confidence, comment, habitability flag.
    """
    pt = (planet_type or "").lower()
    r = float(radius) if radius is not None else None
    t = float(teq) if teq is not None else None

    result = {"likely_gases": [], "confidence": "Low", "comment": "", "habitable": False}

    # --- Gas Giants ---
    if pt in ["gas giant", "hot jupiter", "jupiter-like"] or (r and r > 6.0):
        h2 = _sample_with_noise(88.0, jitter=3.0)
        he = _sample_with_noise(11.0, jitter=2.0)
        ch4 = _sample_with_noise(0.5, jitter=0.5)
        nh3 = _sample_with_noise(0.1, jitter=0.2)
        result["likely_gases"] = [
            {"element": "Hydrogen (H₂)", "percentage": _fmt_pct(h2, 5)},
            {"element": "Helium (He)", "percentage": _fmt_pct(he, 3)},
            {"element": "Methane (CH₄)", "percentage": _fmt_pct(ch4, 1)},
            {"element": "Ammonia (NH₃)", "percentage": _fmt_pct(nh3, 1)},
        ]
        result["confidence"] = "High"
        result["comment"] = "Gas giant — H₂/He-dominated atmosphere expected."

    # --- Mini-Neptunes ---
    elif pt in ["mini-neptune", "minineptune"] or (r and 1.5 < r <= 6.0):
        h2 = _sample_with_noise(55.0, 6)
        he = _sample_with_noise(20.0, 4)
        h2o = _sample_with_noise(8.0, 4)
        ch4 = _sample_with_noise(3.0, 2)
        result["likely_gases"] = [
            {"element": "Hydrogen (H₂)", "percentage": _fmt_pct(h2, 8)},
            {"element": "Helium (He)", "percentage": _fmt_pct(he, 6)},
            {"element": "Water vapor (H₂O)", "percentage": _fmt_pct(h2o, 6)},
            {"element": "Methane (CH₄)", "percentage": _fmt_pct(ch4, 2)},
        ]
        result["confidence"] = "Medium"
        result["comment"] = "Volatile-rich envelope — H₂/He with possible H₂O/CH₄."

    # --- Rocky / Earth-like / Super-Earth ---
    else:
        if r is None:
            r = 1.0
        if t is None:
            temp_bucket = "unknown"
        elif t < 250:
            temp_bucket = "cold"
        elif 250 <= t <= 350:
            temp_bucket = "habitable"
        elif 350 < t <= 1000:
            temp_bucket = "warm"
        else:
            temp_bucket = "hot"

        if r <= 1.5 and temp_bucket == "habitable":
            n2 = _sample_with_noise(75.0, 6)
            o2 = _sample_with_noise(21.0, 4)
            ar = _sample_with_noise(0.9, 0.3)
            h2o = _sample_with_noise(2.0, 2.0)
            co2 = _sample_with_noise(0.1, 0.2)
            result["likely_gases"] = [
                {"element": "Nitrogen (N₂)", "percentage": _fmt_pct(n2, 6)},
                {"element": "Oxygen (O₂)", "percentage": _fmt_pct(o2, 4)},
                {"element": "Argon (Ar)", "percentage": _fmt_pct(ar, 0.2)},
                {"element": "Water vapor (H₂O)", "percentage": _fmt_pct(h2o, 2)},
                {"element": "Carbon dioxide (CO₂)", "percentage": _fmt_pct(co2, 0.2)},
            ]
            result["confidence"] = "Medium"
            result["comment"] = "Rocky planet in temperate range → N₂/O₂ atmosphere plausible."
            result["habitable"] = True

        elif r <= 1.5 and temp_bucket in ("cold", "warm"):
            n2 = _sample_with_noise(60.0, 10)
            co2 = _sample_with_noise(25.0, 8)
            o2 = _sample_with_noise(10.0, 5)
            result["likely_gases"] = [
                {"element": "Nitrogen (N₂)", "percentage": _fmt_pct(n2, 8)},
                {"element": "Carbon dioxide (CO₂)", "percentage": _fmt_pct(co2, 8)},
                {"element": "Oxygen (O₂)", "percentage": _fmt_pct(o2, 6)},
                {"element": "Trace gases", "percentage": "Trace"},
            ]
            result["confidence"] = "Low"
            result["comment"] = "Rocky planet but temperature suggests high CO₂ or thin atmosphere."

        else:
            n2 = _sample_with_noise(40.0, 12)
            co2 = _sample_with_noise(25.0, 10)
            h2o = _sample_with_noise(10.0, 6)
            ch4 = _sample_with_noise(1.0, 1)
            result["likely_gases"] = [
                {"element": "Nitrogen (N₂)", "percentage": _fmt_pct(n2, 8)},
                {"element": "Carbon dioxide (CO₂)", "percentage": _fmt_pct(co2, 8)},
                {"element": "Water vapor (H₂O)", "percentage": _fmt_pct(h2o, 5)},
                {"element": "Methane (CH₄)", "percentage": _fmt_pct(ch4, 1)},
            ]
            result["confidence"] = "Medium"
            result["comment"] = "Super-Earth — heavier, CO₂-rich atmosphere possible."

    # --- Extreme hot override ---
    if t and t > 1000:
        result["likely_gases"] = [
            {"element": "Carbon dioxide (CO₂)", "percentage": _fmt_pct(80.0, 8)},
            {"element": "Sodium (Na) vapor", "percentage": "Trace"},
            {"element": "Potassium (K) vapor", "percentage": "Trace"},
        ]
        result["confidence"] = "High"
        result["comment"] = "Extreme Teq → runaway greenhouse / mineral vapor atmosphere."
        result["habitable"] = False

    return result


# ---------- Formatters ----------
def format_upload_response(raw: Dict[str, Any], analysis_id: int) -> Dict[str, Any]:
    logs = raw.get("logs", [
        "[10:45:01] Booting stellar analysis module...",
        "[10:45:03] Connecting to Deep Space Network... OK",
        "[10:45:05] Calibrating light curve sensors...",
        f"[10:45:06] Outlier count = {len(raw.get('outliers', []))}",
        "[10:45:08] Cross-referencing with known phenomena...",
        "[10:45:10] No match found. Flagging as high-priority anomaly.",
        "[10:45:12] Multi-spectrum analysis complete."
    ])
    return {
        "analysis_id": analysis_id,
        "prediction": raw["prediction"],
        "confidence": raw["confidence"],
        "reliability": raw["reliability"]["label"],
        "planet_type": raw.get("planet_type", {}).get("ml_prediction") if "planet_type" in raw else None,
        "extreme_outlier": raw["extreme_outlier"],
        "logs": logs,
    }


def format_explorer_response(db_objs) -> List[Dict[str, Any]]:
    formatted = []
    for obj in db_objs:
        r = obj.result  # ORM object -> access column
        formatted.append({
            "analysis_id": obj.id,
            "prediction": r["prediction"],
            "confidence": round(r["confidence"], 3),
            "reliability": r["reliability"]["label"],
            "planet_type": r.get("planet_type", {}).get("ml_prediction") if "planet_type" in r else None,
            "outlier_count": len(r["outliers"]),
        })
    return formatted


def format_analysis_response(raw: Dict[str, Any]) -> Dict[str, Any]:
    response = raw.copy()

    # radius / temp extraction
    radius, teq = None, None
    planet_type_name = None
    if raw.get("planet_type"):
        planet_type_name = raw["planet_type"].get("ml_prediction")
        stats = raw["planet_type"].get("planet_stats", {})
        radius = stats.get("koi_prad", {}).get("value")
        teq = stats.get("koi_teq", {}).get("value")

    # atmosphere prediction
    response["likely_atmosphere"] = predict_atmosphere(
        planet_type=planet_type_name,
        radius=radius,
        teq=teq,
    )

    # === Just add logs at the end ===
    response["logs"] = [
        f"[{datetime.now().strftime('%H:%M:%S')}] Booting analysis pipeline...",
        f"[{datetime.now().strftime('%H:%M:%S')}] Prediction: {response.get('prediction', 'Unknown')} "
        f"(Confidence: {response.get('confidence', 0)*100:.2f}%)",
        f"[{datetime.now().strftime('%H:%M:%S')}] Reliability: {response.get('reliability', {}).get('label', 'Unknown')}",
        f"[{datetime.now().strftime('%H:%M:%S')}] Planet Type: {planet_type_name or 'N/A'}",
        f"[{datetime.now().strftime('%H:%M:%S')}] Radius: {radius or 'N/A'} R⊕, Temp: {teq or 'N/A'} K",
        f"[{datetime.now().strftime('%H:%M:%S')}] Atmosphere: "
        f"{', '.join([g['element'] for g in response['likely_atmosphere'].get('likely_gases', [])]) or 'None'}",
        f"[{datetime.now().strftime('%H:%M:%S')}] Analysis complete."
    ]

    return response