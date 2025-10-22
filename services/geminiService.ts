
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overall_strength: {
            type: Type.STRING,
            enum: ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'],
            description: 'A single rating for the password strength.',
        },
        feedback: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Actionable suggestions to improve the password. For example, "Add more special characters." or "Avoid using common dictionary words."',
        },
        compromise_risk: {
            type: Type.STRING,
            enum: ['High', 'Medium', 'Low', 'Very Low'],
            description: 'An assessment of how likely the password pattern is to appear in breached password lists.',
        },
        common_patterns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of any detected weak patterns, like "Keyboard sequence (e.g., qwerty)", "Repeated characters (e.g., 111)", "Common word", "Common name", "A date".',
        },
    },
    required: ['overall_strength', 'feedback', 'compromise_risk', 'common_patterns'],
};

export const checkPasswordWithGemini = async (password: string): Promise<GeminiAnalysisResult> => {
    
    const prompt = `
    Analyze the following password based on its characteristics, but DO NOT repeat or display the password in your response.
    Password to analyze: "${password}"

    Act as a cybersecurity expert. Evaluate the password's strength and potential for compromise. Consider the following factors:
    - Length
    - Mix of character types (uppercase, lowercase, numbers, symbols)
    - Use of common dictionary words, names, or places
    - Presence of sequential or repeated characters (e.g., '1234', 'abc', 'aaa')
    - Common keyboard patterns (e.g., 'qwerty')
    - Resemblance to common passwords found in data breaches (e.g., 'password123', '123456')

    Based on your analysis, provide a structured JSON response.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const result: GeminiAnalysisResult = JSON.parse(jsonText);
        
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};
