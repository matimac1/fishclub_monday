import React, { useState } from 'react';
import { useConcursantes } from '@/context/ConcursantesContext';
import { Team } from '@/services/firestoreService';
import { UsersIcon } from './icons/UsersIcon';
import ConcursanteForm from './ConcursanteForm'; // Importamos el formulario

// El componente ya no necesita recibir props para la navegación del formulario
const ConcursantesList: React.FC = () => {
    const { concursantes, loading, deleteTeam } = useConcursantes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    const handleOpenModalForNew = () => {
        setEditingTeam(null); // Aseguramos que no haya datos de edición
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (team: Team) => {
        setEditingTeam(team);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTeam(null);
    };

    if (loading) {
        return <p className="text-center text-gray-600">Cargando concursantes...</p>;
    }

    return (
        <>
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <UsersIcon className="h-8 w-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Lista de Concursantes</h2>
                    </div>
                    <button
                        onClick={handleOpenModalForNew}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Agregar Nuevo Equipo
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {/* ... El resto de la tabla de concursantes ... */}
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
                                <tr key={concursante.id} className="border-b border-gray-100 hover:bg-blue-50">
                                    <td className="p-4 font-bold text-blue-600">{index + 1}</td>
                                    <td className="p-4 font-medium">{concursante.name}</td>
                                    <td className="p-4 text-gray-600">{concursante.members.join(', ')}</td>
                                    <td className="p-4 font-semibold">{concursante.totalPoints || 0}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-4">
                                            <button onClick={() => handleOpenModalForEdit(concursante)} className="text-blue-600 hover:text-blue-800" title="Editar">
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
                </div>
            </div>

            {/* Renderizado condicional del Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
                        <ConcursanteForm 
                            initialData={editingTeam}
                            onFormSubmit={handleCloseModal} // Cierra el modal al guardar
                            onCancel={handleCloseModal} // Cierra el modal al cancelar
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ConcursantesList;