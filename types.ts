
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

export interface EspeciePez {
    id: number;
    nombre: string;
    puntuacionPieza1: number;
    puntuacionPieza2: number;
    puntuacionPieza3: number;
    medidaCmPieza1: number;
    medidaCmPieza2: number;
    medidaCmPieza3: number;
    medidaObligatoriaPieza1: boolean;
    medidaObligatoriaPieza2: boolean;
    medidaObligatoriaPieza3: boolean;
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