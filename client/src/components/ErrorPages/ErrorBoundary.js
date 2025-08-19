import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPages.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  // SVG Icons (matching other error pages)
  RefreshIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  );

  HomeIcon = () => (
    <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );

  WarningIcon = () => (
    <svg 
      className="error-boundary-warning-svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      width="80" 
      height="80"
    >
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  );

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-page">
          <div className="error-boundary-container">
            <div className="error-boundary-animation-section">
              <div className="error-boundary-code-display">
                <this.WarningIcon />
              </div>
            </div>
            
            <div className="error-boundary-content-section">
              <h1 className="error-boundary-title">Something went wrong</h1>
              <p className="error-boundary-message">
                An unexpected error occurred while rendering this page. Our team has been 
                notified and is working to fix the issue.
              </p>
              
              <div className="error-boundary-action-buttons">
                <button 
                  onClick={this.handleRefresh} 
                  className="error-boundary-btn error-boundary-btn-primary"
                >
                  <this.RefreshIcon />
                  Refresh Page
                </button>
                <Link 
                  to="/" 
                  className="error-boundary-btn error-boundary-btn-secondary"
                >
                  <this.HomeIcon />
                  Go Home
                </Link>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="error-boundary-development-details">
                  <details>
                    <summary className="error-boundary-details-summary">
                      View Error Details (Development)
                    </summary>
                    <div className="error-boundary-details-stack">
                      <h3 className="error-boundary-details-heading">Error:</h3>
                      <pre className="error-boundary-details-code">
                        {this.state.error && this.state.error.toString()}
                      </pre>
                      <h3 className="error-boundary-details-heading">Component Stack:</h3>
                      <pre className="error-boundary-details-code">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
