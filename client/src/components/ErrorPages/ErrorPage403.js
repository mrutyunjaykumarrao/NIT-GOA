import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage403 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // SVG Icon Components
  const LoginIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z"/>
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
    <div className="error403-page">
      <div className="error403-container">
        {/* Visual section with lock and number in a horizontal line */}
        <div className="error403-visual-section">
          <div className="error403-lock-container">
            <div className="error403-lock-shackle"></div>
            <div className="error403-lock-body">
              <div className="error403-lock-keyhole"></div>
            </div>
          </div>
          <h1 className="error403-number-display">403</h1>
        </div>
        
        {/* Title section below visual elements */}
        <div className="error403-title-section">
          <h2 className="error403-main-title">Access Forbidden</h2>
        </div>
        
        {/* Content section with message and actions */}
        <div className="error403-content-section">
          <p className="error403-description-message">
            You don't have permission to access this page. This could be because you're not logged in 
            or your account doesn't have the required privileges.
          </p>
          <div className="error403-action-buttons">
            <Link to="/" className="error403-btn error403-btn-secondary">
              <HomeIcon />
              Go Home
            </Link>
            <Link to="/login" className="error403-btn error403-btn-primary">
              <LoginIcon />
              Sign In
            </Link>
            <button onClick={handleGoBack} className="error403-btn error403-btn-tertiary">
              <BackIcon />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage403;
