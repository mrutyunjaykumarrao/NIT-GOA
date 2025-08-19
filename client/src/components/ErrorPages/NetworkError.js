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

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="error-network-page">
      <div className="error-network-container">
        <div className="error-network-animation-section">
          <div className="error-network-code-display">
            <div className="error-network-icon">🌐</div>
            <div className="error-network-signal">
              <div className="error-network-signal-bar"></div>
              <div className="error-network-signal-bar"></div>
              <div className="error-network-signal-bar"></div>
              <div className="error-network-signal-x">✕</div>
            </div>
          </div>
        </div>
        
        <div className="error-network-content-section">
          <h1 className="error-network-title">Connection Error</h1>
          <p className="error-network-message">
            Unable to connect to our servers. Please check your internet connection and try again.
          </p>
          
          <div className="error-network-action-buttons">
            <button onClick={handleRetry} className="error-network-btn error-network-btn-primary">
              🔄 Retry Connection
            </button>
            <button onClick={handleRefresh} className="error-network-btn error-network-btn-secondary">
              ↻ Refresh Page
            </button>
            <button onClick={handleGoBack} className="error-network-btn error-network-btn-tertiary">
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
