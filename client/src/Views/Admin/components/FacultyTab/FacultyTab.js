import React, { useState } from 'react';
import './FacultyTab.css';

const FacultyTab = ({ facultyList, onCreateFaculty, onEditFaculty, onDeleteFaculty }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [hodFilter, setHodFilter] = useState('');
  const [sortBy, setSortBy] = useState('employee_id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Handle nested array structure - flatten if needed
  let faculty = [];
  if (Array.isArray(facultyList)) {
    if (facultyList.length > 0 && Array.isArray(facultyList[0])) {
      faculty = facultyList.flat();
    } else {
      faculty = facultyList;
    }
  }

  // Get unique departments for filter
  const departments = [...new Set(faculty.map(fac => fac.department_name).filter(Boolean))];

  // Filter and search functionality
  const filteredFaculty = faculty.filter(fac => {
    const matchesSearch = !searchTerm || 
      fac.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.employee_id?.toString().includes(searchTerm);
    
    const matchesDepartment = !departmentFilter || fac.department_name === departmentFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && fac.is_active) ||
      (statusFilter === 'inactive' && !fac.is_active);
    const matchesHod = !hodFilter || 
      (hodFilter === 'hod' && fac.is_hod) ||
      (hodFilter === 'non-hod' && !fac.is_hod);

    return matchesSearch && matchesDepartment && matchesStatus && matchesHod;
  });

  // Sort functionality
  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.full_name || '';
        bValue = b.full_name || '';
        break;
      case 'department':
        aValue = a.department_name || '';
        bValue = b.department_name || '';
        break;
      case 'email':
        aValue = a.email || '';
        bValue = b.email || '';
        break;
      case 'employee_id':
        aValue = a.employee_id || a.employee_code || '';
        bValue = b.employee_id || b.employee_code || '';
        break;
      default:
        aValue = '';
        bValue = '';
    }

    const comparison = aValue.toString().localeCompare(bValue.toString());
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedFaculty.length / itemsPerPage);
  const startIndex = showAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = showAll ? sortedFaculty.length : startIndex + itemsPerPage;
  const paginatedFaculty = sortedFaculty.slice(startIndex, endIndex);

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
    setHodFilter('');
    setSortBy('employee_id');
    setSortOrder('asc');
    setCurrentPage(1);
    setShowAll(false);
  };

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || departmentFilter || statusFilter || hodFilter;

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
          className="faculty-tab-pagination-btn faculty-tab-pagination-prev"
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
          className={`faculty-tab-pagination-btn ${currentPage === i ? 'faculty-tab-pagination-active' : ''}`}
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
          className="faculty-tab-pagination-btn faculty-tab-pagination-next"
        >
          ›
        </button>
      );
    }

    return (
      <div className="faculty-tab-pagination">
        <div className="faculty-tab-pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedFaculty.length)} of {sortedFaculty.length}
        </div>
        <div className="faculty-tab-pagination-controls">
          {pages}
          <button
            onClick={handleShowAll}
            className="faculty-tab-show-all-btn"
          >
            Show All
          </button>
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

  const FacultyImageWithFallback = ({ faculty, size = 100 }) => {
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

    const imageSrc = getImagePath(faculty.image_url);

    if (imageError || !imageSrc) {
      return (
        <FallbackAvatar 
          name={faculty.full_name || faculty.first_name + ' ' + faculty.last_name || 'Faculty'} 
          size={size}
          className="faculty-tab-faculty-avatar"
        />
      );
    }

    return (
      <div style={{ position: 'relative' }}>
        {!imageLoaded && (
          <FallbackAvatar 
            name={faculty.full_name || faculty.first_name + ' ' + faculty.last_name || 'Faculty'} 
            size={size}
            className="faculty-tab-faculty-avatar"
          />
        )}
        <img
          src={imageSrc}
          alt={faculty.full_name || 'Faculty'}
          className="faculty-tab-faculty-avatar"
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

  const getDepartmentCode = (deptName) => {
    const deptMap = {
      'Department of Computer Science and Engineering': 'CSE',
      'Department of Electrical and Electronics Engineering': 'EEE', 
      'Department of Electronics and Communication Engineering': 'ECE',
      'Department of Mechanical Engineering': 'MCE',
      'Department of Civil Engineering': 'CVE',
      'Department of Applied Sciences': 'APS',
      'Department of Humanities and Social Sciences': 'HSS'
    };
    return deptMap[deptName] || 'CSE'; // Default to CSE instead of 'General'
  };
  
  return (
    <div className="faculty-tab-container">
      {/* Search and Filters Section */}
      <div className="faculty-tab-filters-section">
        <div className="faculty-tab-search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="faculty-tab-search-input"
          />
        </div>
        
        <div className="faculty-tab-filter-controls">
          <div className="faculty-tab-filter-left">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="faculty-tab-filter-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{getDepartmentCode(dept)}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="faculty-tab-filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={hodFilter}
              onChange={(e) => setHodFilter(e.target.value)}
              className="faculty-tab-filter-select"
            >
              <option value="">All Faculty</option>
              <option value="hod">HOD Only</option>
              <option value="non-hod">Non-HOD</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="faculty-tab-clear-filters-btn"
                title="Clear all filters"
              >
                <i className="fas fa-times"></i>
                Clear
              </button>
            )}
          </div>

          <button className="faculty-tab-create-btn" onClick={onCreateFaculty}>
            <i className="fas fa-plus"></i>
            Create Faculty Profile
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="faculty-tab-results-summary">
        {showAll ? (
          <>Showing all {sortedFaculty.length} of {faculty.length} faculty members</>
        ) : (
          <>Showing {startIndex + 1}-{Math.min(endIndex, sortedFaculty.length)} of {sortedFaculty.length} faculty members (Page {currentPage} of {totalPages})</>
        )}
      </div>
      
      <div className="faculty-tab-table-container">
        <table className="faculty-tab-table">
          <thead>
            <tr>
              <th>Image</th>
              <th onClick={() => handleSort('employee_id')} className="faculty-tab-sortable-header">
                Employee ID
                {sortBy === 'employee_id' && (
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('name')} className="faculty-tab-sortable-header">
                Name with Honorific
                {sortBy === 'name' && (
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('email')} className="faculty-tab-sortable-header">
                Email
                {sortBy === 'email' && (
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('department')} className="faculty-tab-sortable-header">
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
            {faculty.length === 0 ? (
              <tr>
                <td colSpan="7" className="faculty-tab-loading-cell">
                  <i className="fas fa-spinner fa-spin"></i> Loading faculty data...
                </td>
              </tr>
            ) : paginatedFaculty.length === 0 ? (
              <tr>
                <td colSpan="7" className="faculty-tab-empty-cell">
                  {searchTerm || departmentFilter || statusFilter || hodFilter ? 
                    'No faculty found matching the current filters.' : 
                    'No faculty profiles available.'
                  }
                </td>
              </tr>
            ) : (
              paginatedFaculty.map(fac => (
                <tr key={fac.id} className="faculty-tab-table-row">
                  <td className="faculty-tab-image-cell">
                    <div className="faculty-tab-faculty-image">
                      <FacultyImageWithFallback faculty={fac} size={100} />
                    </div>
                  </td>
                  <td className="faculty-tab-id-cell">
                    <span className="faculty-tab-employee-code">
                      {fac.employee_id || fac.employee_code || 'N/A'}
                    </span>
                  </td>
                  <td className="faculty-tab-name-cell">
                    <div className="faculty-tab-faculty-name">
                      <div className="faculty-tab-name-content">
                        <span className="faculty-tab-full-name">
                          {fac.honorific && `${fac.honorific} `}{fac.full_name || 'N/A'}
                        </span>
                        {fac.is_hod && (
                          <span className="faculty-tab-hod-badge">HOD</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="faculty-tab-email-cell">
                    <a href={`mailto:${fac.email}`} className="faculty-tab-email-link">
                      {fac.email || 'N/A'}
                    </a>
                  </td>
                  <td className="faculty-tab-department-cell">
                    <div className="faculty-tab-department-info">
                      <span className="faculty-tab-department-code">
                        {getDepartmentCode(fac.department_name)}
                      </span>
                    </div>
                  </td>
                  <td className="faculty-tab-extension-cell">
                    {fac.extension_no || 'N/A'}
                  </td>
                  <td className="faculty-tab-actions-cell">
                    <div className="faculty-tab-action-buttons">
                      <button 
                        className="faculty-tab-edit-btn" 
                        onClick={() => onEditFaculty(fac)}
                        title="Edit Faculty Profile"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="faculty-tab-delete-btn" 
                        onClick={() => onDeleteFaculty(fac.faculty_id || fac.employee_id)}
                        title="Delete Faculty Profile"
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

export default FacultyTab;
