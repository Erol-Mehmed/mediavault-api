import psycopg2
from psycopg2.extensions import connection as _connection
from app.config.config import Config
from typing import Optional, cast

_connection_instance: Optional[_connection] = None


def get_db_connection() -> _connection:
    """
    Returns a singleton PostgreSQL connection.
    Creates a new one if not already connected.
    """
    global _connection_instance

    if _connection_instance is None or _connection_instance.closed != 0:
        _connection_instance = psycopg2.connect(
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
        )

    return cast(_connection, _connection_instance)
