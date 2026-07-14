from fastapi import FastAPI

from app.core.config import settings

from app.core.lifespan import lifespan

from app.modules.health.router import router as health_router

from app.modules.history.router import router as history_router

from app.modules.visual_processing.router import (
    router as visual_router
)

from app.modules.recommendation.router import (
    router as recommendation_router
)

from app.modules.analysis.router import (
    router as analysis_router
)

from app.core.logging_config import configure_logging

from app.core.exceptions import (
    value_error_handler,
    generic_error_handler
)

configure_logging()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

app.include_router(
    health_router,
    prefix="/api/v1"
)

app.include_router(
    history_router,
    prefix="/api/v1"
)

app.include_router(

    visual_router,

    prefix="/api/v1"

)

app.include_router(
    recommendation_router,
    prefix="/api/v1"
)

app.include_router(
    analysis_router,
    prefix="/api/v1"
)

app.add_exception_handler(
    ValueError,
    value_error_handler
)

app.add_exception_handler(
    Exception,
    generic_error_handler
)