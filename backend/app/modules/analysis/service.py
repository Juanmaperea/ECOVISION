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
from app.modules.metrics.collector import MetricsCollector
from app.modules.metrics.service import MetricsService

from app.schemas.metrics import MetricsCreate

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
# el resto del flujo (Gemini + guardado en historial). Antes este umbral
# solo generaba un warning en el log, pero igual se llamaba a Gemini y se
# guardaba en el historial sin importar qué tan baja fuera la confianza.
CONFIDENCE_THRESHOLD = 0.60

# Clases de COCO (las 80 que reconoce yolov8n.pt) que corresponden al
# alcance de EcoVision como residuos. yolov8n.pt es un modelo genérico y
# también reconoce clases que no son residuos ("person", "chair", "laptop",
# "tv", etc.): sin este filtro, apuntar la cámara hacia una persona
# generaba una recomendación de Gemini y un registro de historial igual
# que una botella real.
#
# Nota: esta lista está intencionalmente alineada con
# frontendEcovision/src/utils/wasteTaxonomy.js (TAXONOMY). Si se agrega una
# clase nueva aquí, hay que reflejarla también en el frontend para que el
# mensaje que se le muestra al usuario sea coherente con lo que el backend
# realmente valida. La comparación se hace en minúsculas porque así es como
# `Detector.detect` devuelve las clases de YOLO (result.names).
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


        logger.info(
            "Nueva imagen recibida."
        )

        detection = VisualProcessingService.detect(
            image_bytes
        )


        detected_object = detection["detected_object"]

        confidence = detection["confidence"]

        is_recognized_class = detected_object.lower() in RECOGNIZED_WASTE_CLASSES

        has_enough_confidence = confidence >= CONFIDENCE_THRESHOLD

        is_valid_detection = is_recognized_class and has_enough_confidence

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

            elapsed = timer.end()

            logger.info(

                f"Tiempo total: {elapsed} segundos"

            )

            logger.info(

                "Análisis finalizado (detección no válida, sin llamada a Gemini ni guardado en historial)."


        if detection["confidence"] < 0.60:
            logger.warning(
                "La confianza de YOLO es baja."

            )

            # Ni Gemini ni el historial se tocan cuando la detección no es
            # válida: se evita gastar la llamada al LLM y se evita
            # contaminar el historial con detecciones que no son residuos.
            return AnalysisResponse(
                detected_object=detected_object,
                confidence=confidence,
                is_valid_detection=False
            )

        recommendation = RecommendationService.generate(
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
        elapsed = timer.end()
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
