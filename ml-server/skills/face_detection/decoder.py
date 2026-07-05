import numpy as np

STRIDES = [8, 16, 32]
NUM_ANCHORS = 2
INPUT_SIZE = 640

anchor_cache = {}


def generate_anchors(stride):

    if stride in anchor_cache:
        return anchor_cache[stride]

    feature_size = INPUT_SIZE // stride

    anchors = []

    for y in range(feature_size):
        for x in range(feature_size):

            cx = x * stride
            cy = y * stride

            for _ in range(NUM_ANCHORS):

                anchors.append({
                    "x": cx,
                    "y": cy
                })

    anchor_cache[stride] = anchors

    return anchors


def decode_box(anchor, bbox, stride):
    left = bbox[0] * stride
    top = bbox[1] * stride
    right = bbox[2] * stride
    bottom = bbox[3] * stride

    return {
        "x1": float(anchor["x"] - left),
        "y1": float(anchor["y"] - top),
        "x2": float(anchor["x"] + right),
        "y2": float(anchor["y"] + bottom),
        "width": float(left + right),
        "height": float(top + bottom),
    }


def decode_landmarks(anchor, kps, stride):
    landmarks = []
    for i in range(5):
        landmarks.append({
            "x": float(anchor["x"] + kps[i * 2] * stride),
            "y": float(anchor["y"] + kps[i * 2 + 1] * stride),
        })
    return landmarks


def decode_scrfd(outputs, original_width, original_height, scale, threshold=0.5):
    output_map = {
        "score_8": outputs[0],
        "score_16": outputs[1],
        "score_32": outputs[2],
        "bbox_8": outputs[3],
        "bbox_16": outputs[4],
        "bbox_32": outputs[5],
        "kps_8": outputs[6],
        "kps_16": outputs[7],
        "kps_32": outputs[8],
    }

    detections = []

    for stride in STRIDES:
        scores = output_map[f"score_{stride}"].reshape(-1)
        boxes = output_map[f"bbox_{stride}"].reshape(-1, 4)
        kps = output_map[f"kps_{stride}"].reshape(-1, 10)

        anchors = generate_anchors(stride)

        for i in range(len(scores)):
            score = float(scores[i])
            if score < threshold:
                continue

            box = decode_box(anchors[i], boxes[i], stride)
            landmarks = decode_landmarks(anchors[i], kps[i], stride)

            # Undo the letterbox scale (single uniform factor — no distortion)
            box["x1"] /= scale
            box["x2"] /= scale
            box["width"] /= scale
            box["y1"] /= scale
            box["y2"] /= scale
            box["height"] /= scale

            for p in landmarks:
                p["x"] /= scale
                p["y"] /= scale

            # Clamp to original image bounds
            box["x1"] = max(0, min(box["x1"], original_width))
            box["x2"] = max(0, min(box["x2"], original_width))
            box["y1"] = max(0, min(box["y1"], original_height))
            box["y2"] = max(0, min(box["y2"], original_height))

            detections.append({
                "score": score,
                "box": box,
                "landmarks": landmarks,
            })

    return detections