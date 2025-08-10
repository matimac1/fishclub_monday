import React from 'react';
import { useConcursantes } from '../context/ConcursantesContext';
import { Team } from '../services/firestoreService';
import { UsersIcon } from './icons/UsersIcon';

// El componente ahora recibe solo las funciones de navegación como props
interface ConcursantesListProps {
  onGoToForm: () => void;
  onEditTeam: (team: Team) => void;
}

const ConcursantesList: React.FC<ConcursantesListProps> = ({ onGoToForm, onEditTeam }) => {
    // Obtiene los datos y la lógica directamente del contexto
    const { concursantes, loading, deleteTeam } = useConcursantes();

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <p className="text-lg text-gray-600">Cargando concursantes...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Concursantes</h2>
                </div>
                <button
                    onClick={onGoToForm} // Conectado a la prop de navegación
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i>
                    Agregar Nuevo Equipo
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="p-4">#</th>
                            <th className="p-4">Equipo / Embarcación</th>
                            <th className="p-4">Miembros</th>
                            <th className="p-4">Puntos</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {concursantes.map((concursante, index) => (
                            <tr key={concursante.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                <td className="p-4 font-bold text-blue-600">{index + 1}</td>
                                <td className="p-4 font-medium text-gray-900">{concursante.name}</td>
                                <td className="p-4 text-gray-600">{concursante.members.join(', ')}</td>
                                <td className="p-4 font-semibold text-gray-800">{concursante.totalPoints || 0}</td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => onEditTeam(concursante)} className="text-blue-600 hover:text-blue-800" title="Editar">
                                            <i className="fa-solid fa-pencil"></i>
                                        </button>
                                        <button onClick={() => deleteTeam(concursante.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {concursantes.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-8">No hay equipos registrados todavía.</p>
                )}
            </div>
        </div>
    );
};

export default ConcursantesList;