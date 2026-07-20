from app.modules.recommendation.prompt_builder import PromptBuilder
from app.modules.recommendation.gemini_client import GeminiClient

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse
)

import json


class RecommendationService:

    @staticmethod
    def generate(
        request: RecommendationRequest
    ):

        prompt = PromptBuilder.build(
            request.detected_object,
            request.confidence
        )

        response = GeminiClient.ask_with_metadata(
            prompt
        )

        answer = response.text

        print("\n========== RESPUESTA GEMINI ==========")
        print(answer)
        print("======================================\n")

        data = json.loads(answer)

        recommendation = RecommendationResponse(
            detected_object=request.detected_object,
            confidence=request.confidence,
            container=data["container"],
            explanation=data["explanation"],
            recommendation=data["recommendation"]
        )

        return recommendation, response.usage_metadata