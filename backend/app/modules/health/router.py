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
    "/database",
    summary="Verifica la conexión con PostgreSQL",
)
def database_health():
    return HealthService.get_database_status()


@router.get(
    "/gemini",
    summary="Verifica la disponibilidad de Gemini",
)
def gemini_health():
    return HealthService.get_gemini_status()