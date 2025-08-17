import React, { useState, useEffect } from 'react';
import { 
  AdministrativeStaffModal, 
  TechnicalStaffModal, 
  PendingApprovalsModal 
} from '../AdminModals';

const EnhancedStaffManagement = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
    fetchPendingCount();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/admin/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await fetch('/api/admin/designations');
      if (response.ok) {
        const data = await response.json();
        setDesignations(data);
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('/api/admin/pending-approvals');
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  const handleCreateAdminStaff = () => {
    setModalMode('create');
    setSelectedStaff(null);
    setShowAdminModal(true);
  };

  const handleEditAdminStaff = (staff) => {
    setModalMode('edit');
    setSelectedStaff(staff);
    setShowAdminModal(true);
  };

  const handleCreateTechStaff = () => {
    setModalMode('create');
    setSelectedStaff(null);
    setShowTechModal(true);
  };

  const handleEditTechStaff = (staff) => {
    setModalMode('edit');
    setSelectedStaff(staff);
    setShowTechModal(true);
  };

  const handleAdminStaffSubmit = async (formData, mode) => {
    try {
      const url = mode === 'create' 
        ? '/api/admin/staff/administrative'
        : `/api/admin/staff/administrative/${selectedStaff.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method: method,
        body: formData // FormData for file upload
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        alert(result.message);
        
        // Refresh pending count if image was uploaded
        if (result.imagePending) {
          fetchPendingCount();
        }
        
        // Refresh staff list (you would implement this)
        // fetchAdministrativeStaff();
        
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save staff');
      }
    } catch (error) {
      console.error('Error saving administrative staff:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleTechStaffSubmit = async (formData, mode) => {
    try {
      const url = mode === 'create' 
        ? '/api/admin/staff/technical'
        : `/api/admin/staff/technical/${selectedStaff.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method: method,
        body: formData // FormData for file upload
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        alert(result.message);
        
        // Refresh pending count if image was uploaded
        if (result.imagePending) {
          fetchPendingCount();
        }
        
        // Refresh staff list (you would implement this)
        // fetchTechnicalStaff();
        
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save staff');
      }
    } catch (error) {
      console.error('Error saving technical staff:', error);
      alert('Error: ' + error.message);
    }
  };

  const handlePendingApprovalsClose = () => {
    setShowPendingModal(false);
    fetchPendingCount(); // Refresh count after closing
  };

  return (
    <div className="enhanced-staff-management">
      <div className="staff-management-header">
        <h2>Staff Management</h2>
        <div className="header-actions">
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => setShowPendingModal(true)}
          >
            <i className="fas fa-clock"></i>
            Pending Approvals
            {pendingCount > 0 && (
              <span className="notification-badge">{pendingCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="staff-sections">
        <div className="staff-section">
          <div className="section-header">
            <h3>Administrative Staff</h3>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={handleCreateAdminStaff}
            >
              <i className="fas fa-plus"></i>
              Add Administrative Staff
            </button>
          </div>
          {/* Your administrative staff table/list would go here */}
        </div>

        <div className="staff-section">
          <div className="section-header">
            <h3>Technical Staff</h3>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={handleCreateTechStaff}
            >
              <i className="fas fa-plus"></i>
              Add Technical Staff
            </button>
          </div>
          {/* Your technical staff table/list would go here */}
        </div>
      </div>

      {/* Administrative Staff Modal */}
      <AdministrativeStaffModal
        show={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSubmit={handleAdminStaffSubmit}
        mode={modalMode}
        initialData={selectedStaff}
        departments={departments}
        designations={designations}
      />

      {/* Technical Staff Modal */}
      <TechnicalStaffModal
        show={showTechModal}
        onClose={() => setShowTechModal(false)}
        onSubmit={handleTechStaffSubmit}
        mode={modalMode}
        initialData={selectedStaff}
        departments={departments}
        designations={designations}
      />

      {/* Pending Approvals Modal */}
      <PendingApprovalsModal
        show={showPendingModal}
        onClose={handlePendingApprovalsClose}
      />

      <style jsx>{`
        .enhanced-staff-management {
          padding: 20px;
        }

        .staff-management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-actions {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 0.75rem;
          font-weight: bold;
          min-width: 20px;
          text-align: center;
        }

        .staff-section {
          margin-bottom: 40px;
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          margin: 0;
          color: #111827;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .admin-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .admin-btn-primary {
          background: #2563eb;
          color: white;
        }

        .admin-btn-primary:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default EnhancedStaffManagement;
