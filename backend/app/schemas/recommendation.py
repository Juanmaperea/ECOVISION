from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    detected_object: str
    confidence: float


class RecommendationResponse(BaseModel):
    detected_object: str
    confidence: float
    container: str
    explanation: str
    recommendation: str