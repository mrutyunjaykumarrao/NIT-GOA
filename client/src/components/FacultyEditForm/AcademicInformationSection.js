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

    const degreeOptions = [
        { value: '', label: 'Select Degree' },
        { value: 'Ph.D', label: 'Ph.D (Doctor of Philosophy)' },
        { value: 'M.Tech', label: 'M.Tech (Master of Technology)' },
        { value: 'M.E', label: 'M.E (Master of Engineering)' },
        { value: 'M.S', label: 'M.S (Master of Science)' },
        { value: 'M.Sc', label: 'M.Sc (Master of Science)' },
        { value: 'MBA', label: 'MBA (Master of Business Administration)' },
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
        <div className="form-section">
            <h3 className="section-title">Academic Information</h3>

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
                    
                    <div className="form-grid">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Degree/Qualification *</label>
                                <select
                                    value={newEducation.degree}
                                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                                    className="form-input"
                                    required
                                >
                                    {degreeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Specialization/Discipline</label>
                                <select
                                    value={newEducation.discipline}
                                    onChange={(e) => setNewEducation(prev => ({ ...prev, discipline: e.target.value }))}
                                    className="form-input"
                                >
                                    {specializationOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {newEducation.discipline === 'Other' && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom specialization"
                                        value={newEducation.customDiscipline || ''}
                                        onChange={(e) => setNewEducation(prev => ({ ...prev, customDiscipline: e.target.value }))}
                                        className="form-input"
                                        style={{ marginTop: '8px' }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Institute/University *</label>
                            <input
                                type="text"
                                placeholder="Enter institute or university name"
                                value={newEducation.institute}
                                onChange={(e) => setNewEducation(prev => ({ ...prev, institute: e.target.value }))}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Graduation Year</label>
                            <select
                                value={newEducation.graduation_year}
                                onChange={(e) => setNewEducation(prev => ({ ...prev, graduation_year: e.target.value }))}
                                className="form-input"
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

                    <div className="form-actions">
                        <button type="button" onClick={handleAddEducation} className="btn btn-primary">
                            Add Education
                        </button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Education List */}
            <div className="education-list">
                <h4>Education History ({education.length})</h4>
                
                {education.length > 0 ? (
                    <div className="education-entries">
                        {education.map((edu, index) => (
                            <div key={edu.id || index} className="education-item">
                                <div className="education-header">
                                    <div className="education-title">
                                        <h5>{edu.degree}</h5>
                                        {edu.discipline && <span className="discipline">in {edu.discipline}</span>}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEducation(index)}
                                        className="btn btn-sm btn-danger"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                                
                                <div className="education-details">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Degree</label>
                                            <select
                                                value={edu.degree || ''}
                                                onChange={(e) => handleEditEducation(index, 'degree', e.target.value)}
                                                className="form-input"
                                                disabled={loading}
                                            >
                                                {degreeOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Specialization</label>
                                            <select
                                                value={edu.discipline || ''}
                                                onChange={(e) => handleEditEducation(index, 'discipline', e.target.value)}
                                                className="form-input"
                                                disabled={loading}
                                            >
                                                {specializationOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {edu.discipline === 'Other' && (
                                                <input
                                                    type="text"
                                                    placeholder="Enter custom specialization"
                                                    value={edu.customDiscipline || ''}
                                                    onChange={(e) => handleEditEducation(index, 'customDiscipline', e.target.value)}
                                                    className="form-input"
                                                    disabled={loading}
                                                    style={{ marginTop: '8px' }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Institute/University</label>
                                        <input
                                            type="text"
                                            value={edu.institute || ''}
                                            onChange={(e) => handleEditEducation(index, 'institute', e.target.value)}
                                            className="form-input"
                                            disabled={loading}
                                            placeholder="Institute or University name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Graduation Year</label>
                                        <select
                                            value={edu.graduation_year || ''}
                                            onChange={(e) => handleEditEducation(index, 'graduation_year', e.target.value)}
                                            className="form-input"
                                            disabled={loading}
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
                            .sort((a, b) => (b.graduation_year || 0) - (a.graduation_year || 0))
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