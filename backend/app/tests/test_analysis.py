from unittest.mock import patch, MagicMock

from app.modules.analysis.service import AnalysisService

@patch(
    "app.modules.visual_processing.service.VisualProcessingService.detect"
)
@patch(
    "app.modules.recommendation.service.RecommendationService.generate"
)
@patch(
    "app.modules.history.service.HistoryService.create"
)
def test_analysis_unrecognized_class_is_not_valid(

    mock_history,

    mock_recommendation,

    mock_detection

):

    # Confianza alta pero la clase ("person") no está en
    # RECOGNIZED_WASTE_CLASSES: no debe llamarse a Gemini ni guardarse en
    # el historial.
    mock_detection.return_value = {

        "detected_object": "person",

        "confidence": 0.95

    }

    db = MagicMock()

    response = AnalysisService.analyze(

        db,

        b"image"

    )

    assert response.is_valid_detection is False
    assert response.detected_object == "person"
    assert response.confidence == 0.95
    assert response.container is None
    assert response.explanation is None
    assert response.recommendation is None

    mock_recommendation.assert_not_called()
    mock_history.assert_not_called()