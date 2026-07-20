from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.modules.metrics.service import MetricsService

from app.schemas.metrics import MetricsResponse

router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"]
)


@router.get(
    "",
    response_model=list[MetricsResponse]
)
def get_metrics(
    db: Session = Depends(get_db)
):

    return MetricsService.get_all(db)


@router.get(
    "/latest",
    response_model=MetricsResponse
)
def get_latest_metric(
    db: Session = Depends(get_db)
):

    return MetricsService.get_latest(db)