import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-700">LMS Portal</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/courses" className="hover:text-blue-600">Courses</Link>
          {user && <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>}
          {!user ? (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded">Register</Link>
            </>
          ) : (
            <>
              <span className="text-gray-600">Hi, {user.name}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
