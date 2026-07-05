import * as ort from "onnxruntime-node";
import path from "path";

let session;

export async function loadModel() {
  if (session) return session;

  session = await ort.InferenceSession.create(
    path.join(
      process.cwd(),
      "ml",
      "faceDetection",
      "model",
      "scrfd_500m_bnkps.onnx"
    ),
    {
      executionProviders: ["cpu"]
    }
  );

  console.log("✅ SCRFD Loaded");

  return session;
}

export async function runInference(tensor) {
  const model = await loadModel();

  const outputs = await model.run({
    "input.1": tensor
  });

  return outputs;
}