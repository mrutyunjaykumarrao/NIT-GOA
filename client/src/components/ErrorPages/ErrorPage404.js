import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error404-page">
      <div className="error404-container">
        <div className="error404-animation-section">
          <div className="error404-code-display">
            <h1 className="error404-number">404</h1>
            <div className="error404-planet"></div>
            <div className="error404-astronaut">
              <div className="error404-astronaut-helmet"></div>
              <div className="error404-astronaut-body"></div>
            </div>
          </div>
        </div>
        
        <div className="error404-content-section">
          <h1 className="error404-title">Page Not Found</h1>
          <p className="error404-message">
            Oops! The page you're looking for seems to have drifted away into space. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="error404-action-buttons">
            <Link to="/" className="error404-btn error404-btn-primary">
              🏠 Go to Homepage
            </Link>
            <button onClick={handleGoBack} className="error404-btn error404-btn-secondary">
              ← Go Back
            </button>
            <Link to="/search" className="error404-btn error404-btn-tertiary">
              🔍 Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage404;
