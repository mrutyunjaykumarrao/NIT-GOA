import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  type = 'default', 
  message = 'Loading...', 
  overlay = false,
  fullScreen = false,
  operation = null // New prop for database operations
}) => {
  
  // Database operation icons
  const getDatabaseIcon = (operationType) => {
    switch (operationType) {
      case 'fetch':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>;
      case 'save':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
      case 'update':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
      case 'delete':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
      case 'upload':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>;
      case 'download':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>;
      case 'search':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
      case 'sync':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>;
      default:
        return null;
    }
  };

  // Get default message for database operations
  const getDatabaseMessage = (operationType) => {
    switch (operationType) {
      case 'fetch':
        return 'Fetching data...';
      case 'save':
        return 'Saving data...';
      case 'update':
        return 'Updating data...';
      case 'delete':
        return 'Deleting data...';
      case 'upload':
        return 'Uploading...';
      case 'download':
        return 'Downloading...';
      case 'search':
        return 'Searching...';
      case 'sync':
        return 'Synchronizing...';
      default:
        return 'Processing...';
    }
  };

  const getSpinnerContent = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`loading-dots loading-dots--${size}`}>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`loading-pulse loading-pulse--${size}`}>
            <div className="loading-pulse-circle"></div>
          </div>
        );
      
      case 'spinner':
        return (
          <div className={`loading-spinner loading-spinner--${size}`}>
            <div className="loading-spinner-circle"></div>
          </div>
        );
      
      case 'bars':
        return (
          <div className={`loading-bars loading-bars--${size}`}>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        );
      
      default:
        return (
          <div className={`loading-default loading-default--${size}`}>
            <div className="loading-circle"></div>
          </div>
        );
    }
  };

  // Determine the final message to display
  const finalMessage = operation ? (message === 'Loading...' ? getDatabaseMessage(operation) : message) : message;
  
  // Get the database icon if operation is specified
  const databaseIcon = operation ? getDatabaseIcon(operation) : null;

  const content = (
    <div className={`loading-content ${operation ? `loading-operation-${operation}` : ''}`} data-operation={operation}>
      {getSpinnerContent()}
      {finalMessage && (
        <p className="loading-message">
          {databaseIcon && (
            <span className="loading-operation-icon">
              {databaseIcon}
            </span>
          )}
          {finalMessage}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        {content}
      </div>
    );
  }

  return (
    <div className="loading-wrapper">
      {content}
    </div>
  );
};

export default LoadingSpinner;
