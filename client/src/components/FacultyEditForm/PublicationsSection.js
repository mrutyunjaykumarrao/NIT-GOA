import React, { useState } from 'react';

const PublicationsSection = ({ formData, setFormData, loading }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPublication, setNewPublication] = useState({
        title: '',
        publication_year: new Date().getFullYear(),
        publication_month: '',
        publication_type: 'Journal Paper'
    });

    const handlePublicationChange = (index, field, value) => {
        const updated = [...(formData.publications || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, publications: updated }));
    };

    const openAddForm = () => {
        setNewPublication({
            title: '',
            publication_year: new Date().getFullYear(),
            publication_month: '',
            publication_type: 'Journal Paper'
        });
        setShowAddForm(true);
    };

    const cancelAdd = () => {
        setShowAddForm(false);
        setNewPublication({
            title: '',
            publication_year: new Date().getFullYear(),
            publication_month: '',
            publication_type: 'Journal Paper'
        });
    };

    const addToList = () => {
        if (!newPublication.title.trim()) {
            alert('Please enter publication title');
            return;
        }
        
        const currentPublications = Array.isArray(formData.publications) ? formData.publications : [];
        setFormData(prev => ({
            ...prev,
            publications: [
                { ...newPublication, display_order: 1 },
                ...currentPublications
            ]
        }));
        setShowAddForm(false);
        setNewPublication({
            title: '',
            publication_year: new Date().getFullYear(),
            publication_month: '',
            publication_type: 'Journal Paper'
        });
    };

    const removePublication = (index) => {
        const updated = (formData.publications || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, publications: updated }));
    };

    const publicationTypes = ['Journal Paper', 'Conference Proceeding', 'Book Chapter', 'Book Authored', 'Patent', 'Technical Report'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Publications</h3>
            
            <button 
                type="button" 
                onClick={openAddForm} 
                className="add-item-button"
                disabled={loading}
            >
                <i className="fas fa-plus"></i> Add Publication
            </button>

            {/* Add New Publication Form */}
            {showAddForm && (
                <div className="array-item-card" style={{ border: '2px solid var(--primary-color)', backgroundColor: '#f0f8ff' }}>
                    <div className="array-item-header">
                        <h4>Add New Publication</h4>
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
                        <label>Title *</label>
                        <input
                            type="text"
                            value={newPublication.title}
                            onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="Enter publication title"
                            required
                        />
                    </div>

                    <div className="faculty-edit-form-row">
                        <div className="faculty-edit-form-group">
                            <label>Year</label>
                            <input
                                type="number"
                                value={newPublication.publication_year}
                                onChange={(e) => setNewPublication({...newPublication, publication_year: parseInt(e.target.value)})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                        </div>

                        <div className="faculty-edit-form-group">
                            <label>Month</label>
                            <select
                                value={newPublication.publication_month}
                                onChange={(e) => setNewPublication({...newPublication, publication_month: e.target.value})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            >
                                <option value="">Select Month</option>
                                {months.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="faculty-edit-form-group">
                            <label>Type</label>
                            <select
                                value={newPublication.publication_type}
                                onChange={(e) => setNewPublication({...newPublication, publication_type: e.target.value})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            >
                                {publicationTypes.map(t => (
                                    <option key={t} value={t}>{t}</option>
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

            {formData.publications && formData.publications.length > 0 ? (
                <div className="array-items-container">
                    {formData.publications.map((pub, index) => (
                        <div key={index} className="array-item-card">
                            <div className="array-item-header">
                                <h4>Publication {index + 1}</h4>
                                <button 
                                    type="button"
                                    onClick={() => removePublication(index)}
                                    className="remove-item-button"
                                    disabled={loading}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>

                            <div className="faculty-edit-form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={pub.title || ''}
                                    onChange={(e) => handlePublicationChange(index, 'title', e.target.value)}
                                    disabled={loading}
                                    className="faculty-edit-form-input"
                                    placeholder="Enter publication title"
                                    required
                                />
                            </div>

                            <div className="faculty-edit-form-row">
                                <div className="faculty-edit-form-group">
                                    <label>Type</label>
                                    <select
                                        value={pub.publication_type || 'Journal Paper'}
                                        onChange={(e) => handlePublicationChange(index, 'publication_type', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                    >
                                        {publicationTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={pub.publication_year || ''}
                                        onChange={(e) => handlePublicationChange(index, 'publication_year', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                        placeholder="YYYY"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                    />
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>Month</label>
                                    <select
                                        value={pub.publication_month || ''}
                                        onChange={(e) => handlePublicationChange(index, 'publication_month', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                    >
                                        <option value="">Select Month</option>
                                        {months.map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <i className="fas fa-book"></i>
                    <p>No publications added yet</p>
                </div>
            )}
        </div>
    );
};

export default PublicationsSection;
