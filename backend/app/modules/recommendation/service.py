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
    ) -> RecommendationResponse:

        prompt = PromptBuilder.build(
            request.detected_object,
            request.confidence
        )

        answer = GeminiClient.ask(prompt)

        print("\n========== RESPUESTA GEMINI ==========")
        print(answer)
        print("======================================\n")

        data = json.loads(answer)

        return RecommendationResponse(
            detected_object=request.detected_object,
            confidence=request.confidence,
            container=data["container"],
            explanation=data["explanation"],
            recommendation=data["recommendation"]
        )