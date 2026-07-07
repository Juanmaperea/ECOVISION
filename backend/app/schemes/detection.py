from pydantic import BaseModel


class DetectionResponse(BaseModel):

    detected_object: str

    confidence: float