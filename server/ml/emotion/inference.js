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

console.log("✅ Emotion model loaded");

export async function runEmotion(tensor) {

    return session.run({
        Input3: tensor
    });

}