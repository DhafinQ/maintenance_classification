from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from services.db import Base

class MachineLog(Base):
    __tablename__ = "machine_logs"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("productions.id"), nullable=False)

    air_temperature = Column(Float)
    process_temperature = Column(Float)
    rotational_speed = Column(Integer)
    torque = Column(Float)
    tool_wear = Column(Integer)
    prediction = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)

    machine = relationship("Machine", back_populates="logs")
    product = relationship("Production", back_populates="logs")
