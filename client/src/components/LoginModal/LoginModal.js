import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginModal.css';

const LoginModal = () => {
  const { showLoginModal, closeLoginModal, login, loginRedirectPath } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showLoginModal) {
      setCredentials({ username: '', password: '' });
      setError('');
      setIsLoading(false);
    }
  }, [showLoginModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login(credentials);

    if (result.success) {
      console.log('🔐 LOGIN MODAL: Login successful', { redirectPath: result.redirectPath });
      
      // Handle redirect after successful login
      if (result.redirectPath) {
        navigate(result.redirectPath);
      }
      // Modal will close automatically via context state change
    } else {
      console.error('🔐 LOGIN MODAL: Login failed', result.error);
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLoginModal();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      closeLoginModal();
    }
  };

  if (!showLoginModal) return null;

  return (
    <div className="login-modal-overlay" onClick={handleBackdropClick}>
      <div className="login-modal-content">
        <div className="login-modal-header">
          <h2>
            <i className="fas fa-lock"></i>
            Login Required
          </h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="login-modal-body">
          <p className="login-prompt">
            Please log in to access this page.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="modal-username">
                <i className="fas fa-user"></i>
                Username
              </label>
              <input
                type="text"
                id="modal-username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                id="modal-password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || !credentials.username || !credentials.password}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {loginRedirectPath && (
          <div className="redirect-info">
            <i className="fas fa-info-circle"></i>
            You will be redirected to: {loginRedirectPath}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
