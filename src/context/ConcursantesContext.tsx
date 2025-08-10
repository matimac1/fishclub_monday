
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Team, getTeams, addTeam as addTeamService, updateTeam as updateTeamService, deleteTeam as deleteTeamService } from '@/services/firestoreService';

interface ConcursantesContextType {
  concursantes: Team[];
  loading: boolean;
  error: Error | null;
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
}

const ConcursantesContext = createContext<ConcursantesContextType | undefined>(undefined);

export const ConcursantesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [concursantes, setConcursantes] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConcursantes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setConcursantes(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConcursantes();
  }, [fetchConcursantes]);

  const addTeam = async (team: Omit<Team, 'id'>) => {
    await addTeamService(team);
    fetchConcursantes(); // Re-fetch to update state
  };

  const updateTeam = async (id: string, team: Partial<Team>) => {
    await updateTeamService(id, team);
    fetchConcursantes();
  };

  const deleteTeam = async (id: string) => {
    await deleteTeamService(id);
    fetchConcursantes();
  };

  const value = { concursantes, loading, error, addTeam, updateTeam, deleteTeam };

  return (
    <ConcursantesContext.Provider value={value}>
      {children}
    </ConcursantesContext.Provider>
  );
};

export const useConcursantes = () => {
  const context = useContext(ConcursantesContext);
  if (!context) {
    throw new Error('useConcursantes debe ser usado dentro de un ConcursantesProvider');
  }
  return context;
};
