import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import personIcon from '../assets/person-circle.svg';
import './UserMenu.css';

function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-icon" onClick={() => setIsOpen(!isOpen)}>
        <img src={personIcon} alt="User" />
      </button>

      {isOpen && (
        <div className="menu-dropdown">
          <div className="user-info">
            <p className="username">{user.username}</p>
            <p className="email">{user.email}</p>
            <p className="role">Role: {user.role}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu; 