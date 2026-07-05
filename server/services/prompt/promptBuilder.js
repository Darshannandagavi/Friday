import { getRecentMessages } from "../chat/conversationManager.js";
import { searchMemories } from "../memory/memoryManager.js";
import { generateEmbedding } from "../embeddings/embeddingService.js";

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
