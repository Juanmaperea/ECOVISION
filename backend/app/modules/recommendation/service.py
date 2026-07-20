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

        response = GeminiClient.ask(prompt)
        data = json.loads(response["text"])
        usage = response["usage"]
        response2 = GeminiClient.ask_with_metadata(
            prompt
        )

        answer = response2.text


        print("\n========== RESPUESTA GEMINI ==========")
        print(data)
        print("======================================\n")

        prompt_tokens = usage.prompt_token_count
        completion_tokens = usage.candidates_token_count
        total_tokens = usage.total_token_count
        # Precio oficial Gemini 2.5 Flash (USD por millón de tokens)
        INPUT_COST_PER_MILLION = 0.30
        OUTPUT_COST_PER_MILLION = 2.50

        api_cost = round(
            (prompt_tokens / 1_000_000) * INPUT_COST_PER_MILLION +
            (completion_tokens / 1_000_000) * OUTPUT_COST_PER_MILLION,
            8
        )

        recommendation = RecommendationResponse(
            detected_object=request.detected_object,
            confidence=request.confidence,
            container=data["container"],
            explanation=data["explanation"],
            recommendation=data["recommendation"],
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            api_cost=api_cost
        )
        return recommendation, response2.usage_metadata

