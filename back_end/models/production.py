from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from services.db import Base

class Production(Base):
    __tablename__ = "productions"

    id = Column(Integer, primary_key=True, index=True)
    product_code = Column(String(10), unique=True, index=True, nullable=False)
    product_name = Column(String(100), nullable=False)

    logs = relationship("MachineLog", back_populates="product")
