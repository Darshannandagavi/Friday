import { detectFaces } from "./faceDetection/faceDetector.js";
import { cropFace } from "./faceDetection/cropFace.js";
import { detectEmotion } from "./emotion/emotionModel.js";

export async function analyzeFrame(imageBuffer) {

    const faces = await detectFaces(imageBuffer);

    const results = [];

    for (const face of faces) {

        const crop = await cropFace(imageBuffer, face);

        const emotion = await detectEmotion(crop);

        results.push({

            ...face,

            emotion

        });

    }

    return {

        people: faces.length,

        faces: results,

        timestamp: Date.now()

    };

}