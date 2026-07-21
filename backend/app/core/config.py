from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    APP_ENV: str

    HOST: str
    PORT: int

    DATABASE_URL: str

    GEMINI_API_KEY: str
    YOLO_MODEL: str
    LOG_LEVEL: str

    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()