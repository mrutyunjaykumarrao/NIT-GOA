import React, { useState } from 'react';
import './AdministrativeStaffTab.css';
import { ProfileImage } from '../../../../components/common';

const AdministrativeStaffTab = ({ staffList, onCreateStaff, onEditStaff, onDeleteStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('staff_id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Filter only administrative staff
  console.log('🔍 [ADMIN TAB DEBUG] All staff received:', staffList?.length, 'items');
  console.log('🔍 [ADMIN TAB DEBUG] First few staff items:', staffList?.slice(0, 3));
  
  const administrativeStaff = staffList.filter(staff => 
    staff.role === 'Administrative' || staff.department === 'Administration'
  );
  
  console.log('🔍 [ADMIN TAB DEBUG] Filtered administrative staff:', administrativeStaff?.length, 'items');
  console.log('🔍 [ADMIN TAB DEBUG] Administrative staff details:', administrativeStaff?.slice(0, 3));

  // Filter and search functionality
  const filteredStaff = administrativeStaff.filter(staff => {
    const matchesSearch = !searchTerm || 
      staff.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.employee_id?.toString().includes(searchTerm) ||
      staff.staff_id?.toString().includes(searchTerm);
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && staff.is_active) ||
      (statusFilter === 'inactive' && !staff.is_active);

    return matchesSearch && matchesStatus;
  });

  // Sort functionality
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'full_name':
        aValue = a.full_name || `${a.first_name} ${a.last_name}` || '';
        bValue = b.full_name || `${b.first_name} ${b.last_name}` || '';
        break;
      case 'employee_id':
        aValue = a.employee_id || '';
        bValue = b.employee_id || '';
        break;
      default:
        aValue = a[sortBy] || '';
        bValue = b[sortBy] || '';
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
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
    setStatusFilter('');
    setSortBy('staff_id');
    setSortOrder('asc');
    setCurrentPage(1);
    setShowAll(false);
  };

  // Check if any filters are applied
  const hasActiveFilters = searchTerm || statusFilter;

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
          className="administrative-staff-tab-pagination-btn administrative-staff-tab-pagination-prev"
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
          className={`administrative-staff-tab-pagination-btn ${i === currentPage ? 'administrative-staff-tab-pagination-active' : ''}`}
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
          className="administrative-staff-tab-pagination-btn administrative-staff-tab-pagination-next"
        >
          ›
        </button>
      );
    }

    return (
      <div className="administrative-staff-tab-pagination">
        <div className="administrative-staff-tab-pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedStaff.length)} of {sortedStaff.length} administrative staff members
        </div>
        <div className="administrative-staff-tab-pagination-controls">
          {pages}
          {totalPages > 1 && !showAll && (
            <button
              onClick={handleShowAll}
              className="administrative-staff-tab-show-all-btn"
            >
              Show All
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="administrative-staff-tab-container">
      {/* Search and Filters Section */}
      <div className="administrative-staff-tab-filters-section">
        <div className="administrative-staff-tab-search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="administrative-staff-tab-search-input"
          />
        </div>
        
        <div className="administrative-staff-tab-filter-controls">
          <div className="administrative-staff-tab-filter-left">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="administrative-staff-tab-filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="administrative-staff-tab-clear-filters-btn"
                title="Clear all filters"
              >
                <i className="fas fa-times"></i>
                Clear
              </button>
            )}
          </div>

          <button className="administrative-staff-tab-create-btn" onClick={onCreateStaff}>
            <i className="fas fa-plus"></i>
            Add Administrative Staff
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="administrative-staff-tab-results-summary">
        {showAll ? (
          <>Showing all {sortedStaff.length} of {administrativeStaff.length} administrative staff members</>
        ) : (
          <>Showing {startIndex + 1}-{Math.min(endIndex, sortedStaff.length)} of {sortedStaff.length} administrative staff members (Page {currentPage} of {totalPages})</>
        )}
      </div>

      {/* Staff Table */}
      <div className="administrative-staff-tab-table-container">
        <div className="administrative-staff-tab-table-wrapper">
          <table className="administrative-staff-tab-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th 
                  className="administrative-staff-tab-sortable" 
                  onClick={() => handleSort('employee_code')}
                >
                  Employee Code {sortBy === 'employee_code' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="administrative-staff-tab-sortable" 
                  onClick={() => handleSort('full_name')}
                >
                  Name {sortBy === 'full_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Email</th>
                <th>Position</th>
                <th>Extension</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((staff) => (
                  <tr key={staff.staff_id || staff.id} className="administrative-staff-tab-table-row">
                    <td className="administrative-staff-tab-image-cell">
                      <div className="administrative-staff-tab-staff-image">
                                              <ProfileImage staff={staff} size={120} className="administrative-staff-tab-staff-avatar" />
                      </div>
                    </td>
                    <td className="administrative-staff-tab-id-cell">
                      <span className="administrative-staff-tab-employee-code">
                        {staff.employee_code || `ADM${staff.id.toString().padStart(3, '0')}`}
                      </span>
                    </td>
                    <td className="administrative-staff-tab-name-cell">
                      <div className="administrative-staff-tab-staff-name">
                        <span className="administrative-staff-tab-full-name">
                          {staff.honorific && `${staff.honorific} `}{staff.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="administrative-staff-tab-email-cell">
                      <a 
                        href={`mailto:${staff.email}`} 
                        className="administrative-staff-tab-email-link"
                        title={`Send email to ${staff.full_name}`}
                      >
                        {staff.email}
                      </a>
                    </td>
                    <td className="administrative-staff-tab-category-cell">
                      <div className="administrative-staff-tab-category-info">
                        <div className="administrative-staff-tab-position-title">
                          {staff.position || 'Administrative Staff'}
                        </div>
                        {staff.specialty && (
                          <div className="administrative-staff-tab-speciality-text">
                            {staff.specialty}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="administrative-staff-tab-extension-cell">
                      {staff.extension_no || '-'}
                    </td>
                    <td className="administrative-staff-tab-actions-cell">
                      <div className="administrative-staff-tab-action-buttons">
                        <button
                          className="administrative-staff-tab-action-btn administrative-staff-tab-edit-btn"
                          onClick={() => onEditStaff(staff)}
                          title="Edit Staff Member"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="administrative-staff-tab-action-btn administrative-staff-tab-delete-btn"
                          onClick={() => onDeleteStaff(staff.id || staff.staff_id || staff.employee_id)}
                          title="Delete Staff Member"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="administrative-staff-tab-no-data">
                    No administrative staff members found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default AdministrativeStaffTab;
