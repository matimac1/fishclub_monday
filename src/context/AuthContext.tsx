import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, setPersistence, browserLocalPersistence, signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { stopSessionListener } from '@/services/sessionService'; // Importar para limpiar la sesión

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Establecer la persistencia ANTES de suscribirse a los cambios.
    // Esto le dice a Firebase que use localStorage para guardar la sesión.
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // 2. Ahora que la persistencia está asegurada, nos suscribimos.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false); // Se establece en false solo después de verificar
        });
        return unsubscribe;
      })
      .catch((error) => {
        console.error("Error al establecer la persistencia de sesión:", error);
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    stopSessionListener(); // Limpia el listener de sesión única
    await signOut(auth);
  };

  // No renderizar nada hasta que se sepa si hay usuario o no
  if (loading) {
    return <div className="min-h-screen grid place-items-center">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};