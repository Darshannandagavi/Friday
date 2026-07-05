import Conversation from "../../models/Conversation.js";

// Get the last N messages
export const getRecentMessages = async (sessionId, limit = 10) => {
  const conversation = await Conversation.findOne({ sessionId });

  if (!conversation) return [];

  return conversation.messages
    .slice(-limit)
    .map(({ role, content }) => ({
      role,
      content,
    }));
};

// Save a single message
export const saveMessage = async (sessionId, role, content) => {
  let conversation = await Conversation.findOne({ sessionId });

  if (!conversation) {
    conversation = await Conversation.create({
      sessionId,
      messages: [],
    });
  }

  conversation.messages.push({
    role,
    content,
  });

  await conversation.save();
};

// Delete an entire conversation
export const clearConversation = async (sessionId) => {
  await Conversation.deleteOne({ sessionId });
};