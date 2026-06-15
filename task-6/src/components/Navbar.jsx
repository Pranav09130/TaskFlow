import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">TaskFlow</div>
      {user && (
        <div className="navbar-right">
          <span className="navbar-user">👋 {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
