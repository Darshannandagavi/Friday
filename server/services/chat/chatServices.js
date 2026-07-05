import client from "../llm/grok.js";
import { buildPrompt } from "../prompt/promptBuilder.js";
import { saveMessage } from "./conversationManager.js";
import { extractMemory } from "../memory/memoryExtractor.js";
import { saveMemory } from "../memory/memoryManager.js";

export const streamResponse = async ({ sessionId, message, res }) => {
  const messages = await buildPrompt(sessionId, message);

  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    messages,
  });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  let assistantResponse = "";

  for await (const chunk of stream) {
    const token = chunk.choices?.[0]?.delta?.content;

    if (!token) continue;

    assistantResponse += token;
    res.write(token);
  }

  // Save conversation
  await saveMessage(sessionId, "user", message);
  await saveMessage(sessionId, "assistant", assistantResponse);

  // Respond immediately
  res.end();

  // Background memory extraction
  (async () => {
    try {
      const memories = await extractMemory({
        userMessage: message,
        assistantResponse,
      });

      if (!memories?.length) return;

      await Promise.all(
        memories.map((memory) =>
          saveMemory(sessionId, memory)
        )
      );
    } catch (err) {
      console.error("Memory extraction error:", err);
    }
  })();
};