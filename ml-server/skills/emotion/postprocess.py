import numpy as np

from .labels import EMOTION_LABELS


def softmax(scores):
    scores = scores - np.max(scores)
    exp = np.exp(scores)
    return exp / np.sum(exp)


def decode_emotion(raw_output):
    scores = raw_output.reshape(-1)
    probs = softmax(scores)

    best_idx = int(np.argmax(probs))

    return {
        "label": EMOTION_LABELS[best_idx],
        "confidence": float(probs[best_idx]),
        "scores": {
            EMOTION_LABELS[i]: float(probs[i])
            for i in range(len(EMOTION_LABELS))
        },
    }