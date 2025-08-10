
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import RegisterCatch from './components/RegisterCatch';
import Rules from './components/Rules';
import type { Page } from './types';
import type { Team as Concursante } from '@/services/firestoreService';
import ConcursantesList from './components/ConcursantesList';
import ConcursanteForm from './components/ConcursanteForm';
import Home from './components/Home';
import EspeciesPecesCRUD from './components/EspeciesPecesCRUD';
import Settings from './components/Settings';
import GenerateCertificates from './components/GenerateCertificates';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [editingConcursante, setEditingConcursante] = useState<Concursante | null>(null);
  const [logoSrc, setLogoSrc] = useState<string | null>(() => localStorage.getItem('tournamentLogo'));
  const [certificateTemplate, setCertificateTemplate] = useState<any | null>(() => {
    const savedTemplate = localStorage.getItem('certificateTemplate');
    return savedTemplate ? JSON.parse(savedTemplate) : null;
  });

  const handleSetPage = (page: Page) => {
    setEditingConcursante(null);
    setActivePage(page);
  };

  const handleGoToForm = () => {
    setEditingConcursante(null);
    setActivePage('concursanteForm');
  };

  const handleEditTeam = (team: Concursante) => {
    setEditingConcursante(team);
    setActivePage('concursanteForm');
  };

  const handleFormSubmit = () => {
    setActivePage('concursantes');
  };

  const handleSetLogo = (newLogoSrc: string | null) => {
    setLogoSrc(newLogoSrc);
    if (newLogoSrc) {
      localStorage.setItem('tournamentLogo', newLogoSrc);
    } else {
      localStorage.removeItem('tournamentLogo');
    }
  };
  
  const handleSetCertificateTemplate = (template: any | null) => {
    setCertificateTemplate(template);
    if(template){
        localStorage.setItem('certificateTemplate', JSON.stringify(template));
    } else {
        localStorage.removeItem('certificateTemplate');
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={handleSetPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'register':
        return <RegisterCatch logoSrc={logoSrc} />;
      case 'rules':
        return <Rules />;
      case 'concursantes':
        return <ConcursantesList onGoToForm={handleGoToForm} onEditTeam={handleEditTeam} />;
      case 'concursanteForm':
        return <ConcursanteForm initialData={editingConcursante} onFormSubmit={handleFormSubmit} />;
      case 'especies':
        return <EspeciesPecesCRUD />;
      case 'settings':
        return <Settings 
                 currentLogo={logoSrc} 
                 onSaveLogo={handleSetLogo}
                 currentTemplate={certificateTemplate}
                 onSaveTemplate={handleSetCertificateTemplate}
                />;
      case 'certificates':
        return <GenerateCertificates 
                 logoSrc={logoSrc} 
                 template={certificateTemplate} 
                 setActivePage={setActivePage}
                />;
      default:
        return <Home setActivePage={handleSetPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <Header activePage={activePage} setActivePage={handleSetPage} logoSrc={logoSrc} />
      <main className="p-4 sm:p-6 lg:p-8 flex-grow">
        {renderPage()}
      </main>
       <footer className="text-center p-4 text-sm text-gray-500">
          <p>Sistema de Competencia de Pesca © 2025. Desarrollado por matimac para el Club de Pesca y Deportes Náuticos "Monday"</p>
        </footer>
    </div>
  );
};

export default App;
