import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Lesson, ChallengeType } from "../types";

// Using flash-lite-latest as requested for low latency responses
const MODEL_NAME = "gemini-flash-lite-latest";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The specific topic of the lesson" },
    description: { type: Type.STRING, description: "Short description of what user will learn" },
    challenges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { 
            type: Type.STRING, 
            enum: [ChallengeType.SELECT, ChallengeType.TRANSLATE, ChallengeType.FILL_BLANK],
            description: "The type of challenge."
          },
          question: { type: Type.STRING, description: "The question or phrase to translate/identify." },
          imageKeyword: { type: Type.STRING, description: "A simple, single English keyword (noun) to find a relevant image for this question (e.g. 'cat', 'apple', 'bus')." },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3 or 4 possible answers. For translation, these are the choices. For selection, these are labels."
          },
          correctAnswer: { type: Type.STRING, description: "The exact string match from options." }
        },
        required: ["id", "type", "question", "options", "correctAnswer", "imageKeyword"],
      },
    },
  },
  required: ["topic", "description", "challenges"],
};

export const generateLessonContent = async (
  language: string,
  topic: string,
  level: number
): Promise<Lesson> => {
  try {
    const prompt = `
      Create a language learning lesson for: ${language}.
      Topic: ${topic}.
      Difficulty Level: ${level} (1=Beginner, 5=Advanced).
      
      Generate 5 distinct challenges.
      - Mix of "SELECT" (multiple choice vocabulary), "TRANSLATE" (sentence translation), and "FILL_BLANK".
      - Ensure "imageKeyword" is a concrete visual noun related to the question.
      - Keep it simple and fun.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        systemInstruction: "You are an expert language tutor app similar to Duolingo. You generate structured lesson content.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return {
      id: Date.now().toString(),
      ...data
    };
  } catch (error) {
    console.error("Error generating lesson:", error);
    throw error;
  }
};
