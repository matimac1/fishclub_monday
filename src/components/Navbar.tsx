import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Mi App de Pesca</h1>
      {user && (
        <div>
          <span>{user.email}</span>
          <button onClick={handleLogout} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}