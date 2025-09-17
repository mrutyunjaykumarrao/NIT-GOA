import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ImageUpload from '../ImageUpload';

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
            const response = await fetch('/api/faculty-data/departments', {
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
            const response = await fetch('/api/faculty-data/designations', {
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
        <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
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
                    {/* Row 1: Honorific | Full Name (1:3 ratio) */}
                    <div className="basic-info-grid">
                        <div className="form-group">
                            <label htmlFor="honorific">Honorific/Title</label>
                            <select
                                id="honorific"
                                value={formData.honorific || ''}
                                onChange={(e) => handleInputChange('honorific', e.target.value)}
                                disabled={loading}
                                className="form-input"
                            >
                                {honorificOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
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
                                className="form-input"
                                placeholder="Enter full name without honorific"
                            />
                        </div>
                    </div>

                    {/* Row 2: Gender | Date of Birth | Date of Joining (1:1:1 ratio) */}
                    <div className="basic-info-grid-three">
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                value={formData.gender || ''}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                disabled={loading}
                                className="form-input"
                            >
                                {genderOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                                type="date"
                                id="date_of_birth"
                                value={formData.date_of_birth ? formData.date_of_birth.split('T')[0] : ''}
                                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                disabled={loading}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date_of_joining">Date of Joining</label>
                            <input
                                type="date"
                                id="date_of_joining"
                                value={formData.date_of_joining ? formData.date_of_joining.split('T')[0] : ''}
                                onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
                                disabled={loading}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Row 3: Designation | Department (1:1 ratio) */}
            <div className="form-grid">
                {/* Professional Information - Compact Row */}
                <div className="form-row professional-row-two">
                    <div className="form-group form-group-md">
                        <label htmlFor="designation">Designation</label>
                        <select
                            id="designation"
                            value={formData.designation_id || ''}
                            onChange={(e) => handleInputChange('designation_id', e.target.value)}
                            disabled={loading}
                            className="form-input"
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
                            className="form-input"
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
                            <span className="checkbox-label">Head of Department (HOD)</span>
                        </label>
                    </div>
                </div>
            )}

            {/* Personal Information Preview */}
            {(formData.honorific || formData.full_name || formData.designation || formData.department) && (
                <div className="personal-preview">
                    <h4>Personal Information Summary:</h4>
                    <div className="preview-content">
                        {(formData.honorific || formData.full_name) && (
                            <p className="preview-name">
                                <strong>Name:</strong> {formData.honorific && `${formData.honorific} `}
                                {formData.full_name ? formData.full_name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+/i, '') : ''}
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