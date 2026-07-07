from fastapi import APIRouter
from fastapi import File
from fastapi import UploadFile

from app.schemas.detection import DetectionResponse
from app.modules.visual_processing.service import VisualProcessingService

from app.utils.image_validator import ImageValidator

router = APIRouter(
    prefix="/visual-processing",
    tags=["Visual Processing"]
)


@router.post(
    "/detect",
    response_model=DetectionResponse
)
async def detect(
    image: UploadFile = File(...)
):

    image_bytes = await image.read()

    ImageValidator.validate(

        image.content_type,

        len(image_bytes)

    )

    return VisualProcessingService.detect(
        image_bytes
    )