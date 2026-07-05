import client from "../llm/grok.js";
import { saveMessage } from "./conversationManager.js";
import { generateSpeech } from "../voice/elevenlabsService.js";

export const speakObservation = async ({ sessionId, context }) => {
  const systemPrompt = `
You are Friday, a personal AI companion who occasionally makes brief, natural remarks based on what you notice about the user, without being asked.

Rules:
- Keep it short (1-2 sentences), casual, and warm.
- Never mention "monitoring", "detecting", "cameras", or "vision models" — just speak like a companion who noticed something.
- Use the time of day and context to infer what might be happening (morning -> heading out, evening -> dinner), but don't force it if it doesn't fit.
- Don't repeat the same kind of remark you've made recently.
- If nothing worth saying fits naturally, respond with exactly: SKIP

Context:
- Observation: ${context.observation}
- Time: ${context.currentTime}, ${context.weekday}
- Current emotion: ${context.currentEmotion || "unknown"}
- Time present/working: ${context.workingDurationMinutes} minutes
- Known habits/memories:
${context.recentMemories.length ? context.recentMemories.join("\n") : "None"}
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...context.recentConversation,
    { role: "user", content: `[vision event] ${context.observation}` },
  ];

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text || text === "SKIP") return null;

  await saveMessage(sessionId, "assistant", text);
  const audio = await generateSpeech(text);

  return { text, audio };
};