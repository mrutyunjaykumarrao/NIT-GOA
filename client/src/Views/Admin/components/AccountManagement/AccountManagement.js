import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import useAsyncOperation from '../../../../hooks/useAsyncOperation';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Form state for editing and creating
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    access_level: '',
    is_active: true
  });

  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    access_level: '',
    is_active: true
  });

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
    setSelectedUser(user);
    setEditForm({
      username: user.username || '',
      email: user.user_email || '',
      access_level: user.access_level || '',
      is_active: user.is_active || false
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditForm({
      username: '',
      email: '',
      access_level: '',
      is_active: true
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      username: '',
      email: '',
      password: '',
      access_level: '',
      is_active: true
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;

    await executeAsync(async () => {
      const response = await fetch(`/api/admin/users/${selectedUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      closeEditModal();
      await fetchUsers();
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    await executeAsync(async () => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      closeCreateModal();
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
    // Check for employee image first, then try to construct from employee_id
    if (user.employee_image) {
      return user.employee_image;
    }
    // Try to construct image path from employee_id if available
    if (user.employee_id) {
      return `/images/Faculty/${user.employee_id}.jpg`;
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
      <div className="account-management-header">
        <div className="header-content">
          <div className="header-text">
            <h2>Account Management</h2>
            <p>Manage user accounts, roles, and permissions</p>
          </div>
          <button 
            className="btn-primary create-user-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus"></i>
            Create User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="account-management-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by username, name, or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
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
                  <th>Employee ID</th>
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
                      {user.employee_id ? (
                        <span className="employee-id">#{user.employee_id}</span>
                      ) : (
                        <span className="no-employee-id">No ID</span>
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New User</h3>
              <button className="modal-close" onClick={closeCreateModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="create-form">
              <div className="form-group">
                <label htmlFor="create-username">Username *</label>
                <input
                  type="text"
                  id="create-username"
                  value={createForm.username}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="create-email">Email</label>
                <input
                  type="email"
                  id="create-email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="create-password">Password *</label>
                <input
                  type="password"
                  id="create-password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="create-access-level">Role *</label>
                <select
                  id="create-access-level"
                  value={createForm.access_level}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, access_level: e.target.value }))}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={createForm.is_active}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  Active User
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={closeCreateModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User: {selectedUser?.username}</h3>
              <button className="modal-close" onClick={closeEditModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="access_level">Role</label>
                <select
                  id="access_level"
                  value={editForm.access_level}
                  onChange={(e) => setEditForm(prev => ({ ...prev, access_level: e.target.value }))}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  Active User
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
