import { getRecentMessages } from "../chat/conversationManager.js";
import { searchMemories } from "../memory/memoryManager.js";
import { generateEmbedding } from "../embeddings/embeddingService.js";
import { getStateSummary } from "../vision/visionStateManager.js";
import { describeEmotion } from "../vision/emotionPhrasing.js";

function buildVisionSection(sessionId) {
  const vision = getStateSummary(sessionId);

  if (!vision.initialized) {
    return `Vision is currently OFF — you have no camera access right now. If asked whether you can see the user, say you can't right now, and that they can turn on "Friday's Watching" to let you see them. Don't guess at their appearance or mood.`;
  }

  if (!vision.present) {
    return `Vision is ON, but no face is currently visible in the camera. If asked whether you can see the user, say the camera is on but you don't see them at the moment.`;
  }

  const emotionPhrase = describeEmotion(vision.emotion, vision.emotionConfidence);

  return `Vision is ON and a face is currently visible.
${vision.faceCount > 1 ? `There are ${vision.faceCount} people in view.` : "There is one person in view."}
Their current expression reads as: ${emotionPhrase || "neutral"}.
If asked whether you can see the user, answer naturally and confidently — e.g. "Yes, I can see you. You look ${emotionPhrase || "calm"} right now." Only bring up the emotion when it's relevant to what's being asked; don't force it into unrelated replies.`;
}

export const buildPrompt = async (sessionId, message) => {
  // Last few conversation messages
  const history = await getRecentMessages(sessionId);

  // Generate embedding for current query
  const embedding = await generateEmbedding(message);
  console.log("Embedding length:", embedding.length);
  console.log("First 5 values:", embedding.slice(0, 5));

  // Semantic search
  let memories = [];

  if (embedding) {
    memories = await searchMemories(embedding);
  }

  console.log("\n========= SEARCH RESULTS =========");
  console.log(
    memories.map((m) => ({
      score: m.score,
      category: m.category,
      content: m.content,
    })),
  );

  // Build memory context
  const memoryContext =
    memories.length > 0
      ? memories
          .map((memory) => `[${memory.category}] ${memory.content}`)
          .join("\n")
      : "None";

  const visionSection = buildVisionSection(sessionId);

  return [
    {
      role: "system",
      content: `
You are Friday, a highly intelligent personal AI assistant.

You have long-term memory about the user.

Use the memories below ONLY if they are relevant to the current conversation.

Never force memories into unrelated answers.

If the user contradicts an old memory, trust the latest information.

----------------------------------------

Relevant User Memories

${memoryContext}

----------------------------------------

Current Vision Status

${visionSection}

----------------------------------------

Respond naturally and conversationally.
      `,
    },

    ...history,

    {
      role: "user",
      content: message,
    },
  ];
};