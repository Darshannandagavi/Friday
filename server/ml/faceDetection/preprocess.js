import sharp from "sharp";
import * as ort from "onnxruntime-node";

const INPUT_SIZE = 640;

export async function preprocess(imageBuffer) {

  const image = sharp(imageBuffer);

  const metadata = await image.metadata();

  const originalWidth = metadata.width;
  const originalHeight = metadata.height;

  const scale = Math.min(
    INPUT_SIZE / originalWidth,
    INPUT_SIZE / originalHeight
  );

  const resizedWidth = Math.round(originalWidth * scale);
  const resizedHeight = Math.round(originalHeight * scale);

  const padX = Math.floor((INPUT_SIZE - resizedWidth) / 2);
  const padY = Math.floor((INPUT_SIZE - resizedHeight) / 2);

  const { data } = await image
    .resize(resizedWidth, resizedHeight)
    .extend({
      top: padY,
      bottom: INPUT_SIZE - resizedHeight - padY,
      left: padX,
      right: INPUT_SIZE - resizedWidth - padX,
      background: { r: 0, g: 0, b: 0 }
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const floatData = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);

  for (let y = 0; y < INPUT_SIZE; y++) {
    for (let x = 0; x < INPUT_SIZE; x++) {

      const pixel = (y * INPUT_SIZE + x) * 3;

      floatData[y * INPUT_SIZE + x] =
        data[pixel] / 255;

      floatData[INPUT_SIZE * INPUT_SIZE + y * INPUT_SIZE + x] =
        data[pixel + 1] / 255;

      floatData[2 * INPUT_SIZE * INPUT_SIZE + y * INPUT_SIZE + x] =
        data[pixel + 2] / 255;
    }
  }

  return {

    tensor: new ort.Tensor(
      "float32",
      floatData,
      [1, 3, INPUT_SIZE, INPUT_SIZE]
    ),

    scale,

    padX,
    padY,

    originalWidth,
    originalHeight
  };
}