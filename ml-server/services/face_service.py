import cv2
import numpy as np

from skills.face_detection.detector import inference


def detect_face(image_bytes):

    img = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(img, cv2.IMREAD_COLOR)

    outputs, w, h = inference(image)

    return {
        "width": w,
        "height": h
    }