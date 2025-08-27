// src/pages/ManageSpecies.tsx

import React, { useState, useEffect } from 'react';
import { getSpecies, addEspecie, updateEspecie, deleteEspecie } from '../services/firestoreService';
import { Species, PieceRule } from '../types';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useFiltro } from '../hooks/useFiltro';

// --- Componente del Formulario (sin cambios) ---
const SpeciesForm: React.FC<{
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Species | null;
}> = ({ onSuccess, onCancel, initialData }) => {
  const [name, setName] = useState('');
  const [rules, setRules] = useState<PieceRule[]>([
    { points: 0, size: 0, isMandatory: false },
    { points: 0, size: 0, isMandatory: false },
    { points: 0, size: 0, isMandatory: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      const initialRules = Array.from({ length: 3 }, (_, i) => 
        initialData.rules[i] || { points: 0, size: 0, isMandatory: false }
      );
      setRules(initialRules);
    } else {
      setName('');
      setRules([
        { points: 0, size: 0, isMandatory: false },
        { points: 0, size: 0, isMandatory: false },
        { points: 0, size: 0, isMandatory: false },
      ]);
    }
  }, [initialData]);

  const handleRuleChange = (index: number, field: keyof PieceRule, value: string | number | boolean) => {
    const newRules = [...rules];
    const numericValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
    // @ts-ignore
    newRules[index][field] = value === false || value === true ? value : numericValue;
    setRules(newRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('El nombre de la especie es obligatorio.');
      return;
    }
    setIsSubmitting(true);
    try {
      const dataToSave = { name, rules };
      if (isEditing) {
        await updateEspecie(initialData!.id, dataToSave);
      } else {
        await addEspecie(dataToSave);
      }
      onSuccess();
    } catch (error) {
      console.error("Error guardando especie:", error);
      alert("Error al guardar la especie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md mb-8 border">
      <h3 className="text-xl font-bold mb-6 border-b pb-4">{isEditing ? `Editando: ${initialData?.name}` : 'Nueva Especie'}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Especie *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-white block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rules.map((rule, index) => (
            <div key={`points-${index}`}>
              <label className="block text-sm font-medium text-gray-700">Puntos Pieza {index + 1}</label>
              <input type="number" value={rule.points} onChange={(e) => handleRuleChange(index, 'points', e.target.value)} className="bg-white mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rules.map((rule, index) => (
            <div key={`size-${index}`}>
              <label className="block text-sm font-medium text-gray-700">Medida (cm) Pieza {index + 1}</label>
              <div className="mt-1 flex items-center gap-2">
                <input type="number" value={rule.size} onChange={(e) => handleRuleChange(index, 'size', e.target.value)} className="bg-white block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                <input type="checkbox" checked={rule.isMandatory} onChange={(e) => handleRuleChange(index, 'isMandatory', e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded" title="Marcar como Medida Obligatoria" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onCancel} className="bg-white text-gray-800 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Especie')}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Componente de la Página Principal ---
const ManageSpecies: React.FC = () => {
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingSpecies, setEditingSpecies] = useState<Species | null>(null);
    
    // El hook ahora nos da las herramientas para controlar el input
    const { busqueda, setBusqueda, datosFiltrados } = useFiltro(speciesList, 'name');

    const loadSpecies = async () => {
        setLoading(true);
        try {
          const data = await getSpecies();
          data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          setSpeciesList(data);
        } catch (err) {
          setError("Error al cargar las especies.");
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => { loadSpecies(); }, []);

    const handleAddNew = () => {
        setEditingSpecies(null);
        setIsFormVisible(true);
    };

    const handleEdit = (species: Species) => {
        setEditingSpecies(species);
        setIsFormVisible(true);
    };

    const handleDelete = async (id: string) => {
        if(window.confirm("¿Seguro que quieres eliminar esta especie?")) {
            await deleteEspecie(id);
            loadSpecies();
        }
    };

    const handleSuccess = () => {
        setIsFormVisible(false);
        setEditingSpecies(null);
        loadSpecies();
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestión de Especies de Peces</h1>
            {!isFormVisible && (
              <button onClick={handleAddNew} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                <FaPlus /> Agregar Nueva Especie
              </button>
            )}
          </div>
    
          {isFormVisible && (
            <SpeciesForm onSuccess={handleSuccess} onCancel={() => setIsFormVisible(false)} initialData={editingSpecies} />
          )}
    
          <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Renderizamos nuestro propio input aquí */}
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre de especie..."
              className="block w-full max-w-sm border border-gray-300 rounded-md shadow-sm py-2 px-3 mb-4"
            />

            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especie</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">P. P1</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">P. P2</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">P. P3</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Med. P1 (cm)</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Med. P2 (cm)</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Med. P3 (cm)</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {datosFiltrados.map(s => (
                      <tr key={s.id}>
                        <td className="px-3 py-4 whitespace-nowrap font-medium">{s.name}</td>
                        <td className="px-3 py-4 text-center">{(s.rules[0]?.points) || '-'}</td>
                        <td className="px-3 py-4 text-center">{(s.rules[1]?.points) || '-'}</td>
                        <td className="px-3 py-4 text-center">{(s.rules[2]?.points) || '-'}</td>
                        <td className="px-3 py-4 text-center">{s.rules[0]?.size ? `${s.rules[0].size}${s.rules[0].isMandatory ? '*' : ''}` : '-'}</td>
                        <td className="px-3 py-4 text-center">{s.rules[1]?.size ? `${s.rules[1].size}${s.rules[1].isMandatory ? '*' : ''}` : '-'}</td>
                        <td className="px-3 py-4 text-center">{s.rules[2]?.size ? `${s.rules[2].size}${s.rules[2].isMandatory ? '*' : ''}` : '-'}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-900 mr-3"><FaEdit /></button>
                          <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
};

export default ManageSpecies;
