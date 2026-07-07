from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.logger import logger

from app.core.wait_for_db import wait_database


@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("===================================")
    logger.info("EcoVision API iniciada")
    logger.info("===================================")

    wait_database()

    yield

    logger.info("===================================")
    logger.info("EcoVision API detenida")
    logger.info("===================================")