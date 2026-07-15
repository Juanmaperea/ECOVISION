from sqlalchemy.orm import Session

from app.models.detection_history import DetectionHistory


class HistoryRepository:

    @staticmethod
    def create(
        db: Session,
        history: DetectionHistory
    ):

        db.add(history)

        db.commit()

        db.refresh(history)

        return history

    @staticmethod
    def get_all(db: Session):

        return (
            db.query(DetectionHistory)
            .order_by(
                DetectionHistory.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        history_id: int
    ):

        return (
            db.query(DetectionHistory)
            .filter(
                DetectionHistory.id == history_id
            )
            .first()
        )