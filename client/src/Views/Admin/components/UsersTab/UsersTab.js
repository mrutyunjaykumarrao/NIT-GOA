import React, { useState } from 'react';
import './UsersTab.css';

const UsersTab = ({ usersList, onCreateUser, onEditUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('user_id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Handle nested array structure - flatten if needed
  let users = [];
  if (Array.isArray(usersList)) {
    if (usersList.length > 0 && Array.isArray(usersList[0])) {
      users = usersList.flat();
    } else {
      users = usersList;
    }
  }

  // Get unique roles for filter
  const roles = [...new Set(users.map(user => user.role).filter(Boolean))];

  // Filter and search functionality
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employee_id?.toString().includes(searchTerm) ||
      user.user_id?.toString().includes(searchTerm);
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort functionality
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'username':
        aValue = a.username || '';
        bValue = b.username || '';
        break;
      case 'role':
        aValue = a.role || '';
        bValue = b.role || '';
        break;
      case 'employee_id':
        aValue = a.employee_id || '';
        bValue = b.employee_id || '';
        break;
      case 'last_login':
        aValue = new Date(a.last_login || 0);
        bValue = new Date(b.last_login || 0);
        break;
      case 'created_at':
        aValue = new Date(a.created_at || 0);
        bValue = new Date(b.created_at || 0);
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (sortBy === 'created_at' || sortBy === 'last_login') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const comparison = aValue.toString().localeCompare(bValue.toString());
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = showAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = showAll ? sortedUsers.length : startIndex + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setSortBy('employee_id');
    setSortOrder('asc');
    setCurrentPage(1);
    setShowAll(false);
  };

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || roleFilter || statusFilter;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (showAll || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="users-tab-pagination-btn users-tab-pagination-prev"
        >
          ‹
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`users-tab-pagination-btn ${currentPage === i ? 'users-tab-pagination-active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="users-tab-pagination-btn users-tab-pagination-next"
        >
          ›
        </button>
      );
    }

    return (
      <div className="users-tab-pagination">
        <div className="users-tab-pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedUsers.length)} of {sortedUsers.length}
        </div>
        <div className="users-tab-pagination-controls">
          {pages}
          <button
            onClick={handleShowAll}
            className="users-tab-show-all-btn"
          >
            Show All
          </button>
        </div>
      </div>
    );
  };

  // Avatar component with image fallback
  const UserAvatar = ({ user, size = 40 }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const getInitials = (username) => {
      if (!username) return 'U';
      const names = username.split(' ');
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const getColor = (name) => {
      if (!name) return '#6B7280';
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colors = [
        '#EF4444', '#F97316', '#F59E0B', '#10B981', 
        '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'
      ];
      return colors[Math.abs(hash) % colors.length];
    };

    const hasValidImage = user?.image_url && !imageError;
    const initials = getInitials(user?.username || user?.full_name);
    const backgroundColor = getColor(user?.username || user?.full_name);

    if (hasValidImage) {
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6'
          }}
        >
          <img
            src={user.image_url}
            alt={`${user.username} avatar`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoading ? 'none' : 'block'
            }}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          {imageLoading && (
            <div
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: size > 40 ? '14px' : '12px',
                fontWeight: '600',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {initials}
            </div>
          )}
        </div>
      );
    }

    // Fallback avatar with initials
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size > 40 ? '14px' : '12px',
          fontWeight: '600',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {initials}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '#EF4444'; // Red
      case 'faculty':
        return '#10B981'; // Green
      case 'staff':
        return '#8B5CF6'; // Purple
      case 'student':
        return '#3B82F6'; // Blue
      default:
        return '#6B7280'; // Gray
    }
  };

  return (
    <div className="users-tab-container">
      {/* Search and Filters Section */}
      <div className="users-tab-filters-section">
        <div className="users-tab-search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="users-tab-search-input"
          />
        </div>
        
        <div className="users-tab-filter-controls">
          <div className="users-tab-filter-left">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="users-tab-filter-select"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="users-tab-filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="users-tab-clear-filters-btn"
                title="Clear all filters"
              >
                <i className="fas fa-times"></i>
                Clear
              </button>
            )}
          </div>

          <button className="users-tab-create-btn" onClick={onCreateUser}>
            <i className="fas fa-plus"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="users-tab-results-summary">
        {showAll ? (
          <>Showing all {sortedUsers.length} of {users.length} users</>
        ) : (
          <>Showing {startIndex + 1}-{Math.min(endIndex, sortedUsers.length)} of {sortedUsers.length} users (Page {currentPage} of {totalPages})</>
        )}
      </div>

      {/* Users Table */}
      <div className="users-tab-table-container">
        <table className="users-tab-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th 
                className="users-tab-sortable-header"
                onClick={() => handleSort('employee_id')}
              >
                Employee ID
                <i className={`fas fa-sort${sortBy === 'employee_id' ? (sortOrder === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th 
                className="users-tab-sortable-header"
                onClick={() => handleSort('username')}
              >
                Username
                <i className={`fas fa-sort${sortBy === 'username' ? (sortOrder === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th 
                className="users-tab-sortable-header"
                onClick={() => handleSort('role')}
              >
                Role
                <i className={`fas fa-sort${sortBy === 'role' ? (sortOrder === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th 
                className="users-tab-sortable-header"
                onClick={() => handleSort('last_login')}
              >
                Last Logged In
                <i className={`fas fa-sort${sortBy === 'last_login' ? (sortOrder === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th 
                className="users-tab-sortable-header"
                onClick={() => handleSort('created_at')}
              >
                Created At
                <i className={`fas fa-sort${sortBy === 'created_at' ? (sortOrder === 'asc' ? '-up' : '-down') : ''}`}></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="users-tab-empty-cell">
                  {users.length === 0 ? 'No users found' : 'No users match the current filters'}
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.user_id || user.id} className="users-tab-table-row">
                  {/* Avatar */}
                  <td className="users-tab-avatar-cell">
                    <div className="users-tab-user-avatar">
                      <UserAvatar user={user} size={40} />
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="users-tab-employee-cell">
                    {user.employee_id ? (
                      <span className="users-tab-employee-id">
                        {user.employee_id}
                      </span>
                    ) : (
                      <span className="users-tab-no-employee">—</span>
                    )}
                  </td>

                  {/* Username */}
                  <td className="users-tab-username-cell">
                    <div className="users-tab-username-content">
                      <span className="users-tab-username">{user.username}</span>
                      {user.full_name && (
                        <span className="users-tab-full-name">{user.full_name}</span>
                      )}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="users-tab-role-cell">
                    <span 
                      className="users-tab-role-badge"
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Last Login */}
                  <td className="users-tab-date-cell">
                    <span className="users-tab-last-login">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="users-tab-date-cell">
                    <span className="users-tab-created-date">
                      {formatDate(user.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="users-tab-actions-cell">
                    <div className="users-tab-action-buttons">
                      <button 
                        className="users-tab-edit-btn"
                        title="Edit User"
                        onClick={() => onEditUser(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="users-tab-delete-btn"
                        title="Delete User"
                        onClick={() => onDeleteUser(user.user_id || user.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default UsersTab;
