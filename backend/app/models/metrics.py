from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.sql import func

from app.models.detection_history import Base


class Metrics(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    latency = Column(Float)
    cpu = Column(Float)
    memory = Column(Float)
    gpu = Column(Float, nullable=True)
    api_cost = Column(Float)
    created_at = Column(DateTime, server_default=func.now())