// src/pages/ManageTeams.tsx

import React, { useState } from 'react';
import ConcursantesList from '../components/ConcursantesList';
import ConcursanteForm from '../components/ConcursanteForm';
import { Team } from '../types';

const ManageTeams: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddNewTeam = () => {
    setEditingTeam(null); // Nos aseguramos de que no haya datos de edición
    setIsFormModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team); // Guardamos los datos del equipo a editar
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingTeam(null); // Limpiamos los datos de edición al cerrar
  };

  const handleSuccess = () => {
    handleCloseModal();
    setRefreshKey(prevKey => prevKey + 1); // Forzamos la recarga de la lista
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative">
             <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-50"
             >&times;</button>
            <ConcursanteForm 
              onSuccess={handleSuccess} 
              onCancel={handleCloseModal}
              initialData={editingTeam}
            />
          </div>
        </div>
      )}

      <ConcursantesList 
        onAddNewTeam={handleAddNewTeam} 
        onEditTeam={handleEditTeam}
        key={refreshKey} 
      />
    </div>
  );
};

export default ManageTeams;