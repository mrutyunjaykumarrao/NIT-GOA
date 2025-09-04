import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAsyncOperation from '../../hooks/useAsyncOperation';
import './PasswordReset.css';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loading: isLoading, executeAsync } = useAsyncOperation();
  
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      <div className="password-reset-container">
        <div className="password-reset-card">
          <div className="password-reset-header">
            <img 
              src="/NIT_LOGO.png" 
              alt="NIT Goa Logo" 
              className="reset-logo"
            />
            <h1>Reset Password</h1>
            <p>National Institute of Technology Goa</p>
          </div>
          
          <div className="verification-status">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
                <button 
                  onClick={() => navigate('/login')} 
                  className="back-to-login-button"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="loading-message">
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
      <div className="password-reset-container">
        <div className="password-reset-card">
          <div className="password-reset-header">
            <img 
              src="/NIT_LOGO.png" 
              alt="NIT Goa Logo" 
              className="reset-logo"
            />
            <h1>Password Reset Successful</h1>
          </div>
          
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            {success}
            <p>You will be redirected to the login page in a few seconds.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="login-now-button"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <div className="password-reset-header">
          <img 
            src="/NIT_LOGO.png" 
            alt="NIT Goa Logo" 
            className="reset-logo"
          />
          <h1>Reset Password</h1>
          <p>Enter your new password for: <strong>{username}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="password-reset-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <small className="form-hint">Password must be at least 6 characters long</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm your new password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="reset-button"
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

        <div className="reset-footer">
          <button 
            onClick={() => navigate('/login')} 
            className="back-to-login-link"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
