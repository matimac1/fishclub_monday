import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import './index.css';
import { AuthProvider } from './src/context/AuthContext';
import { ConcursantesProvider } from './src/context/ConcursantesContext';
import { CatchesProvider } from './src/context/CatchesContext';
import { EspeciesProvider } from './src/context/EspeciesContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ConcursantesProvider>
        <CatchesProvider>
          <EspeciesProvider>
            <App />
          </EspeciesProvider>
        </CatchesProvider>
      </ConcursantesProvider>
    </AuthProvider>
  </React.StrictMode>
);
