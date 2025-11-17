import React, { useState } from 'react';

const CustomSectionEntries = ({ sectionData, formData, setFormData, loading }) => {
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [newEntryData, setNewEntryData] = useState({});

    // Handle undefined sectionData
    if (!sectionData || !formData.custom_sections) {
        return (
            <div className="section-container">
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    Unable to load section data. Please try refreshing the page.
                </div>
            </div>
        );
    }

    const sectionIndex = formData.custom_sections.findIndex(
        s => s.section_id === sectionData.section_id || s.section_title === sectionData.section_title
    );

    const currentSection = formData.custom_sections[sectionIndex];

    // Handle section not found
    if (!currentSection) {
        return (
            <div className="section-container">
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    Section not found. It may have been deleted.
                </div>
            </div>
        );
    }

    const openAddForm = () => {
        setNewEntryData({});
        setShowAddEntry(true);
    };

    const cancelAdd = () => {
        setShowAddEntry(false);
        setNewEntryData({});
    };

    const updateNewEntryField = (fieldName, value) => {
        setNewEntryData({
            ...newEntryData,
            [fieldName]: value
        });
    };

    const addToList = () => {
        const updated = [...formData.custom_sections];
        const section = { ...updated[sectionIndex] };
        
        const newEntry = {
            cell_data: newEntryData,
            display_order: 1
        };
        
        section.entries = [newEntry, ...(section.entries || [])];
        updated[sectionIndex] = section;
        
        setFormData(prev => ({ ...prev, custom_sections: updated }));
        setShowAddEntry(false);
        setNewEntryData({});
    };

    const removeEntry = (entryIndex) => {
        if (window.confirm('Are you sure you want to remove this entry?')) {
            const updated = [...formData.custom_sections];
            const section = { ...updated[sectionIndex] };
            section.entries = section.entries.filter((_, i) => i !== entryIndex);
            updated[sectionIndex] = section;
            setFormData(prev => ({ ...prev, custom_sections: updated }));
        }
    };

    if (!currentSection) {
        return (
            <div className="faculty-edit-components-form-section">
                <h3 className="faculty-edit-section-title">{sectionData.section_title}</h3>
                <p>Section not found.</p>
            </div>
        );
    }

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">{currentSection.section_title}</h3>

            {/* Add Entry Button */}
            {!showAddEntry && (
                <div className="section-header">
                    <button
                        type="button"
                        onClick={openAddForm}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        + Add Entry
                    </button>
                </div>
            )}

            {/* Add Entry Form */}
            {showAddEntry && (
                <div className="add-form-container">
                    <div className="add-form-header">
                        <h4>Add New Entry</h4>
                        <button type="button" onClick={cancelAdd} className="close-form-btn">✕</button>
                    </div>
                    <div className="add-form-body">
                        <div className="add-entry-fields">
                            {currentSection.fields && currentSection.fields.map((field, fieldIndex) => (
                                <div key={fieldIndex} className="entry-field-compact">
                                    <label>{field.field_name}</label>
                                    {field.field_type === 'textarea' ? (
                                        <textarea
                                            value={newEntryData[field.field_name] || ''}
                                            onChange={(e) => updateNewEntryField(field.field_name, e.target.value)}
                                            disabled={loading}
                                            rows="3"
                                            className="faculty-edit-form-input"
                                        />
                                    ) : (
                                        <input
                                            type={field.field_type}
                                            value={newEntryData[field.field_name] || ''}
                                            onChange={(e) => updateNewEntryField(field.field_name, e.target.value)}
                                            disabled={loading}
                                            className="faculty-edit-form-input"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="form-actions">
                            <button 
                                type="button" 
                                onClick={addToList}
                                className="btn btn-success"
                                disabled={loading}
                            >
                                Add to List
                            </button>
                            <button 
                                type="button" 
                                onClick={cancelAdd}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display Entries */}
            {currentSection.entries && currentSection.entries.length === 0 && !showAddEntry ? (
                <div className="empty-state">
                    <div className="empty-state-content">
                        <div className="empty-state-icon">📝</div>
                        <h4>No entries yet</h4>
                        <p>Click "Add Entry" to add data to this section.</p>
                    </div>
                </div>
            ) : currentSection.entries && currentSection.entries.length > 0 ? (
                <div className="data-list">
                    <h4>Entries ({currentSection.entries.length})</h4>
                    
                    {currentSection.section_type === 'table' ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {currentSection.fields && currentSection.fields.map((field, idx) => (
                                        <th key={idx}>{field.field_name}</th>
                                    ))}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSection.entries.map((entry, entryIndex) => (
                                    <tr key={entryIndex}>
                                        {currentSection.fields && currentSection.fields.map((field, fieldIdx) => (
                                            <td key={fieldIdx}>
                                                {entry.cell_data[field.field_name] || '-'}
                                            </td>
                                        ))}
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => removeEntry(entryIndex)}
                                                className="btn btn-danger btn-sm"
                                                disabled={loading}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="preview-list">
                            {currentSection.entries.map((entry, entryIndex) => (
                                <div key={entryIndex} className="preview-list-item">
                                    <div className="preview-list-content">
                                        {currentSection.fields && currentSection.fields.map((field, fieldIdx) => (
                                            <div key={fieldIdx} className="preview-list-field">
                                                <strong>{field.field_name}:</strong> {entry.cell_data[field.field_name] || '-'}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeEntry(entryIndex)}
                                        className="btn btn-danger btn-sm"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default CustomSectionEntries;
