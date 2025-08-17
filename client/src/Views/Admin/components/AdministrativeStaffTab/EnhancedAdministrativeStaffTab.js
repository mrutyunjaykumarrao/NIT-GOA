import React, { useState, useEffect } from 'react';
import { AdministrativeStaffModal, PendingApprovalsModal } from '../AdminModals';
import './AdministrativeStaffTab.css';

const EnhancedAdministrativeStaffTab = ({ staffList, onCreateStaff, onEditStaff, onDeleteStaff }) => {
  const [showModal, setShowModal] = useState(false);
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

  const handleCreateStaff = () => {
    setModalMode('create');
    setSelectedStaff(null);
    setShowModal(true);
  };

  const handleEditStaff = (staff) => {
    setModalMode('edit');
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const handleStaffSubmit = async (formData, mode) => {
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
        
        // Call parent's callback to refresh the staff list
        if (mode === 'create') {
          onCreateStaff && onCreateStaff();
        } else {
          onEditStaff && onEditStaff();
        }
        
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save staff');
      }
    } catch (error) {
      console.error('Error saving administrative staff:', error);
      alert('Error: ' + error.message);
    }
  };

  const handlePendingApprovalsClose = () => {
    setShowPendingModal(false);
    fetchPendingCount(); // Refresh count after closing
  };

  return (
    <div className="administrative-staff-tab">
      {/* Enhanced Header with Pending Approvals */}
      <div className="tab-header">
        <div className="header-left">
          <h2>Administrative Staff</h2>
          <p className="staff-count">{staffList.length} staff members</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setShowPendingModal(true)}
          >
            <i className="fas fa-clock"></i>
            Pending Approvals
            {pendingCount > 0 && (
              <span className="notification-badge">{pendingCount}</span>
            )}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleCreateStaff}
          >
            <i className="fas fa-plus"></i>
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Your existing staff table/list code would go here */}
      <div className="staff-content">
        {/* This would include your existing search, filters, and table */}
        {staffList.map(staff => (
          <div key={staff.id} className="staff-item">
            <div className="staff-info">
              <h4>{staff.full_name}</h4>
              <p>{staff.employee_code} - {staff.department_name}</p>
            </div>
            <div className="staff-actions">
              <button 
                className="btn btn-small btn-outline"
                onClick={() => handleEditStaff(staff)}
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
              <button 
                className="btn btn-small btn-danger"
                onClick={() => onDeleteStaff && onDeleteStaff(staff.id || staff.staff_id || staff.employee_id)}
              >
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Administrative Staff Modal */}
      <AdministrativeStaffModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleStaffSubmit}
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
        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-left h2 {
          margin: 0 0 4px 0;
          color: #111827;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .staff-count {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
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

        .btn {
          position: relative;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-outline {
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f3f4f6;
        }

        .staff-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .staff-info h4 {
          margin: 0 0 4px 0;
          color: #111827;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .staff-info p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .staff-actions {
          display: flex;
          gap: 8px;
        }

        .btn-small {
          padding: 6px 12px;
          font-size: 0.875rem;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default EnhancedAdministrativeStaffTab;
