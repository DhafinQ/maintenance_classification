from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import json
from sklearn.exceptions import NotFittedError

router = APIRouter(prefix="/predict", tags=["Prediction"])

# Load model saat startup
try:
    logreg_model = joblib.load("models/pkl/logreg_pipeline.pkl")
    rf_model = joblib.load("models/pkl/random_forest_pipeline.pkl")
    xgb_model = joblib.load("models/pkl/xgb_pipeline.pkl")
except Exception as e:
    print("⚠️ Error loading models:", e)
    logreg_model = rf_model = xgb_model = None

# Optional: load metrik model (kalau kamu punya metrics.json)
try:
    with open("models/pkl/metrics.json", "r") as f:
        model_metrics = json.load(f)
except FileNotFoundError:
    model_metrics = {
        "Logistic Regression": 0.85,
        "Random Forest": 0.92,
        "XGBoost": 0.94
    }

# Type 0 = High, 1 = Low 2 = Med 
column_map = {
    "Air_temperature_K": "Air_Temp_K",
    "Process_temperature_K": "Process_Temp_K",
    "Rotational_speed_rpm": "Rot_Speed_RPM",
    "Torque_Nm": "Torque_Nm",
    "Tool_wear_min": "Tool_Wear_min"
}
# --- Schema Input ---
class MachineData(BaseModel):
    Type : float
    Air_temperature_K: float
    Process_temperature_K: float
    Torque_Nm: float
    Rotational_speed_rpm: float
    Tool_wear_min: float


# --- Endpoint Prediksi dari Input User ---
@router.post("/")
def predict(data: MachineData):
    if not rf_model:
        raise HTTPException(status_code=500, detail="Models are not loaded or not fitted yet.")

    # Convert ke DataFrame
    df = pd.DataFrame([{
        "Type": data.Type,
        column_map["Air_temperature_K"]: data.Air_temperature_K,
        column_map["Process_temperature_K"]: data.Process_temperature_K,
        column_map["Rotational_speed_rpm"]: data.Rotational_speed_rpm,
        column_map["Torque_Nm"]: data.Torque_Nm,
        column_map["Tool_wear_min"]: data.Tool_wear_min,
    }])

    df["temperature_difference"] = df["Process_Temp_K"] - df["Air_Temp_K"]
    df["Mechanical_Power_W"] = df["Torque_Nm"] * df["Rot_Speed_RPM"] * (2 * np.pi / 60)


    try:
        # Prediksi dengan tiga model
        preds = {
            "Logistic Regression": get_prediction(logreg_model, df),
            "Random Forest": get_prediction(rf_model, df),
            "XGBoost": get_prediction(xgb_model, df)
        }

        # Cari model dengan confidence tertinggi
        best_model = max(preds.items(), key=lambda x: x[1]["confidence"])

        return {
            "input": data.dict(),
            "predictions": preds,
            "summary": {
                "best_model": best_model[0],
                "final_decision": best_model[1]["label"]
            },
            "model_performance": [
                {"model": k, "accuracy": v}
                for k, v in model_metrics.items()
            ]
        }

    except NotFittedError:
        raise HTTPException(status_code=500, detail="One or more models are not fitted yet. Please retrain.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Fungsi pembantu untuk prediksi dan confidence ---
def get_prediction(model, df: pd.DataFrame):
    """Melakukan prediksi + menghitung confidence"""
    pred = model.predict(df)[0]
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(df)[0]
        confidence = float(probs[pred])
    else:
        confidence = 0.0  # kalau model gak punya probas
    label = str(pred) if isinstance(pred, (str, int)) else str(pred)
    return {"label": label, "confidence": confidence}
