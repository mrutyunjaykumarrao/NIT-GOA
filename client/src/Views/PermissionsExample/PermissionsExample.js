import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import ConditionalRender, { AdminOnly, FacultyOnly, AuthenticatedOnly, EditPermission } from '../../components/ConditionalRender/ConditionalRender';

/**
 * Example component demonstrating the role-based access control system
 * This shows how to use all the permission components and hooks
 */
const PermissionsExample = () => {
  const permissions = usePermissions();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Role-Based Access Control Demo</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current User Info:</h3>
        <p><strong>Logged in:</strong> {permissions.isLoggedIn() ? 'Yes' : 'No'}</p>
        {permissions.isLoggedIn() && (
          <>
            <p><strong>Role:</strong> {permissions.getUserRole()}</p>
            <p><strong>User:</strong> {JSON.stringify(permissions.getUserInfo(), null, 2)}</p>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        
        {/* Public Content - Always Visible */}
        <div style={{ padding: '15px', border: '2px solid #28a745', borderRadius: '8px' }}>
          <h3 style={{ color: '#28a745' }}>🌐 Public Content (Always Visible)</h3>
          <p>This content is visible to everyone, whether they're logged in or not.</p>
          <ul>
            <li>Faculty profiles and contact information</li>
            <li>Department information</li>
            <li>Academic calendar</li>
            <li>Admissions information</li>
          </ul>
        </div>

        {/* Admin Only Content */}
        <AdminOnly 
          fallback={
            <div style={{ padding: '15px', border: '2px solid #dc3545', borderRadius: '8px', opacity: '0.5' }}>
              <h3 style={{ color: '#dc3545' }}>🔒 Admin Only (Hidden - You're not an admin)</h3>
              <p>This content is only visible to users with Admin role.</p>
            </div>
          }
        >
          <div style={{ padding: '15px', border: '2px solid #007bff', borderRadius: '8px' }}>
            <h3 style={{ color: '#007bff' }}>👑 Admin Only Content (Visible)</h3>
            <p>You can see this because you're an Admin!</p>
            <ul>
              <li>Admin Dashboard</li>
              <li>User Management</li>
              <li>System Settings</li>
              <li>Edit any faculty profile</li>
            </ul>
          </div>
        </AdminOnly>

        {/* Faculty Only Content */}
        <FacultyOnly 
          fallback={
            <div style={{ padding: '15px', border: '2px solid #dc3545', borderRadius: '8px', opacity: '0.5' }}>
              <h3 style={{ color: '#dc3545' }}>🔒 Faculty Only (Hidden - You're not faculty)</h3>
              <p>This content is only visible to users with Faculty role.</p>
            </div>
          }
        >
          <div style={{ padding: '15px', border: '2px solid #ffc107', borderRadius: '8px' }}>
            <h3 style={{ color: '#856404' }}>👨‍🏫 Faculty Only Content (Visible)</h3>
            <p>You can see this because you're Faculty!</p>
            <ul>
              <li>Edit your own profile</li>
              <li>Course management</li>
              <li>Student records access</li>
            </ul>
          </div>
        </FacultyOnly>

        {/* Authenticated Users Content */}
        <AuthenticatedOnly 
          fallback={
            <div style={{ padding: '15px', border: '2px solid #dc3545', borderRadius: '8px', opacity: '0.5' }}>
              <h3 style={{ color: '#dc3545' }}>🔒 Authenticated Only (Hidden - You're not logged in)</h3>
              <p>This content is only visible to logged-in users.</p>
            </div>
          }
        >
          <div style={{ padding: '15px', border: '2px solid #17a2b8', borderRadius: '8px' }}>
            <h3 style={{ color: '#17a2b8' }}>🔐 Authenticated Content (Visible)</h3>
            <p>You can see this because you're logged in!</p>
            <ul>
              <li>Personal dashboard</li>
              <li>Settings</li>
              <li>Logout option</li>
            </ul>
          </div>
        </AuthenticatedOnly>

        {/* Edit Permission Examples */}
        <div style={{ padding: '15px', border: '2px solid #6f42c1', borderRadius: '8px' }}>
          <h3 style={{ color: '#6f42c1' }}>✏️ Edit Permission Examples</h3>
          
          {/* Example Faculty ID: 1 */}
          <div style={{ marginBottom: '10px' }}>
            <p><strong>Faculty ID: 1</strong></p>
            <EditPermission 
              facultyId="1"
              fallback={<span style={{ color: '#dc3545' }}>❌ Cannot edit this faculty profile</span>}
            >
              <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
                ✅ Edit Faculty 1 Profile
              </button>
            </EditPermission>
          </div>

          {/* Example Faculty ID: 2 */}
          <div style={{ marginBottom: '10px' }}>
            <p><strong>Faculty ID: 2</strong></p>
            <EditPermission 
              facultyId="2"
              fallback={<span style={{ color: '#dc3545' }}>❌ Cannot edit this faculty profile</span>}
            >
              <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
                ✅ Edit Faculty 2 Profile
              </button>
            </EditPermission>
          </div>
        </div>

        {/* Custom Condition Example */}
        <ConditionalRender 
          condition={(permissions) => {
            return permissions.isLoggedIn() && (permissions.isAdmin() || permissions.isFaculty());
          }}
          fallback={
            <div style={{ padding: '15px', border: '2px solid #dc3545', borderRadius: '8px', opacity: '0.5' }}>
              <h3 style={{ color: '#dc3545' }}>🔒 Custom Condition (Hidden)</h3>
              <p>This uses a custom condition check.</p>
            </div>
          }
        >
          <div style={{ padding: '15px', border: '2px solid #fd7e14', borderRadius: '8px' }}>
            <h3 style={{ color: '#fd7e14' }}>🎯 Custom Condition (Visible)</h3>
            <p>This content is visible if you're either Admin OR Faculty (custom logic).</p>
          </div>
        </ConditionalRender>

        {/* Permission Methods Demo */}
        <div style={{ padding: '15px', border: '2px solid #6c757d', borderRadius: '8px' }}>
          <h3 style={{ color: '#6c757d' }}>🔍 Permission Methods Demo</h3>
          <ul>
            <li><strong>canViewPublicContent:</strong> {permissions.canViewPublicContent() ? '✅' : '❌'}</li>
            <li><strong>canAccessAdmin:</strong> {permissions.canAccessAdmin() ? '✅' : '❌'}</li>
            <li><strong>canEditAnyFaculty:</strong> {permissions.canEditAnyFaculty() ? '✅' : '❌'}</li>
            <li><strong>canEditFaculty(1):</strong> {permissions.canEditFaculty('1') ? '✅' : '❌'}</li>
            <li><strong>canViewAdminDashboard:</strong> {permissions.canViewAdminDashboard() ? '✅' : '❌'}</li>
            <li><strong>isFaculty:</strong> {permissions.isFaculty() ? '✅' : '❌'}</li>
            <li><strong>isAdmin:</strong> {permissions.isAdmin() ? '✅' : '❌'}</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
        <h3>How to Test This System:</h3>
        <ol>
          <li><strong>When not logged in:</strong> You should only see public content</li>
          <li><strong>When logged in as Faculty:</strong> You should see public content + faculty-only content + ability to edit your own profile</li>
          <li><strong>When logged in as Admin:</strong> You should see everything + ability to edit any faculty profile</li>
        </ol>
        
        <h4>Try These Actions:</h4>
        <ul>
          <li>Navigate to any faculty profile page - you should always be able to view it</li>
          <li>Look for the "Edit Profile" button - it should only appear if you have permission</li>
          <li>Try accessing <code>/admin</code> - only admins should be able to access it</li>
          <li>Try accessing <code>/faculty/1/edit</code> directly - proper authorization should be enforced</li>
        </ul>
      </div>
    </div>
  );
};

export default PermissionsExample;
