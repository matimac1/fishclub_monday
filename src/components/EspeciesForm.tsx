
import React, { useState, useEffect } from 'react';
import { useEspecies } from '@/context/EspeciesContext';
import type { Species, PiecePoints } from '@/services/firestoreService';

interface EspeciesFormProps {
  initialData: Species | null;
  onFormClose: () => void;
}

const EspeciesForm: React.FC<EspeciesFormProps> = ({ initialData, onFormClose }) => {
  const { addEspecie, updateEspecie } = useEspecies();
  const [name, setName] = useState('');
  const [piecePoints, setPiecePoints] = useState<Partial<PiecePoints>[]>([{}, {}, {}]);
  const [mandatorySize, setMandatorySize] = useState(true);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMandatorySize(initialData.mandatorySize);
      const paddedPoints = [...(initialData.piecePoints || [])];
      while (paddedPoints.length < 3) {
        paddedPoints.push({});
      }
      setPiecePoints(paddedPoints);
    } else {
      setName('');
      setPiecePoints([{}, {}, {}]);
      setMandatorySize(true);
    }
  }, [initialData]);

  const handlePointsChange = (index: number, field: keyof PiecePoints, value: string) => {
    const newPiecePoints = [...piecePoints];
    const numValue = value === '' ? undefined : Number(value);
    newPiecePoints[index] = { ...newPiecePoints[index], [field]: numValue };
    setPiecePoints(newPiecePoints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('El nombre de la especie es obligatorio.');
      return;
    }

    const finalPiecePoints: PiecePoints[] = [];
    for (const item of piecePoints) {
      const size = item.size;
      const points = item.points;
      if (size === undefined && points === undefined) continue;
      if (size === undefined || points === undefined || isNaN(size) || isNaN(points)) {
        alert('Si se define Puntos o Medida para una pieza, ambos campos son obligatorios.');
        return;
      }
      finalPiecePoints.push({ size, points });
    }

    const specieData = { name, piecePoints: finalPiecePoints, mandatorySize };

    try {
      if (isEditing && initialData) {
        await updateEspecie(initialData.id, specieData);
      } else {
        await addEspecie(specieData);
      }
      onFormClose();
    } catch (error) {
      console.error("Error guardando la especie:", error);
      alert("No se pudo guardar la especie.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-b-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la Especie</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
        </div>

        <div className="space-y-4">
          {[0, 1, 2].map(index => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded-md border">
              <p className="md:col-span-2 text-md font-semibold text-gray-600">Pieza #{index + 1}</p>
              <div>
                <label className="block text-xs text-gray-600">Puntos</label>
                <input type="number" placeholder="Ej: 100" value={piecePoints[index]?.points ?? ''} onChange={(e) => handlePointsChange(index, 'points', e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Medida (cm)</label>
                <input type="number" placeholder="Ej: 50" value={piecePoints[index]?.size ?? ''} onChange={(e) => handlePointsChange(index, 'size', e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="mandatorySize" checked={mandatorySize} onChange={(e) => setMandatorySize(e.target.checked)} className="h-4 w-4 rounded" />
          <label htmlFor="mandatorySize" className="ml-2 block text-sm text-gray-900">¿La medida es obligatoria para puntuar?</label>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button type="button" onClick={onFormClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{isEditing ? 'Guardar Cambios' : 'Agregar Especie'}</button>
        </div>
      </form>
    </div>
  );
};

export default EspeciesForm;
