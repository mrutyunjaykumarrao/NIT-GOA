import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import useAsyncOperation from '../../hooks/useAsyncOperation';
import './PasswordReset.css';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading: isLoading, executeAsync } = useAsyncOperation();
  
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Refs for auto-focusing and navigation
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const navigateToLogin = () => {
    navigate('/login');
  };

  // Auto-focus on password field when token is verified
  useEffect(() => {
    if (tokenVerified && passwordInputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        passwordInputRef.current.focus();
      }, 100);
    }
  }, [tokenVerified]);

  // Password visibility toggle functions
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setError('No reset token provided');
    }
  }, [searchParams]);

  const verifyToken = async (resetToken) => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token/${resetToken}`);
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setTokenValid(true);
        setUsername(data.username);
        setTokenVerified(true);
      } else {
        setError(data.error || 'Invalid or expired reset token');
        setTokenValid(false);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setError('Failed to verify reset token');
      setTokenValid(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear error when user types
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError(''); // Clear error when user types
  };

  // Handle Enter key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      
      // If Enter is pressed in password field, move to confirm password field
      if (e.target.name === 'password') {
        if (confirmPasswordInputRef.current) {
          confirmPasswordInputRef.current.focus();
        }
      }
      // If Enter is pressed in confirm password field, submit the form
      else if (e.target.name === 'confirmPassword') {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    executeAsync(
      async () => {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            newPassword: password
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setSuccess(data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          throw new Error(data.error || 'Failed to reset password');
        }
      },
      {
        showSuccessToast: false, // We'll show success message in UI
        showErrorToast: false, // Handle error manually
        onError: (error) => {
          setError(error.message);
        }
      }
    );
  };

  if (!tokenVerified) {
    return (
      <div className="password-reset-container" onClick={navigateToLogin}>
        <div className="password-reset-card" onClick={(e) => e.stopPropagation()}>
          <button className="password-reset-close" onClick={navigateToLogin} aria-label="Close password reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="password-reset-header">
            <img 
              src="/NIT_LOGO.png" 
              alt="NIT Goa Logo" 
              className="password-reset-logo"
            />
            <h1>Reset Password</h1>
            <p>National Institute of Technology Goa</p>
          </div>
          
          <div className="password-reset-verification-status">
            {error ? (
              <>
                <div className="password-reset-error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
                <button 
                  onClick={navigateToLogin} 
                  className="password-reset-back-to-login-button"
                >
                  Back to Login
                </button>
              </>
            ) : (
              <div className="password-reset-loading-message">
                <i className="fas fa-spinner fa-spin"></i>
                Verifying reset token...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="password-reset-container" onClick={navigateToLogin}>
        <div className="password-reset-card" onClick={(e) => e.stopPropagation()}>
          <button className="password-reset-close" onClick={navigateToLogin} aria-label="Close password reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="password-reset-header">
            <img 
              src="/NIT_LOGO.png" 
              alt="NIT Goa Logo" 
              className="password-reset-logo"
            />
            <h1>Password Reset Successful</h1>
          </div>
          
          <div className="password-reset-success-message">
            <i className="fas fa-check-circle"></i>
            {success}
            <p>You will be redirected to the login page in a few seconds.</p>
            <button 
              onClick={navigateToLogin} 
              className="password-reset-login-now-button"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container" onClick={navigateToLogin}>
      <div className="password-reset-card" onClick={(e) => e.stopPropagation()}>
        <button className="password-reset-close" onClick={navigateToLogin} aria-label="Close password reset">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="password-reset-header">
          <img 
            src="/NIT_LOGO.png" 
            alt="NIT Goa Logo" 
            className="password-reset-logo"
          />
          <h1>Reset Password</h1>
          <p>Enter your new password for: <strong>{username}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="password-reset-form">
          {error && (
            <div className="password-reset-error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="password-reset-form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-reset-input-wrapper password-reset-password-wrapper">
              <i className="fas fa-lock"></i>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your new password"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                className="password-reset-password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <small className="password-reset-form-hint">Password must be at least 6 characters long</small>
          </div>

          <div className="password-reset-form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-reset-input-wrapper password-reset-password-wrapper">
              <i className="fas fa-lock"></i>
              <input
                ref={confirmPasswordInputRef}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onKeyDown={handleKeyDown}
                placeholder="Confirm your new password"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                className="password-reset-password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="password-reset-button"
            disabled={isLoading || !password || !confirmPassword}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Resetting Password...
              </>
            ) : (
              <>
                <i className="fas fa-key"></i>
                Reset Password
              </>
            )}
          </button>
        </form>

        <div className="password-reset-footer">
          <button 
            onClick={navigateToLogin} 
            className="password-reset-back-to-login-link"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
