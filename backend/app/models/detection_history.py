from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.sql import func

from sqlalchemy.orm import DeclarativeBase

from app.models.base import Base

class DetectionHistory(Base):

    __tablename__ = "detection_history"

    id = Column(Integer, primary_key=True, index=True)

    detected_object = Column(String(100), nullable=False)

    confidence = Column(Float, nullable=False)

    recommendation = Column(String(1000), nullable=False)

    explanation = Column(String(1000), nullable=False)

    container = Column(String(50), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )