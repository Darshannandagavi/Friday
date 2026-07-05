import { generateSpeech } from "../services/voice/elevenlabsService.js";

export const textToSpeech = async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({
      error: "Missing text",
    });
  }

  try {
    const audio = await generateSpeech(text);

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (err) {
    console.error("ElevenLabs Error:", err.message);

    res.status(500).json({
      error: "TTS failed",
    });
  }
};