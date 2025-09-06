import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';

const LoginWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoginModal, closeLoginModal, openLoginModal, isAuthenticated } = useAuth();
  
  // Track if modal was manually closed to prevent reopening
  const wasManuallyClosedRef = useRef(false);
  
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
      // Only open if it wasn't manually closed
      if (!wasManuallyClosedRef.current) {
        openLoginModal();
      }
    }
    // Reset manual close flag when route changes
    if (location.pathname !== '/login') {
      wasManuallyClosedRef.current = false;
    }
  }, [location.pathname, showLoginModal, openLoginModal, isAuthenticated]); 
  
  // Close modal when navigating away from /login route
  useEffect(() => {
    if (location.pathname !== '/login' && showLoginModal) {
      closeLoginModal();
    }
  }, [location.pathname, showLoginModal, closeLoginModal]);

  // Handle manual modal close
  const handleModalClose = () => {
    wasManuallyClosedRef.current = true;
    closeLoginModal();
    
    // Small delay to ensure all effects have processed before allowing reopening
    setTimeout(() => {
      // Only reset if we're still not on /login route to avoid conflicts
      if (window.location.pathname !== '/login') {
        wasManuallyClosedRef.current = false;
      }
    }, 100);
  };

  // Always render as a modal overlay
  return (
    <Login 
      isModalOpen={showLoginModal} 
      onClose={handleModalClose} 
    />
  );
};

export default LoginWrapper;
