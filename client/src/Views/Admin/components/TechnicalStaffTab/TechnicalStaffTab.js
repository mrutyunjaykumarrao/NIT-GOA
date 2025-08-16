import React, { useState } from 'react';
import './TechnicalStaffTab.css';

const TechnicalStaffTab = ({ staffList, onCreateStaff, onEditStaff, onDeleteStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('employee_code');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Filter only technical staff
  const technicalStaff = staffList.filter(staff => staff.role === 'Technical');

  // Department code mapping for technical staff
  const departmentCodes = {
    'Department of Civil Engineering': 'CVE',
    'Department of Computer Science and Engineering': 'CSE',
    'Department of Electrical and Electronics Engineering': 'EEE',
    'Department of Electronics and Communication Engineering': 'ECE',
    'Department of Mechanical Engineering': 'MCE',
    'Department of Applied Sciences': 'APS',
    'Department of Humanities and Social Sciences': 'HSS',
    'Campus Control Centre': 'CCC'
  };

  const getDepartmentCode = (department) => {
    return departmentCodes[department] || 'CSE';
  };

  // Get unique departments for filter - use department codes
  const departments = ['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'APS & HSS', 'CCC'];

  // Filter and search functionality
  const filteredStaff = technicalStaff.filter(staff => {
    const matchesSearch = !searchTerm || 
      staff.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.employee_code?.toString().includes(searchTerm) ||
      staff.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || getDepartmentCode(staff.department) === departmentFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && staff.is_active) ||
      (statusFilter === 'inactive' && !staff.is_active);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Sort functionality
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'full_name':
        aValue = a.full_name || '';
        bValue = b.full_name || '';
        break;
      case 'department':
        aValue = a.department || '';
        bValue = b.department || '';
        break;
      case 'position':
        aValue = a.position || '';
        bValue = b.position || '';
        break;
      case 'employee_code':
      default:
        aValue = a.employee_code || '';
        bValue = b.employee_code || '';
        break;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const startIndex = showAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = showAll ? sortedStaff.length : startIndex + itemsPerPage;
  const paginatedStaff = sortedStaff.slice(startIndex, endIndex);

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
    setDepartmentFilter('');
    setStatusFilter('');
    setSortBy('employee_code');
    setSortOrder('asc');
    setCurrentPage(1);
    setShowAll(false);
  };

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || departmentFilter || statusFilter;

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
          className="technical-staff-tab-pagination-btn technical-staff-tab-pagination-prev"
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
          className={`technical-staff-tab-pagination-btn ${
            i === currentPage ? 'technical-staff-tab-pagination-active' : ''
          }`}
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
          className="technical-staff-tab-pagination-btn technical-staff-tab-pagination-next"
        >
          ›
        </button>
      );
    }

    return (
      <div className="technical-staff-tab-pagination">
        <div className="technical-staff-tab-pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedStaff.length)} of {sortedStaff.length} technical staff members
        </div>
        <div className="technical-staff-tab-pagination-controls">
          {pages}
          {totalPages > 1 && !showAll && (
            <button
              onClick={handleShowAll}
              className="technical-staff-tab-show-all-btn"
            >
              Show All
            </button>
          )}
        </div>
      </div>
    );
  };

  // Simple fallback avatar component
  const FallbackAvatar = ({ name, size = 40 }) => {
    const getInitials = (fullName) => {
      if (!fullName) return 'U';
      const names = fullName.split(' ');
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

    const initials = getInitials(name);
    const backgroundColor = getColor(name);

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
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {initials}
      </div>
    );
  };

  const StaffImageWithFallback = ({ staff, size = 100 }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const getImagePath = (imagePath) => {
      if (!imagePath) return null;
      if (imagePath.startsWith('images/')) {
        return `/${imagePath}`;
      }
      return imagePath;
    };

    const imageSrc = getImagePath(staff.image_url);
    const staffName = staff.full_name || (staff.first_name + ' ' + staff.last_name) || 'Staff';

    if (imageError || !imageSrc) {
      return <FallbackAvatar name={staffName} size={size} />;
    }

    return (
      <div style={{ position: 'relative' }}>
        {!imageLoaded && <FallbackAvatar name={staffName} size={size} />}
        <img
          src={imageSrc}
          alt={staffName}
          className="technical-staff-tab-staff-avatar"
          style={{ 
            display: imageLoaded && !imageError ? 'block' : 'none',
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'fill'
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  return (
    <div className="technical-staff-tab-container">
      {/* Search and Filters Section */}
      <div className="technical-staff-tab-filters-section">
        <div className="technical-staff-tab-search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="technical-staff-tab-search-input"
          />
        </div>
        
        <div className="technical-staff-tab-filter-controls">
          <div className="technical-staff-tab-filters-group">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="technical-staff-tab-filter-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{getDepartmentCode(dept)}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="technical-staff-tab-filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="technical-staff-tab-clear-filters-btn"
                title="Clear all filters"
              >
                <i className="fas fa-times"></i>
                Clear
              </button>
            )}
          </div>

          <button className="technical-staff-tab-create-btn" onClick={onCreateStaff}>
            <i className="fas fa-plus"></i>
            Create Technical Staff
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="technical-staff-tab-results-summary">
        {showAll ? (
          <>Showing all {sortedStaff.length} of {technicalStaff.length} technical staff members</>
        ) : (
          <>Showing {startIndex + 1}-{Math.min(endIndex, sortedStaff.length)} of {sortedStaff.length} technical staff members (Page {currentPage} of {totalPages})</>
        )}
      </div>

      {/* Technical Staff Table */}
      <div className="technical-staff-tab-table-container">
        <table className="technical-staff-tab-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th 
                className="technical-staff-tab-sortable-header"
                onClick={() => handleSort('employee_code')}
              >
                Employee Code
                {sortBy === 'employee_code' && (
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th 
                className="technical-staff-tab-sortable-header"
                onClick={() => handleSort('full_name')}
              >
                Name
                {sortBy === 'full_name' && (
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Email</th>
              <th 
                className="technical-staff-tab-sortable-header"
                onClick={() => handleSort('position')}
              >
                Position
                {sortBy === 'position' && (
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th 
                className="technical-staff-tab-sortable-header"
                onClick={() => handleSort('department')}
              >
                Department
                {sortBy === 'department' && (
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Extension</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.length === 0 ? (
              <tr>
                <td colSpan="8" className="technical-staff-tab-empty-cell">
                  No technical staff members found.
                </td>
              </tr>
            ) : (
              paginatedStaff.map(staff => (
                <tr key={staff.id} className="technical-staff-tab-table-row">
                  <td className="technical-staff-tab-image-cell">
                    <div className="technical-staff-tab-staff-image">
                      <StaffImageWithFallback staff={staff} size={100} />
                    </div>
                  </td>
                  <td className="technical-staff-tab-id-cell">
                    <span className="technical-staff-tab-employee-code">
                      {staff.employee_code || `TECH${staff.id.toString().padStart(3, '0')}`}
                    </span>
                  </td>
                  <td className="technical-staff-tab-name-cell">
                    <div className="technical-staff-tab-staff-name">
                      <span className="technical-staff-tab-full-name">
                        {staff.honorific && `${staff.honorific} `}{staff.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="technical-staff-tab-email-cell">
                    <a 
                      href={`mailto:${staff.email}`} 
                      className="technical-staff-tab-email-link"
                      title={`Send email to ${staff.full_name}`}
                    >
                      {staff.email}
                    </a>
                  </td>
                  <td className="technical-staff-tab-category-cell">
                    <div className="technical-staff-tab-category-info">
                      <div className="technical-staff-tab-position-title">
                        {staff.position || 'Technical Staff'}
                      </div>
                      {staff.specialty && (
                        <div className="technical-staff-tab-speciality-text">
                          {staff.specialty}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="technical-staff-tab-department-cell">
                    <span className="technical-staff-tab-department-badge">
                      {getDepartmentCode(staff.department)}
                    </span>
                  </td>
                  <td className="technical-staff-tab-extension-cell">
                    {staff.extension_no || '-'}
                  </td>
                  <td className="technical-staff-tab-actions-cell">
                    <div className="technical-staff-tab-action-buttons">
                      <button
                        className="technical-staff-tab-edit-btn"
                        onClick={() => onEditStaff(staff)}
                        title="Edit Staff Member"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="technical-staff-tab-delete-btn"
                        onClick={() => onDeleteStaff(staff.staff_id || staff.employee_id)}
                        title="Delete Staff Member"
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

export default TechnicalStaffTab;
