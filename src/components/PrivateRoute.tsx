import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // Muestra un loader mientras se verifica el estado de autenticación
    return <div>Verificando sesión...</div>;
  }

  // Si no hay usuario, redirige a /login. Si hay, renderiza la página hija.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}