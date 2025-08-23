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

  // SVG Icon Components
  const NetworkIcon = () => (
    <svg className="error-network-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  );

  const RetryIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  );

  const RefreshIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  );

  const BackIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  );

  return (
    <div className="error-network-page">
      <div className="error-network-container">
        <div className="error-network-animation-section">
          <div className="error-network-code-display">
            <div className="error-network-icon">
              <NetworkIcon />
            </div>
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
            <button onClick={handleRefresh} className="error-network-btn error-network-btn-secondary">
              <RefreshIcon />
              Refresh Page
            </button>
            <button onClick={handleRetry} className="error-network-btn error-network-btn-primary">
              <RetryIcon />
              Retry Connection
            </button>
            <button onClick={handleGoBack} className="error-network-btn error-network-btn-tertiary">
              <BackIcon />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
