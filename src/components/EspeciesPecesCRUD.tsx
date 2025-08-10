import React, { useState } from 'react';
import { useEspecies } from '../context/EspeciesContext';
import type { Species } from '@/services/firestoreService';
import EspeciesForm from './EspeciesForm'; // Importar el nuevo formulario
import { FishIcon } from './icons/FishIcon';

const EspeciesPecesCRUD: React.FC = () => {
  const { especies, loading, deleteEspecie } = useEspecies();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEspecie, setEditingEspecie] = useState<Species | null>(null);

  const handleAddNew = () => {
    setEditingEspecie(null);
    setIsFormOpen(true);
  };

  const handleEdit = (specie: Species) => {
    setEditingEspecie(specie);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEspecie(null);
  };

  if (loading) {
    return <p>Cargando especies...</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <FishIcon className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Especies</h2>
        </div>
        {!isFormOpen && (
          <button onClick={handleAddNew} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Agregar Nueva Especie
          </button>
        )}
      </div>

      {isFormOpen && (
        <EspeciesForm initialData={editingEspecie} onFormClose={handleFormClose} />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2">
              <th className="p-4">Nombre</th>
              <th className="p-4">Puntos por Pieza</th>
              <th className="p-4">Medida Obligatoria</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {especies.map((specie) => (
              <tr key={specie.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{specie.name}</td>
                <td className="p-4">{specie.piecePoints.map(p => `${p.points}pts/${p.size}cm`).join(', ')}</td>
                <td className="p-4">{specie.mandatorySize ? 'Sí' : 'No'}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleEdit(specie)} className="text-blue-600 hover:text-blue-800 mr-4">Editar</button>
                  <button onClick={() => deleteEspecie(specie.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EspeciesPecesCRUD;