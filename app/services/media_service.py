from app.models.media_model import MediaModel


class MediaService:
    def __init__(self):
        self.media_model = MediaModel()

    def fetch_all_media(self):
        return self.media_model.get_all_media()
