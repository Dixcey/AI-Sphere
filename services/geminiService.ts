import { GoogleGenAI, Type } from "@google/genai";
import { GraphData, GraphNode, InfluencerResponse, SentimentScores } from "../types";

export const analyzeSentiment = async (node: GraphNode): Promise<SentimentScores | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API KEY found for sentiment analysis");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const context = [
    node.name,
    node.role ? `Role: ${node.role}` : '',
    node.associated ? `Organization: ${node.associated}` : '',
    node.bio ? `Bio: ${node.bio}` : '',
    node.bioTags?.length ? `Focus areas: ${node.bioTags.join(', ')}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `Analyze the following AI professional's profile and infer their stance on each dimension. Use only the provided information — do not hallucinate.

Profile:
${context}

Return scores as follows:
- trends: their overall outlook on AI progress ("optimistic", "pessimistic", or "neutral")
- regulation: a number from -1 (strongly against AI regulation) to 1 (strongly pro AI regulation)
- usage: a number from -1 (very restrictive/cautious about AI use) to 1 (highly enthusiastic about broad AI usage)
- trust: a number from -1 (perceives AI as very high risk / existential danger) to 1 (high trust in AI safety and development)
- agent: a number from -1 (skeptical of AI agents) to 1 (very bullish on AI agents)

Base your inference on their role, bio, and focus areas. If truly ambiguous, use 0.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: { type: Type.STRING, description: "optimistic, pessimistic, or neutral" },
            regulation: { type: Type.NUMBER, description: "-1 to 1" },
            usage: { type: Type.NUMBER, description: "-1 to 1" },
            trust: { type: Type.NUMBER, description: "-1 to 1" },
            agent: { type: Type.NUMBER, description: "-1 to 1" },
          },
          required: ["trends", "regulation", "usage", "equity", "agent"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      return {
        trends: ['optimistic', 'pessimistic', 'neutral'].includes(parsed.trends) ? parsed.trends : 'neutral',
        regulation: clamp(parsed.regulation ?? 0),
        usage: clamp(parsed.usage ?? 0),
        trust: clamp(parsed.trust ?? 0),
        agent: clamp(parsed.agent ?? 0),
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini sentiment error:", error);
    return null;
  }
};

export const expandNetwork = async (currentData: GraphData): Promise<InfluencerResponse> => {
  if (!process.env.API_KEY) {
    console.warn("No API KEY found");
    return { newNodes: [], newLinks: [] };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Create a list of existing names to avoid duplicates
  const existingNames = currentData.nodes.map(n => n.name).join(", ");

  const prompt = `
    I have a social graph of AI influencers and companies on X (Twitter).
    The current list is: ${existingNames}.
    
    Please identify 5 to 8 NEW, highly relevant, and influential people or AI labs that should be connected to this network.
    Also define how they connect to the EXISTING list or each other.
    
    Focus on:
    1. Top researchers
    2. Founders of major AI labs
    3. Key AI engineering influencers

    For each new person/company, provide:
    - Their Role (e.g. CEO, Researcher)
    - Their X (Twitter) handle (without @)
    - Their Associated Company/Institution
    - Their current X (Twitter) profile bio text (approximate if exact is unknown)
    - 3-4 short keywords (tags) describing their specific AI focus (e.g. "LLMs", "Robotics", "Safety", "Investing")
    - An estimated "joinedDate" year for their Twitter account (e.g. "2015").
    
    Return a raw JSON object with 'newNodes' and 'newLinks'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newNodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of person or company" },
                  group: { type: Type.STRING, description: "Must be one of: 'person', 'company', 'researcher'" },
                  role: { type: Type.STRING, description: "Job title or short description" },
                  handle: { type: Type.STRING, description: "X username without @" },
                  associated: { type: Type.STRING, description: "Main associated company or institution" },
                  bio: { type: Type.STRING, description: "The bio text from their X/Twitter profile" },
                  bioTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 keywords describing their AI focus" },
                  joinedDate: { type: Type.STRING, description: "Year they joined X/Twitter, e.g. '2012'" }
                },
                required: ["name", "group", "role", "handle", "associated", "bio", "bioTags", "joinedDate"]
              }
            },
            newLinks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING, description: "Name of the source node" },
                  target: { type: Type.STRING, description: "Name of the target node" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      // Defensive parsing: strip markdown code blocks if present
      const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      // Ensure arrays exist
      return {
        newNodes: Array.isArray(parsed.newNodes) ? parsed.newNodes : [],
        newLinks: Array.isArray(parsed.newLinks) ? parsed.newLinks : []
      };
    }
    return { newNodes: [], newLinks: [] };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { newNodes: [], newLinks: [] };
  }
};