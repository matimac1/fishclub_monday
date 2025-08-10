/**
 * Valida que las claves requeridas existan y no estén vacías en el objeto fuente.
 * @param keys Array de claves a verificar (ej. ["VITE_API_KEY"]).
 * @param source Objeto de donde leer las variables (ej. import.meta.env).
 * @throws Error si alguna de las claves falta o está vacía.
 */
export function validateRequiredEnv(keys: string[], source: Record<string, any>) {
  const missingKeys = keys.filter(key => {
    const value = source[key];
    return value === undefined || value === null || value === '';
  });

  if (missingKeys.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missingKeys.join(', ')}. Revísalas en .env.local (prefijo VITE_) y reinicia el dev server.`);
  }
}

/**
 * Imprime un resumen de variables de entorno clave para depuración.
 */
export function logEnvSummary() {
  console.debug("--- Resumen de Entorno ---");
  console.debug(`ID del Proyecto Firebase: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`);
  console.debug(`Modelo de Gemini: ${import.meta.env.VITE_GEMINI_MODEL || '(usando fallback)'}`);
  console.debug("Nota: Las variables VITE_ se cargan en tiempo de build. Un reinicio del servidor es necesario tras cambiarlas.");
  console.debug("--------------------------");
}