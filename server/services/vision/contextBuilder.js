import { getRecentMessages } from "../chat/conversationManager.js";
import { getMemories } from "../memory/memoryManager.js";

export async function buildVisionContext({ sessionId, observation, state }) {
  const now = new Date();
  const [history, memories] = await Promise.all([
    getRecentMessages(sessionId, 6),
    getMemories(sessionId),
  ]);

  const workingDurationMs = state.presentSince ? Date.now() - state.presentSince : 0;

  return {
    observation,
    currentTime: now.toLocaleTimeString(),
    weekday: now.toLocaleDateString(undefined, { weekday: "long" }),
    currentEmotion: state.emotion,
    recentMemories: memories.map((m) => `[${m.category}] ${m.content}`),
    recentConversation: history,
    workingDurationMinutes: Math.round(workingDurationMs / 60000),
  };
}