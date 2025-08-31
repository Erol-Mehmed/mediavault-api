import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")

    FLASK_ENV = os.getenv("FLASK_ENV")
    SECRET_KEY = os.getenv("SECRET_KEY")

    @staticmethod
    def get_db_uri():
        return f"postgresql://{Config.DB_USER}:{Config.DB_PASSWORD}" \
               f"@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}"