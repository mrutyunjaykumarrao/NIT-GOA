import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import useAsyncOperation from '../../../../hooks/useAsyncOperation';
import { UserModal } from '../AdminModals';
import './AccountManagement.css';

const AccountManagement = () => {
  const { user, token, openLoginModal } = useAuth();
  const { loading: isLoading, executeAsync } = useAsyncOperation();
  
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  // Pagination helper variables
  const currentPage = pagination.currentPage;
  const totalUsers = pagination.totalItems;
  const usersPerPage = pagination.itemsPerPage;
  const setCurrentPage = (page) => setPagination(prev => ({ ...prev, currentPage: page }));
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all' // all, active, inactive, locked
  });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState('create'); // 'create' or 'edit'
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
      <div className="account-management-container">
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
      <div className="account-management-container">
        <div className="error-message">
          <i className="fas fa-ban"></i>
          Access denied. Admin role required.
        </div>
      </div>
    );
  }

  const fetchUsers = async () => {
    await executeAsync(async () => {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        search: filters.search,
        status: filters.status
      });

      const response = await fetch(`/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setPagination(data.pagination || pagination);
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const openEditModal = (user) => {
    handleEditUser(user);
  };

  const handleCreateUser = () => {
    setUserModalMode('create');
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setUserModalMode('edit');
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserModalClose = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserModalMode('create');
  };

  const handleUserSubmit = async (formData, mode) => {
    await executeAsync(async () => {
      if (mode === 'edit' && selectedUser) {
        const response = await fetch(`/api/admin/users/${selectedUser.user_id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }
      } else if (mode === 'create') {
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }
      }

      handleUserModalClose();
      await fetchUsers();
    });
  };

  const showConfirmation = (action, user, message) => {
    setConfirmAction(() => action);
    setSelectedUser(user);
    setConfirmMessage(message);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setSelectedUser(null);
    setConfirmMessage('');
  };

  const toggleUserStatus = async (user) => {
    await executeAsync(async () => {
      const response = await fetch(`/api/admin/users/${user.user_id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !user.is_active })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      await fetchUsers();
    });
  };

  const unlockUser = async (user) => {
    await executeAsync(async () => {
      const response = await fetch(`/api/admin/users/${user.user_id}/unlock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unlock user');
      }

      await fetchUsers();
    });
  };

  const deleteUser = async (user) => {
    await executeAsync(async () => {
      const response = await fetch(`/api/admin/users/${user.user_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await fetchUsers();
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: 'Never', time: '' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const isUserLocked = (user) => {
    return user.locked_until && new Date(user.locked_until) > new Date();
  };

  const getAvatarUrl = (user) => {
    // Check for employee image first, then try to construct from employee_code
    if (user.employee_image) {
      return user.employee_image;
    }
    // Try to construct image path from employee_code if available
    if (user.employee_code) {
      return `/images/Faculty/${user.employee_code}.jpg`;
    }
    return null;
  };

  const getInitials = (name, username) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return username ? username.slice(0, 2).toUpperCase() : 'U';
  };



  return (
    <div className="account-management-container">
      {/* Search and Filters Section - Technical Staff Style */}
      <div className="search-filters-container">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search by name, email, or employee code..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
        {/* Filters and Create Button Row */}
        <div className="filters-and-create">
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="status-filter"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
            </select>
          </div>
          
          <button 
            className="create-user-btn"
            onClick={handleCreateUser}
          >
            <i className="fas fa-plus"></i>
            Create User
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Loading users...</span>
        </div>
      )}

      {/* Users Table */}
      {!isLoading && (
        <>
          <div className="account-management-table-container">
            <table className="account-management-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Employee Code</th>
                  <th>Username & Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className={!user.is_active ? 'user-inactive' : isUserLocked(user) ? 'user-locked' : ''}>
                    <td>
                      <div className="user-avatar">
                        {getAvatarUrl(user) ? (
                          <img 
                            src={getAvatarUrl(user)} 
                            alt={user.full_name || user.username}
                            className="avatar-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="avatar-initials" style={getAvatarUrl(user) ? {display: 'none'} : {}}>
                          {getInitials(user.full_name, user.username)}
                        </div>
                      </div>
                    </td>
                    <td>
                      {user.employee_code ? (
                        <span className="employee-id">#{user.employee_code}</span>
                      ) : (
                        <span className="no-employee-id">No Code</span>
                      )}
                    </td>
                    <td>
                      <div className="user-name-info">
                        <div className="username">
                          {user.username}
                          {!user.is_active && <span className="status-indicator inactive-indicator" title="Inactive">●</span>}
                          {isUserLocked(user) && <span className="status-indicator locked-indicator" title="Locked">🔒</span>}
                        </div>
                        {user.full_name && (
                          <div className="full-name">{user.full_name}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="email-info">
                        {user.user_email && (
                          <div className="primary-email">{user.user_email}</div>
                        )}
                        {user.employee_email && user.employee_email !== user.user_email && (
                          <div className="secondary-email">{user.employee_email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.access_level?.toLowerCase()}`}>
                        {user.access_level}
                      </span>
                    </td>
                    <td>
                      <div className="date-time-info">
                        {formatDate(user.last_login).date !== 'Never' ? (
                          <>
                            <div className="date">{formatDate(user.last_login).date}</div>
                            <div className="time">{formatDate(user.last_login).time}</div>
                          </>
                        ) : (
                          <div className="never">Never</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="date-time-info">
                        <div className="date">{formatDate(user.created_at).date}</div>
                        <div className="time">{formatDate(user.created_at).time}</div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => openEditModal(user)}
                          title="Edit User"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        
                        {user.is_active ? (
                          <button
                            className="action-btn deactivate-btn"
                            onClick={() => showConfirmation(
                              () => toggleUserStatus(user),
                              user,
                              `Are you sure you want to deactivate ${user.username}?`
                            )}
                            title="Deactivate User"
                          >
                            <i className="fas fa-user-slash"></i>
                          </button>
                        ) : (
                          <button
                            className="action-btn activate-btn"
                            onClick={() => showConfirmation(
                              () => toggleUserStatus(user),
                              user,
                              `Are you sure you want to activate ${user.username}?`
                            )}
                            title="Activate User"
                          >
                            <i className="fas fa-user-check"></i>
                          </button>
                        )}

                        {isUserLocked(user) && (
                          <button
                            className="action-btn unlock-btn"
                            onClick={() => showConfirmation(
                              () => unlockUser(user),
                              user,
                              `Are you sure you want to unlock ${user.username}?`
                            )}
                            title="Unlock User"
                          >
                            <i className="fas fa-unlock"></i>
                          </button>
                        )}
                        
                        <button
                          className="action-btn delete-btn"
                          onClick={() => showConfirmation(
                            () => deleteUser(user),
                            user,
                            `Are you sure you want to delete ${user.username}? This action cannot be undone.`
                          )}
                          title="Delete User"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="no-data-message">
                <i className="fas fa-users"></i>
                <p>No users found matching your criteria.</p>
                <p>Try adjusting your search or filter settings.</p>
              </div>
            )}
          </div>

        </>
      )}

      {/* Pagination */}
      {users.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {Array.from({length: Math.ceil(totalUsers / usersPerPage)}, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current
                const totalPages = Math.ceil(totalUsers / usersPerPage);
                return page === 1 || 
                       page === totalPages || 
                       Math.abs(page - currentPage) <= 1;
              })
              .map((page, index, array) => {
                // Add ellipsis when there's a gap
                const elements = [];
                if (index > 0 && array[index - 1] < page - 1) {
                  elements.push(
                    <span key={`ellipsis-${page}`} className="pagination-ellipsis">...</span>
                  );
                }
                elements.push(
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
                return elements;
              })
              .flat()
            }
            
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalUsers / usersPerPage), prev + 1))}
              disabled={currentPage >= Math.ceil(totalUsers / usersPerPage)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        show={showUserModal}
        onClose={handleUserModalClose}
        onSubmit={handleUserSubmit}
        mode={userModalMode}
        initialData={selectedUser}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Action</h3>
            </div>
            
            <div className="modal-body">
              <p>{confirmMessage}</p>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction} 
                className="btn-danger"
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

export default AccountManagement;
