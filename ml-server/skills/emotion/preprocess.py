import cv2
import numpy as np

INPUT_SIZE = 64


def crop_face(image, box, margin=0.2):
    h, w = image.shape[:2]

    x1, y1, x2, y2 = box["x1"], box["y1"], box["x2"], box["y2"]
    bw, bh = x2 - x1, y2 - y1

    # Add a small margin around the face box so chin/forehead aren't clipped
    x1 -= bw * margin
    y1 -= bh * margin
    x2 += bw * margin
    y2 += bh * margin

    x1 = max(0, int(x1))
    y1 = max(0, int(y1))
    x2 = min(w, int(x2))
    y2 = min(h, int(y2))

    return image[y1:y2, x1:x2]


def preprocess(image, box):
    face = crop_face(image, box)

    if face.size == 0:
        return None

    gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (INPUT_SIZE, INPUT_SIZE))

    # FER+ expects raw float32 pixel values, NOT normalized to 0-1
    tensor = resized.astype(np.float32)
    tensor = np.expand_dims(tensor, axis=0)   # channel dim -> (1, 64, 64)
    tensor = np.expand_dims(tensor, axis=0)   # batch dim   -> (1, 1, 64, 64)

    return tensor