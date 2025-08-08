import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);

  // Verify token validity (optional - can be called periodically)
  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/auth/validate');
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      logout(); // Auto logout on token failure
      return null;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    setShowLoginModal(false);
    setLoginRedirectPath(null);
  };

  const openLoginModal = (redirectPath = null) => {
    console.log('🔐 MODAL: Opening login modal', { redirectPath });
    setLoginRedirectPath(redirectPath);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    console.log('🔐 MODAL: Closing login modal');
    setShowLoginModal(false);
    setLoginRedirectPath(null);
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check both token storage methods for backward compatibility
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          
          console.log('🔐 AUTH INIT: User found in localStorage', {
            user: parsedUser,
            role: parsedUser.role,
            isAuthenticated: true,
            token: token ? 'present' : 'missing'
          });
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Ensure we're using consistent storage
          localStorage.setItem('authToken', token);
          localStorage.removeItem('token'); // Remove old token if it exists
          
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          console.log('🔐 AUTH INIT: No user found in localStorage');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array is intentional for initialization

  const login = async (credentials) => {
    try {
      console.log('🔐 LOGIN ATTEMPT: Starting login process');
      
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user: userData } = response.data;
      
      console.log('🔐 LOGIN SUCCESS: Received response from server', {
        user: userData,
        role: userData.role,
        token: token ? 'present' : 'missing'
      });
      
      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Close modal and handle redirect
      setShowLoginModal(false);
      const redirectPath = loginRedirectPath;
      setLoginRedirectPath(null);
      
      console.log('🔐 LOGIN COMPLETE: Auth state updated', {
        isAuthenticated: true,
        user: userData,
        role: userData.role,
        redirectPath
      });
      
      return { success: true, user: userData, redirectPath };
    } catch (error) {
      console.error('🔐 LOGIN ERROR:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    verifyToken,
    showLoginModal,
    openLoginModal,
    closeLoginModal,
    loginRedirectPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
