import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPages.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-container">
            <div className="error-animation-section">
              <div className="error-code-display">
                <div className="error-boundary-icon">⚠️</div>
                <div className="error-boundary-circuit">
                  <div className="error-boundary-circuit-line"></div>
                  <div className="error-boundary-circuit-line"></div>
                  <div className="error-boundary-circuit-node"></div>
                  <div className="error-boundary-circuit-node"></div>
                </div>
              </div>
            </div>
            
            <div className="error-content-section">
              <h1 className="error-content-title">Something Went Wrong</h1>
              <p className="error-content-message">
                An unexpected error occurred while rendering this page. 
                Our team has been notified and is working to fix the issue.
              </p>
              
              <div className="error-action-buttons">
                <button onClick={this.handleRefresh} className="error-btn error-btn-primary">
                  Refresh Page
                </button>
                <Link to="/" className="error-btn error-btn-secondary">
                  Go to Homepage
                </Link>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="error-debug-details">
                  <summary>Error Details (Development Only)</summary>
                  <div className="error-debug-stack">
                    <h4>Error:</h4>
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                    <h4>Component Stack:</h4>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                </details>
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
