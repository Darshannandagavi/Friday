import * as ort from "onnxruntime-node";
import path from "path";

const modelPath = path.resolve(
  "./ml/faceDetection/model/scrfd_500m_bnkps.onnx"
);

async function inspect() {
  const session = await ort.InferenceSession.create(modelPath);

  console.log("\n=== INPUTS ===");
  console.log(session.inputNames);

  console.log("\n=== OUTPUTS ===");
  console.log(session.outputNames);

  console.log("\n=== INPUT METADATA ===");
  console.log(session.inputMetadata);

  console.log("\n=== OUTPUT METADATA ===");
  console.log(session.outputMetadata);
}

inspect();