import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to check user permissions
 * This provides a clean way to check permissions anywhere in your app
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const permissions = {
    // Check if user can view public content (everyone can)
    canViewPublicContent: () => true,

    // Check if user can access admin features
    canAccessAdmin: () => isAuthenticated && user?.role === 'Admin',

    // Check if user can edit any faculty profile (Admin only)
    canEditAnyFaculty: () => isAuthenticated && user?.role === 'Admin',

    // Check if user can edit a specific faculty profile
    canEditFaculty: (facultyId) => {
      if (!isAuthenticated || !user) return false;
      
      // Admin can edit any faculty
      if (user.role === 'Admin') return true;
      
      // Faculty can edit only their own profile
      if (user.role === 'Faculty') {
        // The facultyId parameter is the employee_code from the URL
        // We need to match it with the user's employee_code or employee_id
        return facultyId === user.employee_code || 
               facultyId === user.employee_id?.toString() ||
               facultyId === user.id?.toString();
      }
      
      return false;
    },

    // Check if user can view faculty edit interface
    canAccessFacultyEdit: (facultyId = null) => {
      if (!isAuthenticated || !user) return false;
      
      // Admin can access any edit interface
      if (user.role === 'Admin') return true;
      
      // Faculty can access edit for their own profile
      if (user.role === 'Faculty' && facultyId) {
        return facultyId === user.employee_code || 
               facultyId === user.employee_id?.toString() ||
               facultyId === user.id?.toString();
      }
      
      return false;
    },

    // Check if user can view admin dashboard
    canViewAdminDashboard: () => isAuthenticated && user?.role === 'Admin',

    // Check if user is faculty
    isFaculty: () => isAuthenticated && user?.role === 'Faculty',

    // Check if user is admin
    isAdmin: () => isAuthenticated && user?.role === 'Admin',

    // Check if user is authenticated
    isLoggedIn: () => isAuthenticated && !!user,

    // Get user role
    getUserRole: () => user?.role || null,

    // Get user info
    getUserInfo: () => user || null
  };

  return permissions;
};
