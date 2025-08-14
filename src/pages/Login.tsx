import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { createNewSession } from "@/services/sessionService";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const allowedEmails = (import.meta.env.VITE_ALLOWED_EMAILS || '')
        .split(',')
        .map(e => e.trim().toLowerCase());

      if (user.email && !allowedEmails.includes(user.email.toLowerCase())) {
        await signOut(auth);
        setError("No tienes permiso para acceder.");
        setLoading(false);
        return;
      }

      await createNewSession(user.uid);

      navigate('/'); // Redirige a la página de inicio

    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else {
        setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
      console.error("Error de inicio de sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="p-8 rounded-xl border bg-white shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}