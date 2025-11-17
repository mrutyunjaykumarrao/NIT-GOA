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
import PublicationsSection from '../../../../components/FacultyEditForm/PublicationsSection';
import ResearchGuidanceSection from '../../../../components/FacultyEditForm/ResearchGuidanceSection';
import MembershipsSection from '../../../../components/FacultyEditForm/MembershipsSection';
import TrainingSection from '../../../../components/FacultyEditForm/TrainingSection';
import SocialLinksSection from '../../../../components/FacultyEditForm/SocialLinksSection';
import CustomSectionsManager from '../../../../components/FacultyEditForm/CustomSectionsManager';
import CustomSectionEntries from '../../../../components/FacultyEditForm/CustomSectionEntries';

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
        research_gate_url: '',
        
        // Academic Information
        education: [],
        
        // Research
        research_interests: [],
        research_areas: [],
        bio_summary: '',
        
        // Publications
        publications: [],
        
        // Courses Taught
        courses_taught: [],
        
        // Memberships
        memberships: [],
        
        // Research Guidance
        research_guidance: [],
        
        // Training
        training_attended: [],
        training_conducted: [],
        
        // Custom Sections
        custom_sections: [],
        
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
            
            // Use new faculty-edit endpoints for complete data
            const [profileRes, educationRes, researchAreasRes, publicationsRes, 
                   researchGuidanceRes, trainingAttendedRes, trainingConductedRes, 
                   membershipsRes, coursesTaughtRes, customSectionsRes] = await Promise.all([
                fetch(`/api/faculty-edit/${id}/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/education`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/research-areas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/publications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/research-guidance`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/training-attended`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/training-conducted`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/memberships`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/courses-taught`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`/api/faculty-edit/${id}/custom-sections`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const [profile, education, researchAreas, publications, 
                   researchGuidance, trainingAttended, trainingConducted, 
                   memberships, coursesTaught, customSections] = await Promise.all([
                profileRes.json(),
                educationRes.json(),
                researchAreasRes.json(),
                publicationsRes.json(),
                researchGuidanceRes.json(),
                trainingAttendedRes.json(),
                trainingConductedRes.json(),
                membershipsRes.json(),
                coursesTaughtRes.json(),
                customSectionsRes.json()
            ]);

            console.log('Fetched profile data:', profile);
            
            if (!profile.success) {
                throw new Error(profile.error || 'Failed to fetch faculty data');
            }

            const data = profile.data;
            
            // Construct faculty object for form population
            const facultyData = {
                personalInformation: {
                    full_name: data.full_name || '',
                    honorific: data.honorific || '',
                    gender: data.gender || '',
                    birthDate: data.date_of_birth || '',
                    designation: data.designation || '',
                    designation_id: data.designation_id || '',
                    department: data.department_name || '',
                    department_id: data.department_id || '',
                    dateOfJoining: data.date_of_joining || '',
                    experience: data.research_teaching_experience || '',
                    is_hod: data.is_hod || false,
                    bio_summary: data.bio_summary || '',
                    research_interests: researchAreas.data?.research_interests || ''
                },
                contactInformation: {
                    email: data.email || '',
                    phoneMobile: data.phone_mobile || '',
                    phoneResidence: data.phone_residence || '',
                    extension_no: data.extension_no || '',
                    address: data.address || '',
                    officeLocation: data.office_location || '',
                    officeHours: data.office_hours || ''
                },
                socialLinks: {
                    linkedin: data.linkedin_url || '',
                    website: data.personal_website_url || '',
                    googleScholar: data.google_scholar_url || '',
                    researchGate: data.research_gate_url || ''
                },
                academicInformation: education.data || [],
                researchInterests: researchAreas.data?.research_interests || '',
                publications: publications.data || [],
                coursesTaught: coursesTaught.data || [],
                memberships: (memberships.data || []).map(m => ({
                    ...m,
                    status: m.is_active === 1 ? 'Active' : 'Inactive'
                })),
                researchGuidance: researchGuidance.data || [],
                trainingAttended: trainingAttended.data || [],
                trainingConducted: trainingConducted.data || [],
                customSections: customSections.data || [],
                profile: {
                    profile_image: data.image_url || '',
                    name: data.full_name || '',
                    employee_code: data.employee_code || ''
                }
            };
            
            console.log('Setting faculty data:', facultyData);
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
        
        const newFormData = {
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
            research_interests: data.personalInformation?.research_interests || '',
            
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
            research_gate_url: data.socialLinks?.researchGate || '',
            
            // Academic Information
            education: data.academicInformation || [],
            
            // Research Areas
            research_areas: data.researchInterests || [],
            
            // Publications
            publications: data.publications || [],
            
            // Courses Taught
            courses_taught: data.coursesTaught || [],
            
            // Memberships
            memberships: data.memberships || [],
            
            // Research Guidance
            research_guidance: data.researchGuidance || [],
            
            // Training
            training_attended: data.trainingAttended || [],
            training_conducted: data.trainingConducted || [],
            
            // Custom Sections
            custom_sections: data.customSections || [],
            
            // Profile
            profile_image: data.profile?.profile_image || ''
        };
        
        console.log('Setting formData to:', newFormData);
        setFormData(newFormData);
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

    const handleSave = async (section = null) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You must be logged in to save changes');
                return;
            }

            // NEW APPROACH: Section-specific saves or save current active tab
            const sectionToSave = section || activeTab;
            let response;
            let successMessage = 'Changes saved successfully!';

            switch (sectionToSave) {
                case 'personal':
                case 'contact':
                    // Combined profile endpoint (personal + contact)
                    const profileData = {
                        full_name: formData.full_name,
                        honorific: formData.honorific,
                        gender: formData.gender,
                        date_of_birth: formData.date_of_birth,
                        designation_id: formData.designation_id,
                        department_id: formData.department_id,
                        date_of_joining: formData.date_of_joining,
                        research_teaching_experience: formData.research_teaching_experience,
                        email: formData.email,
                        phone_mobile: formData.phone_mobile,
                        extension_no: formData.extension_no,
                        address: formData.address,
                        office_location: formData.office_location,
                        office_hours: formData.office_hours,
                        bio_summary: formData.bio_summary,
                        linkedin_url: formData.linkedin_url,
                        personal_website_url: formData.personal_website_url,
                        google_scholar_url: formData.google_scholar_url,
                        research_gate_url: formData.research_gate_url
                    };

                    response = await fetch(`/api/faculty-edit/${id}/profile`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(profileData)
                    });
                    successMessage = 'Profile information updated successfully!';
                    break;

                case 'academic':
                    // Education endpoint
                    const educationData = {
                        education: formData.education.filter(edu => 
                            edu.degree || edu.institute || edu.discipline || edu.graduation_year
                        )
                    };

                    response = await fetch(`/api/faculty-edit/${id}/education`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(educationData)
                    });
                    successMessage = 'Education information updated successfully!';
                    break;

                case 'research':
                    // Research areas endpoint
                    const researchData = {
                        research_interests: Array.isArray(formData.research_interests)
                            ? formData.research_interests.join(', ')
                            : formData.research_interests
                    };

                    response = await fetch(`/api/faculty-edit/${id}/research-areas`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(researchData)
                    });
                    successMessage = 'Research interests updated successfully!';
                    break;

                case 'publications':
                    // Publications endpoint
                    const publicationsData = {
                        publications: formData.publications || []
                    };

                    response = await fetch(`/api/faculty-edit/${id}/publications`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(publicationsData)
                    });
                    successMessage = 'Publications updated successfully!';
                    break;

                case 'research-guidance':
                    // Research Guidance endpoint
                    const researchGuidanceData = {
                        students: formData.research_guidance || []
                    };

                    response = await fetch(`/api/faculty-edit/${id}/research-guidance`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(researchGuidanceData)
                    });
                    successMessage = 'Research guidance updated successfully!';
                    break;

                case 'courses':
                    // Courses Taught endpoint
                    const coursesData = {
                        courses: formData.courses_taught || []
                    };

                    response = await fetch(`/api/faculty-edit/${id}/courses-taught`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(coursesData)
                    });
                    successMessage = 'Courses taught updated successfully!';
                    break;

                case 'memberships':
                    // Memberships endpoint
                    const membershipsData = {
                        memberships: formData.memberships || []
                    };

                    response = await fetch(`/api/faculty-edit/${id}/memberships`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(membershipsData)
                    });
                    successMessage = 'Memberships updated successfully!';
                    break;

                case 'training':
                    // Training endpoints (both attended and conducted)
                    const trainingAttendedData = {
                        training: formData.training_attended || []
                    };
                    const trainingConductedData = {
                        training: formData.training_conducted || []
                    };

                    // Save both in parallel
                    const [attendedResponse, conductedResponse] = await Promise.all([
                        fetch(`/api/faculty-edit/${id}/training-attended`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(trainingAttendedData)
                        }),
                        fetch(`/api/faculty-edit/${id}/training-conducted`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(trainingConductedData)
                        })
                    ]);

                    // Check both responses
                    const attendedResult = await attendedResponse.json();
                    const conductedResult = await conductedResponse.json();

                    if (!attendedResponse.ok || !conductedResponse.ok) {
                        throw new Error('Failed to save training data');
                    }

                    alert('Training data updated successfully!');
                    setSaving(false);
                    return; // Exit early since we handled responses

                case 'social':
                    // Social links are part of profile
                    const socialData = {
                        linkedin_url: formData.linkedin_url,
                        personal_website_url: formData.personal_website_url,
                        google_scholar_url: formData.google_scholar_url,
                        research_gate_url: formData.research_gate_url
                    };

                    response = await fetch(`/api/faculty-edit/${id}/profile`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(socialData)
                    });
                    successMessage = 'Social links updated successfully!';
                    break;

                case 'custom':
                    // Custom sections endpoint
                    const customSectionsData = {
                        sections: formData.custom_sections || []
                    };

                    response = await fetch(`/api/faculty-edit/${id}/custom-sections`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(customSectionsData)
                    });
                    successMessage = 'Custom sections updated successfully!';
                    break;

                default:
                    // Check if it's a custom section entry tab
                    if (sectionToSave.startsWith('custom-')) {
                        // Save specific custom section entries
                        const customSectionsData = {
                            sections: formData.custom_sections || []
                        };

                        response = await fetch(`/api/faculty-edit/${id}/custom-sections`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(customSectionsData)
                        });
                        successMessage = 'Section entries saved successfully!';
                        break;
                    }

                    // Fallback: Use bulk-update for complete save
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
                            research_gate_url: formData.research_gate_url,
                            bio_summary: formData.bio_summary,
                            profile_image: formData.profile_image
                        },
                        education: formData.education.filter(edu => 
                            edu.degree || edu.institute || edu.discipline || edu.graduation_year
                        ),
                        research_interests: Array.isArray(formData.research_interests) 
                            ? formData.research_interests.filter(interest => interest && interest.trim())
                            : (typeof formData.research_interests === 'string' && formData.research_interests.trim())
                                ? formData.research_interests.split(',').map(s => s.trim()).filter(s => s)
                                : [],
                        publications: formData.publications || []
                    };

                    // If there's an image, use FormData
                    if (formData.selectedImage) {
                        const formDataWithImage = new FormData();
                        formDataWithImage.append('data', JSON.stringify(updateData));
                        formDataWithImage.append('image', formData.selectedImage);

                        response = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: formDataWithImage
                        });
                    } else {
                        response = await fetch(`/api/faculty-edit/${id}/bulk-update`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(updateData)
                        });
                    }
                    successMessage = 'All changes saved successfully!';
                    break;
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save changes');
            }

            alert(successMessage);
            console.log('Faculty data saved successfully:', result);

            // Optionally refresh data to show saved changes
            if (sectionToSave === 'all') {
                // If saving all, navigate back
                navigate(`/people/faculty/${id}`);
            } else {
                // If saving a section, refresh that section's data
                await fetchFacultyData();
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
        { id: 'publications', label: 'Publications', icon: 'fas fa-book' },
        { id: 'research-guidance', label: 'Research Guidance', icon: 'fas fa-user-graduate' },
        { id: 'courses', label: 'Courses Taught', icon: 'fas fa-chalkboard-teacher' },
        { id: 'memberships', label: 'Memberships', icon: 'fas fa-certificate' },
        { id: 'training', label: 'Training & Workshops', icon: 'fas fa-chalkboard' },
        { id: 'social', label: 'Social Links', icon: 'fas fa-link' },
        // Add custom sections dynamically
        ...(formData.custom_sections || []).map(section => ({
            id: `custom-${section.section_id || section.section_title}`,
            label: section.section_title,
            icon: 'fas fa-layer-group',
            isCustom: true,
            sectionData: section
        })),
        { id: 'custom', label: 'Custom Sections', icon: 'fas fa-plus-circle' }
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
                            className="save-section-button"
                            onClick={() => handleSave()}
                            disabled={saving}
                            title="Save current section only"
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Save Section
                                </>
                            )}
                        </button>
                        <button 
                            className="save-all-button"
                            onClick={() => handleSave('all')}
                            disabled={saving}
                            title="Save all changes and return to profile"
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-double"></i>
                                    Save All & Exit
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

                    {/* Publications Tab */}
                    {activeTab === 'publications' && (
                        <PublicationsSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Research Guidance Tab */}
                    {activeTab === 'research-guidance' && (
                        <ResearchGuidanceSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Memberships Tab */}
                    {activeTab === 'memberships' && (
                        <MembershipsSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Training & Workshops Tab */}
                    {activeTab === 'training' && (
                        <TrainingSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Social Links Tab */}
                    {activeTab === 'social' && (
                        <SocialLinksSection 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}

                    {/* Dynamic Custom Section Entries Tabs */}
                    {activeTab.startsWith('custom-') && (() => {
                        // Extract section identifier from activeTab
                        const sectionIdentifier = activeTab.replace('custom-', '');
                        
                        // Find the section data from formData
                        const section = formData.custom_sections?.find(s => 
                            s.section_id?.toString() === sectionIdentifier || 
                            s.section_title === sectionIdentifier
                        );
                        
                        return (
                            <CustomSectionEntries 
                                sectionData={section}
                                formData={formData}
                                setFormData={setFormData}
                                loading={loading}
                            />
                        );
                    })()}

                    {/* Custom Sections Manager Tab */}
                    {activeTab === 'custom' && (
                        <CustomSectionsManager 
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                            employeeCode={id}
                        />
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyEdit;
