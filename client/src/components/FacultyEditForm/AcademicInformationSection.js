import React, { useState } from 'react';

const AcademicInformationSection = ({ formData, setFormData, loading }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEducation, setNewEducation] = useState({
        degree: '',
        institute: '',
        discipline: '',
        graduation_year: ''
    });

    const education = formData.education || [];
    
    // Sort education by display_order for consistent display
    const sortedEducation = [...education].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    const handleAddEducation = () => {
        if (!newEducation.degree || !newEducation.institute) {
            alert('Please fill in degree and institute');
            return;
        }

        const finalDiscipline = newEducation.discipline === 'Other' 
            ? (newEducation.customDiscipline || '') 
            : newEducation.discipline;

        const educationEntry = {
            degree: newEducation.degree,
            institute: newEducation.institute,
            discipline: finalDiscipline,
            graduation_year: newEducation.graduation_year,
            display_order: education.length + 1, // Set display_order based on current count
            id: Date.now() // Temporary ID for frontend
        };

        setFormData(prev => ({
            ...prev,
            education: [...education, educationEntry]
        }));

        setNewEducation({
            degree: '',
            institute: '',
            discipline: '',
            graduation_year: ''
        });
        setShowAddForm(false);
    };

    const handleRemoveEducation = (index) => {
        if (window.confirm('Are you sure you want to remove this education entry?')) {
            const updatedEducation = education.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                education: updatedEducation
            }));
        }
    };

    const handleEditEducation = (index, field, value) => {
        const updatedEducation = education.map((edu, i) => 
            i === index ? { ...edu, [field]: value } : edu
        );
        setFormData(prev => ({
            ...prev,
            education: updatedEducation
        }));
    };

    const handleReorderEducation = (educationIndex, direction) => {
        console.log('=== EDUCATION REORDER START ===');
        console.log('Input:', { educationIndex, direction });
        
        // Work with the sorted education array (what user sees)
        const workingArray = [...sortedEducation];
        
        console.log('Education before swap:', workingArray.map(e => e.degree));
        
        // Check boundaries
        if (direction === 'up' && educationIndex === 0) {
            console.log('Cannot move up - at top');
            return;
        }
        if (direction === 'down' && educationIndex >= workingArray.length - 1) {
            console.log('Cannot move down - at bottom');
            return;
        }
        
        // Get the two education entries to swap
        const education1 = workingArray[educationIndex];
        const education2Index = direction === 'up' ? educationIndex - 1 : educationIndex + 1;
        const education2 = workingArray[education2Index];
        
        console.log(`Swapping "${education1.degree}" with "${education2.degree}"`);
        
        // Simple array swap - just swap their positions
        workingArray[educationIndex] = education2;
        workingArray[education2Index] = education1;
        
        // Assign new sequential display_order values
        workingArray.forEach((edu, index) => {
            edu.display_order = index + 1;
        });
        
        console.log('Education after swap:', workingArray.map(e => e.degree));
        
        setFormData(prev => ({
            ...prev,
            education: workingArray
        }));
        
        console.log('=== EDUCATION REORDER END ===');
    };

    const degreeOptions = [
        { value: '', label: 'Select Degree' },
        { value: 'Ph.D', label: 'Ph.D (Doctor of Philosophy)' },
        { value: 'M.Tech', label: 'M.Tech (Master of Technology)' },
        { value: 'M.E', label: 'M.E (Master of Engineering)' },
        { value: 'M.S', label: 'M.S (Master of Science)' },
        { value: 'M.Sc', label: 'M.Sc (Master of Science)' },
        { value: 'MBA', label: 'MBA (Master of Business Administration)' },
        { value: 'M.Phil', label: 'M.Phil (Master of Philosophy)' },
        { value: 'B.Tech', label: 'B.Tech (Bachelor of Technology)' },
        { value: 'B.E', label: 'B.E (Bachelor of Engineering)' },
        { value: 'B.Sc', label: 'B.Sc (Bachelor of Science)' },
        { value: 'B.A', label: 'B.A (Bachelor of Arts)' },
        { value: 'Diploma', label: 'Diploma' },
        { value: 'Certificate', label: 'Certificate' },
        { value: 'Other', label: 'Other' }
    ];

    const specializationOptions = [
        { value: '', label: 'Select Specialization' },
        { value: 'Computer Science and Engineering', label: 'Computer Science and Engineering' },
        { value: 'Electronics and Communication Engineering', label: 'Electronics and Communication Engineering' },
        { value: 'Electrical Engineering', label: 'Electrical Engineering' },
        { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
        { value: 'Civil Engineering', label: 'Civil Engineering' },
        { value: 'Chemical Engineering', label: 'Chemical Engineering' },
        { value: 'Information Technology', label: 'Information Technology' },
        { value: 'Mathematics', label: 'Mathematics' },
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry', label: 'Chemistry' },
        { value: 'English', label: 'English' },
        { value: 'Management Studies', label: 'Management Studies' },
        { value: 'Economics', label: 'Economics' },
        { value: 'Other', label: 'Other' }
    ];

    const getCurrentYear = () => new Date().getFullYear();

    const yearOptions = Array.from({ length: 50 }, (_, i) => {
        const year = getCurrentYear() - i;
        return { value: year.toString(), label: year.toString() };
    });

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Academic Information</h3>

            {/* Add Education Button */}
            <div className="section-header">
                <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    + Add Education
                </button>
            </div>

            {/* Add Education Form */}
            {showAddForm && (
                <div className="add-education-form fade-in">
                    <h4>Add Education/Qualification</h4>
                    
                    <div className="faculty-edit-form-grid">
                        {/* Row 1: Degree (2) + Specialization (2) + Graduation Year (1) in 2:2:1 ratio */}
                        <div className="faculty-edit-form-row">
                            <div className="faculty-edit-form-group" style={{ flex: '2' }}>
                                <label>Degree/Qualification *</label>
                                <select
                                    value={newEducation.degree}
                                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                                    className="faculty-edit-form-input"
                                    required
                                >
                                    {degreeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="faculty-edit-form-group" style={{ flex: '2' }}>
                                <label>Specialization/Discipline</label>
                                <select
                                    value={newEducation.discipline}
                                    onChange={(e) => setNewEducation(prev => ({ ...prev, discipline: e.target.value }))}
                                    className="faculty-edit-form-input"
                                >
                                    {specializationOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="faculty-edit-form-group" style={{ flex: '1' }}>
                                <label>Graduation Year</label>
                                <select
                                    value={newEducation.graduation_year}
                                    onChange={(e) => setNewEducation(prev => ({ ...prev, graduation_year: e.target.value }))}
                                    className="faculty-edit-form-input"
                                >
                                    <option value="">Select Year</option>
                                    {yearOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Custom specialization input (if "Other" is selected) */}
                        {newEducation.discipline === 'Other' && (
                            <div className="faculty-edit-form-row">
                                <div className="faculty-edit-form-group full-width">
                                    <label>Custom Specialization</label>
                                    <input
                                        type="text"
                                        placeholder="Enter custom specialization"
                                        value={newEducation.customDiscipline || ''}
                                        onChange={(e) => setNewEducation(prev => ({ ...prev, customDiscipline: e.target.value }))}
                                        className="faculty-edit-form-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Row 2: Institute/University with Action Buttons (4:1:1 ratio) */}
                        <div className="faculty-edit-form-row">
                            <div className="faculty-edit-form-group" style={{ flex: '4' }}>
                                <label>Institute/University *</label>
                                <input
                                    type="text"
                                    placeholder="Enter institute or university name"
                                    value={newEducation.institute}
                                    onChange={(e) => setNewEducation(prev => ({ ...prev, institute: e.target.value }))}
                                    className="faculty-edit-form-input"
                                    required
                                />
                            </div>
                            <div className="faculty-edit-form-group button-group" style={{ flex: '1' }}>
                                <button 
                                    type="button" 
                                    onClick={handleAddEducation} 
                                    className="btn btn-primary"
                                >
                                    Add Education
                                </button>
                            </div>
                            <div className="faculty-edit-form-group button-group" style={{ flex: '1' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddForm(false)} 
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Education List */}
            <div className="education-list">
                <h4>Education History ({education.length})</h4>
                
                {sortedEducation.length > 0 ? (
                    <div className="education-entries">
                        {sortedEducation.map((edu, index) => (
                            <div key={edu.id || index} className="education-item">
                                <div className="education-header">
                                    <div className="education-title">
                                        <h5>
                                            {edu.degree}
                                            {edu.discipline && <span className="discipline"> in {edu.discipline}</span>}
                                        </h5>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEducation(index)}
                                            className="btn btn-sm btn-danger"
                                            disabled={loading}
                                        >
                                            Remove
                                        </button>
                                        <div className="order-controls">
                                            <button
                                                type="button"
                                                className="order-btn"
                                                onClick={() => handleReorderEducation(index, 'up')}
                                                disabled={index === 0}
                                                title="Move up"
                                            >
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                    <path d="M6 0L12 8H0L6 0Z" fill="currentColor"/>
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="order-btn"
                                                onClick={() => handleReorderEducation(index, 'down')}
                                                disabled={index === sortedEducation.length - 1}
                                                title="Move down"
                                            >
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                    <path d="M6 8L0 0H12L6 8Z" fill="currentColor"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="education-details">
                                    {/* First row: Degree (2), Specialization (2), Graduation Year (1) in 2:2:1 ratio */}
                                    <div className="faculty-edit-form-row">
                                        <div className="faculty-edit-form-group" style={{ flex: '2' }}>
                                            <label>Degree</label>
                                            <input
                                                type="text"
                                                value={edu.degree || 'Not specified'}
                                                className="faculty-edit-form-input"
                                                disabled={true}
                                                readOnly
                                                placeholder="Degree/Qualification"
                                            />
                                        </div>

                                        <div className="faculty-edit-form-group" style={{ flex: '2' }}>
                                            <label>Specialization</label>
                                            <input
                                                type="text"
                                                value={edu.discipline || 'Not specified'}
                                                className="faculty-edit-form-input"
                                                disabled={true}
                                                readOnly
                                                placeholder="Specialization/Discipline"
                                            />
                                        </div>
                                        
                                        <div className="faculty-edit-form-group" style={{ flex: '1' }}>
                                            <label>Graduation Year</label>
                                            <input
                                                type="text"
                                                value={edu.graduation_year || 'Not specified'}
                                                className="faculty-edit-form-input"
                                                disabled={true}
                                                readOnly
                                                placeholder="Year"
                                            />
                                        </div>
                                    </div>

                                    {/* Second row: Institute/University (full width) */}
                                    <div className="faculty-edit-form-row">
                                        <div className="faculty-edit-form-group full-width">
                                            <label>Institute/University</label>
                                            <input
                                                type="text"
                                                value={edu.institute || 'Not specified'}
                                                className="faculty-edit-form-input"
                                                disabled={true}
                                                readOnly
                                                placeholder="Institute or University name"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No education entries added yet. Click "Add Education" to get started.</p>
                    </div>
                )}
            </div>

            {/* Education Summary */}
            {education.length > 0 && (
                <div className="education-summary">
                    <h4>Summary</h4>
                    <div className="summary-list">
                        {education
                            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                            .map((edu, index) => (
                            <div key={index} className="summary-item">
                                <strong>{edu.degree}</strong>
                                {edu.discipline && ` in ${edu.discipline}`}
                                {edu.institute && ` - ${edu.institute}`}
                                {edu.graduation_year && ` (${edu.graduation_year})`}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicInformationSection;