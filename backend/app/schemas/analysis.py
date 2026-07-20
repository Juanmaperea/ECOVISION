from typing import Optional

from pydantic import BaseModel


class AnalysisResponse(BaseModel):

    detected_object: str

    confidence: float

    is_valid_detection: bool

    container: Optional[str] = None

    explanation: Optional[str] = None

    recommendation: Optional[str] = None
