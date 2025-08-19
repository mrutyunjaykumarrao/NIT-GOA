import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage500 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // SVG Icons for buttons
  const RefreshIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  );

  const HomeIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );

  const BackIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  );

  return (
    <div className="error500-page">
      <div className="error500-container">
        {/* New horizontal layout for error display */}
        <div className="error500-horizontal-section">
            <div className="error500-server-large">
            <div className="error500-server-rack-large"></div>
            <div className="error500-sparks-large">
              <div className="error500-spark"></div>
              <div className="error500-spark"></div>
              <div className="error500-spark"></div>
            </div>
          </div>
          <div className="error500-text-stack">
            <h1 className="error500-number-horizontal">500</h1>
            <h2 className="error500-title-horizontal">Server Error</h2>
          </div>
        </div>
        
        <div className="error500-content-section">
          <p className="error500-message">
            Something went wrong on our end. Our team has been notified and is working to fix the issue. 
            Please try again in a few moments.
          </p>
          <div className="error500-action-buttons">
            <button onClick={handleRefresh} className="error500-btn error500-btn-primary">
              <RefreshIcon />
              Try Again
            </button>
            <Link to="/" className="error500-btn error500-btn-secondary">
              <HomeIcon />
              Go Home
            </Link>
            <button onClick={handleGoBack} className="error500-btn error500-btn-tertiary">
              <BackIcon />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage500;
