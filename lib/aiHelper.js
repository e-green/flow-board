import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateTaskSuggestions = async (input) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates tasks and subtasks."
        },
        {
          role: "user",
          content: `Generate a main task and its subtasks based on the following description:\n${input}\n\nProvide the result in JSON format as:\n{\n "task": "Main task",\n "subtasks": ["Subtask 1", "Subtask 2", ...]\n}`
        }
      ],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return null;
  }
};