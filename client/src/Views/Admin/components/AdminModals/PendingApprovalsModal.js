import React, { useState, useEffect } from 'react';
import './AdminModal.css';

const PendingApprovalsModal = ({ 
  show, 
  onClose 
}) => {
  const [pendingChanges, setPendingChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    if (show) {
      fetchPendingChanges();
    }
  }, [show]);

  const fetchPendingChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/pending-approvals');
      if (response.ok) {
        const data = await response.json();
        setPendingChanges(data);
      }
    } catch (error) {
      console.error('Error fetching pending changes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (changeId, approved) => {
    setProcessing(prev => ({ ...prev, [changeId]: true }));
    
    try {
      const response = await fetch(`/api/admin/pending-approvals/${changeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved })
      });

      if (response.ok) {
        // Remove the processed change from the list
        setPendingChanges(prev => prev.filter(change => change.id !== changeId));
      }
    } catch (error) {
      console.error('Error processing approval:', error);
    } finally {
      setProcessing(prev => ({ ...prev, [changeId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!show) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-modal-large">
        <div className="admin-modal-header">
          <h2>Pending Approvals</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="admin-modal-content">
          {loading ? (
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading pending changes...</p>
            </div>
          ) : pendingChanges.length === 0 ? (
            <div className="no-data-container">
              <i className="fas fa-check-circle"></i>
              <p>No pending approvals at this time.</p>
            </div>
          ) : (
            <div className="pending-changes-list">
              {pendingChanges.map((change) => (
                <div key={change.id} className="pending-change-item">
                  <div className="change-header">
                    <div className="change-info">
                      <h4>{change.employee_name}</h4>
                      <p className="change-type">
                        <i className="fas fa-image"></i>
                        Profile Image Update
                      </p>
                      <p className="change-date">
                        Requested on {formatDate(change.created_at)}
                      </p>
                    </div>
                    <div className="change-status">
                      <span className="status-badge pending">Pending</span>
                    </div>
                  </div>

                  <div className="change-details">
                    <div className="image-comparison">
                      <div className="image-container">
                        <h5>Current Image</h5>
                        {change.current_image_url ? (
                          <img 
                            src={change.current_image_url} 
                            alt="Current" 
                            className="comparison-image"
                          />
                        ) : (
                          <div className="no-image">
                            <i className="fas fa-user"></i>
                            <p>No current image</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="arrow-container">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                      
                      <div className="image-container">
                        <h5>Proposed Image</h5>
                        <img 
                          src={change.new_image_url} 
                          alt="Proposed" 
                          className="comparison-image"
                        />
                      </div>
                    </div>

                    <div className="employee-details">
                      <p><strong>Employee Code:</strong> {change.employee_code}</p>
                      <p><strong>Department:</strong> {change.department_name}</p>
                      <p><strong>Role:</strong> {change.role}</p>
                    </div>
                  </div>

                  <div className="change-actions">
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleApproval(change.id, false)}
                      disabled={processing[change.id]}
                    >
                      {processing[change.id] ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-times"></i>
                      )}
                      Reject
                    </button>
                    <button
                      className="admin-btn admin-btn-success"
                      onClick={() => handleApproval(change.id, true)}
                      disabled={processing[change.id]}
                    >
                      {processing[change.id] ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-check"></i>
                      )}
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalsModal;
