// src/services/firestoreService.ts

import { db } from '@/firebase/firebase'; // Se mantiene tu ruta de importación original
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, 
  QueryDocumentSnapshot, runTransaction, writeBatch, getDoc, serverTimestamp
} from 'firebase/firestore';

// --- Definiciones de Tipos (Interfaces) ---

export interface Companion {
  name: string;
  dob: string;
  sex: 'Masculino' | 'Femenino' | '';
  ageString?: string;
  category?: string;
}

export interface Team {
  id: string; // ID de Firestore
  createdAt: any; // Timestamp de Firestore
  
  // Datos del equipo
  club: string;
  country: string;
  category: 'Nacional' | 'Internacional';
  distance: number | null;

  // Datos del Timonel
  helmsmanName: string;
  helmsmanDob: string;
  helmsmanAgeString?: string;
  helmsmanSex: 'Masculino' | 'Femenino' | '';
  helmsmanCategory: string;
  contactPhone: string;

  // Datos de la Embarcación
  boatName?: string;
  boatRegistration?: string;

  // Datos de Acompañantes
  companions?: Companion[];

  // Puntos
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
  timestamp: any;
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

export const addTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'teamNumber'>) => {
  // 1. Referencia al documento contador
  const counterRef = doc(db, 'counters', 'teamCounter');
  
  // 2. Referencia para el nuevo documento de equipo (Firestore generará el ID interno)
  const newTeamRef = doc(collection(db, 'teams'));

  try {
    // 3. Ejecutar como una transacción atómica
    const newTeamNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists()) {
        throw new Error("El documento contador 'teamCounter' no existe.");
      }

      // Calculamos el nuevo ID y lo formateamos
      const newId = counterDoc.data().currentId + 1;
      const formattedId = newId.toString().padStart(3, '0'); // "001", "002", etc.

      const dataToSave = {
        ...teamData,
        teamNumber: formattedId, // Guardamos el nuevo ID legible
        companions: teamData.companions?.filter(c => c.name && c.name.trim() !== ''),
        createdAt: serverTimestamp(),
        totalPoints: 0,
      };

      // Realizamos las escrituras dentro de la transacción
      transaction.set(newTeamRef, dataToSave);
      transaction.update(counterRef, { currentId: newId });

      return formattedId;
    });

    console.log(`Equipo registrado con ID interno: ${newTeamRef.id} y Número de Equipo: ${newTeamNumber}`);
    return { success: true, id: newTeamRef.id, teamNumber: newTeamNumber };

  } catch (error) {
    console.error("Error en la transacción de creación de equipo: ", error);
    return { success: false, error };
  }
};

export const updateTeam = (id: string, teamData: Partial<Team>) => updateDoc(doc(db, 'teams', id), teamData);
export const deleteTeam = async (id: string) => {
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
            transaction.delete(catchRef);
            return;
        }

        const currentPoints = teamDoc.data().totalPoints || 0;
        const newTotalPoints = Math.max(0, currentPoints - points);

        transaction.update(teamRef, { totalPoints: newTotalPoints });
        transaction.delete(catchRef);
    });
};