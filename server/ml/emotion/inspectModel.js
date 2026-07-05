import * as ort from "onnxruntime-node";
import path from "path";

const session = await ort.InferenceSession.create(
    path.join(
        process.cwd(),
        "ml",
        "emotion",
        "model",
        "emotion-ferplus-12-int8.onnx"
    )
);

console.log(session.inputNames);
console.log(session.outputNames);

console.log(session.inputMetadata);
console.log(session.outputMetadata);