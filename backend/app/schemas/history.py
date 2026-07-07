from datetime import datetime

from pydantic import BaseModel


class HistoryCreate(BaseModel):

    detected_object: str

    confidence: float

    recommendation: str

    explanation: str


class HistoryResponse(HistoryCreate):

    id: int

    created_at: datetime

    class Config:

        from_attributes = True