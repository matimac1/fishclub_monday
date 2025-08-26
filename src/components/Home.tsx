// src/components/Home.tsx

import React, { useState, useEffect } from 'react';
import { getTeams } from '../services/firestoreService';
import { Team } from '../types';
import { FaUsers, FaFish, FaTrophy, FaChartBar, FaCertificate, FaBookOpen } from 'react-icons/fa';

const DashboardCard = ({ title, description, icon, path }: { title: string; description: string; icon: React.ReactNode; path: string; }) => (
  <a href={path} className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    <div className="ml-4 text-gray-400">&gt;</div>
  </a>
);

const Home: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        // Ordenamos por número de equipo de forma descendente
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido al Sistema de Competencia</h1>
        <p className="mt-2 text-gray-600">Gestione todos los aspectos de la competencia de pesca desde aquí.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Gestionar Concursantes" description="Añadir, ver, editar y eliminar equipos." icon={<FaUsers />} path="/manage-teams" />
        <DashboardCard title="Gestionar Especies" description="Configurar especies, puntos y medidas." icon={<FaFish />} path="/manage-species" />
        <DashboardCard title="Registrar Captura" description="Introduce una nueva captura para un equipo." icon={<FaTrophy />} path="/register-catch" />
        <DashboardCard title="Ver Clasificación" description="Consultar la tabla de líderes en tiempo real." icon={<FaChartBar />} path="/leaderboard" />
        <DashboardCard title="Generar Certificados" description="Crear e imprimir diplomas para los ganadores." icon={<FaCertificate />} path="/generate-certificates" />
        <DashboardCard title="Ver Reglamento" description="Consultar las reglas oficiales de la competencia." icon={<FaBookOpen />} path="/rules" />
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Equipos Inscritos Recientemente ({teams.length})</h2>
        {loading ? (
          <p>Cargando lista de equipos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : teams.length === 0 ? (
          <p>Aún no hay equipos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Equipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concursantes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => {
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;