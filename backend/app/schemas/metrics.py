from pydantic import BaseModel
from typing import Optional


class MetricsCreate(BaseModel):

    latency: float
    cpu: float
    memory: float
    gpu: Optional[float] = None
    api_cost: float


class MetricsResponse(MetricsCreate):

    id: int

    class Config:
        from_attributes = True