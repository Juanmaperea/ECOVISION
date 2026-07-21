from fastapi import APIRouter

from app.schemas.health import HealthResponse
from app.modules.health.service import HealthService


router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get(
    "",
    response_model=HealthResponse,
    summary="Verifica el estado de la API",
)
def health():
    return HealthService.get_status()


@router.get(
    "/detailed",
    summary="Verifica el estado detallado de los servicios",
)
def detailed_health():
    return HealthService.get_detailed_status()