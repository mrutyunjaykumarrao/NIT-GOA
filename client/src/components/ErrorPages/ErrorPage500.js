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
    <div className="error-page">
      <div className="error-container">
        <div className="error-animation-section">
          <div className="error-code-display">
            <h1 className="error-number">500</h1>
            <div className="error-500-server">
              <div className="error-500-server-rack"></div>
              <div className="error-500-sparks">
                <div className="error-500-spark"></div>
                <div className="error-500-spark"></div>
                <div className="error-500-spark"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="error-content-section">
          <h1 className="error-content-title">Internal Server Error</h1>
          <p className="error-content-message">
            Something went wrong on our end. Our team has been notified and is working to fix the issue.
            Please try again in a few moments.
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
            <h3>If the problem persists:</h3>
            <ul>
              <li><Link to="/contact-us">Contact our support team</Link></li>
              <li>Check our <Link to="/">homepage</Link> for updates</li>
              <li>Try accessing the page later</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage500;
