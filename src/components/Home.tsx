
import React from 'react';
import { useConcursantes } from '@/context/ConcursantesContext';
import type { Page } from '@/types';

// La prop `concursantes` se elimina, ahora se obtiene del contexto.
interface HomeProps {
    setActivePage: (page: Page) => void;
}

const ActionButton: React.FC<{ icon: string; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-blue-50 transition-all text-left w-full flex items-center gap-6"
    >
        <div className="text-blue-600 bg-blue-100 p-4 rounded-lg">
            <i className={`fa-solid ${icon} fa-2x`}></i>
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
        <i className="fa-solid fa-chevron-right text-gray-400 ml-auto"></i>
    </button>
);


const Home: React.FC<HomeProps> = ({ setActivePage }) => {
    // Se obtienen los datos y el estado de carga desde el contexto.
    const { concursantes: concursantesCtx, loading } = useConcursantes();

    // Se aplica el fallback para evitar errores si los datos son undefined/null.
    const concursantes = concursantesCtx ?? [];

    // Se añade el render de estado de carga.
    if (loading) {
        return <p>Cargando datos de la competencia...</p>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Sistema de Competencia</h1>
                <p className="mt-2 text-lg text-gray-600">Gestione todos los aspectos de la competencia de pesca desde aquí.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionButton 
                    icon="fa-users" 
                    title="Gestionar Concursantes" 
                    description="Añadir, ver, editar y eliminar equipos."
                    onClick={() => setActivePage('concursantes')}
                />
                 <ActionButton 
                    icon="fa-fish-fins" 
                    title="Gestionar Especies" 
                    description="Configurar especies, puntos y medidas."
                    onClick={() => setActivePage('especies')}
                />
                <ActionButton 
                    icon="fa-plus-circle" 
                    title="Registrar Captura" 
                    description="Introducir una nueva captura para un equipo."
                    onClick={() => setActivePage('register')}
                />
                <ActionButton 
                    icon="fa-trophy" 
                    title="Ver Clasificación" 
                    description="Consultar la tabla de líderes en tiempo real."
                    onClick={() => setActivePage('leaderboard')}
                />
                 <ActionButton 
                    icon="fa-chart-pie" 
                    title="Ver Dashboard" 
                    description="Estadísticas y reporte del día."
                    onClick={() => setActivePage('dashboard')}
                />
                 <ActionButton 
                    icon="fa-cog" 
                    title="Ajustes del Sistema" 
                    description="Cargar el logotipo y configurar otros detalles."
                    onClick={() => setActivePage('settings')}
                />
                <ActionButton 
                    icon="fa-award" 
                    title="Generar Certificados" 
                    description="Crear e imprimir diplomas para los ganadores."
                    onClick={() => setActivePage('certificates')}
                />
                <ActionButton 
                    icon="fa-scroll" 
                    title="Ver Reglamento" 
                    description="Consultar las reglas oficiales de la competencia."
                    onClick={() => setActivePage('rules')}
                />
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Equipos Inscritos ({concursantes.length})</h2>
                {concursantes.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-3">Equipo</th>
                                <th className="p-3">Miembros</th>
                                <th className="p-3">Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {concursantes.slice(0, 5).map(c => (
                                <tr key={c.id} className="border-b border-gray-100">
                                    <td className="p-3 font-semibold text-blue-600">{c.name}</td>
                                    <td className="p-3">{c.members.join(', ')}</td>
                                    <td className="p-3 font-bold text-gray-700">{c.totalPoints || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {concursantes.length > 5 && (
                        <div className="text-center mt-4">
                             <button onClick={() => setActivePage('concursantes')} className="text-sm font-medium text-blue-600 hover:underline">
                                Ver todos los equipos...
                            </button>
                        </div>
                    )}
                </div>
                 ) : (
                    <div className="text-center text-gray-500 py-8">
                        <i className="fa-solid fa-ship fa-2x mb-2"></i>
                        <p>Aún no hay equipos inscritos.</p>
                        <button onClick={() => setActivePage('concursanteForm')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            ¡Inscribe el primer equipo!
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Home;
