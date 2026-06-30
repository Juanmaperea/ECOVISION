from fastapi import APIRouter, File, UploadFile

from app.schemas.detection import DetectionResponse
from app.services.recommendation.recommendation_service import build_recommendation
from app.services.vision.yolo_detector import detect_waste_from_image

router = APIRouter()


@router.post("/detect", response_model=DetectionResponse)
async def detect_waste(frame: UploadFile = File(...)) -> DetectionResponse:
    image_bytes = await frame.read()
    detection = detect_waste_from_image(image_bytes)
    return build_recommendation(detection)
