import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';

const LoginWrapper = () => {
  const location = useLocation();
  const { showLoginModal, closeLoginModal, openLoginModal } = useAuth();
  
  // Auto-open modal when user navigates to /login route
  useEffect(() => {
    if (location.pathname === '/login' && !showLoginModal) {
      openLoginModal();
    }
  }, [location.pathname, showLoginModal, openLoginModal]); 
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
