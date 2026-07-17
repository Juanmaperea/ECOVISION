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

    assert response.is_valid_detection is True

    assert response.container == "Blanco"

    mock_recommendation.assert_called_once()

    mock_history.assert_called_once()


@patch(
    "app.modules.visual_processing.service.VisualProcessingService.detect"
)

@patch(
    "app.modules.recommendation.service.RecommendationService.generate"
)

@patch(
    "app.modules.history.service.HistoryService.create"
)

def test_analysis_low_confidence_is_not_valid(

    mock_history,

    mock_recommendation,

    mock_detection

):

    # Clase reconocida ("bottle") pero por debajo de CONFIDENCE_THRESHOLD
    # (0.60): no debe llamarse a Gemini ni guardarse en el historial.
    mock_detection.return_value = {

        "detected_object": "bottle",

        "confidence": 0.30

    }

    db = MagicMock()

    response = AnalysisService.analyze(

        db,

        b"image"

    )

    assert response.is_valid_detection is False

    assert response.container is None

    assert response.explanation is None

    assert response.recommendation is None

    mock_recommendation.assert_not_called()

    mock_history.assert_not_called()


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
    # el historial, aunque YOLO esté muy seguro de la detección.
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

    assert response.container is None

    mock_recommendation.assert_not_called()

    mock_history.assert_not_called()


@patch(
    "app.modules.visual_processing.service.VisualProcessingService.detect"
)

@patch(
    "app.modules.recommendation.service.RecommendationService.generate"
)

@patch(
    "app.modules.history.service.HistoryService.create"
)

def test_analysis_unknown_detection_is_not_valid(

    mock_history,

    mock_recommendation,

    mock_detection

):

    # Detector.detect devuelve este valor cuando YOLO no encuentra ninguna
    # caja en la imagen (ver modules/visual_processing/detector.py).
    mock_detection.return_value = {

        "detected_object": "Unknown",

        "confidence": 0.0

    }

    db = MagicMock()

    response = AnalysisService.analyze(

        db,

        b"image"

    )

    assert response.is_valid_detection is False

    mock_recommendation.assert_not_called()

    mock_history.assert_not_called()
