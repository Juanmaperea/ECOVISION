from fastapi import APIRouter

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse
)

from app.modules.recommendation.service import (
    RecommendationService
)

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"]
)


@router.post(
    "",
    response_model=RecommendationResponse
)
def recommendation(
    request: RecommendationRequest
):

    return RecommendationService.generate(
        request
    )