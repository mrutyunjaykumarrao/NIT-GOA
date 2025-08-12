import React, { useState, useMemo } from 'react';
import './StaffTab.css';

const StaffTab = ({ staffList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Staff categories mapping - removed 'Other' and 'General'
  const staffCategories = {
    'All': 'All Staff',
    'Administrative': 'Administrative Staff',
    'Technical': 'Technical Staff',
    'Library': 'Library Staff',
    'Maintenance': 'Maintenance Staff',
    'Security': 'Security Staff'
  };

  // Department code mapping for technical staff - removed 'General' and 'Other'
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

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || selectedCategory !== 'All';

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('id');
    setSortOrder('asc');
    setCurrentPage(1);
    setShowAll(false);
  };

  // Filter and sort staff data
  const filteredAndSortedStaff = useMemo(() => {
    let filtered = staffList.filter(staff => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        staff.full_name?.toLowerCase().includes(searchLower) ||
        staff.email?.toLowerCase().includes(searchLower) ||
        staff.employee_code?.toLowerCase().includes(searchLower) ||
        staff.department_name?.toLowerCase().includes(searchLower) ||
        staff.position?.toLowerCase().includes(searchLower);

      const matchesCategory = selectedCategory === 'All' || 
        staff.role === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';

      if (sortBy === 'full_name') {
        aValue = `${a.first_name || ''} ${a.last_name || ''}`.trim();
        bValue = `${b.first_name || ''} ${b.last_name || ''}`.trim();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [staffList, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedStaff.length / itemsPerPage);
  const startIndex = showAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = showAll ? filteredAndSortedStaff.length : startIndex + itemsPerPage;
  const paginatedStaff = filteredAndSortedStaff.slice(startIndex, endIndex);

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
          className="staff-tab-pagination-btn staff-tab-pagination-prev"
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
          className={`staff-tab-pagination-btn ${currentPage === i ? 'staff-tab-pagination-active' : ''}`}
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
          className="staff-tab-pagination-btn staff-tab-pagination-next"
        >
          ›
        </button>
      );
    }

    return (
      <div className="staff-tab-pagination">
        <div className="staff-tab-pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedStaff.length)} of {filteredAndSortedStaff.length}
        </div>
        <div className="staff-tab-pagination-controls">
          {pages}
          <button
            onClick={handleShowAll}
            className="staff-tab-show-all-btn"
          >
            Show All
          </button>
        </div>
      </div>
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'fas fa-sort';
    return sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
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

  const StaffImageWithFallback = ({ staff, size = 60 }) => {
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
      // Check if it's already a full path or needs to be constructed
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
          className="staff-tab-staff-avatar"
          style={{ 
            display: imageLoaded && !imageError ? 'block' : 'none',
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover'
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  const getDepartmentCode = (department) => {
    return departmentCodes[department] || 'CSE'; // Default to CSE instead of 'GEN'
  };

  const renderStaffRow = (staff) => (
    <tr key={staff.id} className="staff-tab-table-row">
      <td className="staff-tab-image-cell">
        <div className="staff-tab-staff-image">
          <StaffImageWithFallback staff={staff} size={60} />
        </div>
      </td>
      <td className="staff-tab-id-cell">
        <span className="staff-tab-employee-code">
          {staff.employee_code || `STF${staff.id.toString().padStart(3, '0')}`}
        </span>
      </td>
      <td className="staff-tab-name-cell">
        <div className="staff-tab-staff-name">
          {staff.honorific && (
            <span className="staff-tab-honorific">{staff.honorific}</span>
          )}
          <span className="staff-tab-full-name">
            {staff.full_name}
          </span>
        </div>
      </td>
      <td className="staff-tab-email-cell">
        <a 
          href={`mailto:${staff.email}`} 
          className="staff-tab-email-link"
          title={`Send email to ${staff.full_name}`}
        >
          {staff.email}
        </a>
      </td>
      <td className="staff-tab-category-cell">
        <div className="staff-tab-category-info">
          <span className="staff-tab-category-badge">
            {staff.role || 'Staff'}
          </span>
          {staff.position && (
            <span className="staff-tab-position-text">
              {staff.position}
            </span>
          )}
        </div>
      </td>
      <td className="staff-tab-department-cell">
        <div className="staff-tab-department-info">
          <span className="staff-tab-department-code">
            {getDepartmentCode(staff.department_name)}
          </span>
        </div>
      </td>
      <td className="staff-tab-extension-cell">
        {staff.extension_no || '-'}
      </td>
      <td className="staff-tab-actions-cell">
        <div className="staff-tab-action-buttons">
          <button
            className="staff-tab-edit-btn"
            onClick={() => handleEditStaff(staff.id)}
            title="Edit Staff Member"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="staff-tab-delete-btn"
            onClick={() => handleDeleteStaff(staff.id)}
            title="Delete Staff Member"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );

  const handleEditStaff = (staffId) => {
    console.log('Edit staff member:', staffId);
    // TODO: Implement edit functionality
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      console.log('Delete staff member:', staffId);
      // TODO: Implement delete functionality
    }
  };

  const handleCreateStaff = () => {
    console.log('Create new staff member');
    // TODO: Implement create functionality
  };

  return (
    <div className="staff-tab-container">
      {/* Header Section */}
      <div className="staff-tab-header">
        <div className="staff-tab-title-section">
          <h2 className="staff-tab-title">Staff Management</h2>
          <p className="staff-tab-subtitle">
            Manage administrative and technical staff members
          </p>
        </div>
        <button 
          className="staff-tab-create-btn"
          onClick={handleCreateStaff}
        >
          <i className="fas fa-plus"></i>
          Add New Staff
        </button>
      </div>

      {/* Search and Filters Section */}
      <div className="staff-tab-filters-section">
        <div className="staff-tab-search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, employee code, position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="staff-tab-search-input"
          />
        </div>
        
        <div className="staff-tab-filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="staff-tab-filter-select"
          >
            {Object.entries(staffCategories).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="staff-tab-clear-filters-btn"
            >
              <i className="fas fa-times"></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="staff-tab-results-summary">
        {showAll ? (
          <>Showing all {filteredAndSortedStaff.length} of {staffList.length} staff members</>
        ) : (
          <>Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedStaff.length)} of {filteredAndSortedStaff.length} staff members (Page {currentPage} of {totalPages})</>
        )}
        {selectedCategory !== 'All' && ` in ${staffCategories[selectedCategory]}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Staff Table */}
      <div className="staff-tab-table-container">
        <table className="staff-tab-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th 
                className="staff-tab-sortable-header"
                onClick={() => handleSort('employee_code')}
              >
                Employee Code
                <i className={getSortIcon('employee_code')}></i>
              </th>
              <th 
                className="staff-tab-sortable-header"
                onClick={() => handleSort('full_name')}
              >
                Name
                <i className={getSortIcon('full_name')}></i>
              </th>
              <th 
                className="staff-tab-sortable-header"
                onClick={() => handleSort('email')}
              >
                Email
                <i className={getSortIcon('email')}></i>
              </th>
              <th 
                className="staff-tab-sortable-header"
                onClick={() => handleSort('staff_category')}
              >
                Category & Position
                <i className={getSortIcon('staff_category')}></i>
              </th>
              <th 
                className="staff-tab-sortable-header"
                onClick={() => handleSort('department')}
              >
                Department
                <i className={getSortIcon('department')}></i>
              </th>
              <th 
                className="staff-tab-sortable-header"
                onClick={() => handleSort('extension_number')}
              >
                Extension
                <i className={getSortIcon('extension_number')}></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 ? (
              <tr>
                <td colSpan="8" className="staff-tab-loading-cell">
                  <i className="fas fa-spinner fa-spin"></i>
                  Loading staff data...
                </td>
              </tr>
            ) : paginatedStaff.length === 0 ? (
              <tr>
                <td colSpan="8" className="staff-tab-empty-cell">
                  No staff members found matching your criteria.
                  {(searchTerm || selectedCategory !== 'All') && (
                    <button 
                      onClick={clearFilters}
                      className="staff-tab-clear-filters-link"
                      style={{ marginLeft: '8px' }}
                    >
                      Clear filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedStaff.map(renderStaffRow)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default StaffTab;
