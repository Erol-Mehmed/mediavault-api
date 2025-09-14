import os
from dotenv import load_dotenv
from typing import Final

load_dotenv()


class Config:
    DB_NAME: Final[str] = os.getenv("DB_NAME")
    DB_USER: Final[str] = os.getenv("DB_USER")
    DB_PASSWORD: Final[str] = os.getenv("DB_PASSWORD")
    DB_HOST: Final[str] = os.getenv("DB_HOST")
    DB_PORT: Final[str] = os.getenv("DB_PORT")

    FLASK_ENV: Final[str] = os.getenv("FLASK_ENV")
    SECRET_KEY: Final[str] = os.getenv("SECRET_KEY")


@property
def database_url(self) -> str:
    """Return database connection URL."""
    return (
        f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
        f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    )
