/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MANIFESTO_MODEL = 'gemini-2.5-flash';

export async function generateManifesto(name: string, position: string, keyPoints: string): Promise<string> {
  const prompt = `
    You are an expert Political Campaign Manager for university student elections.
    
    Candidate Name: ${name}
    Running For: ${position}
    Key Points/Promises: ${keyPoints}
    
    Task: Write a short, inspiring, and professional election manifesto (max 100 words). 
    It should be persuasive and appeal to university students. 
    Use formatting (bullet points) if necessary.
    Do not use markdown blocks or preamble. Just the manifesto text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MANIFESTO_MODEL,
      contents: prompt,
    });

    return response.text || "Vote for me for a better campus!";
  } catch (error) {
    console.error("Gemini Manifesto Error:", error);
    return "Committed to excellence and student welfare. (AI Generation Failed)";
  }
}