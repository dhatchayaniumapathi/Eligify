from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend directory
BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """
    Core application settings.
    Automatically reads values from backend/.env
    """

    # Project Info
    PROJECT_NAME: str = "Eligify Backend"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Uploads
    UPLOAD_DIRECTORY: str = "uploads"

    # Always load backend/.env irrespective of current working directory
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()