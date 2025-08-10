# Estado Actual del Proyecto: Sistema de Competencia de Pesca (fishclub_monday)

**Fecha de Análisis:** 24 de Mayo de 2024

## 1. Resumen General y Objetivo

El proyecto es un dashboard para administrar competencias de pesca deportiva, desarrollado con React (TypeScript) y Firebase. El objetivo es proporcionar una herramienta completa para los organizadores de eventos. El proyecto ha sido migrado de una persistencia con `localStorage` a Firestore, y la conexión está funcionando. La estructura de componentes está bien definida, aunque parte de la lógica aún podría estar ligada a la implementación anterior (`localStorageUtils.ts`).

## 2. Stack Tecnológico

- **Framework Frontend:** React 18+ con TypeScript
- **Build Tool:** Vite
- **Estilos:** CSS (probablemente con Tailwind, a confirmar)
- **Backend como Servicio (BaaS):** Firebase
  - **Autenticación:** A implementar.
  - **Base de Datos:** Firestore
- **IA Generativa:** `@google/genai` (integrado a través de `geminiService.ts`)

## 3. Estructura de Archivos

.
├── App.tsx
├── components
│ ├── Admin.tsx
│ ├── ConcursanteForm.tsx
│ ├── ConcursantesList.tsx
│ ├── Dashboard.tsx
│ ├── EspeciesPecesCRUD.tsx
│ ├── GenerateCertificates.tsx
│ ├── Header.tsx
│ ├── Home.tsx
│ ├── icons
│ │ ├── FishIcon.tsx
│ │ ├── TrophyIcon.tsx
│ │ └── UsersIcon.tsx
│ ├── Leaderboard.tsx
│ ├── RegisterCatch.tsx
│ ├── Rules.tsx
│ └── Settings.tsx
├── constants.ts
├── index.css
├── index.html
├── index.tsx
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── services
│ └── geminiService.ts
├── src
│ └── firebase.js
├── tsconfig.json
├── types.ts
└── utils
│ ├── categorias.ts
│ └── localStorageUtils.ts
└── vite.config.ts
*(Nota: La imagen muestra una estructura un poco desorganizada con componentes tanto en la raíz como en `/components`. Esto podría ser un punto a refactorizar).*

## 4. Análisis de la Estructura y Lógica

- **Componentes:** Existe una mezcla de componentes en la raíz (`/`) y dentro de `/components`. Parece que los archivos en la raíz son versiones antiguas o páginas completas, mientras que `/components` contiene las versiones más modulares y actuales. Los componentes cubren todas las funcionalidades clave del dashboard.
- **Servicios:** Se ha creado un `geminiService.ts`, lo cual es excelente. Falta un `firestoreService.ts` para centralizar toda la comunicación con la base de datos y mantener los componentes más limpios.
- **Utils:** La presencia de `localStorageUtils.ts` confirma la migración reciente. Este archivo debe ser reemplazado progresivamente por llamadas al futuro `firestoreService.ts`.
- **Configuración de Firebase:** La configuración está en `src/firebase.js`. Sería ideal moverla a una carpeta más consistente como `src/firebase/config.ts` y convertirla a TypeScript.
- **Tipos:** Existe un archivo `types.ts`, lo cual es una muy buena práctica para centralizar las interfaces de TypeScript.

## 5. Funcionalidades Implementadas

- Estructura completa de componentes para todas las vistas del dashboard.
- Conexión inicial a Firebase establecida.
- Servicio para interactuar con la API de Gemini.
- Lógica de negocio (posiblemente funcional pero obsoleta) que utiliza `localStorage`.

## 6. Roadmap y Siguientes Pasos (Acciones Recomendadas)

1.  **Refactorización y Organización:**
    *   Mover todos los archivos de componentes (como `App.tsx`, `Dashboard.tsx`, etc.) a la carpeta `/src`.
    *   Crear una carpeta `src/pages` para los componentes que representan una página completa (Home, Dashboard, Admin) y `src/components` para los reutilizables (Header, DashboardCard).
    *   Convertir `src/firebase.js` a `src/firebase/config.ts`.
    *   Centralizar todas las interacciones con Firestore en un nuevo archivo: `src/services/firestoreService.ts`.

2.  **Migración de Lógica:**
    *   Revisar cada componente (`ConcursantesList`, `EspeciesPecesCRUD`, etc.).
    *   Identificar dónde se llama a `localStorageUtils`.
    *   Reemplazar esas llamadas por funciones asíncronas que interactúen con `firestoreService.ts`.

3.  **Implementar CRUD de Concursantes:**
    *   Usando el componente `ConcursantesList.tsx` y `ConcursanteForm.tsx`, conectar la lectura y escritura a una colección `teams` o `competitors` en Firestore.

4.  **Implementar CRUD de Especies:**
    *   Conectar `EspeciesPecesCRUD.tsx` a la colección `species` en Firestore.

## 7. Puntos de Dolor y Dudas Actuales

- La estructura de archivos actual es confusa y dificulta la navegación y el mantenimiento.
- La lógica de negocio está acoplada a `localStorage`, lo que impide el funcionamiento en tiempo real y multiusuario.
- Falta una capa de servicio clara para las operaciones de base de datos, lo que puede llevar a código repetitivo en los componentes.

