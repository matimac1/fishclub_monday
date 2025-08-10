import React, { useMemo } from 'react';
import { useConcursantes } from '../context/ConcursantesContext';
import { useCatches } from '../context/CatchesContext';
import { TrophyIcon } from './icons/TrophyIcon';

const getRankColor = (rank: number) => {
    if (rank === 0) return 'bg-yellow-400 text-white';
    if (rank === 1) return 'bg-gray-300 text-gray-800';
    if (rank === 2) return 'bg-yellow-600 text-white';
    return 'bg-gray-100 text-gray-700';
};

const Leaderboard: React.FC = () => {
    const { concursantes, loading: loadingConcursantes } = useConcursantes();
    const { catches, loading: loadingCatches } = useCatches();

    const loading = loadingConcursantes || loadingCatches;

    const sortedTeams = useMemo(() => 
        [...concursantes].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)), 
    [concursantes]);

    const individualRankings = useMemo(() => {
        const memberPoints = new Map<string, number>();
        catches.forEach(c => {
            memberPoints.set(c.member, (memberPoints.get(c.member) || 0) + c.points);
        });
        return Array.from(memberPoints.entries())
            .map(([member, totalPoints]) => ({ member, totalPoints }))
            .sort((a, b) => b.totalPoints - a.totalPoints);
    }, [catches]);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando clasificaciones...</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Clasificación General (por Equipo) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4 mb-6">
                    <TrophyIcon className="h-8 w-8 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Clasificación por Equipo</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2">
                                <th className="p-2 text-center">#</th>
                                <th className="p-2">Equipo</th>
                                <th className="p-2 text-right">Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTeams.map((team, index) => (
                                <tr key={team.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2 text-center">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${getRankColor(index)}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="p-2 font-medium">{team.name}</td>
                                    <td className="p-2 text-right font-bold text-blue-600">{team.totalPoints || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Clasificación Individual */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex items-center gap-4 mb-6">
                    <i className="fa-solid fa-user-tag text-2xl text-blue-600"></i>
                    <h2 className="text-2xl font-bold text-gray-800">Clasificación Individual</h2>
                 </div>
                 <div className="space-y-2">
                    {individualRankings.map((ranking, index) => (
                        <div key={ranking.member} className="flex items-center gap-3 p-2 rounded-md bg-gray-50 border-l-4 border-blue-500">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${getRankColor(index)}`}>
                                {index + 1}
                            </span>
                            <p className="flex-grow font-semibold text-gray-800">{ranking.member}</p>
                            <p className="font-bold text-blue-600">{ranking.totalPoints} pts</p>
                        </div>
                    ))}
                    {individualRankings.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No hay capturas para mostrar ranking individual.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default Leaderboard;