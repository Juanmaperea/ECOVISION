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
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    api_cost: float