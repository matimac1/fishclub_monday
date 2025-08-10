import { db } from '@/firebase/firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, 
  QueryDocumentSnapshot, runTransaction, writeBatch, getDoc
} from 'firebase/firestore';

// --- Definiciones de Tipos (Interfaces) ---

export interface Team {
  id: string;
  name: string;
  members: string[];
  totalPoints?: number;
}

export interface PiecePoints {
  size: number;
  points: number;
}

export interface Species {
  id: string;
  name: string;
  piecePoints: PiecePoints[];
  mandatorySize: boolean;
}

export interface Catch {
  id: string;
  teamId: string;
  member: string;
  speciesId: string;
  size: number;
  points: number;
  timestamp: any; // Usar `any` para compatibilidad con Firestore Timestamp
}

// --- Funciones de Servicio Genéricas ---

const fetchData = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const dataCollection = collection(db, collectionName);
    const querySnapshot = await getDocs(dataCollection);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    } as T));
  } catch (error) {
    console.error(`Error al obtener datos de ${collectionName}:`, error);
    throw error;
  }
};

// --- Teams --- 
export const getTeams = () => fetchData<Team>('teams');
export const addTeam = (teamData: Omit<Team, 'id'>) => addDoc(collection(db, 'teams'), teamData);
export const updateTeam = (id: string, teamData: Partial<Team>) => updateDoc(doc(db, 'teams', id), teamData);
export const deleteTeam = async (id: string) => {
    // También elimina las capturas asociadas
    const batch = writeBatch(db);
    const catchesSnapshot = await getDocs(collection(db, `teams/${id}/catches`));
    catchesSnapshot.forEach(doc => batch.delete(doc.ref));
    batch.delete(doc(db, 'teams', id));
    return batch.commit();
};

// --- Species ---
export const getSpecies = () => fetchData<Species>('species');
export const addEspecie = (specieData: Omit<Species, 'id'>) => addDoc(collection(db, 'species'), specieData);
export const updateEspecie = (id: string, specieData: Partial<Species>) => updateDoc(doc(db, 'species', id), specieData);
export const deleteEspecie = (id: string) => deleteDoc(doc(db, 'species', id));


// --- Catches (con lógica transaccional) ---
export const getCatches = () => fetchData<Catch>('catches');

export const addCatchAndUpdatePoints = async (catchData: Omit<Catch, 'id'>) => {
  const teamRef = doc(db, 'teams', catchData.teamId);
  const catchRef = doc(collection(db, 'catches'));

  return runTransaction(db, async (transaction) => {
    const teamDoc = await transaction.get(teamRef);
    if (!teamDoc.exists()) {
      throw new Error("El equipo no existe!");
    }

    const currentPoints = teamDoc.data().totalPoints || 0;
    const newTotalPoints = currentPoints + catchData.points;

    transaction.set(catchRef, catchData);
    transaction.update(teamRef, { totalPoints: newTotalPoints });

    return { ...catchData, id: catchRef.id };
  });
};

export const deleteCatchAndUpdatePoints = async (catchId: string) => {
    const catchRef = doc(db, 'catches', catchId);
    
    return runTransaction(db, async (transaction) => {
        const catchDoc = await transaction.get(catchRef);
        if (!catchDoc.exists()) {
            throw new Error("La captura no existe!");
        }

        const { teamId, points } = catchDoc.data() as Catch;
        const teamRef = doc(db, 'teams', teamId);
        const teamDoc = await transaction.get(teamRef);

        if (!teamDoc.exists()) {
            // Si el equipo no existe, al menos elimina la captura huérfana
            transaction.delete(catchRef);
            return;
        }

        const currentPoints = teamDoc.data().totalPoints || 0;
        const newTotalPoints = Math.max(0, currentPoints - points);

        transaction.update(teamRef, { totalPoints: newTotalPoints });
        transaction.delete(catchRef);
    });
};