from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.db import get_db
from models.machine import Machine
from services.code_generator import generate_machine_code
from pydantic import BaseModel

router = APIRouter(prefix="/machines", tags=["Machines"])

class MachineCreate(BaseModel):
    machine_code: str
    type: str

@router.get("/")
def get_all_machines(db: Session = Depends(get_db)):
    return db.query(Machine).all()

@router.post("/")
def create_machine(machine_data: MachineCreate, db: Session = Depends(get_db)):
    # Generate unique code
    code = machine_data.machine_code
    machine = Machine(machine_code=code, type=machine_data.type)
    db.add(machine)
    db.commit()
    db.refresh(machine)
    return {"message": "Machine created", "data": machine}

@router.get("/{machine_id}")
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.put("/{machine_id}")
def update_machine(machine_id: int, machine_data: MachineCreate, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    machine.type = machine_data.type
    machine.machine_code = machine_data.machine_code
    db.commit()
    db.refresh(machine)
    return {"message": "Machine updated successfully", "data": machine}

@router.delete("/{machine_id}")
def delete_machine(machine_id: int, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    db.delete(machine)
    db.commit()
    return {"message": f"Machine with ID {machine_id} deleted successfully"}
