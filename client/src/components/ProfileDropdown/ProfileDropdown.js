import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// import { useTheme } from '../../contexts/ThemeContext';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const { user, logout, openLoginModal } = useAuth();
  // const { theme } = useTheme(); // Commented out - unused variable
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch user image when user data is available
  useEffect(() => {
    const fetchUserImage = async () => {
      if (!user?.employee_code || !user?.role) {
        // If user has employee_image directly from auth, use it
        if (user?.employee_image) {
          const imageUrl = user.employee_image.startsWith('/') 
            ? user.employee_image 
            : `/${user.employee_image}`;
          
          // Test if the image actually exists
          const img = new Image();
          img.onload = () => {
            setUserImage(imageUrl);
            setImageError(false);
          };
          img.onerror = () => {
            setUserImage(null);
            setImageError(true);
          };
          img.src = imageUrl;
        }
        return;
      }
      
      try {
        let imageUrl = null;
        
        // If user already has employee_image from auth response, use it first
        if (user.employee_image) {
          imageUrl = user.employee_image.startsWith('/') 
            ? user.employee_image 
            : `/${user.employee_image}`;
        } else if (user.role === 'Faculty') {
          // For faculty, fetch their profile image from the faculty endpoint
          const response = await fetch(`/api/public/faculty/${user.employee_code}`);
          if (response.ok) {
            const facultyData = await response.json();
            if (facultyData.profile?.profile_image) {
              imageUrl = facultyData.profile.profile_image.startsWith('/') 
                ? facultyData.profile.profile_image 
                : `/${facultyData.profile.profile_image}`;
            }
          }
        }
        
        if (imageUrl) {
          // Test if the image actually exists
          const img = new Image();
          img.onload = () => {
            setUserImage(imageUrl);
            setImageError(false);
          };
          img.onerror = () => {
            setUserImage(null);
            setImageError(true);
          };
          img.src = imageUrl;
        }
      } catch (error) {
        console.error('Error fetching user image:', error);
        setUserImage(null);
        setImageError(true);
      }
    };

    fetchUserImage();
  }, [user?.employee_code, user?.role, user?.employee_image]);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    // Navigate to home page after logout instead of opening login modal
    navigate('/');
  };

  // Handle hover interactions
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Small delay to prevent flickering when moving between avatar and dropdown
    setHoverTimeout(timeout);
  };

  // All navigation will now be handled during login, so we only need logout handler

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
    if (user?.honorific && user?.employee_name) {
      return `${user.honorific} ${user.employee_name}`;
    }
    return user?.employee_name || user?.name || user?.username || 'User';
  };

  const getUserRole = () => {
    return user?.role || 'User';
  };

  const handleLoginClick = () => {
    // Always navigate to /login but pass current location as state 
    // so the login route knows what page to show as background
    navigate('/login', { 
      state: { 
        from: { 
          pathname: location.pathname,
          search: location.search,
          hash: location.hash
        } 
      } 
    });
  };

  if (!user) {
    return (
      <button 
        className="profile-dropdown-login-btn"
        onClick={handleLoginClick}
        aria-label="Login"
      >
        <i className="fas fa-sign-in-alt"></i>
        <span>Login</span>
      </button>
    );
  }

  return (
    <div 
      className="profile-dropdown" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="profile-dropdown-trigger"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label="User menu"
        title={`${getUserDisplayName()} (${getUserRole()})`}
      >
        <div className="profile-dropdown-avatar">
          {userImage && !imageError ? (
            <img 
              src={userImage} 
              alt={getUserDisplayName()}
              className="profile-dropdown-avatar-img"
              onError={() => {
                setImageError(true);
                setUserImage(null);
              }}
            />
          ) : (
            <span className="profile-dropdown-initials">
              {getInitials(getUserDisplayName())}
            </span>
          )}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-avatar-large">
              {userImage && !imageError ? (
                <img 
                  src={userImage} 
                  alt={getUserDisplayName()}
                  className="profile-dropdown-avatar-large-img"
                  onError={() => {
                    setImageError(true);
                    setUserImage(null);
                  }}
                />
              ) : (
                <span className="profile-dropdown-initials">
                  {getInitials(getUserDisplayName())}
                </span>
              )}
            </div>
            <div className="profile-dropdown-user-info">
              <p className="profile-dropdown-display-name">{getUserDisplayName()}</p>
              <p className="profile-dropdown-user-role">{getUserRole()}</p>
              {user?.email && (
                <p className="profile-dropdown-email">{user.email}</p>
              )}
            </div>
          </div>

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
