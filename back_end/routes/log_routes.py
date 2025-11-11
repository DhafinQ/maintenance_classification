from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.db import get_db
from models.machine_log import MachineLog

router = APIRouter(prefix="/logs", tags=["Machine Logs"])

@router.get("/")
def get_all_logs(db: Session = Depends(get_db)):
    return db.query(MachineLog).all()

def create_log(
    machine_id: int,
    product_id: int,
    air_temperature: float,
    process_temperature: float,
    rotational_speed: float,
    torque: float,
    tool_wear: float,
    prediction: str,
    db: Session = Depends(get_db)
):
    log = MachineLog(
        machine_id=machine_id,
        product_id=product_id,
        air_temperature=air_temperature,
        process_temperature=process_temperature,
        rotational_speed=rotational_speed,
        torque=torque,
        tool_wear=tool_wear,
        prediction=prediction
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"message": "Log created successfully", "data": log}


@router.get("/{log_id}")
def get_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(MachineLog).filter(MachineLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log

@router.put("/{log_id}")
def update_log(
    log_id: int,
    prediction: str,
    db: Session = Depends(get_db)
):
    log = db.query(MachineLog).filter(MachineLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    log.prediction = prediction
    db.commit()
    db.refresh(log)
    return {"message": "Log updated successfully", "data": log}

@router.delete("/{log_id}")
def delete_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(MachineLog).filter(MachineLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": f"Log with ID {log_id} deleted successfully"}
