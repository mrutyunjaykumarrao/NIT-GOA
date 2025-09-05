import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// import { useTheme } from '../../contexts/ThemeContext';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const { user, logout, openLoginModal } = useAuth();
  // const { theme } = useTheme(); // Commented out - unused variable
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    // Navigate to home page after logout instead of opening login modal
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // TODO: Navigate to profile page when implemented
    console.log('Navigate to profile page');
  };

  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    if (user?.role === 'Admin') {
      navigate('/admin');
    }
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    // TODO: Navigate to settings page when implemented
    console.log('Navigate to settings page');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return user?.name || user?.username || 'User';
  };

  const getUserRole = () => {
    return user?.role || 'User';
  };

  if (!user) {
    return (
      <button 
        className="profile-dropdown-login-btn"
        onClick={() => navigate('/login')}
        aria-label="Login"
      >
        <i className="fas fa-sign-in-alt"></i>
        <span>Login</span>
      </button>
    );
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-dropdown-trigger"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label="User menu"
        title={`${getUserDisplayName()} (${getUserRole()})`}
      >
        <div className="profile-dropdown-avatar">
          <span className="profile-dropdown-initials">
            {getInitials(getUserDisplayName())}
          </span>
        </div>
      </button>

      {isDropdownOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-avatar-large">
              <span className="profile-dropdown-initials">
                {getInitials(getUserDisplayName())}
              </span>
            </div>
            <div className="profile-dropdown-user-info">
              <p className="profile-dropdown-display-name">{getUserDisplayName()}</p>
              <p className="profile-dropdown-user-role">{getUserRole()}</p>
              {user?.email && (
                <p className="profile-dropdown-email">{user.email}</p>
              )}
            </div>
          </div>

          <div className="profile-dropdown-divider"></div>

          <div className="profile-dropdown-section">
            {user?.role === 'Admin' && (
              <button 
                className="profile-dropdown-item"
                onClick={handleDashboardClick}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Admin Dashboard</span>
              </button>
            )}
            
            <button 
              className="profile-dropdown-item"
              onClick={handleProfileClick}
            >
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </button>

            <button 
              className="profile-dropdown-item"
              onClick={handleSettingsClick}
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </button>
          </div>

          <div className="profile-dropdown-divider"></div>

          <div className="profile-dropdown-section">
            <button 
              className="profile-dropdown-item profile-dropdown-logout"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
