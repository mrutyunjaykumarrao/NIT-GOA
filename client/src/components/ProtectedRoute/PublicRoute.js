import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PublicRoute - Component for routes that are accessible to everyone
 * This is just a wrapper for clarity in your routing structure
 * All pages wrapped in this component are accessible to both authenticated and non-authenticated users
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  console.log('🌐 PUBLIC ROUTE ACCESSED:', {
    path: location.pathname,
    isAuthenticated,
    user: user ? { id: user.id, role: user.role, username: user.username } : 'anonymous'
  });
  
  return children;
};

export default PublicRoute;
