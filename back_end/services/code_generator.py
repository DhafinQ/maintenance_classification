from sqlalchemy.orm import Session
from models.machine import Machine
from models.production import Production

def generate_machine_code(db: Session):
    last = db.query(Machine).order_by(Machine.id.desc()).first()
    next_id = 1 if not last else last.id + 1
    return f"MC-{next_id:04d}"

def generate_product_code(db: Session):
    last = db.query(Production).order_by(Production.id.desc()).first()
    next_id = 1 if not last else last.id + 1
    return f"PC-{next_id:04d}"
