import sharp from "sharp";

export async function cropFace(imageBuffer, face) {
  return sharp(imageBuffer)
    .extract({
      left: Math.round(face.box.x1),
      top: Math.round(face.box.y1),
      width: Math.round(face.box.width),
      height: Math.round(face.box.height),
    })
    .jpeg()
    .toBuffer();
}