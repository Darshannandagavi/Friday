import time
import threading

import cv2
from flask import Blueprint, jsonify, Response

from skills.face_detection.detector import inference as detect_faces
from skills.emotion.detector import inference as detect_emotion

live_vision_bp = Blueprint("live_vision", __name__)


class LiveVisionWorker:
    def __init__(self, camera_index=0):
        self.camera_index = camera_index
        self.cap = None
        self.thread = None
        self.running = False
        self.lock = threading.Lock()
        self.latest_result = {"faces": [], "timestamp": None}
        self.latest_frame = None

    def start(self):
        with self.lock:
            if self.running:
                return False

            # CAP_DSHOW avoids slow camera init on Windows
            self.cap = cv2.VideoCapture(self.camera_index, cv2.CAP_DSHOW)

            if not self.cap.isOpened():
                self.cap = None
                raise RuntimeError(f"Cannot open camera index {self.camera_index}")

            self.running = True
            self.thread = threading.Thread(target=self._run, daemon=True)
            self.thread.start()

        return True

    def stop(self):
        with self.lock:
            self.running = False

        if self.thread is not None:
            self.thread.join(timeout=2)

        if self.cap is not None:
            self.cap.release()
            self.cap = None

    def _run(self):
        while True:
            with self.lock:
                if not self.running:
                    break

            ret, frame = self.cap.read()

            if not ret:
                time.sleep(0.05)
                continue

            try:
                faces, width, height = detect_faces(frame)
            except Exception as e:
                faces = []
                print("Face detection error:", e)

            results = []
            annotated = frame.copy()

            for face in faces:
                box = face["box"]

                emotion = None
                try:
                    emotion = detect_emotion(frame, box)
                except Exception as e:
                    print("Emotion detection error:", e)

                results.append({
                    "box": box,
                    "landmarks": face.get("landmarks", []),
                    "score": face.get("score"),
                    "emotion": emotion["label"] if emotion else None,
                    "confidence": emotion["confidence"] if emotion else None,
                })

                x1, y1, x2, y2 = int(box["x1"]), int(box["y1"]), int(box["x2"]), int(box["y2"])
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 2)

                for p in face.get("landmarks", []):
                    cv2.circle(annotated, (int(p["x"]), int(p["y"])), 3, (0, 255, 0), -1)

                if emotion:
                    label_text = f"{emotion['label']} {emotion['confidence']:.2f}"
                    cv2.putText(
                        annotated,
                        label_text,
                        (x1, max(0, y1 - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        (255, 255, 0),
                        2,
                    )

            with self.lock:
                self.latest_result = {
                    "faces": results,
                    "timestamp": time.time(),
                }
                self.latest_frame = annotated

            time.sleep(0.03)  # cap ~30fps, raise this if CPU is struggling

    def get_result(self):
        with self.lock:
            return self.latest_result

    def get_frame(self):
        with self.lock:
            return None if self.latest_frame is None else self.latest_frame.copy()


worker = LiveVisionWorker()


@live_vision_bp.route("/vision/start", methods=["POST"])
def start_vision():
    try:
        started = worker.start()
    except RuntimeError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    if not started:
        return jsonify({"status": "already_running"}), 200

    return jsonify({"status": "started"}), 200


@live_vision_bp.route("/vision/stop", methods=["POST"])
def stop_vision():
    worker.stop()
    return jsonify({"status": "stopped"}), 200


@live_vision_bp.route("/vision/status", methods=["GET"])
def get_status():
    return jsonify({"running": worker.running}), 200


@live_vision_bp.route("/vision/result", methods=["GET"])
def get_result():
    return jsonify(worker.get_result()), 200


def _mjpeg_generator():
    while True:
        frame = worker.get_frame()

        if frame is None:
            time.sleep(0.05)
            continue

        ok, buffer = cv2.imencode(".jpg", frame)
        if not ok:
            continue

        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
        )


@live_vision_bp.route("/vision/stream")
def video_stream():
    return Response(
        _mjpeg_generator(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )