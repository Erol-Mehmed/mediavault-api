import os
import psycopg2

class MediaModel:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
        )
        self.cursor = self.conn.cursor()

    def get_all_media(self):
        self.cursor.execute("SELECT id, title, type FROM media")
        return self.cursor.fetchall()