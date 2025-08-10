
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor
import { getRulesContent, saveRulesContent } from '@/services/settingsService';

const Rules: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rulesContent, setRulesContent] = useState('');
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        const content = await getRulesContent();
        setRulesContent(content);
        setEditingContent(content);
      } catch (error) {
        console.error("Failed to fetch rules", error);
        setRulesContent("<p>No se pudo cargar el reglamento.</p>");
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveRulesContent(editingContent);
      setRulesContent(editingContent);
      setIsEditing(false);
    } catch (error) {
      alert("Error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingContent(rulesContent); // Revierte los cambios
    setIsEditing(false);
  };

  if (loading && !isEditing) {
    return <p>Cargando reglamento...</p>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reglamento del Torneo</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar Reglamento
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <ReactQuill 
            theme="snow"
            value={editingContent}
            onChange={setEditingContent}
            className="bg-white"
          />
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: rulesContent || '<p>Aún no se ha definido el reglamento.</p>' }}
        />
      )}
    </div>
  );
};

export default Rules;
