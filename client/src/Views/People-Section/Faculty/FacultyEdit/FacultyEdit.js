import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import './FacultyEdit.css';

const FacultyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    
    // Form data state
    const [formData, setFormData] = useState({
        // Personal Information
        full_name: '',
        honorific: '',
        gender: '',
        date_of_birth: '',
        designation: '',
        department: '',
        date_of_joining: '',
        experience: '',
        
        // Contact Information
        email: '',
        phone_mobile: '',
        extension_no: '',
        address: '',
        office_location: '',
        office_hours: '',
        
        // Social Links
        linkedin_url: '',
        personal_website_url: '',
        google_scholar_url: '',
        orcid_id: '',
        scopus_id: '',
        research_gate_url: '',
        
        // Academic Information
        education: [],
        
        // Research
        research_interests: [],
        research_areas: [],
        bio_summary: '',
        
        // Publications
        publications: [],
        
        // Profile
        profile_image: ''
    });

    useEffect(() => {
        // Always ensure we have a valid token first, then fetch data
        ensureAuthentication().then(() => {
            fetchFacultyData();
        });
    }, [id]);

    // Ensure authentication
    const ensureAuthentication = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('No token found, attempting auto-login...');
            await autoLogin();
        } else {
            // Verify token is still valid
            try {
                const response = await fetch('/api/auth/validate', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    console.log('Token invalid, attempting auto-login...');
                    await autoLogin();
                }
            } catch (error) {
                console.log('Token validation failed, attempting auto-login...');
                await autoLogin();
            }
        }
    };

    // Auto-login function for development/testing
    const autoLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password: 'admin123' })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role || 'admin');
                console.log('Auto-login successful');
            }
        } catch (error) {
            console.log('Auto-login failed:', error);
        }
    };

    const fetchFacultyData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/faculty-details/${id}/details`);
            const result = await response.json();
            
            if (response.ok) {
                setFaculty(result);
                populateFormData(result);
            } else {
                console.error('Failed to fetch faculty data:', result.error);
            }
        } catch (error) {
            console.error('Error fetching faculty data:', error);
        } finally {
            setLoading(false);
        }
    };

    const populateFormData = (data) => {
        setFormData({
            // Personal Information
            full_name: data.personalInformation?.name || '',
            honorific: data.profile?.name?.split(' ')[0] || '',
            gender: data.personalInformation?.gender || '',
            date_of_birth: data.personalInformation?.birthDate || '',
            designation: data.personalInformation?.designation || '',
            department: data.personalInformation?.department || '',
            date_of_joining: data.personalInformation?.dateOfJoining || '',
            experience: data.personalInformation?.experience || '',
            
            // Contact Information
            email: data.contactInformation?.email || '',
            phone_mobile: data.contactInformation?.phoneMobile || '',
            extension_no: data.profile?.phone || '',
            address: data.contactInformation?.address || '',
            office_location: data.contactInformation?.officeLocation || '',
            office_hours: data.contactInformation?.officeHours || '',
            
            // Social Links
            linkedin_url: data.socialLinks?.linkedin || '',
            personal_website_url: data.socialLinks?.website || '',
            google_scholar_url: data.socialLinks?.googleScholar || '',
            orcid_id: data.socialLinks?.orcid || '',
            scopus_id: data.socialLinks?.scopus || '',
            research_gate_url: data.socialLinks?.researchGate || '',
            
            // Academic Information
            education: data.academicInformation || [],
            
            // Research
            research_interests: Array.isArray(data.profile?.researchAreaSummary) ? data.profile.researchAreaSummary : [],
            research_areas: data.researchAreas || [],
            bio_summary: data.biography || '',
            
            // Publications
            publications: data.publications?.journal || [],
            
            // Profile
            profile_image: data.profile?.profile_image || ''
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayFieldChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleEducationChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', institute: '', subject: '', year: '', grade_percentage: '' }]
        }));
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handlePublicationChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            publications: prev.publications.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addPublication = () => {
        setFormData(prev => ({
            ...prev,
            publications: [...prev.publications, { 
                title: '', 
                publication_details: '', 
                journal_name: '', 
                publication_year: '', 
                doi: '' 
            }]
        }));
    };

    const removePublication = (index) => {
        setFormData(prev => ({
            ...prev,
            publications: prev.publications.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to save changes');
                return;
            }

            // Prepare the data payload
            const updateData = {
                profile: {
                    full_name: formData.full_name,
                    honorific: formData.honorific,
                    gender: formData.gender,
                    date_of_birth: formData.date_of_birth,
                    designation: formData.designation,
                    department: formData.department,
                    date_of_joining: formData.date_of_joining,
                    experience: formData.experience,
                    email: formData.email,
                    phone_mobile: formData.phone_mobile,
                    extension_no: formData.extension_no,
                    address: formData.address,
                    office_location: formData.office_location,
                    office_hours: formData.office_hours,
                    linkedin_url: formData.linkedin_url,
                    personal_website_url: formData.personal_website_url,
                    google_scholar_url: formData.google_scholar_url,
                    orcid_id: formData.orcid_id,
                    scopus_id: formData.scopus_id,
                    research_gate_url: formData.research_gate_url,
                    bio_summary: formData.bio_summary,
                    profile_image: formData.profile_image
                },
                education: formData.education.filter(edu => 
                    edu.degree || edu.institute || edu.subject || edu.year
                ),
                research_interests: formData.research_interests.filter(interest => 
                    interest && interest.trim()
                ),
                publications: formData.publications.filter(pub => 
                    pub.title && pub.title.trim()
                )
            };

            console.log('Saving faculty data:', updateData);

            // Call the bulk update API
            const response = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            // Check if response is ok before trying to parse JSON
            if (!response.ok) {
                if (response.status === 403) {
                    // Try to re-authenticate
                    console.log('Authentication failed, attempting auto-login...');
                    await autoLogin();
                    
                    // Retry the request with new token
                    const newToken = localStorage.getItem('token');
                    if (newToken) {
                        const retryResponse = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newToken}`
                            },
                            body: JSON.stringify(updateData)
                        });
                        
                        if (retryResponse.ok) {
                            const retryResult = await retryResponse.json();
                            if (retryResult.success) {
                                alert('Faculty profile updated successfully!');
                                navigate(`/faculty/${id}`);
                                return;
                            }
                        }
                    }
                    throw new Error('Authentication failed. Please refresh the page and try again.');
                }
                
                // For other errors, try to get error message from response
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || `HTTP Error ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();

            if (result.success) {
                alert('Faculty profile updated successfully!');
                // Navigate back to faculty details page
                navigate(`/faculty/${id}`);
            } else {
                throw new Error(result.error || 'Failed to update faculty profile');
            }
        } catch (error) {
            console.error('Error saving faculty data:', error);
            alert(`Failed to save changes: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'personal', label: 'Personal Information', icon: 'fas fa-user' },
        { id: 'contact', label: 'Contact Information', icon: 'fas fa-envelope' },
        { id: 'academic', label: 'Academic Information', icon: 'fas fa-graduation-cap' },
        { id: 'research', label: 'Research & Publications', icon: 'fas fa-microscope' },
        { id: 'social', label: 'Social Links', icon: 'fas fa-link' }
    ];

    if (loading) {
        return (
            <div className={`faculty-edit-page ${theme}`} data-theme={theme}>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading faculty information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`faculty-edit-page ${theme}`} data-theme={theme}>
            <div className="faculty-edit-container">
                {/* Header */}
                <div className="faculty-edit-header">
                    <button 
                        className="back-button"
                        onClick={() => navigate(`/faculty/${id}`)}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Back to Profile
                    </button>
                    <h1>Edit Faculty Profile</h1>
                    <div className="header-actions">
                        <button 
                            className="save-button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={tab.icon}></i>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Personal Information Tab */}
                    {activeTab === 'personal' && (
                        <div className="form-section">
                            <h2>Personal Information</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Honorific</label>
                                    <select
                                        value={formData.honorific}
                                        onChange={(e) => handleInputChange('honorific', e.target.value)}
                                    >
                                        <option value="">Select Honorific</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="Prof.">Prof.</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Mrs.">Mrs.</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.date_of_birth ? formData.date_of_birth.split('T')[0] : ''}
                                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Designation <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.designation}
                                        onChange={(e) => handleInputChange('designation', e.target.value)}
                                        placeholder="Enter designation"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Department <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => handleInputChange('department', e.target.value)}
                                        placeholder="Enter department"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Date of Joining</label>
                                    <input
                                        type="date"
                                        value={formData.date_of_joining ? formData.date_of_joining.split('T')[0] : ''}
                                        onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Experience</label>
                                    <textarea
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                        placeholder="Enter research/teaching experience"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Information Tab */}
                    {activeTab === 'contact' && (
                        <div className="form-section">
                            <h2>Contact Information</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>
                                        Email <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Mobile Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone_mobile}
                                        onChange={(e) => handleInputChange('phone_mobile', e.target.value)}
                                        placeholder="Enter mobile number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Extension Number</label>
                                    <input
                                        type="text"
                                        value={formData.extension_no}
                                        onChange={(e) => handleInputChange('extension_no', e.target.value)}
                                        placeholder="Enter extension number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Office Location</label>
                                    <input
                                        type="text"
                                        value={formData.office_location}
                                        onChange={(e) => handleInputChange('office_location', e.target.value)}
                                        placeholder="Enter office location"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Office Hours</label>
                                    <input
                                        type="text"
                                        value={formData.office_hours}
                                        onChange={(e) => handleInputChange('office_hours', e.target.value)}
                                        placeholder="e.g., Monday-Friday: 10:00 AM - 5:00 PM"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Enter complete address"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Academic Information Tab */}
                    {activeTab === 'academic' && (
                        <div className="form-section">
                            <h2>Academic Information</h2>
                            
                            {/* Education Section */}
                            <div className="dynamic-section">
                                <div className="section-header">
                                    <h3>Education</h3>
                                    <button
                                        type="button"
                                        className="add-button"
                                        onClick={addEducation}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Add Education
                                    </button>
                                </div>

                                {formData.education.map((edu, index) => (
                                    <div key={index} className="dynamic-item">
                                        <div className="item-header">
                                            <h4>Education {index + 1}</h4>
                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={() => removeEducation(index)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Degree</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree || ''}
                                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                    placeholder="e.g., Ph.D., M.Tech, B.Tech"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Institute</label>
                                                <input
                                                    type="text"
                                                    value={edu.institute || ''}
                                                    onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                                                    placeholder="Enter institute name"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Subject/Specialization</label>
                                                <input
                                                    type="text"
                                                    value={edu.subject || ''}
                                                    onChange={(e) => handleEducationChange(index, 'subject', e.target.value)}
                                                    placeholder="Enter subject or specialization"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Year</label>
                                                <input
                                                    type="number"
                                                    value={edu.year || ''}
                                                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                    placeholder="Enter completion year"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Grade/Percentage</label>
                                                <input
                                                    type="text"
                                                    value={edu.grade_percentage || ''}
                                                    onChange={(e) => handleEducationChange(index, 'grade_percentage', e.target.value)}
                                                    placeholder="Enter grade or percentage"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Research & Publications Tab */}
                    {activeTab === 'research' && (
                        <div className="form-section">
                            <h2>Research & Publications</h2>
                            
                            {/* Bio Summary */}
                            <div className="form-group full-width">
                                <label>Bio Summary</label>
                                <textarea
                                    value={formData.bio_summary}
                                    onChange={(e) => handleInputChange('bio_summary', e.target.value)}
                                    placeholder="Enter bio summary"
                                    rows="4"
                                />
                            </div>

                            {/* Research Interests */}
                            <div className="dynamic-section">
                                <div className="section-header">
                                    <h3>Research Interests</h3>
                                    <button
                                        type="button"
                                        className="add-button"
                                        onClick={() => addArrayItem('research_interests', '')}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Add Interest
                                    </button>
                                </div>

                                {formData.research_interests.map((interest, index) => (
                                    <div key={index} className="array-item">
                                        <input
                                            type="text"
                                            value={interest}
                                            onChange={(e) => handleArrayFieldChange('research_interests', index, e.target.value)}
                                            placeholder="Enter research interest"
                                        />
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => removeArrayItem('research_interests', index)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Publications */}
                            <div className="dynamic-section">
                                <div className="section-header">
                                    <h3>Publications</h3>
                                    <button
                                        type="button"
                                        className="add-button"
                                        onClick={addPublication}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Add Publication
                                    </button>
                                </div>

                                {formData.publications.map((pub, index) => (
                                    <div key={index} className="dynamic-item">
                                        <div className="item-header">
                                            <h4>Publication {index + 1}</h4>
                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={() => removePublication(index)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={pub.title || ''}
                                                    onChange={(e) => handlePublicationChange(index, 'title', e.target.value)}
                                                    placeholder="Enter publication title"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Journal Name</label>
                                                <input
                                                    type="text"
                                                    value={pub.journal_name || ''}
                                                    onChange={(e) => handlePublicationChange(index, 'journal_name', e.target.value)}
                                                    placeholder="Enter journal name"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Year</label>
                                                <input
                                                    type="number"
                                                    value={pub.publication_year || ''}
                                                    onChange={(e) => handlePublicationChange(index, 'publication_year', e.target.value)}
                                                    placeholder="Enter publication year"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>DOI</label>
                                                <input
                                                    type="text"
                                                    value={pub.doi || ''}
                                                    onChange={(e) => handlePublicationChange(index, 'doi', e.target.value)}
                                                    placeholder="Enter DOI"
                                                />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Publication Details</label>
                                                <textarea
                                                    value={pub.publication_details || ''}
                                                    onChange={(e) => handlePublicationChange(index, 'publication_details', e.target.value)}
                                                    placeholder="Enter additional details"
                                                    rows="2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Social Links Tab */}
                    {activeTab === 'social' && (
                        <div className="form-section">
                            <h2>Social Links</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>LinkedIn</label>
                                    <input
                                        type="url"
                                        value={formData.linkedin_url}
                                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Personal Website</label>
                                    <input
                                        type="url"
                                        value={formData.personal_website_url}
                                        onChange={(e) => handleInputChange('personal_website_url', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Google Scholar</label>
                                    <input
                                        type="url"
                                        value={formData.google_scholar_url}
                                        onChange={(e) => handleInputChange('google_scholar_url', e.target.value)}
                                        placeholder="https://scholar.google.com/citations?user=..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>ORCID</label>
                                    <input
                                        type="text"
                                        value={formData.orcid_id}
                                        onChange={(e) => handleInputChange('orcid_id', e.target.value)}
                                        placeholder="0000-0000-0000-0000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Scopus ID</label>
                                    <input
                                        type="text"
                                        value={formData.scopus_id}
                                        onChange={(e) => handleInputChange('scopus_id', e.target.value)}
                                        placeholder="Enter Scopus ID"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>ResearchGate</label>
                                    <input
                                        type="url"
                                        value={formData.research_gate_url}
                                        onChange={(e) => handleInputChange('research_gate_url', e.target.value)}
                                        placeholder="https://researchgate.net/profile/..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="faculty-edit-footer">
                    <button 
                        className="cancel-button"
                        onClick={() => navigate(`/faculty/${id}`)}
                    >
                        <i className="fas fa-times"></i>
                        Cancel
                    </button>
                    <button 
                        className="save-button"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacultyEdit;
