import logging

from sqlalchemy.orm import Session

from app.modules.metrics.service import MetricsService
from app.modules.metrics.system import SystemMetrics
from app.schemas.metrics import MetricsCreate
from app.modules.metrics.timer import Timer

from app.modules.visual_processing.service import VisualProcessingService
from app.modules.recommendation.service import RecommendationService
from app.modules.history.service import HistoryService

from app.schemas.recommendation import RecommendationRequest
from app.schemas.history import HistoryCreate


logger = logging.getLogger(__name__)


class AnalysisService:

    @staticmethod
    def analyze(
        db: Session,
        image_bytes: bytes
    ):

        timer = Timer()
        timer.start()

        cpu_before = SystemMetrics.cpu()
        memory_before = SystemMetrics.memory()

        logger.info(
            "Nueva imagen recibida."
        )

        detection = VisualProcessingService.detect(
            image_bytes
        )

        if detection["confidence"] < 0.60:
            logger.warning(
                "La confianza de YOLO es baja."
            )

        recommendation = RecommendationService.generate(
            RecommendationRequest(
                detected_object=detection["detected_object"],
                confidence=detection["confidence"]
            )
        )

        HistoryService.create(
            db,
            HistoryCreate(
                detected_object=recommendation.detected_object,
                confidence=recommendation.confidence,
                recommendation=recommendation.recommendation,
                explanation=recommendation.explanation
            )
        )

        latency = timer.stop()

        cpu = SystemMetrics.cpu()

        memory = (
            SystemMetrics.memory()
            - memory_before
        )

        MetricsService.create(
            db,
            MetricsCreate(
                latency=latency,
                cpu=cpu,
                memory=memory,
                gpu=None,
                api_cost=0.0
            )
        )

        logger.info(
            f"Latencia: {latency:.3f}s"
        )

        logger.info(
            "Análisis finalizado."
        )

        return recommendation