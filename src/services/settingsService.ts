
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// --- Document References ---
const mainSettingsDocRef = doc(db, "settings", "main");
const rulesDocRef = doc(db, "settings", "tournamentRules");

// --- Interfaces ---
export interface CertificateStyle {
  color: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  top: number; // Posición en %
  left: number; // Posición en %
}

export interface AppSettings {
  logoUrl: string;
  certificateBgUrl: string;
  certificateStyle: CertificateStyle;
}

// --- Main Settings Functions ---
export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    const docSnap = await getDoc(mainSettingsDocRef);
    return docSnap.exists() ? (docSnap.data() as AppSettings) : null;
  } catch (error) {
    console.error("Error al obtener la configuración principal:", error);
    throw error;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await setDoc(mainSettingsDocRef, settings, { merge: true });
  } catch (error) {
    console.error("Error al guardar la configuración principal:", error);
    throw error;
  }
};

// --- Rules Functions ---
export const getRulesContent = async (): Promise<string> => {
  try {
    const docSnap = await getDoc(rulesDocRef);
    // Devuelve el contenido HTML o un string vacío si no existe.
    return docSnap.exists() ? docSnap.data().content : '';
  } catch (error) {
    console.error("Error al obtener el reglamento:", error);
    throw error;
  }
};

export const saveRulesContent = async (htmlContent: string): Promise<void> => {
  try {
    await setDoc(rulesDocRef, { content: htmlContent });
  } catch (error) {
    console.error("Error al guardar el reglamento:", error);
    throw error;
  }
};
