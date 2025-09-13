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
  const [showForgotPasswordLink, setShowForgotPasswordLink] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [cooldownTimer, setCooldownTimer] = useState(null);
  
  // Refs for auto-focusing and navigation
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { loading: isLoading, executeAsync } = useAsyncOperation();
  const { loading: isForgotLoading, executeAsync: executeForgotAsync } = useAsyncOperation();

  // Clear form when user logs out (don't handle redirection here)
  React.useEffect(() => {
    if (isAuthenticated) {
      // Always close modal if it's open
      if (onClose) onClose();
    } else {
      // User logged out, clear the form
      setCredentials({ username: '', password: '' });
      setError('');
      setShowPassword(false);
      setFailedAttempts(0);
      setShowForgotPasswordLink(false);
      setShowForgotPassword(false);
      setForgotEmail('');
      setForgotMessage('');
      setCooldownTimer(null);
    }
  }, [isAuthenticated, onClose]);

  // Only check lockout status when cooldownTimer is active (after failed login attempts)
  React.useEffect(() => {
    let pollInterval;
    
    // Only poll if we're in a cooldown state
    if (cooldownTimer > 0) {
      const checkLockoutStatus = async () => {
        if (!credentials.username) return;
        
        try {
          const response = await fetch('/api/auth/lockout-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: credentials.username })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.locked && (data.remainingSeconds > 0 || data.remainingMinutes > 0)) {
              // Use precise remaining seconds from server, fallback to minutes * 60
              const preciseSeconds = data.remainingSeconds || Math.max(1, data.remainingMinutes * 60);
              setCooldownTimer(preciseSeconds);
            } else if (!data.locked) {
              // Clear lockout state when server says not locked
              setCooldownTimer(null);
              setError('');
            }
          }
        } catch (error) {
          console.log('Failed to check lockout status:', error);
        }
      };
      
      // Check immediately and then every 10 seconds while locked
      checkLockoutStatus();
      pollInterval = setInterval(checkLockoutStatus, 10000);
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [cooldownTimer, credentials.username]);

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
      setShowForgotPasswordLink(false);
      setShowForgotPassword(false);
      setForgotEmail('');
      setForgotMessage('');
      setCooldownTimer(null);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, onClose]);

  // Cooldown timer effect
  useEffect(() => {
    let interval;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer(prev => {
          if (prev <= 1) {
            // Timer expired, allow retry
            setError('');
            return null;
          }
          const newTime = prev - 1;
          // Update error message with current remaining time
          const totalAttempts = failedAttempts >= 4 ? failedAttempts : 'multiple';
          setError(`Account locked after ${totalAttempts} failed attempts. Please try again in ${formatCooldownTime(newTime)}.`);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTimer, failedAttempts]);

  // Format cooldown timer display
  const formatCooldownTime = (seconds) => {
    if (!seconds || seconds <= 0) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

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
          setShowForgotPasswordLink(false);
          setShowForgotPassword(false);
          
          // Close modal immediately
          if (onClose) onClose();
          
          // Always use the redirectPath from AuthContext which handles role-based redirection
          const redirectPath = result.redirectPath || '/';
          
          // Always navigate to the redirect path for proper role-based redirection
          // Admin -> /admin, Faculty -> /people/faculty/employee_code, Default -> /
          navigate(redirectPath, { replace: true });
        } else {
          // For lockout errors, throw an error object with all the lockout details
          if (result.errorType === 'ACCOUNT_LOCKED') {
            const error = new Error(result.error);
            // Attach lockout details to the error object
            error.errorType = result.errorType;
            error.remainingMinutes = result.remainingMinutes;
            error.lockoutDuration = result.lockoutDuration;
            error.totalFailedAttempts = result.totalFailedAttempts;
            error.lockedUntil = result.lockedUntil;
            error.lockoutStart = result.lockoutStart;
            throw error;
          } else {
            // Use the error directly from the backend for non-lockout errors
            throw new Error(result.error);
          }
        }
      },
      {
        showSuccessToast: true,
        successMessage: 'Login successful!',
        showErrorToast: false, // We'll handle errors manually for better UX
        suppressErrorRethrow: true, // Prevent React error overlay
        onError: (error) => {
          console.log('Login error:', error); // Debug log
          
          // Handle ACCOUNT_LOCKED responses
          if (error.errorType === 'ACCOUNT_LOCKED' || error.remainingMinutes) {
            console.log('🔒 LOCKOUT ERROR RECEIVED:', error); // Debug log
            
            const totalAttempts = error.totalFailedAttempts || 'multiple';
            
            // Use the exact remaining seconds from backend for accurate countdown
            const actualDuration = error.remainingSeconds || Math.max(60, (error.remainingMinutes || 0) * 60);
            
            console.log('🔒 SETTING COOLDOWN:', actualDuration, 'seconds'); // Debug log
            setCooldownTimer(actualDuration); // Use exact remaining time from server
            
            // Format the initial error message with seconds
            const formatTime = (seconds) => {
              const minutes = Math.floor(seconds / 60);
              const secs = seconds % 60;
              return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
            };
            
            const customMessage = `Account locked after ${totalAttempts} failed attempts. Please try again in ${formatTime(actualDuration)}.`;
            console.log('🔒 CUSTOM MESSAGE:', customMessage); // Debug log
            setError(customMessage);
          } else if (error.message.includes('cooldown period')) {
            // Handle legacy cooldown messages for backward compatibility
            const match = error.message.match(/\((\d+) minutes remaining\)/);
            if (match) {
              const minutes = parseInt(match[1]);
              setCooldownTimer(minutes * 60); // Convert to seconds
              setError(error.message);
            }
          } else if (error.remainingAttempts !== undefined) {
            // Handle failed attempts with remaining count
            const newFailedAttempts = failedAttempts + 1;
            setFailedAttempts(newFailedAttempts);
            setError(error.message);
            
            // Show forgot password LINK after 2 failed password attempts
            if (newFailedAttempts >= 2) {
              setShowForgotPasswordLink(true);
            }
          } else {
            // Handle other authentication errors
            setError(error.message);
            const newFailedAttempts = failedAttempts + 1;
            setFailedAttempts(newFailedAttempts);
            
            // Show forgot password LINK after 2 failed password attempts (not username not found)
            if (newFailedAttempts >= 2 && !error.message.includes('username not found')) {
              setShowForgotPasswordLink(true);
            }
          }
        }
      }
    );
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotMessage('');
    
    // Use the username from the login attempt instead of asking for email
    if (!credentials.username) {
      setForgotMessage('Please enter your username first and try logging in.');
      return;
    }
    
    executeForgotAsync(
      async () => {
        const response = await fetch('/api/auth/forgot-password-by-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: credentials.username }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setForgotMessage(data.message);
        } else {
          throw new Error(data.error || 'Failed to process password reset request');
        }
      },
      {
        showSuccessToast: false, // We'll show the message directly
        showErrorToast: false, // Handle error manually
        suppressErrorRethrow: true, // Prevent React error overlay
        onError: (error) => {
          setForgotMessage(error.message || 'Failed to process password reset request. Please try again.');
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
    setShowForgotPasswordLink(false);
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotMessage('');
    setCooldownTimer(null);
    
    // Close the modal first before navigation to prevent race conditions
    if (onClose) {
      onClose();
    }
    
    // If we're on the /login route, navigate back to the previous page
    if (location.pathname === '/login') {
      const previousPath = location.state?.from?.pathname || '/';
      
      // Define protected routes that require authentication
      const protectedRoutes = ['/admin', '/faculty/edit', '/profile'];
      const isProtectedRoute = protectedRoutes.some(route => previousPath.startsWith(route));
      
      // If the previous path is a protected route, go to homepage instead to avoid infinite loop
      const targetPath = isProtectedRoute ? '/' : 
        previousPath + (location.state?.from?.search || '') + (location.state?.from?.hash || '');
      
      // Use setTimeout to ensure the modal state is updated before navigation
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 0);
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
          <h1>{showForgotPassword ? 'Password Reset' : 'Login'}</h1>
          <p>National Institute of Technology Goa</p>
        </div>

        {error && !showForgotPassword && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {cooldownTimer ? (
              <>
                Cannot log in until cooldown period ends ({formatCooldownTime(cooldownTimer)} remaining)
              </>
            ) : (
              error
            )}
          </div>
        )}

        {showForgotPassword ? (
          <div className="forgot-password-section">
            <form onSubmit={handleForgotPassword} className="forgot-password-form">
              <div className="forgot-password-confirmation">
                <i className="fas fa-key forgot-password-icon"></i>
                <h3>Reset Password for "{credentials.username}"</h3>
                <p>
                  We'll send password reset instructions to the email address associated with this account.
                </p>
              </div>
              
              <button 
                type="submit" 
                className="forgot-password-button"
                disabled={isForgotLoading}
              >
                {isForgotLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending Instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
              
              <button 
                type="button" 
                className="back-to-login-button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotMessage('');
                }}
                disabled={isForgotLoading}
              >
                Back to Login
              </button>
              
              {forgotMessage && (
                <div className="forgot-message">
                  <i className="fas fa-info-circle"></i>
                  {forgotMessage}
                </div>
              )}
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
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
                  disabled={isLoading || cooldownTimer > 0}
                />
              </div>
            </div>

            <div className="login-form-group">
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
                  disabled={isLoading || cooldownTimer > 0}
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
              disabled={isLoading || cooldownTimer > 0}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing in...
                </>
              ) : cooldownTimer > 0 ? (
                <>
                  <i className="fas fa-lock"></i>
                  Account Locked ({formatCooldownTime(cooldownTimer)})
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>

            {showForgotPasswordLink && !showForgotPassword && (
              <div className="forgot-password-link-container">
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </form>
        )}

        <div className="login-footer">
          <p>© 2025 National Institute of Technology Goa</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
