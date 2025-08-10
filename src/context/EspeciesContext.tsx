
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Species, getSpecies, addEspecie as addEspecieService, updateEspecie as updateEspecieService, deleteEspecie as deleteEspecieService } from '@/services/firestoreService';

interface EspeciesContextType {
  especies: Species[];
  loading: boolean;
  error: Error | null;
  addEspecie: (specie: Omit<Species, 'id'>) => Promise<void>;
  updateEspecie: (id: string, specie: Partial<Species>) => Promise<void>;
  deleteEspecie: (id: string) => Promise<void>;
}

const EspeciesContext = createContext<EspeciesContextType | undefined>(undefined);

export const EspeciesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [especies, setEspecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEspecies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSpecies();
      setEspecies(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEspecies();
  }, [fetchEspecies]);

  const addEspecie = async (specie: Omit<Species, 'id'>) => {
    await addEspecieService(specie);
    fetchEspecies();
  };

  const updateEspecie = async (id: string, specie: Partial<Species>) => {
    await updateEspecieService(id, specie);
    fetchEspecies();
  };

  const deleteEspecie = async (id: string) => {
    await deleteEspecieService(id);
    fetchEspecies();
  };

  const value = { especies, loading, error, addEspecie, updateEspecie, deleteEspecie };

  return (
    <EspeciesContext.Provider value={value}>
      {children}
    </EspeciesContext.Provider>
  );
};

export const useEspecies = () => {
  const context = useContext(EspeciesContext);
  if (!context) {
    throw new Error('useEspecies debe ser usado dentro de un EspeciesProvider');
  }
  return context;
};
