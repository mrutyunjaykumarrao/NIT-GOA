import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage403 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error403-page">
      <div className="error403-container">
        <div className="error403-animation-section">
          <div className="error403-code-display">
            <h1 className="error403-number">403</h1>
            <div className="error403-lock">
              <div className="error403-lock-shackle"></div>
              <div className="error403-lock-body">
                <div className="error403-lock-keyhole"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="error403-content-section">
          <h1 className="error403-title">Access Forbidden</h1>
          <p className="error403-message">
            You don't have permission to access this page. This could be because you're not logged in 
            or your account doesn't have the required privileges.
          </p>
          
          <div className="error403-action-buttons">
            <Link to="/login" className="error403-btn error403-btn-primary">
              🔑 Sign In
            </Link>
            <Link to="/" className="error403-btn error403-btn-secondary">
              🏠 Go Home
            </Link>
            <button onClick={handleGoBack} className="error403-btn error403-btn-tertiary">
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage403;
