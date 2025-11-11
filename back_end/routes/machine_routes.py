from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.db import get_db
from models.machine import Machine
from services.code_generator import generate_machine_code

router = APIRouter(prefix="/machines", tags=["Machines"])

@router.get("/")
def get_all_machines(db: Session = Depends(get_db)):
    return db.query(Machine).all()

@router.post("/")
def create_machine(type: str, db: Session = Depends(get_db)):
    # Generate unique code
    code = generate_machine_code(db)
    machine = Machine(machine_code=code, type=type)
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
def update_machine(machine_id: int, type: str, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    machine.type = type
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
