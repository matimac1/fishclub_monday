
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase";

/**
 * Sube un archivo a una ruta específica en Firebase Storage.
 * @param {File} file - El archivo a subir.
 * @param {string} path - La ruta de destino en el storage (ej. 'logos/tournament_logo.png').
 * @returns {Promise<string>} La URL de descarga pública del archivo subido.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  try {
    // Sube el archivo
    const snapshot = await uploadBytes(storageRef, file);
    // Obtiene la URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw new Error("No se pudo subir el archivo a Firebase Storage.");
  }
};
