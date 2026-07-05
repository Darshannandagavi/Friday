function iou(a, b) {

  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);

  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);

  const inter =
    Math.max(0, x2 - x1) *
    Math.max(0, y2 - y1);

  const areaA =
    (a.x2 - a.x1) *
    (a.y2 - a.y1);

  const areaB =
    (b.x2 - b.x1) *
    (b.y2 - b.y1);

  return inter / (areaA + areaB - inter);
}

export function nonMaxSuppression(
  detections,
  threshold = 0.45
) {
  detections.sort((a, b) => b.score - a.score);

  const result = [];

  while (detections.length) {

    const best = detections.shift();

    result.push(best);

    detections = detections.filter(
      d => iou(best.box, d.box) < threshold
    );
  }

  return result;
}