import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "other",
    },

    importance: {
      type: Number,
      default: 5,
    },

    embedding: {
      type: [Number],
      default: [],
    },

    accessCount: {
      type: Number,
      default: 0,
    },

    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Memory", memorySchema);