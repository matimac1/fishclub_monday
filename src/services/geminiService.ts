// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error("Falta VITE_GEMINI_API_KEY");

const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? "gemini-1.5-flash"; // <- rápido por defecto
const genAI = new GoogleGenerativeAI(apiKey);

/** Devuelve un modelo listo; por defecto usa gemini-1.5-flash */
export function getModel(model: string = DEFAULT_MODEL) {
  console.debug("[Gemini] usando modelo:", model); // ver en consola qué se está usando
  return genAI.getGenerativeModel({ model });
}

/** Ejemplo simple: generar texto */
export async function generateComment(prompt: string, modelName?: string): Promise<string> {
  try {
    const model = getModel(modelName);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Error Gemini:", err);
    return "Hubo un error al contactar a la IA. Intenta otra vez.";
  }
}
