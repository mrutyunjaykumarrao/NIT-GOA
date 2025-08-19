import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage403 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-animation-section">
          <div className="error-code-display">
            <h1 className="error-number">403</h1>
            <div className="error-403-lock">
              <div className="error-403-lock-body"></div>
              <div className="error-403-lock-shackle"></div>
              <div className="error-403-lock-keyhole"></div>
            </div>
          </div>
        </div>
        
        <div className="error-content-section">
          <h1 className="error-content-title">Access Forbidden</h1>
          <p className="error-content-message">
            You don't have permission to access this page. This could be because you're not logged in
            or your account doesn't have the required privileges.
          </p>
          
          <div className="error-action-buttons">
            <Link to="/login" className="error-btn error-btn-primary">
              Login
            </Link>
            <Link to="/" className="error-btn error-btn-secondary">
              Go to Homepage
            </Link>
            <button onClick={handleGoBack} className="error-btn error-btn-tertiary">
              Go Back
            </button>
          </div>
          
          <div className="error-help-section">
            <h3>Try these options:</h3>
            <ul>
              <li><Link to="/login">Log in to your account</Link></li>
              <li><Link to="/contact-us">Contact support</Link> if you believe this is an error</li>
              <li>Visit our <Link to="/">public pages</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage403;
