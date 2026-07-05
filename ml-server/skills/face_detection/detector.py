import os
import onnxruntime as ort

from .preprocess import preprocess
from .decoder import decode_scrfd
from .postprocess import non_max_suppression

MODEL = os.path.join(
    os.path.dirname(__file__),
    "model",
    "scrfd_500m_bnkps.onnx"
)

session = ort.InferenceSession(
    MODEL,
    providers=["CPUExecutionProvider"]
)

print("SCRFD Loaded")


def inference(image):
    tensor, width, height, scale = preprocess(image)

    outputs = session.run(
        None,
        {session.get_inputs()[0].name: tensor}
    )

    detections = decode_scrfd(outputs, width, height, scale)
    detections = non_max_suppression(detections)

    return detections, width, height