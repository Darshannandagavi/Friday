// Normalizes whatever the client sends (base64 string or raw Buffer) into
// a Buffer that ml/pipeline.js can process. No capture/hardware logic here —
// frames are pushed in via the API.

export function toImageBuffer(frameData) {
  if (Buffer.isBuffer(frameData)) return frameData;

  if (typeof frameData === "string") {
    const base64 = frameData.includes(",")
      ? frameData.split(",")[1]
      : frameData;

    return Buffer.from(base64, "base64");
  }

  throw new Error("Unsupported frame format");
}