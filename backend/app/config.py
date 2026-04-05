"""
Configuration module for the Resume Builder backend.
Loads environment variables and provides settings for the entire application.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    All sensitive values (API keys, secrets) come from .env file,
    never hardcoded in the codebase.
    """
    
    # MongoDB Configuration
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "resume_builder"
    
    # JWT Authentication
    SECRET_KEY: str = "default-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Google Gemini API
    GEMINI_API_KEY: str = ""
    
    # CORS - allowed frontend URLs
    FRONTEND_URL: str = "http://localhost:5173"
    
    @property
    def mongodb_url(self) -> str:
        return self.MONGODB_URL
    
    @property
    def database_name(self) -> str:
        return self.DATABASE_NAME
    
    @property
    def secret_key(self) -> str:
        return self.SECRET_KEY
    
    @property
    def algorithm(self) -> str:
        return self.ALGORITHM
    
    @property
    def access_token_expire_minutes(self) -> int:
        return self.ACCESS_TOKEN_EXPIRE_MINUTES
    
    @property
    def gemini_api_key(self) -> str:
        return self.GEMINI_API_KEY
    
    @property
    def frontend_url(self) -> str:
        return self.FRONTEND_URL
    
    class Config:
        # Load from .env file
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Allow case-insensitive variable names
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    Returns cached settings instance.
    
    Using lru_cache ensures we only read the .env file once,
    improving performance for repeated calls.
    """
    return Settings()
