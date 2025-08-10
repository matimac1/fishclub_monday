import React, { useState, useEffect } from 'react';
import { useConcursantes } from '../context/ConcursantesContext';
import type { Team } from '../services/firestoreService';

// Props que el formulario aceptará desde App.tsx
interface ConcursanteFormProps {
  initialData: Team | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

// El estado del formulario ahora es más simple para coincidir con la BD
const initialFormData = {
    name: '', // Corresponde a nombre_embarcacion
    members: '', // Un string de nombres separados por coma
};

const ConcursanteForm: React.FC<ConcursanteFormProps> = ({ initialData, onFormSubmit, onCancel }) => {
  const { addTeam, updateTeam } = useConcursantes();
  const [formData, setFormData] = useState(initialFormData);
  const isEditing = !!initialData;

  // Si hay `initialData` (modo edición), llena el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        members: initialData.members.join(', '),
      });
    } else {
      setFormData(initialFormData); // Limpia el form si es para crear uno nuevo
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.members) {
      alert('El nombre del equipo y al menos un miembro son obligatorios.');
      return;
    }

    // Convierte el string de miembros en un array de strings
    const teamData = {
      name: formData.name,
      members: formData.members.split(',').map(m => m.trim()).filter(m => m),
    };

    try {
      if (isEditing && initialData) {
        // Lógica de Actualización
        await updateTeam(initialData.id, teamData);
      } else {
        // Lógica de Creación
        await addTeam({ ...teamData, totalPoints: 0 });
      }
      onFormSubmit(); // Vuelve a la lista de concursantes
    } catch (error) {
      console.error("Error al guardar el equipo:", error);
      alert("Hubo un error al guardar. Revisa la consola.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? `Editar Equipo: ${initialData?.name}` : 'Registrar Nuevo Equipo'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Equipo / Embarcación</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="members" className="block text-sm font-medium text-gray-700">Miembros (separados por comas)</label>
          <input
            id="members"
            name="members"
            type="text"
            value={formData.members}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Juan Pérez, María Gómez"
            required
          />
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {isEditing ? 'Guardar Cambios' : 'Registrar Equipo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConcursanteForm;