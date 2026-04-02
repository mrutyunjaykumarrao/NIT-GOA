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
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch user image when user data is available
  useEffect(() => {
      const fetchUserImage = async (forceRefresh = false) => {
        if (!user?.employee_code || !user?.role) {
          if (user?.employee_image) {
            let imageUrl = user.employee_image.startsWith('http://') || user.employee_image.startsWith('https://') 
              ? user.employee_image 
              : (user.employee_image.startsWith('/') 
                  ? user.employee_image 
                  : `/${user.employee_image}`);
            
            if (forceRefresh) {
              imageUrl += imageUrl.includes('?') ? `&t=${new Date().getTime()}` : `?t=${new Date().getTime()}`;
            }

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
          
          if (user.role === 'Faculty') {
            const response = await fetch(`/api/faculty-details/${user.employee_code}`);
            if (response.ok) {
              const responseData = await response.json();
              const facultyProfile = responseData.data?.profile;
              
              // If the profile fetch succeeds, we strictly use its result (even if null/empty)
              // This prevents falling back to stale login token images after a user deletes their picture.
              if (facultyProfile && facultyProfile.profile_image) {
                imageUrl = facultyProfile.profile_image.startsWith('http://') || facultyProfile.profile_image.startsWith('https://') 
                  ? facultyProfile.profile_image 
                  : (facultyProfile.profile_image.startsWith('/') 
                      ? facultyProfile.profile_image 
                      : `/${facultyProfile.profile_image}`);
              } else if (facultyProfile && !facultyProfile.profile_image) {
                // They explicitly have no picture anymore
                imageUrl = null;
              }
            }
          } else if (!imageUrl && user.employee_image) {
            // Only fallback to the auth token image if they are not Faculty
            imageUrl = user.employee_image.startsWith('http://') || user.employee_image.startsWith('https://') 
              ? user.employee_image 
              : (user.employee_image.startsWith('/') 
                  ? user.employee_image 
                  : `/${user.employee_image}`);
          }
          
          if (imageUrl) {
            if (forceRefresh) {
              imageUrl += imageUrl.includes('?') ? `&t=${new Date().getTime()}` : `?t=${new Date().getTime()}`;
            }
            
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
          } else {
            setUserImage(null);
          }
        } catch (error) {
          console.error('Error fetching user image:', error);
          setUserImage(null);
          setImageError(true);
        }
      };

      fetchUserImage();

      // Listen for profile image updates
      const handleImageUpdate = () => fetchUserImage(true);
      window.addEventListener('profileImageUpdated', handleImageUpdate);
      return () => window.removeEventListener('profileImageUpdated', handleImageUpdate);  }, [user]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
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
        closeDropdown();
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

  const closeDropdown = () => {
    if (!isDropdownOpen) return;
    
    setIsDropdownClosing(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsDropdownClosing(false);
    }, 300); // Match the animation duration
  };

  const handleLogout = () => {
    closeDropdown();
    logout();
    // Navigate to home page after logout instead of opening login modal
    navigate('/');
  };

  const handleAdminDashboard = () => {
    closeDropdown();
    navigate('/admin');
  };

  const handleFacultyProfile = () => {
    closeDropdown();
    if (user?.employee_code) {
      navigate(`/people/faculty/${user.employee_code}`);
    }
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
      closeDropdown();
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
        <div 
          className={`profile-dropdown-menu ${isDropdownClosing ? 'profile-dropdown-menu-closing' : ''}`}
        >
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
            {user?.role === 'Admin' && (
              <button 
                className="profile-dropdown-item profile-dropdown-dashboard"
                onClick={handleAdminDashboard}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Admin Dashboard</span>
              </button>
            )}
            
            {user?.role === 'Faculty' && user?.employee_code && (
              <button 
                className="profile-dropdown-item profile-dropdown-profile"
                onClick={handleFacultyProfile}
              >
                <i className="fas fa-user"></i>
                <span>My Profile</span>
              </button>
            )}
            
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
