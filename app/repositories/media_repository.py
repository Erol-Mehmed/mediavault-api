from typing import List, Optional
from app.database.connection import get_db_connection
from app.models.media import Media


class MediaRepository:
    def get_all(self) -> List[Media]:
        """
        Fetch all media records from the database.
        """
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, title, type, release_year FROM media")
            rows = cursor.fetchall()

        return [
            Media(
                id=row[0],
                title=row[1],
                type=row[2],
                release_year=row[3],
            )
            for row in rows
        ]
