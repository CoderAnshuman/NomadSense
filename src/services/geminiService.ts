import { GoogleGenAI, Type } from "@google/genai";
import { LocationInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getLocationInsight(locationName: string): Promise<LocationInsight> {
  const prompt = `Research and provide a deep cultural and travel insight for: ${locationName}. 
  Include famous places with their GPS coordinates, cultural background, traditional facts, legendary festivals, and unique local activities. 
  Use Google Search to find real-time information and currently popular spots.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          culture: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              facts: { type: Type.ARRAY, items: { type: Type.STRING } },
              traditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          },
          famousPlaces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["landmark", "museum", "nature", "hidden-gem"] },
                latitude: { type: Type.NUMBER },
                longitude: { type: Type.NUMBER },
              }
            }
          },
          festivals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                timing: { type: Type.STRING },
                significance: { type: Type.STRING },
                isComingSoon: { type: Type.BOOLEAN },
              }
            }
          },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                vibe: { type: Type.STRING },
              }
            }
          }
        },
        required: ["name", "description", "culture", "famousPlaces", "festivals", "activities"]
      }
    }
  });

  return JSON.parse(response.text);
}
