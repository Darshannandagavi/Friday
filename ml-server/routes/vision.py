from flask import Blueprint, jsonify
from flask import request
vision_bp = Blueprint("vision", __name__, url_prefix="/vision")


@vision_bp.route("/face", methods=["POST"])
def detect_face():
    return jsonify({
        "message": "Face detector not implemented yet"
    })


@vision_bp.route("/emotion", methods=["POST"])
def detect_emotion():
    return jsonify({
        "message": "Emotion detector not implemented yet"
    })
    


from services.face_service import detect_face

vision_bp = Blueprint(
    "vision",
    __name__,
    url_prefix="/vision"
)


@vision_bp.route("/face", methods=["POST"])
def face():

    file = request.files["image"]

    result = detect_face(file.read())

    return jsonify(result)