from flask import Blueprint, jsonify
from app.controllers.media_controller import MediaController

media_bp = Blueprint("media", __name__)
controller = MediaController()


@media_bp.route("/", methods=["GET"])
def get_media():
    return jsonify(controller.get_all_media())
