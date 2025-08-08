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
  const [token, setToken] = useState(null);
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
    setToken(null);
    setIsAuthenticated(false);
    setShowLoginModal(false);
    setLoginRedirectPath(null);
  };

  const openLoginModal = (redirectPath = null) => {
    // If no redirect path is provided, preserve the current location
    if (!redirectPath && typeof window !== 'undefined') {
      redirectPath = window.location.pathname;
    }
    setLoginRedirectPath(redirectPath);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setLoginRedirectPath(null);
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check both token storage methods for backward compatibility
        const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (storedToken && userData) {
          const parsedUser = JSON.parse(userData);
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Ensure we're using consistent storage
          localStorage.setItem('authToken', storedToken);
          localStorage.removeItem('token'); // Remove old token if it exists
          
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
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
      const response = await axios.post('/api/auth/login', credentials);
      const { token: authToken, user: userData } = response.data;
      
      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      // Update state
      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);
      
      // Close modal and handle redirect
      setShowLoginModal(false);
      const redirectPath = loginRedirectPath;
      setLoginRedirectPath(null);
      
      return { success: true, user: userData, redirectPath };
    } catch (error) {
      console.error('Login error:', error);
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
    token,
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
