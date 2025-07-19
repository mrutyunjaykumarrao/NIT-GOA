import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLoginModal } from '../../contexts/LoginModalContext';
import Login from './Login';

const LoginWrapper = () => {
  const location = useLocation();
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();
  
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
      isModalOpen={isLoginModalOpen} 
      onClose={closeLoginModal} 
    />
  );
};

export default LoginWrapper;
