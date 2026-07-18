@patch(
    "app.modules.visual_processing.service.VisualProcessingService.detect"
)
@patch(
    "app.modules.recommendation.service.RecommendationService.generate"
)
@patch(
    "app.modules.history.service.HistoryService.create"
)
def test_analysis_unrecognized_class_generates_recommendation(

    mock_history,

    mock_recommendation,

    mock_detection

):

    mock_detection.return_value = {
        "detected_object": "person",
        "confidence": 0.95
    }

    recommendation = MagicMock()
    recommendation.detected_object = "person"
    recommendation.confidence = 0.95
    recommendation.container = "No aplica"
    recommendation.explanation = "No es un residuo reconocido"
    recommendation.recommendation = "Sin recomendación"

    mock_recommendation.return_value = recommendation

    db = MagicMock()

    response = AnalysisService.analyze(
        db,
        b"image"
    )

    assert response.is_valid_detection is True
    assert response.detected_object == "person"
    assert response.container == "No aplica"
    assert response.explanation == "No es un residuo reconocido"
    assert response.recommendation == "Sin recomendación"

    mock_recommendation.assert_called_once()
    mock_history.assert_called_once()