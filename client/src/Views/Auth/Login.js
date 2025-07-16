import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = ({ isModalOpen, onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      if (onClose) onClose();
    }
  }, [isAuthenticated, navigate, location, onClose]);

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(credentials);
      
      if (result.success) {
        // Reset failed attempts on successful login
        setFailedAttempts(0);
        setShowForgotPassword(false);
        
        // Redirect based on user role or return to intended page
        const from = location.state?.from?.pathname;
        if (result.user.role === 'admin' && !from) {
          navigate('/admin');
        } else {
          navigate(from || '/');
        }
        
        if (onClose) onClose();
      } else {
        setError(result.error);
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        // Show forgot password after 2 failed attempts
        if (newFailedAttempts >= 2) {
          setShowForgotPassword(true);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 2) {
        setShowForgotPassword(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setForgotMessage('');
    
    try {
      // For now, we'll simulate retrieving password
      // In a real application, you would send a password reset email
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setForgotMessage(`Your password is: ${data.password}`);
      } else {
        setForgotMessage('Email not found. Please check your email address.');
      }
    } catch (error) {
      // For demo purposes, show a mock password
      if (forgotEmail === 'admin@nitgoa.ac.in') {
        setForgotMessage('Your password is: admin123');
      } else {
        setForgotMessage('Email not found. Please check your email address.');
      }
    } finally {
      setIsForgotLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Don't render if modal is not open
  if (!isModalOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose} aria-label="Close login">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="login-header">
          <img 
            src="/NIT_LOGO.png" 
            alt="NIT Goa Logo" 
            className="login-logo"
          />
          <h1>Login</h1>
          <p>National Institute of Technology Goa</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper password-wrapper">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        {showForgotPassword && (
          <div className="forgot-password-section">
            <div className="forgot-password-divider">
              <span>Forgot Password?</span>
            </div>
            
            <form onSubmit={handleForgotPassword} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="forgotEmail">Enter your email to retrieve password</label>
                <div className="input-wrapper">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isForgotLoading}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="forgot-password-button"
                disabled={isForgotLoading}
              >
                {isForgotLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Retrieving...
                  </>
                ) : (
                  'Get Password'
                )}
              </button>
              
              {forgotMessage && (
                <div className="forgot-message">
                  <i className="fas fa-info-circle"></i>
                  {forgotMessage}
                </div>
              )}
            </form>
          </div>
        )}

        <div className="login-footer">
          <p>© 2025 National Institute of Technology Goa</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
