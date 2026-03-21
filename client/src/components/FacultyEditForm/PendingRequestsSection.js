import React, { useState, useEffect } from 'react';
import './FacultyEditComponents.css';

const PendingRequestsSection = ({ employeeId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('authToken') || localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found');
                    setLoading(false);
                    return;
                }
                
                const response = await fetch(`/api/faculty-edit/${employeeId}/pending-requests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Extract requests array correctly
                let requestsArray = [];
                if (Array.isArray(data)) {
                    requestsArray = data;
                } else if (data.data && Array.isArray(data.data.requests)) {
                    requestsArray = data.data.requests;
                } else if (Array.isArray(data.requests)) {
                    requestsArray = data.requests;
                }
                
                setRequests(requestsArray);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching requests:", err);
                setError("Failed to load pending requests. Please try again later.");
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchRequests();
        }
    }, [employeeId]);

    const formatValue = (value) => {
        if (!value) return '-';
        if (value === 'REMOVE') return <span className="text-danger fw-bold">Requested Deletion</span>;
        
        try {
            // Check if it's a JSON string that can be parsed
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                const parsed = JSON.parse(value);
                // Return a formatted snippet or whatever fits
                return JSON.stringify(parsed).substring(0, 50) + '...';
            }
        } catch (e) {
            // If it's not JSON, do nothing and return the value
        }
        
        return String(value);
    };

    if (loading) {
        return (
            <div className="custom-section-card">
                <div className="custom-section-header">
                    <h3>Request Statuses</h3>
                </div>
                <div className="custom-section-content text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="custom-section-card">
                <div className="custom-section-header">
                    <h3>Request Statuses</h3>
                </div>
                <div className="custom-section-content text-center py-4">
                    <p className="text-danger">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="custom-section-card">
            <div className="custom-section-header">
                <h3>Request Statuses</h3>
                <p className="text-muted small">View the status of your edit requests.</p>
            </div>
            
            <div className="custom-section-content p-0">
                {requests.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="fas fa-clipboard-check fa-3x mb-3 text-success opacity-50"></i>
                        <h5>No pending requests found</h5>
                        <p>All your changes have been processed or you haven't made any requests.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Field/Section</th>
                                    <th>Action</th>
                                    <th>Status</th>
                                    <th>Admin Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request, index) => (
                                    <tr key={request.approval_id || request.id || index}>
                                        <td>{new Date(request.requested_at || request.request_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge bg-secondary">
                                                {request.approval_type || request.field_name || request.section_name}
                                            </span>
                                        </td>
                                        <td>{request.action_type || 'Update'}</td>
                                        <td>
                                            {request.status?.toLowerCase() === 'pending' && <span className="badge bg-warning text-dark"><i className="fas fa-clock me-1"></i>Pending</span>}
                                            {request.status?.toLowerCase() === 'approved' && <span className="badge bg-success"><i className="fas fa-check-circle me-1"></i>Approved</span>}
                                            {request.status?.toLowerCase() === 'rejected' && <span className="badge bg-danger"><i className="fas fa-times-circle me-1"></i>Rejected</span>}
                                        </td>
                                        <td className="text-muted small">
                                            {request.admin_notes || request.admin_comments || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingRequestsSection;
