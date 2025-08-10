
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

// 1. Definir la forma del contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 2. Crear el Contexto con un valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Crear el Proveedor (Provider)
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged devuelve una función para "desuscribirse"
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpiar el efecto: se desuscribe cuando el componente se desmonta
    return () => unsubscribe();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Crear un Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
