import os
from dotenv import load_dotenv
from typing import Final

load_dotenv()


class Config:
    SECRET_KEY: Final[str] = os.getenv("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI: Final[str] = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
        f"@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', 5432)}"
        f"/{os.getenv('DB_NAME')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: Final[bool] = False
