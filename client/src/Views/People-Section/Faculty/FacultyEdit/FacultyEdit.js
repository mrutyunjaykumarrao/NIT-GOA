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
            const token = localStorage.getItem('authToken');
            
            // Load data from our new modular APIs
            const [profileSummary, personalInfo, contactInfo, socialLinks, education, researchAreas] = await Promise.all([
                // Core profile summary
                fetch(`/api/faculty/core/${id}/profile-summary`).then(r => r.json()),
                // Personal information
                fetch(`/api/faculty/profile/${id}/personal`).then(r => r.json()),
                // Contact information  
                fetch(`/api/faculty/profile/${id}/contact`).then(r => r.json()),
                // Social links (using the dedicated social endpoint)
                fetch(`/api/faculty/social/${id}/social-links`).then(r => r.json()),
                // Education
                fetch(`/api/faculty/academic/${id}/education`).then(r => r.json()),
                // Research areas (fixed endpoint name)
                fetch(`/api/faculty/academic/${id}/research-areas`).then(r => r.json())
            ]);
            
            console.log('Fetched data:', { profileSummary, personalInfo, contactInfo, socialLinks, education, researchAreas });
            
            // Construct faculty object for backwards compatibility
            const facultyData = {
                personalInformation: {
                    full_name: personalInfo.full_name,
                    honorific: personalInfo.honorific,
                    gender: personalInfo.gender,
                    birthDate: personalInfo.date_of_birth,
                    designation: personalInfo.designation,
                    designation_id: personalInfo.designation_id,
                    department: personalInfo.department,
                    department_id: personalInfo.department_id,
                    dateOfJoining: personalInfo.date_of_joining,
                    experience: personalInfo.research_teaching_experience,
                    is_hod: personalInfo.is_hod,
                    employment_status: personalInfo.employment_status,
                    bio_summary: personalInfo.bio_summary,
                    research_interests: personalInfo.research_interests
                },
                contactInformation: {
                    email: contactInfo.email,
                    phoneMobile: contactInfo.phone_mobile,
                    phoneResidence: contactInfo.phone_residence,
                    extension_no: contactInfo.extension_no,
                    address: contactInfo.address,
                    officeLocation: contactInfo.office_location,
                    officeHours: contactInfo.office_hours
                },
                socialLinks: {
                    linkedin: socialLinks.linkedin_url || '',
                    website: socialLinks.personal_website_url || '',
                    googleScholar: socialLinks.google_scholar_url || '',
                    orcid: socialLinks.orcid_id || '',
                    scopus: socialLinks.scopus_id || '',
                    researchGate: socialLinks.research_gate_url || ''
                },
                academicInformation: education || [],
                researchInterests: researchAreas.research_areas || [],
                profile: {
                    profile_image: personalInfo.profile_image,
                    name: profileSummary.name,
                    employee_code: profileSummary.employee_code
                }
            };
            
            setFaculty(facultyData);
            populateFormData(facultyData);
            
        } catch (error) {
            console.error('Error fetching faculty data:', error);
            alert('Error loading faculty data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const populateFormData = (data) => {
        console.log('Populating form with data:', data);
        
        setFormData({
            // Personal Information
            employee_code: data.profile?.employee_code || '',
            full_name: data.personalInformation?.full_name || '',
            honorific: data.personalInformation?.honorific || '',
            gender: data.personalInformation?.gender || '',
            date_of_birth: data.personalInformation?.birthDate ? 
                data.personalInformation.birthDate.split('T')[0] : '',
            designation: data.personalInformation?.designation || '',
            designation_id: data.personalInformation?.designation_id || '',
            department: data.personalInformation?.department || '',
            department_id: data.personalInformation?.department_id || '',
            date_of_joining: data.personalInformation?.dateOfJoining ? 
                data.personalInformation.dateOfJoining.split('T')[0] : '',
            research_teaching_experience: data.personalInformation?.experience || '',
            is_hod: data.personalInformation?.is_hod || false,
            employment_status: data.personalInformation?.employment_status || '',
            bio_summary: data.personalInformation?.bio_summary || '',
            
            // Contact Information
            email: data.contactInformation?.email || '',
            phone_mobile: data.contactInformation?.phoneMobile || '',
            phone_residence: data.contactInformation?.phoneResidence || '',
            extension_no: data.contactInformation?.extension_no || '',
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
            research_interests: data.researchInterests || [],
            research_areas: data.researchInterests || [],
            
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

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            // Save to different modular endpoints based on data changes
            const savePromises = [];

            // 1. Personal Information
            const personalData = {
                full_name: formData.full_name,
                honorific: formData.honorific,
                gender: formData.gender,
                date_of_birth: formData.date_of_birth,
                designation_id: formData.designation_id,
                department_id: formData.department_id,
                date_of_joining: formData.date_of_joining,
                research_teaching_experience: formData.research_teaching_experience,
                is_hod: formData.is_hod,
                employment_status: formData.employment_status
            };

            savePromises.push(
                fetch(`/api/faculty/profile/${id}/personal`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(personalData)
                })
            );

            // 2. Contact Information
            const contactData = {
                email: formData.email,
                phone_mobile: formData.phone_mobile,
                extension_no: formData.extension_no,
                address: formData.address,
                office_location: formData.office_location,
                office_hours: formData.office_hours
            };

            savePromises.push(
                fetch(`/api/faculty/profile/${id}/contact`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(contactData)
                })
            );

            // 3. Social Links
            const socialData = {
                linkedin_url: formData.linkedin_url,
                personal_website_url: formData.personal_website_url,
                google_scholar_url: formData.google_scholar_url,
                orcid_id: formData.orcid_id,
                scopus_id: formData.scopus_id,
                research_gate_url: formData.research_gate_url
            };

            savePromises.push(
                fetch(`/api/faculty/social/${id}/social-links`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(socialData)
                })
            );

            // 4. Education
            if (formData.education && formData.education.length > 0) {
                const educationData = {
                    education: formData.education.filter(edu => 
                        edu.degree || edu.institute || edu.discipline || edu.graduation_year
                    )
                };

                savePromises.push(
                    fetch(`/api/faculty/academic/${id}/education`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(educationData)
                    })
                );
            }

            // 5. Research Interests
            const researchInterests = Array.isArray(formData.research_interests) 
                ? formData.research_interests.filter(interest => interest && interest.trim())
                : (typeof formData.research_interests === 'string' && formData.research_interests.trim())
                    ? formData.research_interests.split(',').map(s => s.trim()).filter(s => s)
                    : [];

            if (researchInterests.length > 0) {
                savePromises.push(
                    fetch(`/api/faculty/academic/${id}/research-interests`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ research_interests: researchInterests })
                    })
                );
            }

            // 6. Handle image upload separately if there's a selected image
            if (formData.selectedImage) {
                const imageFormData = new FormData();
                imageFormData.append('image', formData.selectedImage);

                savePromises.push(
                    fetch(`/api/faculty/profile/${id}/image`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`
                            // Don't set Content-Type for FormData
                        },
                        body: imageFormData
                    })
                );
            }

            console.log('Saving faculty data to modular APIs...');

            // Execute all save operations
            const responses = await Promise.all(savePromises);

            // Check if all responses are successful
            const failedResponses = responses.filter(response => !response.ok);
            
            if (failedResponses.length > 0) {
                console.error('Some updates failed:', failedResponses);
                
                // Try to get error details
                const errorMessages = await Promise.all(
                    failedResponses.map(async (response) => {
                        try {
                            const errorData = await response.json();
                            return errorData.error || `HTTP ${response.status}`;
                        } catch {
                            return `HTTP ${response.status}`;
                        }
                    })
                );
                
                throw new Error(`Some changes could not be saved: ${errorMessages.join(', ')}`);
            }

            // All successful
            alert('Faculty information updated successfully!');
            console.log('All faculty data saved successfully using modular APIs');

            // Navigate back to faculty details page
            navigate(`/faculty/${id}`);

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
