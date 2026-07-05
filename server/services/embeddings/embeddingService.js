import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const jina = new OpenAI({
  apiKey: process.env.JINA_API_KEY,
  baseURL: "https://api.jina.ai/v1",
});

export const generateEmbedding = async (text) => {
  try {
    const response = await jina.embeddings.create({
      model: "jina-embeddings-v3",
      input: text,
    });

    return response.data[0].embedding;
  } catch (err) {
    console.error("Embedding Error:", err.message);
    return null;
  }
};