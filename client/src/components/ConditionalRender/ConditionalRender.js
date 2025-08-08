import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * ConditionalRender - Component to conditionally render UI elements based on user permissions
 * This makes it easy to show/hide elements like "Edit" buttons based on user role
 */
const ConditionalRender = ({ 
  children, 
  condition = null,
  roles = [], 
  requireAuth = false,
  facultyId = null,
  fallback = null 
}) => {
  const permissions = usePermissions();

  let shouldRender = false;

  // Custom condition check
  if (condition !== null) {
    shouldRender = typeof condition === 'function' ? condition(permissions) : !!condition;
  }
  // Role-based check
  else if (roles.length > 0) {
    const userRole = permissions.getUserRole();
    shouldRender = roles.includes(userRole);
  }
  // Authentication check
  else if (requireAuth) {
    shouldRender = permissions.isLoggedIn();
  }
  // Faculty edit check
  else if (facultyId) {
    shouldRender = permissions.canEditFaculty(facultyId);
  }
  // Default to true if no conditions specified
  else {
    shouldRender = true;
  }

  if (shouldRender) {
    return children;
  }

  return fallback;
};

export default ConditionalRender;

// Convenience components for common use cases
export const AdminOnly = ({ children, fallback = null }) => (
  <ConditionalRender roles={['Admin']} fallback={fallback}>
    {children}
  </ConditionalRender>
);

export const FacultyOnly = ({ children, fallback = null }) => (
  <ConditionalRender roles={['Faculty']} fallback={fallback}>
    {children}
  </ConditionalRender>
);

export const AuthenticatedOnly = ({ children, fallback = null }) => (
  <ConditionalRender requireAuth={true} fallback={fallback}>
    {children}
  </ConditionalRender>
);

export const EditPermission = ({ facultyId, children, fallback = null }) => (
  <ConditionalRender 
    condition={(permissions) => permissions.canEditFaculty(facultyId)} 
    fallback={fallback}
  >
    {children}
  </ConditionalRender>
);
