from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str
    APP_VERSION: str
    APP_ENV: str

    HOST: str
    PORT: int

    DATABASE_URL: str


    GEMINI_API_KEY: str

    YOLO_MODEL: str
    
    FRONTEND_URL: str = "http://localhost:5173"

    LOG_LEVEL: str

    class Config:
        env_file = ".env"


settings = Settings()