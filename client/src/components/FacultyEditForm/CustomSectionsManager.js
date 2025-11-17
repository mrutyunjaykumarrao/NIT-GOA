import React, { useState } from 'react';

const CustomSectionsManager = ({ formData, setFormData, loading, employeeCode }) => {
    const [editingSection, setEditingSection] = useState(null);
    const [showAddEntry, setShowAddEntry] = useState({});
    const [newEntryData, setNewEntryData] = useState({});

    const addSection = () => {
        console.log('Add Section clicked, current formData:', formData);
        const currentSections = Array.isArray(formData.custom_sections) ? formData.custom_sections : [];
        const newSection = {
            section_title: 'New Section',
            section_type: 'table',
            fields: [{ field_name: 'Field 1', field_type: 'text', field_order: 1 }],
            entries: [],
            display_order: 1
        };
        setFormData(prev => ({
            ...prev,
            custom_sections: [
                newSection,
                ...currentSections
            ]
        }));
    };

    const removeSection = (index) => {
        const updated = (formData.custom_sections || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, custom_sections: updated }));
    };

    const updateSectionTitle = (index, title) => {
        const updated = [...(formData.custom_sections || [])];
        updated[index] = { ...updated[index], section_title: title };
        setFormData(prev => ({ ...prev, custom_sections: updated }));
    };

    const addField = (sectionIndex) => {
        const updated = [...(formData.custom_sections || [])];
        const section = updated[sectionIndex];
        section.fields = [
            ...(section.fields || []),
            {
                field_name: `Field ${(section.fields || []).length + 1}`,
                field_type: 'text',
                field_order: (section.fields || []).length + 1
            }
        ];
        setFormData(prev => ({ ...prev, custom_sections: updated }));
    };

    const removeField = (sectionIndex, fieldIndex) => {
        const updated = [...(formData.custom_sections || [])];
        updated[sectionIndex].fields = updated[sectionIndex].fields.filter((_, i) => i !== fieldIndex);
        setFormData(prev => ({ ...prev, custom_sections: updated }));
    };

    const updateField = (sectionIndex, fieldIndex, key, value) => {
        const updated = [...(formData.custom_sections || [])];
        updated[sectionIndex].fields[fieldIndex] = {
            ...updated[sectionIndex].fields[fieldIndex],
            [key]: value
        };
        setFormData(prev => ({ ...prev, custom_sections: updated }));
    };

    const addEntry = (sectionIndex) => {
        const updated = [...(formData.custom_sections || [])];
        const section = updated[sectionIndex];
        const newEntry = {
            cell_data: {},
            display_order: (section.entries || []).length + 1
        };
        section.fields.forEach(field => {
            newEntry.cell_data[field.field_name] = '';
        });
        section.entries = [newEntry, ...(section.entries || [])];
        setFormData(prev => ({ ...prev, custom_sections: updated }));
        
        // Initialize form for new entry
        setShowAddEntry({ ...showAddEntry, [sectionIndex]: true });
        setNewEntryData({ ...newEntryData, [sectionIndex]: {} });
    };

    const saveNewEntry = (sectionIndex) => {
        const entryData = newEntryData[sectionIndex] || {};
        const updated = [...(formData.custom_sections || [])];
        const section = updated[sectionIndex];
        
        const newEntry = {
            cell_data: entryData,
            display_order: 1
        };
        
        section.entries = [newEntry, ...(section.entries || [])];
        setFormData(prev => ({ ...prev, custom_sections: updated }));
        
        // Reset form
        setShowAddEntry({ ...showAddEntry, [sectionIndex]: false });
        setNewEntryData({ ...newEntryData, [sectionIndex]: {} });
    };

    const cancelNewEntry = (sectionIndex) => {
        setShowAddEntry({ ...showAddEntry, [sectionIndex]: false });
        setNewEntryData({ ...newEntryData, [sectionIndex]: {} });
    };

    const updateNewEntryField = (sectionIndex, fieldName, value) => {
        setNewEntryData({
            ...newEntryData,
            [sectionIndex]: {
                ...(newEntryData[sectionIndex] || {}),
                [fieldName]: value
            }
        });
    };

    const removeEntry = (sectionIndex, entryIndex) => {
        const updated = [...(formData.custom_sections || [])];
        updated[sectionIndex].entries = updated[sectionIndex].entries.filter((_, i) => i !== entryIndex);
        setFormData(prev => ({ ...prev, custom_sections: updated }));
    };

    const updateEntry = (sectionIndex, entryIndex, fieldName, value) => {
        const updated = [...(formData.custom_sections || [])];
        updated[sectionIndex].entries[entryIndex].cell_data[fieldName] = value;
        setFormData(prev => ({ ...prev, custom_sections: updated }));
    };

    const fieldTypes = ['text', 'textarea', 'number', 'date', 'url', 'email'];

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Custom Sections</h3>
            <p className="section-description">
                Create custom sections with dynamic fields to add any additional information not covered by standard sections.
            </p>
            
            <button 
                type="button" 
                onClick={addSection} 
                className="btn btn-primary"
                disabled={loading}
            >
                + Add Custom Section
            </button>

            {formData.custom_sections && formData.custom_sections.length > 0 ? (
                <div className="custom-sections-container">
                    {formData.custom_sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="custom-section-card-compact">
                            {/* Section Header - Compact */}
                            <div className="custom-section-header-compact">
                                <input
                                    type="text"
                                    value={section.section_title || ''}
                                    onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                                    disabled={loading}
                                    className="section-title-input-compact"
                                    placeholder="Section Title"
                                />
                                <div className="section-header-controls-compact">
                                    <select
                                        value={section.section_type || 'table'}
                                        onChange={(e) => {
                                            const updated = [...(formData.custom_sections || [])];
                                            updated[sectionIndex] = { ...updated[sectionIndex], section_type: e.target.value };
                                            setFormData(prev => ({ ...prev, custom_sections: updated }));
                                        }}
                                        disabled={loading}
                                        className="display-type-select-compact"
                                    >
                                        <option value="table">📊 Table</option>
                                        <option value="list">📋 List</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeSection(sectionIndex)}
                                        className="btn btn-danger btn-sm"
                                        disabled={loading}
                                        title="Remove Section"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {/* Fields Definition - Inline Compact */}
                            <div className="fields-definition-compact">
                                <div className="fields-header-compact">
                                    <h4>Fields</h4>
                                    <button
                                        type="button"
                                        onClick={() => addField(sectionIndex)}
                                        className="btn btn-success btn-sm"
                                        disabled={loading}
                                    >
                                        + Field
                                    </button>
                                </div>
                                
                                <div className="fields-list-compact">
                                    {section.fields && section.fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="field-chip">
                                            <input
                                                type="text"
                                                value={field.field_name || ''}
                                                onChange={(e) => updateField(sectionIndex, fieldIndex, 'field_name', e.target.value)}
                                                disabled={loading}
                                                placeholder="Field name"
                                                className="field-chip-input"
                                            />
                                            <select
                                                value={field.field_type || 'text'}
                                                onChange={(e) => updateField(sectionIndex, fieldIndex, 'field_type', e.target.value)}
                                                disabled={loading}
                                                className="field-chip-select"
                                            >
                                                {fieldTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => removeField(sectionIndex, fieldIndex)}
                                                className="field-chip-remove"
                                                disabled={loading}
                                                title="Remove field"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add Entry Form - Compact */}
                            {showAddEntry[sectionIndex] ? (
                                <div className="add-entry-form-compact">
                                    <div className="add-entry-header">
                                        <h4>Add New Entry</h4>
                                        <button
                                            type="button"
                                            onClick={() => cancelNewEntry(sectionIndex)}
                                            className="close-form-btn"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="add-entry-fields">
                                        {section.fields && section.fields.map((field, fieldIndex) => (
                                            <div key={fieldIndex} className="entry-field-compact">
                                                <label>{field.field_name}</label>
                                                {field.field_type === 'textarea' ? (
                                                    <textarea
                                                        value={(newEntryData[sectionIndex] || {})[field.field_name] || ''}
                                                        onChange={(e) => updateNewEntryField(sectionIndex, field.field_name, e.target.value)}
                                                        disabled={loading}
                                                        rows="2"
                                                        className="faculty-edit-form-input"
                                                    />
                                                ) : (
                                                    <input
                                                        type={field.field_type}
                                                        value={(newEntryData[sectionIndex] || {})[field.field_name] || ''}
                                                        onChange={(e) => updateNewEntryField(sectionIndex, field.field_name, e.target.value)}
                                                        disabled={loading}
                                                        className="faculty-edit-form-input"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="entry-form-actions">
                                        <button
                                            type="button"
                                            onClick={() => saveNewEntry(sectionIndex)}
                                            className="btn btn-success btn-sm"
                                            disabled={loading}
                                        >
                                            Add to List
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => cancelNewEntry(sectionIndex)}
                                            className="btn btn-secondary btn-sm"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowAddEntry({ ...showAddEntry, [sectionIndex]: true })}
                                    className="btn btn-primary btn-sm"
                                    disabled={loading}
                                    style={{ marginTop: '12px' }}
                                >
                                    + Add Entry
                                </button>
                            )}

                            {/* Preview Section */}
                            {section.entries && section.entries.length > 0 && (
                                <div className="entries-preview-compact">
                                    <h4>Preview ({section.entries.length} {section.entries.length === 1 ? 'entry' : 'entries'})</h4>
                                    
                                    {section.section_type === 'table' ? (
                                        <div className="preview-table-wrapper">
                                            <table className="preview-table">
                                                <thead>
                                                    <tr>
                                                        {section.fields && section.fields.map((field, idx) => (
                                                            <th key={idx}>{field.field_name}</th>
                                                        ))}
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {section.entries.map((entry, entryIndex) => (
                                                        <tr key={entryIndex}>
                                                            {section.fields && section.fields.map((field, fieldIdx) => (
                                                                <td key={fieldIdx}>
                                                                    {entry.cell_data[field.field_name] || '-'}
                                                                </td>
                                                            ))}
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeEntry(sectionIndex, entryIndex)}
                                                                    className="btn btn-danger btn-sm"
                                                                    disabled={loading}
                                                                    title="Remove entry"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="preview-list">
                                            {section.entries.map((entry, entryIndex) => (
                                                <div key={entryIndex} className="preview-list-item">
                                                    <div className="preview-list-content">
                                                        {section.fields && section.fields.map((field, fieldIdx) => (
                                                            <div key={fieldIdx} className="preview-list-field">
                                                                <strong>{field.field_name}:</strong> {entry.cell_data[field.field_name] || '-'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEntry(sectionIndex, entryIndex)}
                                                        className="btn btn-danger btn-sm"
                                                        disabled={loading}
                                                        title="Remove entry"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-content">
                        <div className="empty-state-icon">📋</div>
                        <h4>No custom sections yet</h4>
                        <p>Click "Add Custom Section" to create dynamic sections with custom fields</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSectionsManager;
