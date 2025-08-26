// src/components/ConcursanteForm.tsx

import React, { useState, useEffect } from 'react';
import { Team, TeamFormData, Companion } from '../types';
import { calculateFullAge, getAgeInYears } from '../utils/dateUtils';
import { addTeam, updateTeam } from '../services/firestoreService';

const TOTAL_STEPS = 5;

const initialState: TeamFormData = {
  club: '', country: 'Paraguay', category: 'Nacional', distance: null,
  helmsmanName: '', helmsmanDob: '', helmsmanSex: '', helmsmanCategory: '', helmsmanAgeString: '', contactPhone: '',
  companions: [ { name: '', dob: '', sex: '', ageString: '', category: '' }, { name: '', dob: '', sex: '', ageString: '', category: '' } ],
  boatName: '', boatRegistration: '',
};

interface ConcursanteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Team | null;
}

const ConcursanteForm: React.FC<ConcursanteFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>(initialState);
  
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialState);
    }
  }, [initialData]);

  const nextStep = () => currentStep < TOTAL_STEPS && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleDataChange = (newData: Partial<TeamFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateTeam(initialData.id, formData);
      } else {
        await addTeam(formData);
      }
      onSuccess();
    } catch (error) {
      alert('Hubo un error al guardar los datos.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <Step1TeamInfo data={formData} onDataChange={handleDataChange} />;
      case 2: return <Step2HelmsmanInfo data={formData} onDataChange={handleDataChange} />;
      case 3: return <Step3CompanionsInfo data={formData} onDataChange={handleDataChange} />;
      case 4: return <Step4BoatInfo data={formData} onDataChange={handleDataChange} />;
      case 5: return <Step5Summary data={formData} />;
      default: return <p>Paso {currentStep} en construcción.</p>;
    }
  };
  
  const getStepTitle = (step: number) => {
      switch(step) {
          case 1: return 'Equipo';
          case 2: return 'Timonel';
          case 3: return 'Acompañantes';
          case 4: return 'Embarcación';
          case 5: return 'Resumen';
          default: return '';
      }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}</h1>
        <p className="mt-2 text-gray-600">Paso {currentStep} de {TOTAL_STEPS}: {getStepTitle(currentStep)}</p>
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          {renderCurrentStep()}
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between items-center">
            <button type="button" onClick={onCancel} className="text-gray-700 hover:text-gray-900">Cancelar</button>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} disabled={currentStep === 1 || isSubmitting} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50">Anterior</button>
              {currentStep < TOTAL_STEPS ? (
                <button type="button" onClick={nextStep} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Siguiente</button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:bg-green-400">
                  {isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Finalizar Registro')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StepProps { data: TeamFormData; onDataChange?: (newData: Partial<TeamFormData>) => void; }

const Step1TeamInfo: React.FC<StepProps> = ({ data, onDataChange }) => {
  const [countries, setCountries] = useState(['Paraguay', 'Argentina', 'Brasil', 'Uruguay']);
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value, type } = e.target; onDataChange({ [name]: type === 'number' ? parseFloat(value) || null : value }); };
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const selectedCountry = e.target.value; const category = selectedCountry === 'Paraguay' ? 'Nacional' : 'Internacional'; onDataChange({ country: selectedCountry, category }); };
  const handleAddNewCountry = () => { if (newCountry && !countries.includes(newCountry)) { const updatedCountries = [...countries, newCountry].sort(); setCountries(updatedCountries); const category = newCountry === 'Paraguay' ? 'Nacional' : 'Internacional'; onDataChange({ country: newCountry, category }); setNewCountry(''); setIsAddingCountry(false); } };
  return ( <div className="space-y-6"> <div> <label htmlFor="club" className="block text-sm font-medium text-gray-700">Club <span className="text-red-500">*</span></label> <input type="text" id="club" name="club" value={data.club || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500" required /> </div> <div> <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label> <div className="mt-1 flex items-center gap-2"> <select id="country" name="country" value={data.country || ''} onChange={handleCountryChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500"> {countries.map((c) => (<option key={c} value={c}>{c}</option>))} </select> <button type="button" onClick={() => setIsAddingCountry(true)} className="flex-shrink-0 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300" title="Añadir nuevo país">+</button> </div> </div> {data.country && ( <div className="mt-4 bg-green-50 p-3 rounded-md text-sm"> <span className="font-semibold text-green-800">Origen: </span> <span className="text-green-700">{data.category}</span> </div> )} {isAddingCountry && ( <div className="p-4 bg-gray-50 rounded-md border"> <label htmlFor="newCountry" className="block text-sm font-medium text-gray-600">Nombre del nuevo país</label> <div className="mt-1 flex items-center gap-2"> <input type="text" id="newCountry" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="Escribe aquí..." /> <button type="button" onClick={handleAddNewCountry} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Guardar</button> <button type="button" onClick={() => setIsAddingCountry(false)} className="text-gray-600 hover:text-gray-800">Cancelar</button> </div> </div> )} <div> <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distancia (km)</label> <input type="number" id="distance" name="distance" value={data.distance || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="Ej: 150" /> </div> </div> );
};

const Step2HelmsmanInfo: React.FC<StepProps> = ({ data, onDataChange }) => {
  const [ageError, setAgeError] = useState('');
  const ageInYears = getAgeInYears(data.helmsmanDob);

  useEffect(() => {
    const sex = data.helmsmanSex;
    let finalCategory = '';

    if (ageInYears !== null) {
      if (ageInYears < 18) {
        setAgeError('El timonel debe ser mayor de 18 años.');
        finalCategory = '';
      } else {
        setAgeError('');
        if (sex) {
            if (sex === 'Femenino') {
                finalCategory = 'Damas';
            } else { 
                if (ageInYears <= 54) finalCategory = 'General';
                else if (ageInYears <= 64) finalCategory = 'Senior';
                else if (ageInYears >= 65) finalCategory = 'Máster';
            }
        }
      }
    }
    
    onDataChange({ helmsmanCategory: finalCategory });
    
  }, [data.helmsmanDob, data.helmsmanSex, onDataChange, ageInYears]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
    
    if (name === 'helmsmanDob') {
        const ageString = calculateFullAge(value);
        onDataChange({ helmsmanAgeString: ageString });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800 border-b pb-2">Datos del Timonel</h2>
      <div>
        <label htmlFor="helmsmanName" className="block text-sm font-medium text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
        <input type="text" id="helmsmanName" name="helmsmanName" value={data.helmsmanName || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="helmsmanDob" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento <span className="text-red-500">*</span></label>
          <input type="date" id="helmsmanDob" name="helmsmanDob" value={data.helmsmanDob || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
          {ageError && <p className="text-red-500 text-sm mt-1">{ageError}</p>}
        </div>
        
        <div>
          <label htmlFor="helmsmanSex" className="block text-sm font-medium text-gray-700">Sexo <span className="text-red-500">*</span></label>
          <select id="helmsmanSex" name="helmsmanSex" value={data.helmsmanSex || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
      </div>
      {data.helmsmanAgeString && !ageError && (
        <div className="bg-gray-100 p-3 rounded-md text-sm">
            <span className="font-semibold text-gray-800">Edad: </span>
            <span className="text-gray-700">{data.helmsmanAgeString}</span>
        </div>
      )}
      {data.helmsmanCategory && !ageError && (
        <div className="bg-blue-50 p-3 rounded-md text-sm mt-4">
          <span className="font-semibold text-blue-800">Categoría: </span>
          <span className="text-blue-700">{data.helmsmanCategory}</span>
        </div>
      )}
      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Teléfono de Contacto <span className="text-red-500">*</span></label>
        <input type="tel" id="contactPhone" name="contactPhone" value={data.contactPhone || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="Ej: 0981 123 456" required />
      </div>
    </div>
  );
};

const Step3CompanionsInfo: React.FC<StepProps> = ({ data, onDataChange }) => {
  useEffect(() => {
    const updatedCompanions = data.companions?.map(comp => {
      const ageInYears = getAgeInYears(comp.dob);
      let sex = comp.sex;
      let finalCategory = '';

      if (ageInYears !== null) {
        if (ageInYears < 18) {
          sex = '';
          if (ageInYears <= 12) {
            finalCategory = 'Infantil';
          } else { 
            finalCategory = 'Juvenil';
          }
        } 
        else {
          if (sex === 'Femenino') {
            finalCategory = 'Damas';
          } else if (sex === 'Masculino') {
            if (ageInYears <= 54) finalCategory = 'General';
            else if (ageInYears <= 64) finalCategory = 'Senior';
            else if (ageInYears >= 65) finalCategory = 'Máster';
          }
        }
      }
      return { ...comp, sex, category: finalCategory };
    });

    if (JSON.stringify(updatedCompanions) !== JSON.stringify(data.companions)) {
        onDataChange({ companions: updatedCompanions });
    }

  }, [data.companions, onDataChange]);

  const handleCompanionChange = (index: number, field: keyof Omit<Companion, 'ageString' | 'category'>, value: string) => {
    const updatedCompanions = JSON.parse(JSON.stringify(data.companions || []));
    updatedCompanions[index][field] = value;
    
    if (field === 'dob') {
        updatedCompanions[index].ageString = calculateFullAge(value);
    }
    
    onDataChange({ companions: updatedCompanions });
  };
  
  return (
    <div className="space-y-8">
      {[0, 1].map((index) => {
        const companion = data.companions?.[index];
        const ageInYears = getAgeInYears(companion?.dob);

        return (
          <div key={index} className="space-y-6 border-b pb-8 last:border-b-0 last:pb-0">
            <h2 className="text-lg font-medium text-gray-800">
              {index === 0 ? 'Primer' : 'Segundo'} Acompañante (Opcional)
            </h2>
            
            <div>
              <label htmlFor={`companionName${index}`} className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input type="text" id={`companionName${index}`} value={companion?.name || ''} onChange={(e) => handleCompanionChange(index, 'name', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor={`companionDob${index}`} className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                <input type="date" id={`companionDob${index}`} value={companion?.dob || ''} onChange={(e) => handleCompanionChange(index, 'dob', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>

              {ageInYears !== null && ageInYears >= 18 && (
                <div>
                  <label htmlFor={`companionSex${index}`} className="block text-sm font-medium text-gray-700">Sexo</label>
                  <select id={`companionSex${index}`} value={companion?.sex || ''} onChange={(e) => handleCompanionChange(index, 'sex', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
              )}
            </div>
            
            {companion?.ageString && (
               <div className="bg-gray-100 p-3 rounded-md text-sm">
                  <span className="font-semibold text-gray-800">Edad: </span>
                  <span className="text-gray-700">{companion.ageString}</span>
              </div>
            )}

            {companion?.category && (
               <div className="bg-blue-50 p-3 rounded-md text-sm mt-4">
                  <span className="font-semibold text-blue-800">Categoría: </span>
                  <span className="text-blue-700">{companion.category}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Step4BoatInfo: React.FC<StepProps> = ({ data, onDataChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800 border-b pb-2">Datos de la Embarcación</h2>
      <div>
        <label htmlFor="boatName" className="block text-sm font-medium text-gray-700">Nombre de Embarcación</label>
        <input type="text" id="boatName" name="boatName" value={data.boatName || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
      </div>
      <div>
        <label htmlFor="boatRegistration" className="block text-sm font-medium text-gray-700">Matrícula</label>
        <input type="text" id="boatRegistration" name="boatRegistration" value={data.boatRegistration || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
      </div>
    </div>
  );
};

const SummaryItem: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
  </div>
);

const Step5Summary: React.FC<StepProps> = ({ data }) => {
  const validCompanions = data.companions?.filter(c => c.name && c.name.trim() !== '') || [];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Resumen de Inscripción</h2>
      <section>
        <h3 className="text-lg font-medium text-gray-800">Equipo</h3>
        <dl className="divide-y divide-gray-200"><SummaryItem label="Club" value={data.club} /><SummaryItem label="País" value={data.country} /><SummaryItem label="Origen" value={data.category} /><SummaryItem label="Distancia (km)" value={data.distance} /></dl>
      </section>
      <section>
        <h3 className="text-lg font-medium text-gray-800">Timonel</h3>
        <dl className="divide-y divide-gray-200"><SummaryItem label="Nombre" value={data.helmsmanName} /><SummaryItem label="Edad" value={data.helmsmanAgeString} /><SummaryItem label="Categoría" value={data.helmsmanCategory} /><SummaryItem label="Teléfono" value={data.contactPhone} /></dl>
      </section>
      {validCompanions.length > 0 && (
        <section>
          <h3 className="text-lg font-medium text-gray-800">Acompañantes</h3>
          {validCompanions.map((comp, index) => (
            <dl key={index} className="divide-y divide-gray-200 mt-4 border-t pt-4"><SummaryItem label={`Acompañante #${index + 1}`} value={<strong>{comp.name}</strong>} /><SummaryItem label="Edad" value={comp.ageString} /><SummaryItem label="Categoría" value={comp.category} /></dl>
          ))}
        </section>
      )}
      {(data.boatName || data.boatRegistration) && (
        <section>
          <h3 className="text-lg font-medium text-gray-800">Embarcación</h3>
          <dl className="divide-y divide-gray-200"><SummaryItem label="Nombre" value={data.boatName} /><SummaryItem label="Matrícula" value={data.boatRegistration} /></dl>
        </section>
      )}
    </div>
  );
};

export default ConcursanteForm;