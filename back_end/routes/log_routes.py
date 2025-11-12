from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.db import get_db
from models.machine_log import MachineLog
from models.machine import Machine
import joblib
import pandas as pd
import numpy as np
from sklearn.exceptions import NotFittedError
from pydantic import BaseModel
from services.token_service import get_current_user
# === Load Models Once ===
try:
    logreg_model = joblib.load("models/pkl/logreg_pipeline.pkl")
    rf_model = joblib.load("models/pkl/random_forest_pipeline.pkl")
    xgb_model = joblib.load("models/pkl/xgb_pipeline.pkl")
except Exception as e:
    print("⚠️ Error loading models:", e)
    logreg_model = rf_model = xgb_model = None


# === Helper: Prediction Function ===
def get_prediction(model, df: pd.DataFrame):
    """Return predicted label and confidence score"""
    pred = model.predict(df)[0]
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(df)[0]
        confidence = float(probs[pred])
    else:
        confidence = 0.0
    return {"label": str(pred), "confidence": confidence}

def predict_best(machine_type: str, log_data: MachineLog):
    machine_type = 0 if machine_type == "H" else (1 if machine_type == "L" else 2)
    """Generate prediction results using all models"""
    air_temp = log_data.air_temperature
    process_temp = log_data.process_temperature
    rot_speed = log_data.rotational_speed
    torque = log_data.torque
    tool_wear = log_data.tool_wear

    # 🔹 Tambahkan kalkulasi fitur turunan
    temperature_diff = process_temp - air_temp
    mech_power = torque * rot_speed * (2 * np.pi / 60)

    # 🔹 Buat DataFrame input untuk model
    df = pd.DataFrame([{
        "Type": machine_type,
        "Air_Temp_K": air_temp,
        "Process_Temp_K": process_temp,
        "Rot_Speed_RPM": rot_speed,
        "Torque_Nm": torque,
        "Tool_Wear_min": tool_wear,
        "temperature_difference": temperature_diff,
        "Mechanical_Power_W": mech_power
    }])

    # 🔹 Prediksi dari semua model
    preds = {
        "Logistic Regression": get_prediction(logreg_model, df),
        "Random Forest": get_prediction(rf_model, df),
        "XGBoost": get_prediction(xgb_model, df)
    }

    # 🔹 Pilih model terbaik
    best_model = max(preds.items(), key=lambda x: x[1]["confidence"])
    return best_model, preds

class MachineLogCreate(BaseModel):
    machine_id: int
    product_id: int
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float

router = APIRouter(prefix="/logs", tags=["Machine Logs"])

@router.get("/", dependencies=[Depends(get_current_user)])
def get_all_logs(db: Session = Depends(get_db)):
    return db.query(MachineLog).all()


@router.post("/", dependencies=[Depends(get_current_user)])
def create_log(
    log_data: MachineLogCreate,
    db: Session = Depends(get_db)
):
    if not rf_model:
        raise HTTPException(status_code=500, detail="Models not loaded")

    # Ambil type mesin
    machine = db.query(Machine).filter(Machine.id == log_data.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    # Buat objek log sementara
    temp_log = MachineLog(
        machine_id=log_data.machine_id,
        product_id=log_data.product_id,
        air_temperature=log_data.air_temperature + 273.15,
        process_temperature=log_data.process_temperature + 273.15,
        rotational_speed=log_data.rotational_speed,
        torque=log_data.torque,
        tool_wear=log_data.tool_wear
    )

    try:
        # Jalankan prediksi otomatis

        best_model, preds = predict_best(machine.type, temp_log)
        temp_log.prediction = best_model[1]["label"]

        # Simpan ke database
        db.add(temp_log)
        db.commit()
        db.refresh(temp_log)

        return {
            "message": "Log created and predicted successfully",
            "best_model": best_model[0],
            "confidence": best_model[1]["confidence"],
            "data": temp_log,
            "all_model_results": preds
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{log_id}", dependencies=[Depends(get_current_user)])
def get_log_detail(log_id: int, db: Session = Depends(get_db)):
    if not rf_model:
        raise HTTPException(status_code=500, detail="Models not loaded")

    log = db.query(MachineLog).filter(MachineLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    machine = db.query(Machine).filter(Machine.id == log.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    try:
        best_model, preds = predict_best(machine.type, log)
        return {
            "message": "Log detail with prediction results",
            "data": {
                "id": log.id,
                "machine_id": log.machine_id,
                "product_id": log.product_id,
                "machine_type": machine.type,
                "air_temperature": log.air_temperature,
                "process_temperature": log.process_temperature,
                "rotational_speed": log.rotational_speed,
                "torque": log.torque,
                "tool_wear": log.tool_wear,
                "saved_prediction": log.prediction
            },
            "current_prediction": best_model[1]["label"],
            "best_model": best_model[0],
            "confidence": best_model[1]["confidence"],
            "all_model_results": preds
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{log_id}", dependencies=[Depends(get_current_user)])
def re_predict_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(MachineLog).filter(MachineLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    machine = db.query(Machine).filter(Machine.id == log.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    try:
        best_model, preds = predict_best(machine.type, log)
        log.prediction = best_model[1]["label"]
        db.commit()
        db.refresh(log)

        return {
            "message": "Log re-predicted successfully",
            "best_model": best_model[0],
            "confidence": best_model[1]["confidence"],
            "data": log,
            "all_model_results": preds
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{log_id}", dependencies=[Depends(get_current_user)])
def delete_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(MachineLog).filter(MachineLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": f"Log with ID {log_id} deleted successfully"}
