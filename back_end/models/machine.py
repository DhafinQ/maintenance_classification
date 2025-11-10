from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from services.db import Base

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    machine_code = Column(String(10), unique=True, index=True, nullable=False)
    type = Column(String(50), nullable=False)

    logs = relationship("MachineLog", back_populates="machine")
