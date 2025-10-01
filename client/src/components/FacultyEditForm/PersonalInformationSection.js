import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ImageUpload from '../ImageUpload';

// Convert date from dd-mm-yyyy or YYYY-MM-DD to YYYY-MM-DD for HTML date input
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in YYYY-MM-DD format, return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    
    // If it's in dd-mm-yyyy format, convert to YYYY-MM-DD
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }
    
    // If it's an ISO string with time, extract just the date part
    if (dateString.includes('T')) {
        return dateString.split('T')[0];
    }
    
    return '';
};

// Format date for display (dd-mm-yyyy)
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    // If it's in dd-mm-yyyy format already, return it
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        return dateString;
    }
    
    // Convert from YYYY-MM-DD to dd-mm-yyyy
    const date = formatDateForInput(dateString);
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
};

// Convert date from HTML input (YYYY-MM-DD) to dd-mm-yyyy for storage
const formatDateForStorage = (dateString) => {
    if (!dateString) return '';
    
    // If it's from HTML date input (YYYY-MM-DD), convert to dd-mm-yyyy
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }
    
    return dateString;
};

const PersonalInformationSection = ({ formData, setFormData, loading }) => {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    
    // Check if user is admin
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        fetchDepartments();
        fetchDesignations();
    }, []);

    // Update current image URL when form data changes
    useEffect(() => {
        if (formData.profile_image) {
            // Construct proper image URL - add leading slash if not present
            const imageUrl = formData.profile_image.startsWith('/') 
                ? formData.profile_image 
                : `/${formData.profile_image}`;
            setCurrentImageUrl(imageUrl);
        }
    }, [formData.profile_image]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/faculty/data/departments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setDepartments(data.departments);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchDesignations = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/faculty/data/designations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setDesignations(data.designations);
            }
        } catch (error) {
            console.error('Error fetching designations:', error);
        }
    };

    const handleInputChange = (field, value) => {
        // For date fields, convert to dd-mm-yyyy format for storage
        if (field === 'date_of_birth' || field === 'date_of_joining') {
            value = formatDateForStorage(value);
        }
        
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        // Store the selected image file in form data for parent component
        setFormData(prev => ({
            ...prev,
            selectedImage: file
        }));
    };

    const honorificOptions = [
        { value: '', label: 'Select Honorific' },
        { value: 'Dr.', label: 'Dr.' },
        { value: 'Mr.', label: 'Mr.' },
        { value: 'Mrs.', label: 'Mrs.' },
        { value: 'Ms.', label: 'Ms.' },
        { value: 'Prof.', label: 'Prof.' }
    ];

    const genderOptions = [
        { value: '', label: 'Select Gender' },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
    ];



    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Personal Information</h3>
            
            {/* Profile Layout - Image on left, Basic info on right */}
            <div className="profile-layout">
                {/* Profile Image Column */}
                <div className="profile-image-container">
                    <h4>📷 Profile Image</h4>
                    <div className="passport-image-upload">
                        <ImageUpload
                            currentImage={currentImageUrl}
                            onImageSelect={handleImageSelect}
                            maxSizeKB={5120}
                            acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                            disabled={loading}
                            fallbackImage="/images/fallback-profile.svg"
                        />
                    </div>
                </div>

                {/* Form Fields Column */}
                <div className="form-fields-container">
                    {/* Row 1: Employee Code | Honorific | Full Name (1:1:4 ratio for admin, 1:3 for faculty) */}
                    <div className={isAdmin ? "basic-info-grid-admin" : "basic-info-grid"}>
                        {isAdmin && (
                            <div className="faculty-edit-form-group">
                                <label htmlFor="employee_code">Employee Code</label>
                                <input
                                    type="text"
                                    id="employee_code"
                                    value={formData.employee_code || ''}
                                    onChange={(e) => handleInputChange('employee_code', e.target.value)}
                                    disabled={loading}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., FAC001"
                                />
                            </div>
                        )}

                        <div className="faculty-edit-form-group">
                            <label htmlFor="honorific">Honorific/Title</label>
                            <select
                                id="honorific"
                                value={formData.honorific || ''}
                                onChange={(e) => handleInputChange('honorific', e.target.value)}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            >
                                {honorificOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="faculty-edit-form-group">
                            <label htmlFor="full_name">Full Name</label>
                            <input
                                type="text"
                                id="full_name"
                                value={
                                    // Remove honorific from full name if it exists
                                    formData.full_name ? 
                                    formData.full_name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+/i, '') : ''
                                }
                                onChange={(e) => handleInputChange('full_name', e.target.value)}
                                disabled={loading}
                                className="faculty-edit-form-input"
                                placeholder="Enter full name without honorific"
                            />
                        </div>
                    </div>

                    {/* Row 2: Gender | Date of Birth | Date of Joining (1:1:1 ratio) */}
                    <div className="basic-info-grid-three">
                        <div className="faculty-edit-form-group">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                value={formData.gender || ''}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            >
                                {genderOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="faculty-edit-form-group">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                                type="date"
                                id="date_of_birth"
                                value={formatDateForInput(formData.date_of_birth)}
                                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            />
                        </div>

                        <div className="faculty-edit-form-group">
                            <label htmlFor="date_of_joining">Date of Joining</label>
                            <input
                                type="date"
                                id="date_of_joining"
                                value={formatDateForInput(formData.date_of_joining)}
                                onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
                                disabled={loading}
                                className="faculty-edit-form-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Row 3: Designation | Department (1:1 ratio) */}
            <div className="faculty-edit-form-grid">
                {/* Professional Information - Compact Row */}
                <div className="form-row professional-row-two">
                    <div className="form-group form-group-md">
                        <label htmlFor="designation">Designation</label>
                        <select
                            id="designation"
                            value={formData.designation_id || ''}
                            onChange={(e) => handleInputChange('designation_id', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                        >
                            <option value="">Select Designation</option>
                            {designations.map(designation => (
                                <option key={designation.designation_id} value={designation.designation_id}>
                                    {designation.designation_title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group form-group-md">
                        <label htmlFor="department">Department</label>
                        <select
                            id="department"
                            value={formData.department_id || ''}
                            onChange={(e) => handleInputChange('department_id', e.target.value)}
                            disabled={loading}
                            className="faculty-edit-form-input"
                        >
                            <option value="">Select Department</option>
                            {departments.map(department => (
                                <option key={department.department_id} value={department.department_id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Research Experience */}
                <div className="form-group full-width">
                    <label htmlFor="research_teaching_experience">Research & Teaching Experience</label>
                    <textarea
                        id="research_teaching_experience"
                        value={formData.research_teaching_experience || ''}
                        onChange={(e) => handleInputChange('research_teaching_experience', e.target.value)}
                        disabled={loading}
                        className="form-input form-textarea"
                        rows="4"
                        placeholder="Describe your research and teaching experience..."
                    />
                </div>

                {/* Bio Summary */}
                <div className="form-group full-width">
                    <label htmlFor="bio_summary">Bio Summary</label>
                    <textarea
                        id="bio_summary"
                        value={formData.bio_summary || ''}
                        onChange={(e) => handleInputChange('bio_summary', e.target.value)}
                        disabled={loading}
                        className="form-input form-textarea"
                        rows="6"
                        placeholder="Write a brief biography or summary about yourself..."
                    />
                </div>


            </div>

            {/* HOD Status - Admin Only */}
            {isAdmin && (
                <div className="form-row hod-row">
                    <div className="form-group hod-group">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                id="is_hod"
                                checked={formData.is_hod || false}
                                onChange={(e) => handleInputChange('is_hod', e.target.checked)}
                                disabled={loading}
                                className="checkbox-input"
                            />
                            <span className="checkbox-checkmark"></span>
                            <span className="faculty-edit-checkbox-label">Head of Department (HOD)</span>
                        </label>
                    </div>
                </div>
            )}

            {/* Personal Information Preview */}
            {(formData.honorific || formData.full_name || formData.designation || formData.department || formData.gender || formData.date_of_birth || formData.date_of_joining || formData.employment_status) && (
                <div className="personal-preview">
                    <h4>Personal Information Summary:</h4>
                    <div className="preview-content">
                        {(formData.honorific || formData.full_name) && (
                            <p className="preview-name">
                                <strong>Name:</strong> {formData.honorific && `${formData.honorific} `}
                                {formData.full_name ? formData.full_name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+/i, '') : ''}
                            </p>
                        )}
                        {formData.gender && (
                            <p className="preview-gender">
                                <strong>Gender:</strong> {formData.gender}
                            </p>
                        )}
                        {formData.date_of_birth && (
                            <p className="preview-birth-date">
                                <strong>Date of Birth:</strong> {formatDateForDisplay(formData.date_of_birth)}
                            </p>
                        )}
                        {formData.designation_id && (
                            <p className="preview-designation">
                                <strong>Designation:</strong> {designations.find(d => d.designation_id == formData.designation_id)?.designation_title || formData.designation}
                            </p>
                        )}
                        {formData.department_id && (
                            <p className="preview-department">
                                <strong>Department:</strong> {departments.find(d => d.department_id == formData.department_id)?.department_name || formData.department}
                            </p>
                        )}
                        {formData.date_of_joining && (
                            <p className="preview-joining-date">
                                <strong>Date of Joining:</strong> {formatDateForDisplay(formData.date_of_joining)}
                            </p>
                        )}
                        {formData.employment_status && (
                            <p className="preview-employment-status">
                                <strong>Employment Status:</strong> {formData.employment_status}
                            </p>
                        )}
                        {formData.research_teaching_experience && (
                            <p className="preview-experience">
                                <strong>Experience:</strong> {formData.research_teaching_experience.substring(0, 100)}{formData.research_teaching_experience.length > 100 ? '...' : ''}
                            </p>
                        )}
                        {formData.is_hod && (
                            <p className="preview-hod">
                                <strong>Role:</strong> Head of Department
                            </p>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInformationSection;