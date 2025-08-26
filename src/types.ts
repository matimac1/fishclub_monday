export type Sexo = 'Masculino' | 'Femenino' | '';
export type Categoria = 'Infantil' | 'Juvenil' | 'Damas' | 'Adultos (Masculino)' | 'Senior' | 'Máster' | '';

export interface Persona {
  nombre: string;
  edad: number | '';
  sexo: Sexo;
  categoria: Categoria;
}

export interface Concursante {
  id: number;
  numero_equipo: number | '';
  club: string;
  distancia: number | '';
  pais: string;
  nombre_embarcacion: string;
  matricula: string;
  telefono: string;
  timonero: Persona;
  acompanante1?: Persona;
  acompanante2?: Persona;
  totalPoints: number;
}

export interface PieceRule {
  points: number;
  size: number;
  isMandatory: boolean;
}

export interface Species {
  id: string;
  name: string;
  rules: PieceRule[]; // Un array que contendrá hasta 3 reglas
}

export interface Catch {
  id: number;
  equipoId: number;
  miembroNombre: string; // Nombre del miembro del equipo que realizó la captura
  especieId: number;
  especieNombre: string;
  piezaNum: number; // 1, 2, o 3
  medidaCm?: number; // Medida en cm, opcional
  timestamp: Date;
  points: number;
}

export interface IndividualRanking extends Persona {
  totalPoints: number;
  equipoNombre: string;
}

export interface CertificateTextConfig {
    x: number;
    y: number;
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
}

export interface CertificateTemplate {
    backgroundImage: string; // Base64 encoded image
    textConfig: CertificateTextConfig;
}


export type Page = 'home' | 'dashboard' | 'leaderboard' | 'register' | 'rules' | 'concursantes' | 'concursanteForm' | 'especies' | 'settings' | 'certificates';

export interface TeamFormData {
  club: string;
  country: string;
  category: 'Nacional' | 'Internacional';
  distance: number | null;
  helmsmanName: string;
  helmsmanDob: string; // Antes era 'helmsmanAge: number | null'
  helmsmanSex: 'Masculino' | 'Femenino' | '';
  helmsmanCategory: string;
  contactPhone: string;
  companions?: Companion[];
  boatName?: string;
  boatRegistration?: string;
  helmsmanAgeString?: string; // Nuevo campo
  teamNumber: string; // Ej: "001"
}

export interface Companion {
  name: string;
  dob: string; // Antes era 'age: number | null'
  sex: 'Masculino' | 'Femenino' | '';
  ageString?: string; // Nuevo campo para la edad calculada
  category?: string;
}