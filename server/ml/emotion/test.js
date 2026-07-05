import fs from "fs";

import { detectFaces } from "../faceDetection/faceDetector.js";
import { detectEmotion } from "./emotionModel.js";
import { cropFace } from "../faceDetection/cropFace.js";

const img = fs.readFileSync("./test.jpg");

const faces = await detectFaces(img);

const face = await cropFace(img, faces[0]);

fs.writeFileSync("face.jpg", face);

const emotion = await detectEmotion(face);

console.log(emotion);