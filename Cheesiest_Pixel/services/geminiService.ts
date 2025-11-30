import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDifferentialDiagnosis = async (symptoms: string, history: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze the following patient information and provide diagnostic insights.
      Patient Symptoms: ${symptoms}
      Patient History: ${history}
      
      Provide a response in JSON format with the following structure:
      {
        "differentialDiagnosis": ["Condition A", "Condition B", "Condition C"],
        "suggestedTests": ["Test 1", "Test 2"],
        "integratedApproach": "Brief suggestion combining modern and traditional (Ayurveda/Yoga) advice."
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "{}";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      differentialDiagnosis: ["API Error - Check Logs"],
      suggestedTests: [],
      integratedApproach: "System unavailable."
    };
  }
};

export const getTrendAnalysis = async (topic: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze current global health trends regarding: ${topic}.
      Provide a brief summary (max 50 words) and a list of 3 emerging research areas.
      Return plain text.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch trends at this moment.";
  }
};