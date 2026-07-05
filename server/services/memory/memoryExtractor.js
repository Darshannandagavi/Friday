import client from "../llm/grok.js";

export const extractMemory = async ({
  userMessage,
  assistantResponse,
}) => {
  const completion =
    await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      temperature: 0,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are Friday's memory engine.

Your ONLY job is to decide what should be stored as long-term memory.

The conversation contains:
- User message
- Assistant response

Use BOTH messages for context.

Store ONLY information that is likely to remain useful in future conversations.

Examples:
- Name
- Age
- Occupation
- Education
- Skills
- Preferences
- Favorite things
- Current project
- Long-term goals
- Languages
- Location
- Important relationships

DO NOT STORE:

- Greetings
- Questions
- Temporary tasks
- Requests
- Current mood
- Short-term plans
- Facts about yourself (the assistant)

Each memory must contain:

action
content
category
importance

Actions:

create
update

If nothing should be stored return

{
  "memories":[]
}

Example:

{
  "memories":[
    {
      "action":"create",
      "content":"Name: Darshan Nandagavi",
      "category":"personal",
      "importance":10
    },
    {
      "action":"create",
      "content":"Favorite programming language: JavaScript",
      "category":"preference",
      "importance":9
    }
  ]
}

Return ONLY valid JSON.
`,
        },

        {
          role: "user",
          content: JSON.stringify({
            userMessage,
            assistantResponse,
          }),
        },
      ],
    });

  try {
    const result = JSON.parse(
      completion.choices[0].message.content
    );

    return result.memories || [];
  } catch (err) {
    console.error("Memory parse error:", err);
    return [];
  }
};