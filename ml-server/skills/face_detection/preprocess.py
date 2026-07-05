import cv2
import numpy as np

INPUT_SIZE = 640


def preprocess(image):
    h, w = image.shape[:2]

    # Preserve aspect ratio — resize so the longer side = INPUT_SIZE
    scale = INPUT_SIZE / max(h, w)
    new_w = int(round(w * scale))
    new_h = int(round(h * scale))

    resized = cv2.resize(image, (new_w, new_h))

    # Pad onto a black 640x640 canvas (top-left aligned, no centering needed)
    canvas = np.zeros((INPUT_SIZE, INPUT_SIZE, 3), dtype=np.uint8)
    canvas[:new_h, :new_w] = resized

    rgb = cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB)
    rgb = rgb.astype(np.float32) / 255.0

    tensor = np.transpose(rgb, (2, 0, 1))
    tensor = np.expand_dims(tensor, axis=0)

    return tensor, w, h, scale