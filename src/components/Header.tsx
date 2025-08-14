
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FishIcon } from './icons/FishIcon';

// El Header ahora es autónomo y consume el contexto directamente.
const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Log de diagnóstico para verificar el estado del usuario en cada renderizado.
  console.log("Header se está renderizando con user:", user);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
             <div className="text-blue-600">
                <FishIcon />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Club de Pesca "Monday"</h1>
          </div>
          
          <nav className="flex items-center gap-4">
            {/* Renderizado condicional del saludo y botón */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 hidden sm:block">Hola, {user.email}</span>
                <button 
                  onClick={logout}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              // Opcional: Mostrar un botón de Login si no hay usuario y no estamos en la página de login
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 hover:text-blue-700">
                Iniciar Sesión
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
