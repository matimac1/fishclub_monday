import React, { useState, useMemo, useEffect } from 'react';
import { useConcursantes } from '../context/ConcursantesContext';
import { useEspecies } from '../context/EspeciesContext';
import { useCatches } from '../context/CatchesContext';
import { Team, Species, Catch } from '@/services/firestoreService';
import { Timestamp } from 'firebase/firestore';

// El componente principal que orquesta la vista
const RegisterCatch: React.FC = () => {
  const { concursantes, loading: loadingConcursantes } = useConcursantes();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const selectedTeam = useMemo(() => 
    concursantes.find(c => c.id === selectedTeamId), 
  [concursantes, selectedTeamId]);

  if (loadingConcursantes) {
    return <p className="text-center">Cargando equipos...</p>;
  }

  // Si no hay equipo seleccionado, muestra el selector
  if (!selectedTeam) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Hoja de Fiscalización</h2>
        <p className="text-gray-600 mb-4">Seleccione un equipo para comenzar a registrar capturas.</p>
        <select 
          onChange={(e) => setSelectedTeamId(e.target.value)} 
          className="w-full p-2 border rounded-md bg-gray-50"
          defaultValue=""
        >
          <option value="" disabled>-- Elija un equipo --</option>
          {concursantes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    );
  }

  // Si se selecciona un equipo, muestra el dashboard de registro
  return <CatchRegistrationDashboard team={selectedTeam} />;
};

// Componente interno para manejar el registro una vez que se selecciona un equipo
const CatchRegistrationDashboard: React.FC<{ team: Team }> = ({ team }) => {
    const { especies } = useEspecies();
    const { catches, addCatch, deleteCatch, loading: loadingCatches } = useCatches();

    const [formState, setFormState] = useState({ member: '', speciesId: '', size: '' });

    const teamCatches = useMemo(() => 
        catches.filter(c => c.teamId === team.id).sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()),
    [catches, team.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { member, speciesId, size } = formState;

        if (!member || !speciesId || !size) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const species = especies.find(s => s.id === speciesId);
        if (!species) {
            alert('Especie no válida.');
            return;
        }

        const catchesOfSameSpecies = teamCatches.filter(c => c.speciesId === speciesId);
        if (catchesOfSameSpecies.length >= 3) {
            alert(`Límite de 3 piezas de ${species.name} alcanzado para este equipo.`);
            return;
        }

        let points = 0;
        const pieceNumber = catchesOfSameSpecies.length;
        if (species.piecePoints[pieceNumber]) {
            points = species.piecePoints[pieceNumber].points;
        }
        if (pieceNumber === 2) { // Bono para la 3ra pieza (índice 2)
            points *= 2;
        }

        const newCatch: Omit<Catch, 'id'> = {
            teamId: team.id,
            member,
            speciesId,
            size: Number(size),
            points,
            timestamp: Timestamp.now(),
        };

        try {
            await addCatch(newCatch);
            setFormState({ member: '', speciesId: '', size: '' }); // Reset form
        } catch (error) {
            console.error("Error al añadir la captura:", error);
            alert("No se pudo registrar la captura.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md h-fit">
                <h3 className="text-xl font-bold mb-4">Registrar Nueva Captura</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Miembro del Equipo</label>
                        <select name="member" value={formState.member} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                            <option value="" disabled>Seleccionar...</option>
                            {team.members.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Especie</label>
                        <select name="speciesId" value={formState.speciesId} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1">
                            <option value="" disabled>Seleccionar...</option>
                            {especies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Medida (cm)</label>
                        <input type="number" name="size" value={formState.size} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        + Añadir Captura
                    </button>
                </form>
            </div>

            {/* Columna Derecha: Lista de Capturas */}
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Capturas de: {team.name}</h3>
                {loadingCatches ? <p>Cargando...</p> : (
                    <div className="overflow-y-auto max-h-[500px]">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white"><tr><th>Especie</th><th>Medida</th><th>Puntos</th><th>Pescador</th><th>Acciones</th></tr></thead>
                            <tbody>
                                {teamCatches.map(c => {
                                    const species = especies.find(s => s.id === c.speciesId);
                                    return (
                                        <tr key={c.id} className="border-b"><td className="p-2">{species?.name || 'N/A'}</td><td>{c.size} cm</td><td>{c.points}</td><td>{c.member}</td>
                                            <td><button onClick={() => deleteCatch(c.id)} className="text-red-500 text-sm">Eliminar</button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {teamCatches.length === 0 && <p className="text-center text-gray-500 py-4">Este equipo aún no tiene capturas.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterCatch;