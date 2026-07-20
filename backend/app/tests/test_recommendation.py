from unittest.mock import patch, MagicMock
import json

from app.schemas.recommendation import RecommendationRequest
from app.modules.recommendation.service import RecommendationService


@patch(
    "app.modules.recommendation.gemini_client.GeminiClient.ask_with_metadata"
)
def test_recommendation(mock_gemini):

    response = MagicMock()

    response.text = json.dumps({
        "container": "Blanco",
        "explanation": "Plástico reciclable",
        "recommendation": "Vaciar la botella"
    })

    response.usage_metadata = MagicMock(
        prompt_token_count=100,
        candidates_token_count=50
    )

    mock_gemini.return_value = response

    request = RecommendationRequest(
        detected_object="Bottle",
        confidence=0.96
    )

    recommendation, usage_metadata = RecommendationService.generate(request)

    assert recommendation.container == "Blanco"
    assert recommendation.detected_object == "Bottle"
    assert recommendation.explanation == "Plástico reciclable"
    assert recommendation.recommendation == "Vaciar la botella"

    assert usage_metadata == response.usage_metadata