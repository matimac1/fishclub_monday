import React, { useState, useEffect } from 'react';
import { uploadFile } from '@/services/storageService';
import { getSettings, saveSettings, AppSettings, CertificateStyle } from '@/services/settingsService';

const initialSettings: AppSettings = {
  logoUrl: '',
  certificateBgUrl: '',
  certificateStyle: {
    color: '#000000',
    fontSize: 24,
    textAlign: 'center',
    top: 50,
    left: 50,
  },
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const loadedSettings = await getSettings();
      if (loadedSettings) {
        setSettings(loadedSettings);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'certificateBg') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const path = type === 'logo' ? `logos/tournament_logo.png` : `backgrounds/certificate_bg.png`;
      const downloadURL = await uploadFile(file, path);
      
      setSettings(prev => ({
        ...prev,
        [type === 'logo' ? 'logoUrl' : 'certificateBgUrl']: downloadURL,
      }));

    } catch (error) {
      alert("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleStyleChange = (field: keyof CertificateStyle, value: any) => {
    setSettings(prev => ({
      ...prev,
      certificateStyle: { ...prev.certificateStyle, [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      alert('¡Configuración guardada con éxito!');
    } catch (error) {
      alert('Error al guardar la configuración.');
    }
  };

  if (loading) {
    return <p>Cargando configuración...</p>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Sección de Logo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Logotipo del Torneo</h2>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
        {settings.logoUrl && <img src={settings.logoUrl} alt="Logo Preview" className="mt-4 h-24" />}
      </div>

      {/* Sección de Certificado */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Plantilla de Certificado</h2>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'certificateBg')} />
        {settings.certificateBgUrl && <img src={settings.certificateBgUrl} alt="Cert Preview" className="mt-4 w-full" />}
        {/* Controles de estilo */}
      </div>

      <button onClick={handleSave} disabled={uploading} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
        {uploading ? 'Subiendo...' : 'Guardar Ajustes'}
      </button>
    </div>
  );
};

export default Settings;