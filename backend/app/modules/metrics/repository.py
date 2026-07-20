from sqlalchemy.orm import Session

from app.models.metrics import Metrics


class MetricsRepository:

    @staticmethod
    def create(db: Session, metric: Metrics):

        db.add(metric)
        db.commit()
        db.refresh(metric)

        return metric
    @staticmethod
    def get_all(db: Session):

        return (
            db.query(Metrics)
            .order_by(Metrics.created_at.desc())
            .all()
        )

    @staticmethod
    def get_latest(db: Session):

        return (
            db.query(Metrics)
            .order_by(Metrics.created_at.desc())
            .first()
        )