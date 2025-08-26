import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Providers
import { AuthProvider } from '@/context/AuthContext';
import { ConcursantesProvider } from '@/context/ConcursantesContext';
import { CatchesProvider } from '@/context/CatchesContext';
import { EspeciesProvider } from '@/context/EspeciesContext';

// Layout y Rutas
import PrivateRoute from '@/components/PrivateRoute';
import App from '@/App';
import Login from '@/pages/Login';
import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import RegisterCatch from '@/components/RegisterCatch';
import ConcursantesList from '@/components/ConcursantesList';
import Settings from '@/components/Settings';
import EspeciesPecesCRUD from '@/components/EspeciesPecesCRUD';
import Leaderboard from '@/components/Leaderboard';
import GenerateCertificates from '@/components/GenerateCertificates';
import Rules from '@/components/Rules';
import ManageTeams from '@/pages/ManageTeams';

import './index.css';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <PrivateRoute><App /></PrivateRoute>,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'register', element: <RegisterCatch /> },
      { path: 'manage-teams', element: <ManageTeams /> },
      { path: 'settings', element: <Settings /> },
      { path: 'especies', element: <EspeciesPecesCRUD /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'certificates', element: <GenerateCertificates /> },
      { path: 'rules', element: <Rules /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ConcursantesProvider>
        <CatchesProvider>
          <EspeciesProvider>
            <RouterProvider router={router} />
          </EspeciesProvider>
        </CatchesProvider>
      </ConcursantesProvider>
    </AuthProvider>
  </React.StrictMode>
);