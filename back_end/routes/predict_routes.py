from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import logging

router = APIRouter()

# --- Load models sekali di awal (biar cepat) ---
logreg_model = joblib.load("models/pkl/logreg_pipeline.pkl")
rf_model = joblib.load("models/pkl/random_forest_pipeline.pkl")
xgb_model = joblib.load("models/pkl/xgb_pipeline.pkl")

# Optional: Load metrics (jika ada)
try:
    with open("models/pkl/metrics.json", "r") as f:
        model_metrics = json.load(f)
except FileNotFoundError:
    model_metrics = {
        "LogisticRegression": 0.85,
        "RandomForest": 0.92,
        "XGBoost": 0.95
    }

class MachineData(BaseModel):
    Air_temperature_K: float
    Process_temperature_K: float
    Rotational_speed_rpm: float
    Torque_Nm: float
    Tool_wear_min: float

@router.post("/predict")
def predict(data: MachineData):
    logging.debug(data)
    try:
        df = pd.DataFrame([{
            "Air_Temp_K": data.Air_temperature_K,
            "Process_Temp_K": data.Process_temperature_K,
            "Rot_Speed_RPM": data.Rotational_speed_rpm,
            "Torque_Nm": data.Torque_Nm,
            "Tool_Wear_min": data.Tool_wear_min
        }])
        
        preds = {
            "LogisticRegression": {
                "label": logreg_model.predict(df)[0],
                "confidence": float(logreg_model.predict_proba(df)[0][1])
            },
            "RandomForest": {
                "label": rf_model.predict(df)[0],
                "confidence": float(rf_model.predict_proba(df)[0][1])
            },
            "XGBoost": {
                "label": xgb_model.predict(df)[0],
                "confidence": float(xgb_model.predict_proba(df)[0][1])
            },
        }

        most_confident = max(preds.items(), key=lambda x: x[1]["confidence"])

        return {
            "input": data.dict(),
            "predictions": preds,
            "summary": {
                "most_confident_model": most_confident[0],
                "final_decision": most_confident[1]["label"]
            },
            "model_performance": [
                {"model": k, "accuracy": v}
                for k, v in model_metrics.items()
            ]
        }

    except Exception as e:
        logging.debug(str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
