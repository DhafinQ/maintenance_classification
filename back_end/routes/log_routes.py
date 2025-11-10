from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.db import get_db
from models.machine_log import MachineLog

router = APIRouter(prefix="/logs", tags=["Machine Logs"])

@router.get("/")
def get_all_logs(db: Session = Depends(get_db)):
    return db.query(MachineLog).all()

@router.get("/{log_id}")
def get_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(MachineLog).filter(MachineLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log
