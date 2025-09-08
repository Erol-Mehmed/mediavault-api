from flask import Flask
from app.config.config import Config
from .routes.media_routes import media_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register blueprints
    app.register_blueprint(media_bp, url_prefix="/media")

    return app
