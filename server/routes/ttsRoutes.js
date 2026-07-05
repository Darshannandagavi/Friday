import express from "express";
import { textToSpeech } from "../controllers/ttsController.js";

const ttsRouter = express.Router();

ttsRouter.post("/", textToSpeech);

export default ttsRouter;