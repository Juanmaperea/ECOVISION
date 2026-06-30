from pydantic import BaseModel, Field


class VisionDetection(BaseModel):
    object_name: str
    confidence: float = Field(ge=0, le=1)
    bounding_box: list[float] | None = None


class DetectionResponse(BaseModel):
    object_name: str
    confidence: float
    recommended_bin: str
    explanation: str
    tips: list[str]
    warning: str | None = None
