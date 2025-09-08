from app.services.media_service import MediaService


class MediaController:
    def __init__(self):
        self.service = MediaService()

    def get_all_media(self):
        return self.service.fetch_all_media()
