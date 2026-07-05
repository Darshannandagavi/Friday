import Memory from "../../models/Memory.js";
import { generateEmbedding } from "../embeddings/embeddingService.js";

export const saveMemory = async (sessionId, memory) => {
  if (!memory) return;

  if (memory.action === "ignore") return;

  const embedding = await generateEmbedding(memory.content);

  // CREATE
  if (memory.action === "create") {

    const exists = await Memory.findOne({
      sessionId,
      content: memory.content,
    });

    if (exists) return;

    await Memory.create({
      sessionId,
      content: memory.content,
      category: memory.category,
      importance: memory.importance,
      embedding,
    });

    return;
  }

  // UPDATE
  if (memory.action === "update") {

    const existing = await Memory.findOne({
      sessionId,
      category: memory.category,
    });

    if (existing) {

      existing.content = memory.content;
      existing.importance = memory.importance;
      existing.embedding = embedding;

      await existing.save();

      return;
    }

    await Memory.create({
      sessionId,
      content: memory.content,
      category: memory.category,
      importance: memory.importance,
      embedding,
    });
  }
};

export const getMemories = async (sessionId) => {
  return await Memory.find({ sessionId })
    .sort({ importance: -1 })
    .limit(20);
};



export const updateMemoryAccess = async (memoryIds) => {
  if (!memoryIds.length) return;

  await Memory.updateMany(
    {
      _id: { $in: memoryIds },
    },
    {
      $inc: {
        accessCount: 1,
      },
      $set: {
        lastAccessed: new Date(),
      },
    }
  );
};

export const searchMemories = async (
  embedding,
  limit = 5
) => {
  const results = await Memory.aggregate([
    {
      $vectorSearch: {
        index: "memory_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 100,
        limit: 20,
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        category: 1,
        importance: 1,
        accessCount: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  console.log("===== VECTOR SCORES =====");

  results.forEach((m) => {
    console.log(m.score, "-", m.content);
  });

  const filtered = results.filter(
    (m) => m.score >= 0.75
  );

  console.log("AFTER FILTER", filtered);

  await updateMemoryAccess(
    filtered.map((m) => m._id)
  );

  console.log(
    "RETURNING:",
    filtered.slice(0, limit)
  );

  return filtered.slice(0, limit);
};