import { processFrame } from "../services/vision/visionService.js";

export const analyzeVisionFrame = async (req, res) => {
  try {
    const { sessionId, frame, isUserTalking } = req.body;

    if (!sessionId || !frame) {
      return res.status(400).json({ error: "sessionId and frame are required" });
    }

    const result = await processFrame({ sessionId, frame, isUserTalking });

    res.json({
      faces: result.state.faceCount,
      emotion: result.state.emotion,
      events: result.events.map((e) => e.type),
      responses: result.spoken.map((s) => ({
        text: s.text,
        audio: s.audio.toString("base64"),
      })),
    });
  } catch (err) {
    console.error("Vision analysis error:", err);
    res.status(500).json({ error: "Vision analysis failed" });
  }
};