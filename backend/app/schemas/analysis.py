from pydantic import BaseModel


class AnalysisResponse(BaseModel):

    detected_object: str

    confidence: float

    container: str

    explanation: str

    recommendation: str