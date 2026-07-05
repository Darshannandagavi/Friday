import cv2

from skills.face_detection.detector import inference
from skills.face_detection.draw import draw_faces

image = cv2.imread("sad.jpg")

faces, width, height = inference(image)

print(faces)

draw_faces(image, faces)