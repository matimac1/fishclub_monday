import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Aumenta el límite para evitar el warning
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa React
          react: ['react', 'react-dom'],
          // Separa Firebase
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage'
          ],
          // Separa librerías pesadas (si las usas)
          editor: ['react-quill'],
          pdf: ['jspdf', 'html2canvas']
        }
      }
    }
  }
})
