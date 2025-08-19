import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // SVG Icons
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

  const SearchIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );

  return (
    <div className="error404-page">
      <div className="error404-container">
        <div className="error404-animation-section">
          <div className="error404-code-display">
            <h1 className="error404-number">404</h1>
            <div className="error404-planet"></div>
            <div className="error404-astronaut">
              <div className="error404-astronaut-body"></div>
              <div className="error404-astronaut-helmet"></div>
            </div>
          </div>
        </div>
        
        <div className="error404-content-section">
          <h2 className="error404-title">Page Not Found</h2>
          <p className="error404-message">
            Oops! The page you're looking for seems to have drifted away into space. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="error404-action-buttons">
            <button onClick={handleGoBack} className="error404-btn error404-btn-secondary">
              <BackIcon />
              Go Back
            </button>
            <Link to="/" className="error404-btn error404-btn-primary">
              <HomeIcon />
              Go to Homepage
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage404;
