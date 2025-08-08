import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Authorization.css';

/**
 * ProtectedRoute - Component for routes that require authentication
 * Use this for pages that should only be accessible to logged-in users
 * For role-specific access, use RoleBasedRoute instead
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  fallbackPath = '/',
  showUnauthorizedMessage = false 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log('🔒 PROTECTED ROUTE CHECK:', {
    path: location.pathname,
    isAuthenticated,
    user: user ? { id: user.id, role: user.role, username: user.username } : null,
    isLoading,
    requiredRole
  });

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🔒 REDIRECTING TO LOGIN: User not authenticated');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole) {
    console.log('🔒 ACCESS DENIED: Role requirement not met', {
      userRole: user?.role,
      requiredRole
    });
    if (showUnauthorizedMessage) {
      return (
        <div className="unauthorized-message">
          <div className="unauthorized-content">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <button onClick={() => window.history.back()} className="btn btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      );
    }
    console.log('🔒 REDIRECTING: Role check failed, redirecting to fallback');
    return <Navigate to={fallbackPath} replace />;
  }

  console.log('🔒 ACCESS GRANTED: All checks passed, rendering children');
  return children;
};

export default ProtectedRoute;
