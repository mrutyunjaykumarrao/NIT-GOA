import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import useAsyncOperation from '../../../hooks/useAsyncOperation';
import './UserManagement.css';

const UserManagement = () => {
  const { user, token, openLoginModal } = useAuth();
  const { loading: isLoading, executeAsync } = useAsyncOperation();
  
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    if (user && token && user.role === 'Admin') {
      fetchUsers();
    }
  }, [filters, pagination?.currentPage, user, token]);

  // Don't render if user is not authenticated or not an admin
  if (!user || !token) {
    return (
      <div className="user-management-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          Please log in to access this page.
          <button 
            onClick={() => openLoginModal('/admin')} 
            className="btn-primary"
            style={{ marginLeft: '1rem' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'Admin') {
    return (
      <div className="user-management-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  // Helper function to show confirmation dialog
  const showConfirmation = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const fetchUsers = async () => {
    if (!pagination || !filters) return;
    
    executeAsync(
      async () => {
        const queryParams = new URLSearchParams({
          page: (pagination?.currentPage || 1).toString(),
          limit: (pagination?.itemsPerPage || 20).toString(),
          search: filters?.search || '',
          status: filters?.status || 'all'
        });

        const response = await fetch(`/api/admin/users?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch users' }));
          throw new Error(errorData.error || 'Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users || []);
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20
        });
      },
      {
        showSuccessToast: false, // Don't show success toast for fetching users
        showErrorToast: true,
        errorMessage: 'Failed to load users. Please try again.'
      }
    );
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const unlockUser = async (userId, username) => {
    const unlockAction = async () => {
      executeAsync(
        async () => {
          const response = await fetch(`/api/admin/users/${userId}/unlock`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to unlock user');
          }

          // Refresh users list
          fetchUsers();
        },
        {
          showSuccessToast: true,
          successMessage: `User ${username} has been unlocked successfully!`
        }
      );
    };

    showConfirmation(
      `Are you sure you want to unlock ${username}?`,
      unlockAction
    );
  };

  const resetFailedAttempts = async (userId, username) => {
    executeAsync(
      async () => {
        const response = await fetch(`/api/admin/users/${userId}/reset-attempts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to reset failed attempts');
        }

        await fetchUsers(); // Refresh the list
      },
      {
        showSuccessToast: true,
        successMessage: `Failed login attempts reset for ${username}`,
        showErrorToast: true
      }
    );
  };

  const toggleUserStatus = async (userId, username, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    
    const toggleAction = async () => {
      executeAsync(
        async () => {
          const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to toggle user status');
          }

          await fetchUsers(); // Refresh the list
        },
        {
          showSuccessToast: true,
          successMessage: `${username} has been ${action}d successfully`,
          showErrorToast: true
        }
      );
    };

    showConfirmation(
      `Are you sure you want to ${action} ${username}?`,
      toggleAction
    );
  };

  const openEmailModal = (userObj) => {
    setSelectedUser(userObj);
    setNewEmail(userObj.user_email || '');
    setShowEmailModal(true);
  };

  const updateEmail = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    executeAsync(
      async () => {
        const response = await fetch(`/api/admin/users/${selectedUser.user_id}/email`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: newEmail })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update email');
        }

        setShowEmailModal(false);
        setSelectedUser(null);
        setNewEmail('');
        await fetchUsers(); // Refresh the list
      },
      {
        showSuccessToast: true,
        successMessage: `Email updated for ${selectedUser.username}`,
        showErrorToast: true
      }
    );
  };

  const getStatusBadge = (userObj) => {
    if (userObj.status === 'locked') {
      return <span className="status-badge status-locked">Locked</span>;
    }
    if (!userObj.is_active) {
      return <span className="status-badge status-inactive">Inactive</span>;
    }
    return <span className="status-badge status-active">Active</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    // Use the centralized timezone utility
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <p>Manage user accounts, unlock locked accounts, and handle password resets</p>
      </div>

      <div className="user-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by username, name, or email..."
            value={filters.search}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
        </div>
        
        <select
          value={filters.status}
          onChange={handleStatusChange}
          disabled={isLoading}
          className="status-filter"
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      <div className="users-table-container">
        {isLoading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading users...</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Failed Attempts</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((userObj) => (
                <tr key={userObj.user_id} className={`user-row ${userObj.status}`}>
                  <td>
                    <div className="user-info">
                      <strong>{userObj.username}</strong>
                      {userObj.full_name && (
                        <small>{userObj.full_name}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="email-info">
                      <span>{userObj.employee_email || userObj.user_email || 'No email'}</span>
                      {!userObj.employee_email && (
                        <button
                          onClick={() => openEmailModal(userObj)}
                          className="email-edit-btn"
                          title="Set email for password reset"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-${userObj.access_level.toLowerCase()}`}>
                      {userObj.access_level}
                    </span>
                  </td>
                  <td>{getStatusBadge(userObj)}</td>
                  <td>
                    <span className={userObj.failed_login_attempts > 0 ? 'failed-attempts warning' : 'failed-attempts'}>
                      {userObj.failed_login_attempts}
                    </span>
                  </td>
                  <td>{formatDate(userObj.last_login)}</td>
                  <td>
                    <div className="user-actions">
                      {userObj.status === 'locked' && (
                        <button
                          onClick={() => unlockUser(userObj.user_id, userObj.username)}
                          className="action-btn unlock-btn"
                          title="Unlock account"
                        >
                          <i className="fas fa-unlock"></i>
                        </button>
                      )}
                      
                      {userObj.failed_login_attempts > 0 && (
                        <button
                          onClick={() => resetFailedAttempts(userObj.user_id, userObj.username)}
                          className="action-btn reset-btn"
                          title="Reset failed login attempts"
                        >
                          <i className="fas fa-redo"></i>
                        </button>
                      )}
                      
                      <button
                        onClick={() => toggleUserStatus(userObj.user_id, userObj.username, userObj.is_active)}
                        className={`action-btn ${userObj.is_active ? 'deactivate-btn' : 'activate-btn'}`}
                        title={userObj.is_active ? 'Deactivate account' : 'Activate account'}
                        disabled={userObj.user_id === user?.id} // Can't disable own account
                      >
                        <i className={`fas ${userObj.is_active ? 'fa-ban' : 'fa-check'}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || isLoading}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalItems} total users)
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || isLoading}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Set Email for {selectedUser?.username}</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="modal-close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p>This email will be used for password reset functionality.</p>
              <div className="user-management-form-group">
                <label htmlFor="newEmail">Email Address</label>
                <input
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => setShowEmailModal(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={updateEmail}
                className="btn-primary"
                disabled={!newEmail}
              >
                Update Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelConfirm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Action</h3>
              <button
                onClick={handleCancelConfirm}
                className="modal-close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p>{confirmMessage}</p>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={handleCancelConfirm}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
