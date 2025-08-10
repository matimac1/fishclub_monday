import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useConcursantes } from '../context/ConcursantesContext';
import { getSettings, AppSettings } from '@/services/settingsService';
import { Team } from '@/services/firestoreService';

// Subcomponente para la vista previa (se renderizará fuera de pantalla)
interface CertificatePreviewProps {
  concursante: Team;
  rank: number;
  settings: AppSettings;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ concursante, rank, settings }) => {
  return (
    <div 
      style={{
        width: '1040px', // Ancho estándar para una buena resolución
        height: '720px',
        position: 'relative',
        backgroundImage: `url(${settings.certificateBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: `${settings.certificateStyle.top}%`,
          left: `${settings.certificateStyle.left}%`,
          transform: 'translate(-50%, -50%)',
          color: settings.certificateStyle.color,
          fontSize: `${settings.certificateStyle.fontSize}px`,
          textAlign: settings.certificateStyle.textAlign,
          width: '80%',
        }}
      >
        <h1 className="font-bold text-4xl mb-4">Certificado de Ganador</h1>
        <p className="text-2xl mb-2">Se otorga a:</p>
        <p className="text-5xl font-bold mb-6">{concursante.name}</p>
        <p className="text-3xl">por obtener el <strong>{rank}° Lugar</strong></p>
        <p className="text-3xl">con un total de <strong>{concursante.totalPoints} puntos</strong>.</p>
      </div>
    </div>
  );
};


const GenerateCertificates: React.FC = () => {
  const { concursantes, loading: loadingConcursantes } = useConcursantes();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null); // Almacena el ID del concursante

  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSettings().then(data => {
      setSettings(data);
      setLoadingSettings(false);
    });
  }, []);

  const winners = useMemo(() => 
    [...concursantes].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)).slice(0, 3),
  [concursantes]);

  const handleGeneratePDF = async (concursante: Team) => {
    try {
      setIsGenerating(concursante.id);
  
      // Esperar a que la vista previa se monte/renderice
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
  
      if (!certificateRef.current) {
        alert("Error: No se pudo encontrar la plantilla del certificado.");
        return;
      }
  
      // Dar un pequeño margen para cargas (imagen de fondo, fuentes)
      await new Promise(res => setTimeout(res, 50));
  
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
  
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const safeName = (concursante.name || 'equipo').replace(/ /g, '_');
      pdf.save(`Certificado-${safeName}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Ocurrió un error al generar el PDF.');
    } finally {
      setIsGenerating(null);
    }
  };

  if (loadingConcursantes || loadingSettings) {
    return <p>Cargando datos para certificados...</p>;
  }

  if (!settings || !settings.certificateBgUrl) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Plantilla no configurada</h2>
        <p className="text-gray-600 mt-2">Por favor, ve a la sección de 'Ajustes' para subir una imagen de fondo y configurar la plantilla del certificado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Generador de Certificados</h2>
      <div className="space-y-4">
        {winners.map((winner, index) => (
          <div key={winner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-bold text-lg">{index + 1}° Lugar: {winner.name}</p>
              <p className="text-sm text-gray-600">{winner.totalPoints} puntos</p>
            </div>
            <button 
              onClick={() => handleGeneratePDF(winner)}
              disabled={!!isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isGenerating === winner.id ? 'Generando...' : 'Generar PDF'}
            </button>
          </div>
        ))}
      </div>

      {/* Contenedor oculto para la vista previa que será capturada */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }} ref={certificateRef}>
        {isGenerating && (
          <CertificatePreview 
            concursante={concursantes.find(c => c.id === isGenerating)!}
            rank={winners.findIndex(w => w.id === isGenerating) + 1}
            settings={settings}
          />
        )}
      </div>
    </div>
  );
};

export default GenerateCertificates;