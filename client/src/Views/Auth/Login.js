import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import useAsyncOperation from '../../hooks/useAsyncOperation';
import './Login.css';

const Login = ({ isModalOpen, onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  
  // Refs for auto-focusing and navigation
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { loading: isLoading, executeAsync } = useAsyncOperation();
  const { loading: isForgotLoading, executeAsync: executeForgotAsync } = useAsyncOperation();

  // Redirect if already authenticated and clear form when user logs out
  React.useEffect(() => {
    if (isAuthenticated) {
      // Only redirect if we're on the actual /login page, not when rendered as a modal
      if (location.pathname === '/login') {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
      // Always close modal if it's open
      if (onClose) onClose();
    } else {
      // User logged out, clear the form
      setCredentials({ username: '', password: '' });
      setError('');
      setShowPassword(false);
      setFailedAttempts(0);
      setShowForgotPassword(false);
      setForgotEmail('');
      setForgotMessage('');
    }
  }, [isAuthenticated, navigate, location, onClose]);

  // Close modal on escape key and auto-focus username field
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      
      // Auto-focus the username field when modal opens
      setTimeout(() => {
        if (usernameInputRef.current) {
          usernameInputRef.current.focus();
        }
      }, 100); // Small delay to ensure modal is fully rendered
    } else {
      // Clear form when modal closes
      setCredentials({ username: '', password: '' });
      setError('');
      setShowPassword(false);
      setFailedAttempts(0);
      setShowForgotPassword(false);
      setForgotEmail('');
      setForgotMessage('');
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

  const handleKeyDown = (e) => {
    // Handle Enter key based on which field is focused
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      
      // If Enter is pressed in username field, move to password field
      if (e.target.name === 'username') {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
      // If Enter is pressed in password field, submit the form
      else if (e.target.name === 'password') {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    executeAsync(
      async () => {
        const result = await login(credentials);
        
        if (result.success) {
          // Reset failed attempts on successful login
          setFailedAttempts(0);
          setShowForgotPassword(false);
          
          // Close modal and stay on current page (don't navigate away)
          if (onClose) onClose();
          
          // Role-based redirection logic
          const userRole = result.user.role;
          const from = location.state?.from?.pathname;
          
          // Only navigate if we're on the actual /login page OR if redirecting from protected route
          if (location.pathname === '/login' || from) {
            if (from) {
              // If user was redirected from a protected route, go back there
              navigate(from);
            } else {
              // Default redirection based on role
              switch (userRole) {
                case 'Admin':
                  navigate('/admin');
                  break;
                case 'Faculty':
                  // Redirect to faculty edit page using employee_id or employee_code
                  const facultyId = result.user.employee_id || result.user.employee_code || result.user.id;
                  navigate(`/faculty/${facultyId}/edit`);
                  break;
                default:
                  navigate('/');
                  break;
              }
            }
          }
          // If we're not on /login page and no redirect needed, stay on current page after login
        } else {
          // Show username in error message to help user remember
          const errorMsg = credentials.username 
            ? `Invalid credentials for username: ${credentials.username}` 
            : result.error;
          throw new Error(errorMsg);
        }
      },
      {
        showSuccessToast: true,
        successMessage: 'Login successful!',
        showErrorToast: false, // We'll handle errors manually for better UX
        onError: (error) => {
          const errorMsg = credentials.username 
            ? `Invalid credentials for username: ${credentials.username}` 
            : error.message;
          setError(errorMsg);
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);
          
          // Show forgot password after 2 failed attempts
          if (newFailedAttempts >= 2) {
            setShowForgotPassword(true);
          }
        }
      }
    );
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotMessage('');
    
    executeForgotAsync(
      async () => {
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
      },
      {
        showSuccessToast: false, // We'll show the message directly
        showErrorToast: false, // Handle error manually
        onError: (error) => {
          // For demo purposes, show a mock password
          if (forgotEmail === 'admin@nitgoa.ac.in') {
            setForgotMessage('Your password is: admin123');
          } else {
            setForgotMessage('Email not found. Please check your email address.');
          }
        }
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    // Clear form data when closing
    setCredentials({ username: '', password: '' });
    setError('');
    setShowPassword(false);
    setFailedAttempts(0);
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotMessage('');
    
    if (onClose) {
      onClose();
    }
  };

  // Don't render if modal is not open
  if (!isModalOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={handleClose} aria-label="Close login">
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
                ref={usernameInputRef}
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                autoComplete="current-password"
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
