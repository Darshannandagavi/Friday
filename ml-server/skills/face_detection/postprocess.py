def iou(a, b):

    x1 = max(a["x1"], b["x1"])
    y1 = max(a["y1"], b["y1"])
    x2 = min(a["x2"], b["x2"])
    y2 = min(a["y2"], b["y2"])

    inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)

    area_a = (a["x2"] - a["x1"]) * (a["y2"] - a["y1"])
    area_b = (b["x2"] - b["x1"]) * (b["y2"] - b["y1"])

    union = area_a + area_b - inter

    if union <= 0:
        return 0

    return inter / union


def non_max_suppression(detections, threshold=0.45):

    detections = sorted(
        detections,
        key=lambda x: x["score"],
        reverse=True
    )

    result = []

    while detections:

        best = detections.pop(0)

        result.append(best)

        detections = [
            d
            for d in detections
            if iou(best["box"], d["box"]) < threshold
        ]

    return result