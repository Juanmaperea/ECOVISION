from unittest.mock import patch
from unittest.mock import MagicMock

from app.modules.analysis.service import (
    AnalysisService
)


@patch(
    "app.modules.visual_processing.service.VisualProcessingService.detect"
)

@patch(
    "app.modules.recommendation.service.RecommendationService.generate"
)

@patch(
    "app.modules.history.service.HistoryService.create"
)

def test_analysis(

    mock_history,

    mock_recommendation,

    mock_detection

):

    mock_detection.return_value = {

        "detected_object": "Bottle",

        "confidence": 0.95

    }

    recommendation = MagicMock()

    recommendation.detected_object = "Bottle"

    recommendation.confidence = 0.95

    recommendation.container = "Blanco"

    recommendation.explanation = "Plástico"

    recommendation.recommendation = "Reciclar"

    mock_recommendation.return_value = recommendation

    db = MagicMock()

    response = AnalysisService.analyze(

        db,

        b"image"

    )

    assert response.container == "Blanco"

    mock_history.assert_called_once()