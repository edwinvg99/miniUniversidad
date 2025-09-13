import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold">
          MiniUniversidad
        </Link>
        <nav className="space-x-4 flex items-center">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin/subjects" className="hover:text-gray-300">
                    Materias
                  </Link>
                  <Link to="/admin/courses" className="hover:text-gray-300">
                    Cursos
                  </Link>
                </>
              ) : user.role === 'professor' ? (
                <>
                  <Link to="/teaching" className="hover:text-gray-300">
                    Mis Clases
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/courses" className="hover:text-gray-300">
                    Ver Cursos
                  </Link>
                  <Link to="/my-courses" className="hover:text-gray-300">
                    Mis Cursos
                  </Link>
                </>
              )}
              <span className="text-gray-300">Hola, {user.firstName}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 