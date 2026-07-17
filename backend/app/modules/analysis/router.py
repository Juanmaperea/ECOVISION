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

from app.utils.image_validator import ImageValidator

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

    # Antes, este router no validaba el archivo recibido (a diferencia de
    # visual_processing/router.py, que sí lo hace). Se agrega aquí por
    # consistencia: rechaza tipos de imagen no soportados y archivos que
    # superen el tamaño máximo permitido.
    ImageValidator.validate(

        image.content_type,

        len(image_bytes)

    )

    return AnalysisService.analyze(

        db,

        image_bytes

    )
