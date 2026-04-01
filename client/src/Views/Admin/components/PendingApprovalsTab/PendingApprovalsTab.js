import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import './PendingApprovalsTab.css';

const PendingApprovalsTab = () => {
  const { token } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch pending approvals
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pending-approvals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending approvals');
      }

      const data = await response.json();
      setPendingApprovals(data.approvals || []);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, [token]);

  // Handle approve
  const handleApprove = async (approvalId, actionType = 'UPDATE') => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/pending-approvals/${approvalId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          admin_notes: actionType === 'DELETE' 
            ? 'Image deletion approved and file removed' 
            : 'Image approved and moved to public directory'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      const result = await response.json();
      
      // Refresh the list
      await fetchPendingApprovals();
      
      // Close preview if this was the selected item
      if (selectedApproval?.approval_id === approvalId) {
        setSelectedApproval(null);
        setShowPreview(false);
      }
      
      // Dispatch event to update the profile dropdown image immediately
      window.dispatchEvent(new Event('profileImageUpdated'));
      
      alert(`✅ ${result.message}`);
    } catch (error) {
      console.error('Error approving request:', error);
      alert(`❌ Failed to approve: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Handle reject
  const handleReject = async (approvalId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/pending-approvals/${approvalId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          admin_notes: reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      const result = await response.json();
      
      // Refresh the list
      await fetchPendingApprovals();
      
      // Close preview if this was the selected item
      if (selectedApproval?.approval_id === approvalId) {
        setSelectedApproval(null);
        setShowPreview(false);
      }
      
      alert(`✅ ${result.message}`);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(`❌ Failed to reject: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Handle preview
  const handlePreview = (approval) => {
    setSelectedApproval(approval);
    setShowPreview(true);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get approval type display name
  const getApprovalTypeDisplay = (type) => {
    switch (type) {
      case 'profile_image':
        return 'Profile Image';
      case 'personal_info':
        return 'Personal Information';
      case 'contact_info':
        return 'Contact Information';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="pending-approvals-tab">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pending-approvals-tab">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Error: {error}</p>
          <button onClick={fetchPendingApprovals}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-approvals-tab">
      <div className="pending-approvals-header">
        <h2>Pending Approvals</h2>
        <button 
          className="refresh-btn"
          onClick={fetchPendingApprovals}
          disabled={loading}
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="no-approvals">
          <i className="fas fa-check-circle"></i>
          <p>No pending approvals at this time</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {pendingApprovals.map(approval => (
            <div key={approval.approval_id} className="approval-card">
              <div className="approval-header">
                <div className="approval-type">
                  <i className={`fas ${approval.approval_type === 'profile_image' ? 'fa-image' : 'fa-edit'}`}></i>
                  {getApprovalTypeDisplay(approval.approval_type)}
                </div>
                <span className="approval-id">#{approval.approval_id}</span>
              </div>

              <div className="approval-details">
                <div className="employee-info">
                  <strong>{approval.full_name}</strong>
                  <span className="employee-code">({approval.employee_code})</span>
                  <span className="department">{approval.department_name}</span>
                </div>

                <div className="request-meta">
                  <p><strong>Requested:</strong> {formatDate(approval.requested_at)}</p>
                  <p><strong>Requested by:</strong> {approval.requested_by}</p>
                </div>
              </div>

              {approval.approval_type === 'profile_image' && (
                <div className="image-preview-section">
                  <button 
                    className="preview-btn"
                    onClick={() => handlePreview(approval)}
                  >
                    <i className="fas fa-eye"></i>
                    Preview Image
                  </button>
                </div>
              )}

              <div className="approval-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(approval.approval_id, approval.action_type)}
                  disabled={processing}
                >
                  <i className="fas fa-check"></i>
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(approval.approval_id)}
                  disabled={processing}
                >
                  <i className="fas fa-times"></i>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {showPreview && selectedApproval && (
        <div className="preview-modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>Image Preview - {selectedApproval.full_name}</h3>
              <button 
                className="close-preview-btn"
                onClick={() => setShowPreview(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="preview-content">
              <div className="preview-comparison">
                <div className="preview-section">
                  <h4>Current Image</h4>
                  {selectedApproval.current_image_url && selectedApproval.current_image_url !== 'null' ? (
                    <img 
                      src={selectedApproval.current_image_url.startsWith('http') || selectedApproval.current_image_url.startsWith('/') 
                        ? selectedApproval.current_image_url 
                        : `/${selectedApproval.current_image_url}`}
                      alt="Current" 
                      className="pendingApproval-preview-image"
                    />
                  ) : (
                    <div className="no-image">No current image</div>
                  )}
                </div>

                <div className="preview-section">
                  <h4>New Image (Pending)</h4>
                  {selectedApproval.action_type === 'DELETE' || selectedApproval.requested_image_url === 'REMOVE' || selectedApproval.requested_value === 'REMOVE' ? (
                    <div className="no-image" style={{ color: 'red', fontWeight: 'bold' }}>
                      Requested Deletion
                    </div>
                  ) : (
                    <img 
                      src={selectedApproval.temp_file_path || selectedApproval.requested_image_url || selectedApproval.requested_value}
                      alt="New" 
                      className="pendingApproval-preview-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="no-image">Image not found</div>';
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="preview-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(selectedApproval.approval_id, selectedApproval.action_type)}
                  disabled={processing}
                >
                  <i className="fas fa-check"></i>
                  Approve This Image
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(selectedApproval.approval_id)}
                  disabled={processing}
                >
                  <i className="fas fa-times"></i>
                  Reject This Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovalsTab;