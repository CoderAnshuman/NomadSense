import { GoogleGenAI, Type } from "@google/genai";
import { LocationInsight } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function getLocationInsight(locationName: string): Promise<LocationInsight> {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY in the secrets panel.");
  }

  const prompt = `Research and provide an exhaustive cultural and travel guide for: ${locationName}. 
  You MUST return the data in strictly valid JSON format according to the provided schema.
  Include:
  - Famous places with exact latitude/longitude.
  - Deep cultural summary and facts.
  - Traditional festivals and their timings.
  - A comprehensive 3-day itinerary.
  - Local cuisine details.
  - Essential etiquette and travel tips.
  
  Use Google Search to ensure the information is current and accurate.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
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
              },
              required: ["summary", "facts", "traditions"]
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
                },
                required: ["name", "description", "category", "latitude", "longitude"]
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
                },
                required: ["name", "timing", "significance", "isComingSoon"]
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
                },
                required: ["title", "description", "vibe"]
              }
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  theme: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        activity: { type: Type.STRING },
                        location: { type: Type.STRING },
                        estimatedCost: { type: Type.NUMBER },
                      },
                      required: ["time", "activity", "location", "estimatedCost"]
                    }
                  }
                },
                required: ["day", "theme", "items"]
              }
            },
            cuisine: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["dish", "drink", "dessert"] },
                  mustTry: { type: Type.BOOLEAN },
                },
                required: ["name", "description", "type", "mustTry"]
              }
            },
            etiquette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rule: { type: Type.STRING },
                  description: { type: Type.STRING },
                  isEssential: { type: Type.BOOLEAN },
                },
                required: ["rule", "description", "isEssential"]
              }
            },
            travelTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, enum: ["language", "transport", "weather", "budget"] },
                  content: { type: Type.STRING },
                },
                required: ["category", "content"]
              }
            }
          },
          required: [
            "name", "description", "culture", "famousPlaces", 
            "festivals", "activities", "itinerary", "cuisine", 
            "etiquette", "travelTips"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Zero-length response from Gemini model.");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Exploration Error:", error);
    const message = error?.message || "An unexpected error occurred while exploring.";
    throw new Error(message);
  }
}

export async function generatePersonalizedTripPlan(
  locationName: string, 
  days: number, 
  budget: number, 
  peopleCount: number, 
  transportMode: string
): Promise<LocationInsight> {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const prompt = `Create a highly personalized travel plan for ${locationName}. 
  User Constraints:
  - Duration: ${days} days
  - Total Budget: $${budget} USD
  - Travelers: ${peopleCount} people
  - Preferred Transport: ${transportMode}
  
  The itinerary must be realistic for this budget. 
  Each itinerary item MUST include an 'estimatedCost' in USD.
  If the budget is low, suggest more free activities and budget-friendly street food.
  If the budget is high, suggest luxury landmarks and fine dining.
  
  Return the data in the same JSON schema as the general explorer, but customize the 'itinerary' to exactly ${days} days and ensure the 'cuisine' and 'activities' reflect the budget level.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
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
            },
            required: ["summary", "facts", "traditions"]
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
              },
              required: ["name", "description", "category", "latitude", "longitude"]
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
              },
              required: ["name", "timing", "significance", "isComingSoon"]
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
              },
              required: ["title", "description", "vibe"]
            }
          },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                theme: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      location: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                    },
                    required: ["time", "activity", "location", "estimatedCost"]
                  }
                }
              },
              required: ["day", "theme", "items"]
            }
          },
          cuisine: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["dish", "drink", "dessert"] },
                mustTry: { type: Type.BOOLEAN },
              },
              required: ["name", "description", "type", "mustTry"]
            }
          },
          etiquette: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rule: { type: Type.STRING },
                description: { type: Type.STRING },
                isEssential: { type: Type.BOOLEAN },
              },
              required: ["rule", "description", "isEssential"]
            }
          },
          travelTips: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, enum: ["language", "transport", "weather", "budget"] },
                content: { type: Type.STRING },
              },
              required: ["category", "content"]
            }
          }
        },
        required: [
          "name", "description", "culture", "famousPlaces", 
          "festivals", "activities", "itinerary", "cuisine", 
          "etiquette", "travelTips"
        ]
      }
    }
  });

  return JSON.parse(response.text);
}

