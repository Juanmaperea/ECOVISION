from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.core.logger import logger


class HealthService:

    @staticmethod
    def get_status():
        return {
            "application": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.APP_ENV,
            "status": "ok",
        }

    @staticmethod
    def get_detailed_status():
        database_status = {
            "status": "down",
            "detail": "No fue posible conectar con PostgreSQL.",
        }

        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))

            database_status = {
                "status": "ok",
                "detail": "Conexión con PostgreSQL establecida.",
            }

        except Exception as exc:
            logger.error(
                "Error comprobando PostgreSQL: %s",
                exc,
                exc_info=True,
            )

        yolo_configured = bool(settings.YOLO_MODEL)

        yolo_status = {
            "status": "ok" if yolo_configured else "down",
            "detail": (
                f"Modelo configurado: {settings.YOLO_MODEL}"
                if yolo_configured
                else "No se configuró el modelo YOLO."
            ),
        }

        gemini_configured = bool(settings.GEMINI_API_KEY)

        gemini_status = {
            "status": "ok" if gemini_configured else "down",
            "detail": (
                "La clave de Gemini está configurada."
                if gemini_configured
                else "GEMINI_API_KEY no está configurada."
            ),
        }

        return {
            "status": "ok",
            "yolo": yolo_status,
            "gemini": gemini_status,
            "database": database_status,
        }