// src/components/ConcursantesList.tsx

import React, { useState, useEffect } from 'react';
import { getTeams, deleteTeam } from '../services/firestoreService';
import { Team } from '../types';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Props {
  onAddNewTeam: () => void;
  onEditTeam: (team: Team) => void;
}

const ConcursantesList: React.FC<Props> = ({ onAddNewTeam, onEditTeam }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const teamsData = await getTeams();
        teamsData.sort((a, b) => (b.teamNumber || "").localeCompare(a.teamNumber || ""));
        setTeams(teamsData);
      } catch (err) {
        setError("Error al cargar la lista de equipos.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleDelete = async (id: string, teamNumber: string) => {
    if (window.confirm(`¿Seguro que quieres eliminar el equipo ${teamNumber}?`)) {
      try {
        await deleteTeam(id);
        setTeams(teams.filter(team => team.id !== id));
      } catch (err) {
        setError("Error al eliminar el equipo.");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Concursantes</h2>
        <button
          onClick={onAddNewTeam}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          + Agregar Nuevo Equipo
        </button>
      </div>
      
      {loading && <p>Cargando lista de concursantes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Equipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concursantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                <th className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team) => {
                // Lógica para unir al timonel y los acompañantes
                const contestants = [
                  team.helmsmanName,
                  ...(team.companions || []).filter(c => c.name).map(c => c.name)
                ].filter(Boolean).join(', ');

                return (
                  <tr key={team.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.teamNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contestants}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.club}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onEditTeam(team)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <FaEdit className="h-5 w-5 inline-block" />
                      </button>
                      <button onClick={() => handleDelete(team.id, team.teamNumber || team.id)} className="text-red-600 hover:text-red-900">
                        <FaTrash className="h-5 w-5 inline-block" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConcursantesList;
