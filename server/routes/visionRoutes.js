import express from "express";
import { analyzeVisionFrame } from "../controllers/visionController.js";

const visionRoutes = express.Router();

visionRoutes.post("/frame", analyzeVisionFrame);

export default visionRoutes;