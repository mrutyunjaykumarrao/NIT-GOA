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

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-page">
          <div className="error-boundary-container">
            <div className="error-boundary-animation-section">
              <div className="error-boundary-code-display">
                <h1 className="error-boundary-number">⚠️</h1>
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
                  🔄 Refresh Page
                </button>
                <Link 
                  to="/" 
                  className="error-boundary-btn error-boundary-btn-secondary"
                >
                  🏠 Go Home
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
                        {this.state.errorInfo.componentStack}
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
