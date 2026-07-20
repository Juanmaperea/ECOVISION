from sqlalchemy.orm import Session

from app.models.detection_history import DetectionHistory

from app.modules.history.repository import HistoryRepository

from app.schemas.history import HistoryCreate


class HistoryService:

    @staticmethod
    def create(
        db: Session,
        request: HistoryCreate
    ):

        history = DetectionHistory(

            detected_object=request.detected_object,

            confidence=request.confidence,

            recommendation=request.recommendation,

            explanation=request.explanation,

            container=request.container

        )

        return HistoryRepository.create(
            db,
            history
        )

    @staticmethod
    def get_all(db: Session):

        return HistoryRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db: Session,
        history_id: int
    ):

        return HistoryRepository.get_by_id(
            db,
            history_id
        )