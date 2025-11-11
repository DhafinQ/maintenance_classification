from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.db import get_db
from models.production import Production
from services.code_generator import generate_product_code

router = APIRouter(prefix="/productions", tags=["Productions"])

@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    return db.query(Production).all()

@router.post("/")
def create_product(product_name: str, db: Session = Depends(get_db)):
    code = generate_product_code(db)
    product = Production(product_code=code, product_name=product_name)
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"message": "Product created", "data": product}

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Production).filter(Production.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}")
def update_product(product_id: int, product_name: str, db: Session = Depends(get_db)):
    product = db.query(Production).filter(Production.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.product_name = product_name
    db.commit()
    db.refresh(product)
    return {"message": "Product updated successfully", "data": product}

def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Production).filter(Production.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": f"Product with ID {product_id} deleted successfully"}
