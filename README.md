# 🌌 Exoplanet Analysis & Visualization Dashboard

> An interactive, AI-powered dashboard for visualizing exoplanet systems, anomaly detection, and atmospheric analysis — blending data science and space visualization.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-blueviolet)
![Python](https://img.shields.io/badge/ML-Python-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🚀 Overview

The **Exoplanet Analysis Dashboard** visualizes real astronomical datasets and ML-based predictions in an immersive, cinematic way.  
It integrates **data-driven insights**, **machine learning predictions**, and **interactive orbit visualizations** for each detected planet system.

✨ Features include:
- 🪐 Real-time animated orbital systems (2D + 3D views)
- 🔭 AI-powered planet classification and anomaly detection
- 🌈 Atmospheric composition, confidence scoring, and visual trends
- 📊 Dynamic feature importance visualization
- 🛰️ Gemini-based AI insights (if API key configured)
- 🌠 Twinkling starfield, nebula glows, and parallax camera motion

---

## 🧠 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React + TypeScript + Vite | High-performance UI |
| **Styling** | TailwindCSS + ShadCN/UI | Modern, clean design system |
| **Charts** | Recharts | Atmospheric and data trend visualization |
| **Backend** | FastAPI (Python) | REST API for analysis and ML inference |
| **Database** | SQLite / PostgreSQL | Persistent data store |
| **ML/AI** | Scikit-learn, Gemini API | Outlier detection, classification, explanations |

---

## 📂 Project Structure

```
.
├── backend/
│   ├── main.py                # FastAPI entry point
│   ├── models.py              # Database & ML models
│   ├── routes/
│   │   └── analysis.py        # /analysis/<id> endpoint
│   └── utils/
│       └── ml_engine.py       # ML inference, outlier detection
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StarSystem.tsx    # 3D orbital visualization
│   │   │   └── StarSystem2D.tsx  # 2D flat projection
│   │   ├── pages/
│   │   │   └── Analysis.tsx      # Main dashboard page
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/exoplanet-visualizer.git
cd exoplanet-visualizer
```

### 2️⃣ Backend setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API will run at: `http://localhost:8000`

### 3️⃣ Frontend setup (React)

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🌍 Usage

1. Open the web app in your browser.
2. Choose an analysis record (`/analysis/<id>`) to visualize.
3. Explore:
   - **3D mode**: Orbital animation, parallax motion, and nebula glow
   - **2D mode**: Clear system layout with orbits and anomaly-coded colors
4. Check **Prediction Summary**, **Atmosphere**, and **Feature Importance** panels for insights.
5. Watch trends update in real-time.

---

## 🪩 Visualization Highlights

### 🪐 3D Orbital System
- Smooth planet orbits with dynamic anomalies
- Twinkling background stars with parallax drift
- Nebula gradients and subtle rotational motion

### 🌈 2D System View
- Clear static orbit visualization
- Confidence and anomaly indicators
- Light nebula overlays and soft UI glow

### 📊 Feature Importance
- Dynamic bar visualizations from model weights
- Adaptive scaling and Tailwind-based color gradients

### 🔬 Atmospheric Analysis
- Trend chart with real-time simulated updates (O₂, CH₄)
- Confidence and color-coded stability indicators

---

## 🔧 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Optional key for Gemini-based explanations | None |
| `PORT` | FastAPI port | 8000 |
| `DATABASE_URL` | Database connection string | SQLite local |
| `FRONTEND_PORT` | React dev server port | 5173 |

---

## 📈 Example API Response

```json
{
  "prediction": "Habitable",
  "confidence": 0.92,
  "reliability": { "label": "High", "score": 0.89 },
  "likely_atmosphere": {
    "likely_gases": [
      { "element": "O₂", "percentage": "21%" },
      { "element": "CH₄", "percentage": "1.7%" }
    ],
    "confidence": "High"
  },
  "outliers": [
    { "feature": "koi_depth", "z": 8.9 },
    { "feature": "koi_period", "z": 9.3 }
  ],
  "planet_type": {
    "ml_prediction": "Super-Earth",
    "rule_based_prediction": "Rocky",
    "agreement": true
  }
}
```

---

## 💫 Screenshots

| 3D System | 2D System | Insights |
|-----------|-----------|----------|
| ![3D View](#) | ![2D View](#) | ![Dashboard](#) |

---

## 🧩 Future Enhancements

- 🌌 WebGL-based 3D starfield (Three.js)
- 🪙 Export data as CSV or PDF report
- 🧬 Planet comparison mode
- 🌐 Deploy to Vercel + Render stack

---

## 🛡 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 👨‍🚀 Author

**Saptarshi Mondal**  
Data Visualization Engineer • Space Enthusiast 🚀

📫 Reach out: saptarshidev169@gmail.com  
🌐 [Portfolio / Website](#)