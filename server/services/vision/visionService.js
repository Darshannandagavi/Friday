import { analyzeFrame } from "../../ml/pipeline.js";
import { toImageBuffer } from "../../ml/camera/frameProcessor.js";
import { updateState } from "./visionStateManager.js";
import { generateEvents } from "./eventGenerator.js";
import { generateObservation } from "./observationGenerator.js";
import { canSpeak, markSpeaking, markSpoken } from "./cooldownManager.js";
import { buildVisionContext } from "./contextBuilder.js";
import { speakObservation } from "../chat/proactiveChat.js";
import { recordEventForHabits } from "./habitLearner.js";

export const processFrame = async ({ sessionId, frame, isUserTalking }) => {
  const imageBuffer = toImageBuffer(frame);
  const frameResult = await analyzeFrame(imageBuffer);

  const { previous, current } = updateState(sessionId, frameResult);
  const events = generateEvents(previous, current);

  const spoken = [];

  for (const event of events) {
    await recordEventForHabits(sessionId, event); // learn regardless of whether Friday speaks

    const observation = generateObservation(event);
    if (!observation) continue;
    if (!canSpeak(sessionId, event, { isUserTalking })) continue;

    markSpeaking(sessionId, true);
    try {
      const context = await buildVisionContext({ sessionId, observation, state: current });
      const result = await speakObservation({ sessionId, context });

      if (result) {
        markSpoken(sessionId, event);
        spoken.push(result);
      }
    } finally {
      markSpeaking(sessionId, false);
    }
  }

  return { state: current, events, spoken };
};