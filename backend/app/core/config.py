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

    LOG_LEVEL: str

    class Config:
        env_file = ".env"


settings = Settings()