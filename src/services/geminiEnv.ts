import { validateRequiredEnv } from "@/utils/verifyEnv";

/**
 * Valida las variables de entorno específicas para el servicio de Gemini.
 */
export function validateGeminiEnv() {
  validateRequiredEnv(["VITE_GEMINI_API_KEY"], import.meta.env);
}