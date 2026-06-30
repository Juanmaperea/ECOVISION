from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "EcoVision AI"
    app_env: str = "development"
    cors_origins: list[str] = ["http://localhost:5173"]
    yolo_model_path: str = "backend/models/yolov8n.pt"
    detection_confidence_threshold: float = 0.50
    frame_process_interval_ms: int = 1000
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    store_images: bool = False
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
