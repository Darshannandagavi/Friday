import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import cv2

print("Step 1: imports starting")

from skills.face_detection.detector import inference as detect_faces
from skills.face_detection.draw import draw_faces
from skills.emotion.detector import inference as detect_emotion

print("Step 2: imports done")

image = cv2.imread("surprise4.jpg")
print("Step 3: image loaded:", image is not None)

faces, width, height = detect_faces(image)
print("Step 4: faces detected:", len(faces))

for face in faces:
    emotion = detect_emotion(image, face["box"])

    if emotion:
        face["emotion"] = emotion["label"]
        face["emotion_confidence"] = emotion["confidence"]

        print(
            f"Face @ ({int(face['box']['x1'])}, {int(face['box']['y1'])}) "
            f"-> {emotion['label']} ({emotion['confidence']:.2f})"
        )
    else:
        print("Face detected but emotion crop failed (empty region)")

draw_faces(image, faces)
print("Step 5: done")