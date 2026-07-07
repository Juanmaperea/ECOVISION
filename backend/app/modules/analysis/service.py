from sqlalchemy.orm import Session

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

from app.modules.metrics.timer import Timer

import logging

class AnalysisService:

    @staticmethod
    def analyze(
        db: Session,
        image_bytes: bytes
    ):
        
        timer = Timer()

        timer.begin()

        logger = logging.getLogger(__name__)

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

                detected_object=detection[
                    "detected_object"
                ],

                confidence=detection[
                    "confidence"
                ]

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
        
        elapsed = timer.end()

        logger.info(

            f"Tiempo total: {elapsed} segundos"

        )

        logger.info(

            "Análisis finalizado."

        )

        return recommendation