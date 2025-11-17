import React, { useState } from 'react';

const ResearchGuidanceSection = ({ formData, setFormData, loading }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        student_honorific: 'Mr.',
        student_name: '',
        research_topic: '',
        status: 'Ph.D. Ongoing'
    });

    const handleGuidanceChange = (index, field, value) => {
        const updated = [...(formData.research_guidance || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, research_guidance: updated }));
    };

    const openAddForm = () => {
        setNewStudent({
            student_honorific: 'Mr.',
            student_name: '',
            research_topic: '',
            status: 'Ph.D. Ongoing'
        });
        setShowAddForm(true);
    };

    const cancelAdd = () => {
        setShowAddForm(false);
        setNewStudent({
            student_honorific: 'Mr.',
            student_name: '',
            research_topic: '',
            status: 'Ph.D. Ongoing'
        });
    };

    const addToList = () => {
        if (!newStudent.student_name.trim()) {
            alert('Please enter student name');
            return;
        }
        
        const currentGuidance = Array.isArray(formData.research_guidance) ? formData.research_guidance : [];
        setFormData(prev => ({
            ...prev,
            research_guidance: [
                { ...newStudent, display_order: 1 },
                ...currentGuidance
            ]
        }));
        setShowAddForm(false);
        setNewStudent({
            student_honorific: 'Mr.',
            student_name: '',
            research_topic: '',
            status: 'Ph.D. Ongoing'
        });
    };

    const removeGuidance = (index) => {
        const updated = (formData.research_guidance || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, research_guidance: updated }));
    };

    const honorifics = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
    const statuses = ['Ph.D. Ongoing', 'Ph.D. Completed', 'M.Tech Ongoing', 'M.Tech Completed'];

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Research Guidance</h3>
            
            <button 
                type="button" 
                onClick={openAddForm} 
                className="add-item-button"
                disabled={loading}
            >
                <i className="fas fa-plus"></i> Add Student
            </button>

            {/* Add New Student Form */}
            {showAddForm && (
                <div className="array-item-card" style={{ border: '2px solid var(--primary-color)', backgroundColor: '#f0f8ff' }}>
                    <div className="array-item-header">
                        <h4>Add New Student</h4>
                        <button 
                            type="button"
                            onClick={cancelAdd}
                            className="remove-item-button"
                            disabled={loading}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="faculty-edit-form-row">
                        <div className="faculty-edit-form-group" style={{ flex: '0 0 120px' }}>
                            <label>Honorific</label>
                            <select
                                value={newStudent.student_honorific}
                                onChange={(e) => setNewStudent({...newStudent, student_honorific: e.target.value})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            >
                                {honorifics.map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                        </div>

                        <div className="faculty-edit-form-group" style={{ flex: '1' }}>
                            <label>Student Name *</label>
                            <input
                                type="text"
                                value={newStudent.student_name}
                                onChange={(e) => setNewStudent({...newStudent, student_name: e.target.value})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                                placeholder="Enter student name"
                                required
                            />
                        </div>
                    </div>

                    <div className="faculty-edit-form-group">
                        <label>Research Topic</label>
                        <textarea
                            value={newStudent.research_topic}
                            onChange={(e) => setNewStudent({...newStudent, research_topic: e.target.value})}
                            disabled={loading}
                            className="faculty-edit-form-input"
                            placeholder="Enter research topic"
                            rows="2"
                        />
                    </div>

                    <div className="faculty-edit-form-group">
                        <label>Status</label>
                        <select
                            value={newStudent.status}
                            onChange={(e) => setNewStudent({...newStudent, status: e.target.value})}
                            disabled={loading}
                            className="faculty-edit-form-input"
                        >
                            {statuses.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
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

            {formData.research_guidance && formData.research_guidance.length > 0 ? (
                <div className="array-items-container">
                    {formData.research_guidance.map((student, index) => {
                        return (
                        <div key={`student-${index}-${student.student_name || 'new'}`} className="array-item-card">
                            <div className="array-item-header">
                                <h4>Student {index + 1}</h4>
                                <button 
                                    type="button"
                                    onClick={() => removeGuidance(index)}
                                    className="remove-item-button"
                                    disabled={loading}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>

                            <div className="faculty-edit-form-row">
                                <div className="faculty-edit-form-group" style={{ flex: '0 0 120px' }}>
                                    <label>Honorific</label>
                                    <select
                                        value={student.student_honorific || 'Mr.'}
                                        onChange={(e) => handleGuidanceChange(index, 'student_honorific', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                    >
                                        {honorifics.map(h => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="faculty-edit-form-group" style={{ flex: '1' }}>
                                    <label>Student Name *</label>
                                    <input
                                        type="text"
                                        value={student.student_name || ''}
                                        onChange={(e) => handleGuidanceChange(index, 'student_name', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                        placeholder="Enter student name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="faculty-edit-form-group">
                                <label>Research Topic</label>
                                <textarea
                                    value={student.research_topic || ''}
                                    onChange={(e) => handleGuidanceChange(index, 'research_topic', e.target.value)}
                                    disabled={loading}
                                    className="faculty-edit-form-input"
                                    placeholder="Enter research topic"
                                    rows="2"
                                />
                            </div>

                            <div className="faculty-edit-form-group">
                                <label>Status</label>
                                <select
                                    value={student.status || 'Ph.D. Ongoing'}
                                    onChange={(e) => handleGuidanceChange(index, 'status', e.target.value)}
                                    disabled={loading}
                                    className="faculty-edit-form-input"
                                >
                                    {statuses.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <i className="fas fa-user-graduate"></i>
                    <p>No research guidance added yet</p>
                </div>
            )}
        </div>
    );
};

export default ResearchGuidanceSection;
