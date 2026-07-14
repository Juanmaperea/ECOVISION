from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import UploadFile

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.modules.analysis.service import (
    AnalysisService
)

from app.schemas.analysis import (
    AnalysisResponse
)

router = APIRouter(

    prefix="/analysis",

    tags=["Analysis"]

)


@router.post(

    "",

    response_model=AnalysisResponse

)

async def analyze(

    image: UploadFile = File(...),

    db: Session = Depends(get_db)

):

    image_bytes = await image.read()

    return AnalysisService.analyze(

        db,

        image_bytes

    )