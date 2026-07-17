from sqlalchemy.orm import Session

from app.models.metrics import Metrics


class MetricsRepository:

    @staticmethod
    def create(db: Session, metric: Metrics):

        db.add(metric)
        db.commit()
        db.refresh(metric)

        return metric