const STRIDES = [8, 16, 32];
const NUM_ANCHORS = 2;
const INPUT_SIZE = 640;

const anchorCache = {};

function generateAnchors(stride) {
  if (anchorCache[stride]) return anchorCache[stride];

  const featureSize = INPUT_SIZE / stride;

  const anchors = [];

  for (let y = 0; y < featureSize; y++) {
    for (let x = 0; x < featureSize; x++) {
      const cx = (x + 0.5) * stride;
      const cy = (y + 0.5) * stride;

      // SCRFD 2-anchor model
      for (let a = 0; a < NUM_ANCHORS; a++) {
        anchors.push({
          x: cx,
          y: cy,
        });
      }
    }
  }

  anchorCache[stride] = anchors;
  return anchors;
}

function decodeBox(anchor, bbox, stride) {
  const left = bbox[0] * stride;
  const top = bbox[1] * stride;
  const right = bbox[2] * stride;
  const bottom = bbox[3] * stride;

  return {
    x1: anchor.x - left,
    y1: anchor.y - top,
    x2: anchor.x + right,
    y2: anchor.y + bottom,
    width: left + right,
    height: top + bottom,
  };
}

function decodeLandmarks(anchor, kps, stride) {
  const landmarks = [];

  for (let i = 0; i < 5; i++) {
    landmarks.push({
      x: anchor.x + kps[i * 2] * stride,
      y: anchor.y + kps[i * 2 + 1] * stride,
    });
  }

  return landmarks;
}

export function decodeSCRFD(outputs, threshold = 0.5) {
  const detections = [];

  for (const stride of STRIDES) {
    const scores = outputs[`score_${stride}`].data;
    const boxes = outputs[`bbox_${stride}`].data;
    const kps = outputs[`kps_${stride}`].data;

    const anchors = generateAnchors(stride);

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];

      if (score < threshold) continue;

      const box = decodeBox(
        anchors[i],
        boxes.subarray(i * 4, i * 4 + 4),
        stride
      );

      const landmarks = decodeLandmarks(
        anchors[i],
        kps.subarray(i * 10, i * 10 + 10),
        stride
      );

      detections.push({
        score,
        box,
        landmarks,
      });
    }
  }

  return detections;
}