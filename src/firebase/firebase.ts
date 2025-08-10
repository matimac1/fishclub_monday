import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig, { validateFirebaseEnv } from './config';
import { logEnvSummary } from '@/utils/verifyEnv';

// Validar variables de entorno de Firebase al inicio
validateFirebaseEnv();

// Imprimir resumen de entorno para depuración
logEnvSummary();

// Inicializa Firebase de forma segura para evitar re-inicialización
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa y exporta los servicios principales
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Inicializa Analytics solo si es compatible con el navegador
const analyticsPromise = isSupported().then(yes => (yes ? getAnalytics(app) : null));

export { app, db, auth, storage, analyticsPromise };