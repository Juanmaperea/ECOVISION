from sqlalchemy.orm import Session

from app.models.metrics import Metrics
from app.modules.metrics.repository import MetricsRepository
from app.schemas.metrics import MetricsCreate


class MetricsService:

    @staticmethod
    def create(
        db: Session,
        request: MetricsCreate
    ):

        metric = Metrics(
            latency=request.latency,
            cpu=request.cpu,
            memory=request.memory,
            gpu=request.gpu,
            api_cost=request.api_cost
        )

        return MetricsRepository.create(
            db,
            metric
        )
    @staticmethod
    def get_all(db: Session):

        return MetricsRepository.get_all(db)


    @staticmethod
    def get_latest(db: Session):

        return MetricsRepository.get_latest(db)