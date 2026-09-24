from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    database_url: str = "postgresql+psycopg://sparkwave:sparkwave@localhost:5432/sparkwave"

    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 720
    cookie_name: str = "sw_session"
    csrf_cookie_name: str = "sw_csrf"
    cookie_secure: bool = False
    cookie_domain: str | None = None

    cors_origins: str = "http://localhost:3000"

    admin_email: str = "admin@sparkwave.dev"
    admin_password: str = "change-me-now"

    frontend_url: str = "http://localhost:3000"
    revalidate_secret: str = ""

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "SparkWave Digital Systems <connect@sparkwave.dev>"
    admin_notify_email: str = "connect@sparkwave.dev"

    storage_backend: str = "local"  # local | cloudinary | s3
    upload_dir: str = "uploads"
    max_upload_mb: int = 15
    cloudinary_url: str = ""
    s3_bucket: str = ""
    s3_region: str = ""
    s3_public_base_url: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

if settings.is_production and settings.jwt_secret == "dev-secret-change-me":
    raise RuntimeError("JWT_SECRET must be set in production")
