import cv2


def draw_faces(image, detections):

    img = image.copy()

    for face in detections:

        b = face["box"]

        cv2.rectangle(
            img,
            (int(b["x1"]), int(b["y1"])),
            (int(b["x2"]), int(b["y2"])),
            (0, 0, 255),
            2,
        )

        for p in face["landmarks"]:

            cv2.circle(
                img,
                (int(p["x"]), int(p["y"])),
                3,
                (0, 255, 0),
                -1,
            )

    cv2.imwrite("result.jpg", img)

    print("Saved result.jpg")