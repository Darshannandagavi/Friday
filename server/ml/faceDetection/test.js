import fs from "fs";
import { detectFaces } from "./faceDetector.js";
import { drawDetection } from "./debugDraw.js";

const img = fs.readFileSync("./test.jpg");

const faces = await detectFaces(img);

console.log(faces);

await drawDetection(img, faces);