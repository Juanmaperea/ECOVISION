from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.database import Base, engine
from app.core.logger import logger
from app.core.wait_for_db import wait_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("===================================")
    logger.info("Iniciando EcoVision API")
    logger.info("===================================")

    try:
        # Usa await solamente si wait_database está declarada con async def.
        wait_database()

        logger.info("Conexión con PostgreSQL establecida")

        # Crear las tablas después de comprobar que la BD responde.
        Base.metadata.create_all(bind=engine)

        logger.info("Tablas de base de datos verificadas")
        logger.info("EcoVision API iniciada correctamente")

        yield

    finally:
        engine.dispose()

        logger.info("===================================")
        logger.info("EcoVision API detenida")
        logger.info("===================================")