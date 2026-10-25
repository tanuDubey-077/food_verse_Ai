import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "FoodVerse AI"
    PROJECT_SUBTITLE: str = "Multimodal Food Intelligence Agent"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = (
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,"
        "https://foodverse-frontend.onrender.com,https://foodverseai-1.onrender.com"
    )

    @field_validator("ALLOWED_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Database & Storage
    DATABASE_URL: str = "sqlite:///./data/foodverse.db"
    UPLOAD_DIR: str = "./data/uploads"
    MAX_UPLOAD_SIZE_MB: int = 50

    # Primary Multimodal Gemini AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # AI Providers ('gemini' is primary multimodal provider)
    LLM_PROVIDER: str = "gemini"
    LLM_MODEL: str = "gemini-2.5-flash"
    LLM_API_KEY: str = ""

    VISION_PROVIDER: str = "gemini"
    VISION_MODEL: str = "gemini-2.5-flash"
    VISION_API_KEY: str = ""

    NUTRITION_PROVIDER: str = "local"
    NUTRITION_API_KEY: str = ""

    def get_gemini_api_key(self) -> str:
        """Returns configured Gemini API key from environment or config, prioritizing GEMINI_API_KEY."""
        key = (
            self.GEMINI_API_KEY
            or os.environ.get("GEMINI_API_KEY", "")
            or os.environ.get("GOOGLE_API_KEY", "")
            or self.VISION_API_KEY
            or self.LLM_API_KEY
            or ""
        )
        return key.strip()

    def is_gemini_configured(self) -> bool:
        """Checks if a Gemini API key is configured."""
        return bool(self.get_gemini_api_key())

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.DATABASE_URL.replace("sqlite:///", "")), exist_ok=True)
