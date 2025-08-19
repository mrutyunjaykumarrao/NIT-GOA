import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-animation-section">
          <div className="error-code-display">
            <h1 className="error-number">404</h1>
            <div className="error-404-planet"></div>
            <div className="error-404-astronaut">
              <div className="error-404-astronaut-body"></div>
              <div className="error-404-astronaut-helmet"></div>
            </div>
          </div>
        </div>
        
        <div className="error-content-section">
          <h2 className="error-content-title">Page Not Found</h2>
          <p className="error-content-message">
            Oops! The page you're looking for seems to have drifted away into space.
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="error-action-buttons">
            <Link to="/" className="error-btn error-btn-primary">
              Go to Homepage
            </Link>
            <button onClick={handleGoBack} className="error-btn error-btn-secondary">
              Go Back
            </button>
          </div>
          
          <div className="error-help-section">
            <h3>You might want to check:</h3>
            <ul>
              <li>
                <Link to="/academics/departments">
                  Academic Departments
                </Link>
              </li>
              <li>
                <Link to="/faculty">
                  Faculty Directory
                </Link>
              </li>
              <li>
                <Link to="/admissions">
                  Admissions
                </Link>
              </li>
              <li>
                <Link to="/contact-us">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage404;
