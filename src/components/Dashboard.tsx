import React, { useState, useMemo } from 'react';
import { useConcursantes } from '../context/ConcursantesContext';
import { useCatches } from '../context/CatchesContext';
import { useEspecies } from '../context/EspeciesContext';
import { generateComment } from '@/services/geminiService';
import { FishIcon } from './icons/FishIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { UsersIcon } from './icons/UsersIcon';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { concursantes, loading: loadingConcursantes } = useConcursantes();
    const { catches, loading: loadingCatches } = useCatches();
    const { especies, loading: loadingEspecies } = useEspecies();
    
    const [aiComment, setAiComment] = useState('Haz clic en "Actualizar Reporte" para obtener un comentario de la IA.');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const loading = loadingConcursantes || loadingCatches || loadingEspecies;

    const { leader, recentCatches } = useMemo(() => {
        const sortedTeams = [...concursantes].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
        const sortedCatches = [...catches].sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        return {
            leader: sortedTeams[0],
            recentCatches: sortedCatches.slice(0, 5),
        };
    }, [concursantes, catches]);

    const handleGenerateComment = async () => {
        setIsAiLoading(true);
        const lastCatch = recentCatches[0];
        const lastCatchSpecies = lastCatch ? especies.find(s => s.id === lastCatch.speciesId) : null;

        const prompt = `
            Actúa como un comentarista entusiasta de un torneo de pesca deportiva. 
            El público está ansioso por un resumen rápido y emocionante.
            Usa los siguientes datos para generar un comentario de 2 o 3 líneas:
            - Equipos totales: ${concursantes.length}
            - Capturas totales: ${catches.length}
            - Líder actual: ${leader ? leader.name : 'Aún no hay líder'}
            - Puntos del líder: ${leader ? leader.totalPoints : 0}
            - Última captura registrada: ${lastCatch ? `${lastCatch.member} pescó un ${lastCatchSpecies?.name || 'pez'} de ${lastCatch.size}cm.` : 'Aún no hay capturas.'}
            
            Genera un comentario vibrante y conciso. ¡Haz que suene emocionante!
        `;

        const comment = await generateComment(prompt);
        setAiComment(comment);
        setIsAiLoading(false);
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando datos del dashboard...</p>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Equipos Inscritos" value={concursantes.length} icon={<UsersIcon />} />
                <StatCard title="Capturas Totales" value={catches.length} icon={<FishIcon />} />
                <StatCard title="Líder Actual" value={leader?.name || 'N/A'} icon={<TrophyIcon />} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Comentario en Vivo (IA)</h2>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 min-h-[80px]">
                    <p className="text-gray-700 italic">{isAiLoading ? "La IA está analizando los datos..." : `"${aiComment}"`}</p>
                </div>
                <button onClick={handleGenerateComment} disabled={isAiLoading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                    Actualizar Reporte
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Capturas Recientes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2">
                                <th>Equipo</th><th>Pescador</th><th>Especie</th><th>Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCatches.map(c => {
                                const team = concursantes.find(t => t.id === c.teamId);
                                const species = especies.find(s => s.id === c.speciesId);
                                return (
                                    <tr key={c.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2 font-medium">{team?.name || 'N/A'}</td>
                                        <td className="p-2">{c.member}</td>
                                        <td className="p-2">{species?.name || 'N/A'}</td>
                                        <td className="p-2 font-semibold text-blue-600">{c.points}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;