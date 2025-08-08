import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * RoleBasedRoute - Component for routes that require specific role-based access
 * This allows more complex authorization logic beyond just checking for admin role
 */
const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuthentication = true,
  customAuthCheck = null,
  fallbackPath = '/',
  unauthorizedComponent = null 
}) => {
  const { isAuthenticated, user, isLoading, openLoginModal } = useAuth();
  const location = useLocation();

  // Open login modal if authentication is required but user is not authenticated (hook must be called before any conditional returns)
  useEffect(() => {
    if (!isLoading && requireAuthentication && !isAuthenticated) {
      console.log('🛡️ OPENING LOGIN MODAL: Authentication required but user not authenticated');
      openLoginModal();
    }
  }, [isAuthenticated, isLoading, requireAuthentication, openLoginModal]);

  console.log('🛡️ ROLE-BASED ROUTE CHECK:', {
    path: location.pathname,
    isAuthenticated,
    user: user ? { id: user.id, role: user.role, username: user.username } : null,
    isLoading,
    allowedRoles,
    requireAuthentication
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

  // Check if authentication is required
  if (requireAuthentication && !isAuthenticated) {
    console.log('🛡️ REDIRECTING TO LOGIN: Authentication required but user not authenticated');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, check role-based access
  if (isAuthenticated && user) {
    console.log('🛡️ CHECKING ROLES: User is authenticated, checking permissions');
    
    // Use custom auth check if provided
    if (customAuthCheck) {
      const hasAccess = customAuthCheck(user, location);
      console.log('🛡️ CUSTOM AUTH CHECK:', { hasAccess });
      if (!hasAccess) {
        console.log('🛡️ ACCESS DENIED: Custom auth check failed');
        if (unauthorizedComponent) {
          return unauthorizedComponent;
        }
        return <Navigate to={fallbackPath} replace />;
      }
    }
    // Standard role check
    else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      console.log('🛡️ ACCESS DENIED: User role not in allowed roles', {
        userRole: user.role,
        allowedRoles,
        roleMatch: allowedRoles.includes(user.role)
      });
      if (unauthorizedComponent) {
        return unauthorizedComponent;
      }
      return <Navigate to={fallbackPath} replace />;
    } else if (allowedRoles.length > 0) {
      console.log('🛡️ ACCESS GRANTED: User role matches allowed roles', {
        userRole: user.role,
        allowedRoles
      });
    }
  }

  console.log('🛡️ RENDERING CHILDREN: All checks passed');
  return children;
};

export default RoleBasedRoute;
