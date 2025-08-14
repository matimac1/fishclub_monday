import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';

export default function App() {
  const { user, logout } = useAuth();

  return (
    //<div className="flex flex-col h-screen">
    <div style={{ background: '#ccf', border: '3px solid blue' }} className="flex flex-col h-screen">

      {/* El Header ahora es parte del layout y siempre visible si hay usuario */}
      <Header user={user} logout={logout} />
      
      {/* El contenido principal es el que tendrá scroll si es necesario */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      
      <footer className="text-center p-4 text-sm text-gray-500 bg-white border-t">
        <p>Sistema de Competencia de Pesca © 2025. Desarrollado por matimac para el Club de Pesca y Deportes Náuticos "Monday"</p>
      </footer>
    </div>
  );
}
