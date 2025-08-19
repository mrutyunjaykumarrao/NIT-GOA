import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const NetworkError = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-animation-section">
          <div className="error-code-display">
            <div className="error-network-icon">🌐</div>
            <div className="error-network-signal">
              <div className="error-network-signal-bar"></div>
              <div className="error-network-signal-bar"></div>
              <div className="error-network-signal-bar"></div>
              <div className="error-network-signal-x">✕</div>
            </div>
          </div>
        </div>
        
        <div className="error-content-section">
          <h1 className="error-content-title">Network Error</h1>
          <p className="error-content-message">
            Unable to connect to our servers. Please check your internet connection
            and try again.
          </p>
          
          <div className="error-action-buttons">
            <button onClick={handleRefresh} className="error-btn error-btn-primary">
              Try Again
            </button>
            <Link to="/" className="error-btn error-btn-secondary">
              Go to Homepage
            </Link>
            <button onClick={handleGoBack} className="error-btn error-btn-tertiary">
              Go Back
            </button>
          </div>
          
          <div className="error-help-section">
            <h3>Troubleshooting steps:</h3>
            <ul>
              <li>Check your internet connection</li>
              <li>Refresh the page</li>
              <li>Try again in a few minutes</li>
              <li>Contact your network administrator</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
