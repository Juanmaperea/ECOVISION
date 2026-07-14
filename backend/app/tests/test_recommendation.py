from unittest.mock import patch
import json

from app.schemas.recommendation import RecommendationRequest
from app.modules.recommendation.service import RecommendationService


@patch(
    "app.modules.recommendation.gemini_client.GeminiClient.ask"
)
def test_recommendation(mock_gemini):

    mock_gemini.return_value = json.dumps({

        "container": "Blanco",

        "explanation": "Plástico reciclable",

        "recommendation": "Vaciar la botella"

    })

    request = RecommendationRequest(

        detected_object="Bottle",

        confidence=0.96

    )

    response = RecommendationService.generate(request)

    assert response.container == "Blanco"
    assert response.detected_object == "Bottle"
    assert response.explanation == "Plástico reciclable"
    assert response.recommendation == "Vaciar la botella"