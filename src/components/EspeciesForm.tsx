
import React, { useState, useEffect } from 'react';
import { useEspecies } from '../context/EspeciesContext';
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
      // Pad the piecePoints array to always have 3 entries for the form
      const paddedPoints = [...initialData.piecePoints];
      while (paddedPoints.length < 3) {
        paddedPoints.push({});
      }
      setPiecePoints(paddedPoints);
    } else {
      // Reset form for new entry
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

      if (size === undefined && points === undefined) continue; // Skip empty entries

      if (size === undefined || points === undefined || isNaN(size) || isNaN(points)) {
        alert('Todos los campos de Puntos y Medida deben ser números válidos si uno de ellos tiene valor.');
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {isEditing ? 'Editar Especie' : 'Agregar Nueva Especie'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {isEditing ? 'Guardar Cambios' : 'Agregar Especie'}
        </button>
        <button type="button" onClick={onFormClose} className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EspeciesForm;
