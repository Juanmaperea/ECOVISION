import logging

from sqlalchemy.orm import Session

from app.modules.metrics.collector import MetricsCollector
from app.modules.metrics.service import MetricsService

from app.schemas.metrics import MetricsCreate

from app.modules.visual_processing.service import (
    VisualProcessingService
)

from app.modules.recommendation.service import (
    RecommendationService
)

from app.modules.history.service import (
    HistoryService
)

from app.schemas.recommendation import (
    RecommendationRequest
)

from app.schemas.history import (
    HistoryCreate
)

logger = logging.getLogger(__name__)


class AnalysisService:

    @staticmethod
    def analyze(
        db: Session,
        image_bytes: bytes
    ):

        collector = MetricsCollector()
        collector.start()

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

        metrics = collector.finish()

        MetricsService.create(
            db,
            MetricsCreate(
                latency=metrics["latency"],
                cpu=metrics["cpu"],
                memory=metrics["memory"],
                gpu=metrics["gpu"],
                # Calcular el costo real de la API
                api_cost=0.0
            )
        )

        logger.info(
            f"Latencia: {metrics['latency']:.3f}s"
        )

        logger.info(
            f"CPU: {metrics['cpu']:.2f}%"
        )

        logger.info(
            f"Memoria: {metrics['memory']:.2f} MB"
        )

        logger.info(
            "Análisis finalizado."
        )

        return recommendation