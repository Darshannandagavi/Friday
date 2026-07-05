import os
import onnxruntime as ort

from .preprocess import preprocess
from .postprocess import decode_emotion

MODEL = os.path.join(
    os.path.dirname(__file__),
    "model",
    "emotion-ferplus.onnx"
)

session = ort.InferenceSession(
    MODEL,
    providers=["CPUExecutionProvider"]
)

print("Emotion Model Loaded")


def inference(image, box):
    tensor = preprocess(image, box)

    if tensor is None:
        return None

    outputs = session.run(
        None,
        {session.get_inputs()[0].name: tensor}
    )

    result = decode_emotion(outputs[0])

    return result