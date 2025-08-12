import React, { useState } from 'react';
import './StaffTab.css';
import './StaffTab-pagination.css';

const StaffTab = ({ staffList }) => {
  // Separate staff into administrative and technical categories
  const administrativeStaff = staffList.filter(staff => staff.role === 'Administrative');
  const technicalStaff = staffList.filter(staff => staff.role === 'Technical');

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

  const getDepartmentCode = (department) => {
    return departmentCodes[department] || 'CSE'; // Default to CSE instead of 'GEN'
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
            objectFit: 'fill'
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  // Helper function to render administrative staff row
  const renderAdminStaffRow = (staff) => (
    <tr key={staff.id} className="staff-tab-table-row">
      <td className="staff-tab-image-cell">
        <div className="staff-tab-staff-image">
          <StaffImageWithFallback staff={staff} size={100} />
        </div>
      </td>
      <td className="staff-tab-id-cell">
        <span className="staff-tab-employee-code">
          {staff.employee_code || `ADM${staff.id.toString().padStart(3, '0')}`}
        </span>
      </td>
      <td className="staff-tab-name-cell">
        <div className="staff-tab-staff-name">
          <span className="staff-tab-full-name">
            {staff.honorific && `${staff.honorific} `}{staff.full_name}
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
          <div className="staff-tab-position-title">
            {staff.position || 'Administrative Staff'}
          </div>
          {staff.specialty && (
            <div className="staff-tab-speciality-text">
              {staff.specialty}
            </div>
          )}
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

  // Helper function to render technical staff row
  const renderTechStaffRow = (staff) => (
    <tr key={staff.id} className="staff-tab-table-row">
      <td className="staff-tab-image-cell">
        <div className="staff-tab-staff-image">
          <StaffImageWithFallback staff={staff} size={100} />
        </div>
      </td>
      <td className="staff-tab-id-cell">
        <span className="staff-tab-employee-code">
          {staff.employee_code || `TECH${staff.id.toString().padStart(3, '0')}`}
        </span>
      </td>
      <td className="staff-tab-name-cell">
        <div className="staff-tab-staff-name">
          <span className="staff-tab-full-name">
            {staff.honorific && `${staff.honorific} `}{staff.full_name}
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
          <div className="staff-tab-position-title">
            {staff.position || 'Technical Staff'}
          </div>
          {staff.specialty && (
            <div className="staff-tab-speciality-text">
              {staff.specialty}
            </div>
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

      {/* Administrative Staff Section */}
      <div className="staff-section">
        <div className="staff-section-header">
          <h3 className="staff-section-title">
            <i className="fas fa-users-cog"></i>
            Administrative Staff ({administrativeStaff.length})
          </h3>
        </div>
        
        <div className="staff-tab-table-container">
          <table className="staff-tab-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Employee Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position & Role</th>
                <th>Extension</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {administrativeStaff.length === 0 ? (
                <tr>
                  <td colSpan="7" className="staff-tab-empty-cell">
                    No administrative staff members found.
                  </td>
                </tr>
              ) : (
                administrativeStaff.map(renderAdminStaffRow)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Staff Section */}
      <div className="staff-section">
        <div className="staff-section-header">
          <h3 className="staff-section-title">
            <i className="fas fa-tools"></i>
            Technical Staff ({technicalStaff.length})
          </h3>
        </div>
        
        <div className="staff-tab-table-container">
          <table className="staff-tab-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Employee Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position & Role</th>
                <th>Department</th>
                <th>Extension</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {technicalStaff.length === 0 ? (
                <tr>
                  <td colSpan="8" className="staff-tab-empty-cell">
                    No technical staff members found.
                  </td>
                </tr>
              ) : (
                technicalStaff.map(renderTechStaffRow)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffTab;
