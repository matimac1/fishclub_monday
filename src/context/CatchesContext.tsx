
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Catch,
  getCatches,
  addCatchAndUpdatePoints,
  deleteCatchAndUpdatePoints
} from '@/services/firestoreService';
import { useConcursantes } from './ConcursantesContext'; // Importar el hook de concursantes

interface CatchesContextType {
  catches: Catch[];
  loading: boolean;
  error: Error | null;
  addCatch: (catchData: Omit<Catch, 'id'>) => Promise<void>;
  deleteCatch: (id: string) => Promise<void>;
}

const CatchesContext = createContext<CatchesContextType | undefined>(undefined);

export const CatchesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [catches, setCatches] = useState<Catch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchConcursantes } = useConcursantes(); // Obtener la función para refrescar concursantes

  const fetchCatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCatches();
      setCatches(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatches();
  }, [fetchCatches]);

  const addCatch = async (catchData: Omit<Catch, 'id'>) => {
    await addCatchAndUpdatePoints(catchData);
    fetchCatches();
    fetchConcursantes(); // Refrescar también los puntos de los equipos
  };

  const deleteCatch = async (id: string) => {
    await deleteCatchAndUpdatePoints(id);
    fetchCatches();
    fetchConcursantes(); // Refrescar también los puntos de los equipos
  };

  const value = { catches, loading, error, addCatch, deleteCatch };

  return (
    <CatchesContext.Provider value={value}>
      {children}
    </CatchesContext.Provider>
  );
};

export const useCatches = () => {
  const context = useContext(CatchesContext);
  if (!context) {
    throw new Error('useCatches debe ser usado dentro de un CatchesProvider');
  }
  return context;
};
