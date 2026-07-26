from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Core application settings.
    Automatically reads from environment variables and the .env file.
    """
    
    # Project Info
    PROJECT_NAME: str = "Eligify Backend"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database Settings
    DATABASE_URL: str
    
    # Security and Authentication
    # SECRET_KEY should be a long, random string in the production .env file
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application Specific Settings
    UPLOAD_DIRECTORY: str = "uploads"
    
    # Instruct Pydantic to read environment variables from a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Global singleton instance of the settings to be imported by other modules
settings = Settings()
