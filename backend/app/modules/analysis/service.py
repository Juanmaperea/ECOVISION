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

from app.schemas.analysis import (
    AnalysisResponse
)

from app.modules.metrics.timer import Timer

logger = logging.getLogger(__name__)


# Confianza mínima de YOLO para considerar la detección válida y disparar
# el resto del flujo (Gemini + guardado en historial).
CONFIDENCE_THRESHOLD = 0.60

# Clases de COCO que EcoVision considera residuos válidos.
RECOGNIZED_WASTE_CLASSES = {
    "bottle",
    "wine glass",
    "cup",
    "bowl",
    "vase",
    "book",
    "fork",
    "knife",
    "spoon",
    "banana",
    "apple",
    "orange",
    "sandwich",
    "broccoli",
    "carrot",
    "pizza",
    "donut",
    "cake",
}


class AnalysisService:

    @staticmethod
    def analyze(
        db: Session,
        image_bytes: bytes
    ):

        collector = MetricsCollector()
        collector.start()

        timer = Timer()
        timer.start()

        logger.info(
            "Nueva imagen recibida."
        )

        detection = VisualProcessingService.detect(
            image_bytes
        )

        detected_object = detection["detected_object"]
        confidence = detection["confidence"]

        is_recognized_class = (
            detected_object.lower() in RECOGNIZED_WASTE_CLASSES
        )

        has_enough_confidence = (
            confidence >= CONFIDENCE_THRESHOLD
        )

        is_valid_detection = (
            is_recognized_class and has_enough_confidence
        )

        if not is_valid_detection:

            if not is_recognized_class:

                logger.info(
                    "Detección descartada: '%s' no está en RECOGNIZED_WASTE_CLASSES.",
                    detected_object
                )

            if not has_enough_confidence:

                logger.warning(
                    "La confianza de YOLO es baja (%.2f < %.2f).",
                    confidence,
                    CONFIDENCE_THRESHOLD
                )

            elapsed = timer.stop()

            logger.info(
                f"Tiempo total: {elapsed} segundos"
            )

            logger.info(
                "Análisis finalizado (detección no válida, sin llamada a Gemini ni guardado en historial)."
            )

            # Ni Gemini ni el historial se tocan cuando la detección no es
            # válida: se evita gastar la llamada al LLM y se evita
            # contaminar el historial con detecciones que no son residuos.
            return AnalysisResponse(
                detected_object=detected_object,
                confidence=confidence,
                is_valid_detection=False
            )

        recommendation, usage_metadata = RecommendationService.generate(
            RecommendationRequest(
                detected_object=detected_object,
                confidence=confidence
            )
        )

        HistoryService.create(
            db,
            HistoryCreate(
                detected_object=recommendation.detected_object,
                confidence=recommendation.confidence,
                recommendation=recommendation.recommendation,
                explanation=recommendation.explanation,
                container=recommendation.container
            )
        )

        metrics = collector.finish(usage_metadata)

        print(">>> Guardando métricas:", metrics)

        MetricsService.create(
            db,
            MetricsCreate(
                latency=metrics["latency"],
                cpu=metrics["cpu"],
                memory=metrics["memory"],
                gpu=metrics["gpu"],
                api_cost=metrics["api_cost"]
            )
        )

        print(">>> Métricas guardadas")

        elapsed = timer.stop()

        logger.info(
            f"Tiempo total: {elapsed} segundos"
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

        return AnalysisResponse(
            detected_object=recommendation.detected_object,
            confidence=recommendation.confidence,
            is_valid_detection=True,
            container=recommendation.container,
            explanation=recommendation.explanation,
            recommendation=recommendation.recommendation
        )