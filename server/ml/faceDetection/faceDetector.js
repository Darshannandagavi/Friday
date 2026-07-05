import { preprocess } from "./preprocess.js";
import { runInference } from "./inference.js";
import { decodeSCRFD } from "./decoder.js";
import { nonMaxSuppression } from "./postprocess.js";

export async function detectFaces(imageBuffer) {

  const {
    tensor,
    scale,
    padX,
    padY,
    originalWidth,
    originalHeight
  } = await preprocess(imageBuffer);

  const outputs = await runInference(tensor);

  let detections = decodeSCRFD(outputs);

  detections = nonMaxSuppression(detections);

  for (const face of detections) {

    face.box.x1 = (face.box.x1 - padX) / scale;
    face.box.y1 = (face.box.y1 - padY) / scale;

    face.box.x2 = (face.box.x2 - padX) / scale;
    face.box.y2 = (face.box.y2 - padY) / scale;

    face.box.x1 = Math.max(0, Math.min(face.box.x1, originalWidth));
    face.box.y1 = Math.max(0, Math.min(face.box.y1, originalHeight));

    face.box.x2 = Math.max(0, Math.min(face.box.x2, originalWidth));
    face.box.y2 = Math.max(0, Math.min(face.box.y2, originalHeight));

    face.box.width = face.box.x2 - face.box.x1;
    face.box.height = face.box.y2 - face.box.y1;

    for (const point of face.landmarks) {

      point.x = (point.x - padX) / scale;
      point.y = (point.y - padY) / scale;
    }
  }

  return detections;
}