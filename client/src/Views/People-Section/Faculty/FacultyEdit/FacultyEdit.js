import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import './FacultyEdit.css';

// Import new enhanced form components and CSS
import '../../../../components/FacultyEditForm/FacultyEditComponents.css';
import PersonalInformationSection from '../../../../components/FacultyEditForm/PersonalInformationSection';
import ContactInformationSection from '../../../../components/FacultyEditForm/ContactInformationSection';
import ResearchAreasSection from '../../../../components/FacultyEditForm/ResearchAreasSection';
import CoursesTaughtSection from '../../../../components/FacultyEditForm/CoursesTaughtSection';
import AcademicInformationSection from '../../../../components/FacultyEditForm/AcademicInformationSection';

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
        research_teaching_experience: '',
        
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
        const initializePage = async () => {
            console.log('Initializing faculty edit page...');
            const authSuccess = await ensureAuthentication();
            if (authSuccess) {
                console.log('Authentication successful, fetching faculty data...');
                await fetchFacultyData();
            } else {
                console.error('Authentication failed, cannot load faculty data');
                alert('Unable to authenticate. Please refresh the page and try again.');
            }
        };
        
        initializePage();
    }, [id]);

    // Ensure authentication
    const ensureAuthentication = async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.log('No token found, attempting auto-login...');
            const loginSuccess = await autoLogin();
            if (!loginSuccess) {
                console.error('Failed to authenticate');
                return false;
            }
        } else {
            // Verify token is still valid
            try {
                const response = await fetch('/api/auth/validate', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    console.log('Token invalid, attempting auto-login...');
                    const loginSuccess = await autoLogin();
                    if (!loginSuccess) {
                        console.error('Failed to re-authenticate');
                        return false;
                    }
                }
            } catch (error) {
                console.log('Token validation failed, attempting auto-login...');
                const loginSuccess = await autoLogin();
                if (!loginSuccess) {
                    console.error('Failed to re-authenticate');
                    return false;
                }
            }
        }
        return true;
    };

    // Auto-login function for development/testing
    const autoLogin = async () => {
        try {
            console.log('Attempting auto-login...');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password: 'admin123' })
            });

            if (response.ok) {
                const data = await response.json();
                // Use consistent storage keys with AuthContext
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log('Auto-login successful:', data.user);
                return true;
            } else {
                console.error('Auto-login failed with status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Auto-login failed:', error);
            return false;
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
            full_name: data.personalInformation?.full_name || '',
            honorific: data.personalInformation?.honorific || '',
            gender: data.personalInformation?.gender || '',
            date_of_birth: data.personalInformation?.birthDate || '',
            designation: data.personalInformation?.designation || '',
            designation_id: data.personalInformation?.designation_id || '',
            department: data.personalInformation?.department || '',
            department_id: data.personalInformation?.department_id || '',
            date_of_joining: data.personalInformation?.dateOfJoining || '',
            research_teaching_experience: data.personalInformation?.experience || '',
            is_hod: data.personalInformation?.is_hod || false,
            employment_status: data.personalInformation?.employment_status || '',
            
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
            const token = localStorage.getItem('authToken');
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
                    experience: formData.research_teaching_experience,
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

            // Check if there's a selected image file to upload
            const hasImageFile = formData.selectedImage;
            let response;

            if (hasImageFile) {
                // Use FormData for file upload
                const formDataPayload = new FormData();
                formDataPayload.append('data', JSON.stringify(updateData));
                formDataPayload.append('image', formData.selectedImage);

                response = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Don't set Content-Type for FormData, let browser set it
                    },
                    body: formDataPayload
                });
            } else {
                // Use JSON for regular data update
                response = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                });
            }

            // Check if response is ok before trying to parse JSON
            if (!response.ok) {
                if (response.status === 403) {
                    // Try to re-authenticate
                    console.log('Authentication failed, attempting auto-login...');
                    await autoLogin();
                    
                    // Retry the request with new token
                    const newToken = localStorage.getItem('authToken');
                    if (newToken) {
                        let retryResponse;
                        
                        if (hasImageFile) {
                            const retryFormData = new FormData();
                            retryFormData.append('data', JSON.stringify(updateData));
                            retryFormData.append('image', formData.selectedImage);
                            
                            retryResponse = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${newToken}`
                                },
                                body: retryFormData
                            });
                        } else {
                            retryResponse = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${newToken}`
                                },
                                body: JSON.stringify(updateData)
                            });
                        }
                        
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
        { id: 'research', label: 'Research Areas', icon: 'fas fa-microscope' },
        { id: 'courses', label: 'Courses Taught', icon: 'fas fa-chalkboard-teacher' },
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

                {/* Main Content Area */}
                <div className="faculty-edit-content">
                    {/* Vertical Navigation */}
                    <div className="faculty-edit-vertical-navigation">
                        <nav className="faculty-edit-nav-menu">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`faculty-edit-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <i className={tab.icon}></i>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Form Content */}
                    <div className="faculty-edit-form-content">
                    {/* Personal Information Tab */}
                    {activeTab === 'personal' && (
                        <PersonalInformationSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Contact Information Tab */}
                    {activeTab === 'contact' && (
                        <ContactInformationSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Academic Information Tab */}
                    {activeTab === 'academic' && (
                        <AcademicInformationSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Research & Publications Tab */}
                    {activeTab === 'research' && (
                        <ResearchAreasSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Courses Taught Tab - New tab for our enhanced courses section */}
                    {activeTab === 'courses' && (
                        <CoursesTaughtSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                            employeeCode={id}
                        />
                    )}

                    {/* Social Links Tab */}
                    {activeTab === 'social' && (
                        <div className="faculty-edit-components-form-section">
                            <h2>Social Links</h2>
                            <div className="faculty-edit-form-grid">
                                <div className="faculty-edit-form-group">
                                    <label>LinkedIn</label>
                                    <input
                                        type="url"
                                        value={formData.linkedin_url}
                                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>Personal Website</label>
                                    <input
                                        type="url"
                                        value={formData.personal_website_url}
                                        onChange={(e) => handleInputChange('personal_website_url', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>Google Scholar</label>
                                    <input
                                        type="url"
                                        value={formData.google_scholar_url}
                                        onChange={(e) => handleInputChange('google_scholar_url', e.target.value)}
                                        placeholder="https://scholar.google.com/citations?user=..."
                                    />
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>ORCID</label>
                                    <input
                                        type="text"
                                        value={formData.orcid_id}
                                        onChange={(e) => handleInputChange('orcid_id', e.target.value)}
                                        placeholder="0000-0000-0000-0000"
                                    />
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>Scopus ID</label>
                                    <input
                                        type="text"
                                        value={formData.scopus_id}
                                        onChange={(e) => handleInputChange('scopus_id', e.target.value)}
                                        placeholder="Enter Scopus ID"
                                    />
                                </div>

                                <div className="faculty-edit-form-group">
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
