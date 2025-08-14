import { doc, setDoc, onSnapshot, DocumentData } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/firebase/firebase";

const SESSION_ID_KEY = 'app_session_id';
let unsubscribeFromSession: (() => void) | null = null;

/**
 * Crea un nuevo ID de sesión, lo guarda en Firestore y en localStorage.
 * @param {string} uid - El ID del usuario.
 * @returns {string} El nuevo ID de sesión generado.
 */
export async function createNewSession(uid: string): Promise<string> {
  const sessionId = crypto.randomUUID(); // Usamos el crypto nativo del navegador
  const sessionRef = doc(db, "userSessions", uid);
  
  await setDoc(sessionRef, { sessionId, timestamp: new Date() });
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  
  return sessionId;
}

/**
 * Inicia el listener en tiempo real para la sesión del usuario.
 * Si la sesión cambia en otro dispositivo, cierra la sesión actual.
 * @param {string} uid - El ID del usuario.
 */
export function startSessionListener(uid: string) {
  if (unsubscribeFromSession) {
    unsubscribeFromSession(); // Limpia cualquier listener anterior
  }

  const sessionRef = doc(db, "userSessions", uid);
  
  unsubscribeFromSession = onSnapshot(sessionRef, (docSnap: DocumentData) => {
    const localSessionId = localStorage.getItem(SESSION_ID_KEY);
    const remoteSessionId = docSnap.data()?.sessionId;

    if (remoteSessionId && localSessionId && remoteSessionId !== localSessionId) {
      console.log("Detectado inicio de sesión en otro dispositivo. Cerrando sesión actual.");
      stopSessionListener(); // Detiene el listener antes de cerrar sesión
      signOut(auth).then(() => {
        alert("Tu sesión ha sido cerrada porque iniciaste sesión en otro dispositivo.");
      });
    }
  });
}

/**
 * Detiene el listener de sesión activa.
 * Debe llamarse al cerrar sesión manualmente.
 */
export function stopSessionListener() {
  if (unsubscribeFromSession) {
    unsubscribeFromSession();
    unsubscribeFromSession = null;
  }
  localStorage.removeItem(SESSION_ID_KEY);
}
