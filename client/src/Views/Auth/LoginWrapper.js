import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';

const LoginWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoginModal, closeLoginModal, openLoginModal, isAuthenticated } = useAuth();
  
  // Handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      // User is authenticated and on login page - navigate away
      closeLoginModal();
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, location.pathname, closeLoginModal, navigate]);
  
  // Auto-open modal when user navigates to /login route (only if not authenticated)
  useEffect(() => {
    if (location.pathname === '/login' && !showLoginModal && !isAuthenticated) {
      openLoginModal();
    }
  }, [location.pathname, showLoginModal, openLoginModal, isAuthenticated]); 
  
  // Close modal when navigating away from /login route
  useEffect(() => {
    if (location.pathname !== '/login' && showLoginModal) {
      closeLoginModal();
    }
  }, [location.pathname, showLoginModal, closeLoginModal]);
  // Always render as a modal overlay
  return (
    <Login 
      isModalOpen={showLoginModal} 
      onClose={closeLoginModal} 
    />
  );
};

export default LoginWrapper;
