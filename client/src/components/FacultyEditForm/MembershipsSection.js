import React, { useState } from 'react';

const MembershipsSection = ({ formData, setFormData, loading }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMembership, setNewMembership] = useState({
        organization_name: '',
        membership_type: '',
        status: 'Active'
    });

    const handleMembershipChange = (index, field, value) => {
        const updated = [...(formData.memberships || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, memberships: updated }));
    };

    const openAddForm = () => {
        setNewMembership({
            organization_name: '',
            membership_type: '',
            status: 'Active'
        });
        setShowAddForm(true);
    };

    const cancelAdd = () => {
        setShowAddForm(false);
        setNewMembership({
            organization_name: '',
            membership_type: '',
            status: 'Active'
        });
    };

    const addToList = () => {
        if (!newMembership.organization_name.trim()) {
            alert('Please enter organization name');
            return;
        }
        
        const currentMemberships = Array.isArray(formData.memberships) ? formData.memberships : [];
        setFormData(prev => ({
            ...prev,
            memberships: [
                { ...newMembership, display_order: 1 },
                ...currentMemberships
            ]
        }));
        setShowAddForm(false);
        setNewMembership({
            organization_name: '',
            membership_type: '',
            status: 'Active'
        });
    };

    const removeMembership = (index) => {
        const updated = (formData.memberships || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, memberships: updated }));
    };

    const statuses = ['Active', 'Inactive'];

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Professional Memberships</h3>
            
            <button 
                type="button" 
                onClick={openAddForm} 
                className="add-item-button"
                disabled={loading}
            >
                <i className="fas fa-plus"></i> Add Membership
            </button>

            {/* Add New Membership Form */}
            {showAddForm && (
                <div className="array-item-card" style={{ border: '2px solid var(--primary-color)', backgroundColor: '#f0f8ff' }}>
                    <div className="array-item-header">
                        <h4>Add New Membership</h4>
                        <button 
                            type="button"
                            onClick={cancelAdd}
                            className="remove-item-button"
                            disabled={loading}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="faculty-edit-form-group">
                        <label>Organization Name *</label>
                        <input
                            type="text"
                            value={newMembership.organization_name}
                            onChange={(e) => setNewMembership({...newMembership, organization_name: e.target.value})}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="Enter organization name"
                            required
                        />
                    </div>

                    <div className="faculty-edit-form-row">
                        <div className="faculty-edit-form-group">
                            <label>Membership Type</label>
                            <input
                                type="text"
                                value={newMembership.membership_type}
                                onChange={(e) => setNewMembership({...newMembership, membership_type: e.target.value})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                                placeholder="e.g., Fellow, Senior Member"
                            />
                        </div>

                        <div className="faculty-edit-form-group">
                            <label>Status</label>
                            <select
                                value={newMembership.status}
                                onChange={(e) => setNewMembership({...newMembership, status: e.target.value})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={addToList}
                        className="add-item-button"
                        disabled={loading}
                        style={{ marginTop: '10px' }}
                    >
                        <i className="fas fa-check"></i> Add to List
                    </button>
                </div>
            )}

            {formData.memberships && formData.memberships.length > 0 ? (
                <div className="array-items-container">
                    {formData.memberships.map((membership, index) => (
                        <div key={index} className="array-item-card">
                            <div className="array-item-header">
                                <h4>Membership {index + 1}</h4>
                                <button 
                                    type="button"
                                    onClick={() => removeMembership(index)}
                                    className="remove-item-button"
                                    disabled={loading}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>

                            <div className="faculty-edit-form-group">
                                <label>Organization Name *</label>
                                <input
                                    type="text"
                                    value={membership.organization_name || ''}
                                    onChange={(e) => handleMembershipChange(index, 'organization_name', e.target.value)}
                                    disabled={loading}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., IEEE, ACM, etc."
                                    required
                                />
                            </div>

                            <div className="faculty-edit-form-row">
                                <div className="faculty-edit-form-group">
                                    <label>Membership Type</label>
                                    <input
                                        type="text"
                                        value={membership.membership_type || ''}
                                        onChange={(e) => handleMembershipChange(index, 'membership_type', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                        placeholder="e.g., Senior Member, Fellow"
                                    />
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>Status</label>
                                    <select
                                        value={membership.status || 'Active'}
                                        onChange={(e) => handleMembershipChange(index, 'status', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                    >
                                        {statuses.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <i className="fas fa-certificate"></i>
                    <p>No memberships added yet</p>
                </div>
            )}
        </div>
    );
};

export default MembershipsSection;
