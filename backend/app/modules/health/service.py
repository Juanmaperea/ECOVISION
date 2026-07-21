from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.core.logger import logger


class HealthService:

    @staticmethod
    def get_status():
        return {
            "status": "ok",
            "app_name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.APP_ENV,
        }

    @staticmethod
    def get_database_status():
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))

            return {
                "service": "postgresql",
                "status": "active",
                "message": "Conexión con PostgreSQL establecida",
            }

        except Exception:
            logger.exception(
                "No fue posible verificar la conexión con PostgreSQL"
            )

            return {
                "service": "postgresql",
                "status": "inactive",
                "message": "No fue posible conectar con PostgreSQL",
            }

    @staticmethod
    def get_gemini_status():
        # Debe reemplazarse por una comprobación del cliente Gemini
        # que ya utiliza el módulo de recomendaciones.
        if not settings.GEMINI_API_KEY:
            return {
                "service": "gemini",
                "status": "inactive",
                "message": "GEMINI_API_KEY no está configurada",
            }

        return {
            "service": "gemini",
            "status": "configured",
            "message": "La clave de Gemini está configurada",
        }