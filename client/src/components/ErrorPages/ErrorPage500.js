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

  return (
    <div className="error500-page">
      <div className="error500-container">
        <div className="error500-animation-section">
          <div className="error500-code-display">
            <h1 className="error500-number">500</h1>
            <div className="error500-server">
              <div className="error500-server-rack"></div>
              <div className="error500-sparks">
                <div className="error500-spark"></div>
                <div className="error500-spark"></div>
                <div className="error500-spark"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="error500-content-section">
          <h1 className="error500-title">Server Error</h1>
          <p className="error500-message">
            Something went wrong on our end. Our team has been notified and is working to fix the issue. 
            Please try again in a few moments.
          </p>
          
          <div className="error500-action-buttons">
            <button onClick={handleRefresh} className="error500-btn error500-btn-primary">
              🔄 Try Again
            </button>
            <Link to="/" className="error500-btn error500-btn-secondary">
              🏠 Go Home
            </Link>
            <button onClick={handleGoBack} className="error500-btn error500-btn-tertiary">
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage500;
