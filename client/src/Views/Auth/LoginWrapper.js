import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';

const LoginWrapper = () => {
  const location = useLocation();
  const { showLoginModal, closeLoginModal } = useAuth();
  
  // If we're on the /login route, render as a page
  if (location.pathname === '/login') {
    return (
      <div className="login-page-container">
        <Login isModalOpen={true} onClose={() => window.history.back()} />
      </div>
    );
  }
  
  // Otherwise, render as a modal
  return (
    <Login 
      isModalOpen={showLoginModal} 
      onClose={closeLoginModal} 
    />
  );
};

export default LoginWrapper;
