import { GoogleGenAI, FunctionDeclaration, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateMultimodalResponse = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating multimodal response:", error);
    return "Sorry, I encountered an error while processing your request with the image.";
  }
};

const scheduleReminderFunctionDeclaration: FunctionDeclaration = {
  name: 'schedule_reminder',
  parameters: {
    type: Type.OBJECT,
    description: 'Schedules a reminder for a user. Use this function to capture the task and the exact date and time for the reminder.',
    properties: {
      task: {
        type: Type.STRING,
        description: 'The specific task the user wants to be reminded about. e.g., "submit the project proposal"',
      },
      datetime_iso: {
        type: Type.STRING,
        description: 'The fully resolved date and time for the reminder in ISO 8601 format, including the correct timezone offset derived from the user\'s context. e.g., "2025-11-20T09:00:00-05:00"',
      },
    },
    required: ['task', 'datetime_iso'],
  },
};

export const generateAgentResponse = async (prompt: string, timezone: string): Promise<GenerateContentResponse> => {
  try {
    const systemInstruction = `You are an intelligent reminder scheduling assistant.
The user's current timezone is "${timezone}".
The current date and time is ${new Date().toISOString()}.
Your primary goal is to determine the exact date and time for a reminder based on the user's request and the current context.
You must resolve relative times (like "tomorrow at 10am" or "in 2 hours") into a full ISO 8601 timestamp.
If the user provides a time without AM/PM (e.g., "at 7"), use common sense to infer whether it is AM or PM based on the current time of day.
Once you have the task description and the precise timestamp, you must call the 'schedule_reminder' function with the arguments.
Do not ask the user for their timezone; use the one provided in this instruction to calculate the correct ISO 8601 timestamp with offset.
If the user's request is ambiguous or not related to scheduling, respond naturally without calling the function.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [scheduleReminderFunctionDeclaration] }],
      },
    });
    return response;
  } catch (error) {
    console.error("Error generating agent response:", error);
    throw new Error("Failed to get a response from the agent.");
  }
};