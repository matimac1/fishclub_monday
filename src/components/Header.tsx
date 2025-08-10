
import React from 'react';
import type { Page } from '../types';
import { FishIcon } from './icons/FishIcon';

interface HeaderProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  logoSrc: string | null;
}

const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, logoSrc }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
             <div className="text-blue-600">
                <FishIcon />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Club de Pesca y Deportes Náuticos "Monday"</h1>
            {logoSrc && <img src={logoSrc} alt="Logo del Torneo" className="h-12 ml-4 object-contain" />}
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
             {activePage !== 'home' && (
                 <button
                    onClick={() => setActivePage('home')}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                >
                    <i className="fa-solid fa-home"></i>
                    <span className="hidden sm:inline">Inicio</span>
                </button>
             )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
