import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import './FacultyDetailsNew.css';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const FacultyDetailsNew = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    // State for faculty data
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for expandable sections
    const [expandedSections, setExpandedSections] = useState({});

    // State for dynamic section data
    const [sectionData, setSectionData] = useState({
        qualifications: [],
        publications: [],
        courses: [],
        research_guidance: [],
        funded_projects: [],
        awards: [],
        memberships: [],
        professional_services: [],
        training_attended: [],
        training_conducted: []
    });

    // Function to get the correct image path
    const getImagePath = (imageName, department) => {
        if (!imageName || imageName === 'NULL') {
            return 'https://via.placeholder.com/386x380/E5E7EB/6B7280?text=Faculty';
        }
        
        if (imageName.startsWith('http') || imageName.startsWith('/')) {
            return imageName;
        }
        
        const deptFolders = {
            'CSE': 'CSE', 'ECE': 'ECE', 'EEE': 'EEE',
            'MCE': 'MCE', 'CVE': 'CVE', 'APS': 'APS', 'HSS': 'HSS'
        };
        
        const deptFolder = deptFolders[department] || department;
        try {
            return require(`../../../../assets/images/Faculty/${deptFolder}/${imageName}`);
        } catch (error) {
            console.warn(`Could not load image: ${imageName} for department: ${department}`);
            return 'https://via.placeholder.com/386x380/E5E7EB/6B7280?text=Faculty';
        }
    };

    // Function to get full department name
    const getDepartmentFullName = (code) => {
        const deptMap = {
            'CSE': 'Department of Computer Science and Engineering',
            'ECE': 'Department of Electronics & Communication Engineering',
            'EEE': 'Department of Electrical & Electronics Engineering',
            'MCE': 'Department of Mechanical Engineering',
            'CVE': 'Department of Civil Engineering',
            'APS': 'Department of Applied Sciences',
            'HSS': 'Department of Humanities & Social Sciences'
        };
        return deptMap[code] || code;
    };

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Function to calculate experience
    const calculateExperience = (joiningDate) => {
        if (!joiningDate) return 'Not specified';
        try {
            const joining = new Date(joiningDate);
            const today = new Date();
            const years = Math.floor((today - joining) / (365.25 * 24 * 60 * 60 * 1000));
            return `${years} years of Teaching and Research Experience at NIT Goa`;
        } catch (error) {
            return 'Not specified';
        }
    };

    // Fetch faculty basic data
    const fetchFacultyData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/faculty/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFaculty(data);
        } catch (err) {
            console.error('Error fetching faculty data:', err);
            setError('Failed to load faculty information.');
        }
    };

    // Fetch section data dynamically
    const fetchSectionData = async () => {
        try {
            const endpoints = [
                { key: 'qualifications', url: `${API_BASE_URL}/faculty/${id}/academic-info` },
                { key: 'publications', url: `${API_BASE_URL}/faculty/${id}/publications` },
                { key: 'courses', url: `${API_BASE_URL}/faculty/${id}/courses-taught` },
                { key: 'research_guidance', url: `${API_BASE_URL}/faculty/${id}/research-guidance` },
                { key: 'funded_projects', url: `${API_BASE_URL}/faculty/${id}/funded-projects` },
                { key: 'awards', url: `${API_BASE_URL}/faculty/${id}/awards` },
                { key: 'memberships', url: `${API_BASE_URL}/faculty/${id}/memberships` },
                { key: 'professional_services', url: `${API_BASE_URL}/faculty/${id}/professional-services` },
                { key: 'training_attended', url: `${API_BASE_URL}/faculty/${id}/courses-attended` },
                { key: 'training_conducted', url: `${API_BASE_URL}/faculty/${id}/courses-conducted` }
            ];

            const sectionResults = {};
            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint.url);
                    if (response.ok) {
                        const data = await response.json();
                        sectionResults[endpoint.key] = Array.isArray(data) ? data : [];
                    } else {
                        sectionResults[endpoint.key] = [];
                    }
                } catch (error) {
                    console.warn(`Failed to fetch ${endpoint.key}:`, error);
                    sectionResults[endpoint.key] = [];
                }
            }

            setSectionData(sectionResults);
        } catch (err) {
            console.error('Error fetching section data:', err);
        }
    };

    // Load all data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchFacultyData(), fetchSectionData()]);
            setLoading(false);
        };

        if (id) {
            loadData();
        }
    }, [id]);

    // Toggle section expansion
    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    // Define available sections with their display names and data checks
    const availableSections = [
        {
            key: 'research',
            title: 'Research Areas',
            hasData: faculty?.research_areas && faculty.research_areas.trim() !== '',
            isSimple: true
        },
        {
            key: 'qualifications',
            title: 'Academic Information',
            hasData: sectionData.qualifications && sectionData.qualifications.length > 0,
            isSimple: false
        },
        {
            key: 'courses',
            title: 'Courses Taught',
            hasData: sectionData.courses && sectionData.courses.length > 0,
            isSimple: false
        },
        {
            key: 'publications',
            title: 'Publications',
            hasData: sectionData.publications && sectionData.publications.length > 0,
            isSimple: false
        },
        {
            key: 'research_guidance',
            title: 'Research Guidance',
            hasData: sectionData.research_guidance && sectionData.research_guidance.length > 0,
            isSimple: false
        },
        {
            key: 'funded_projects',
            title: 'Funded Research Projects',
            hasData: sectionData.funded_projects && sectionData.funded_projects.length > 0,
            isSimple: false
        },
        {
            key: 'awards',
            title: 'Awards and Honors',
            hasData: sectionData.awards && sectionData.awards.length > 0,
            isSimple: false
        },
        {
            key: 'memberships',
            title: 'Professional Memberships',
            hasData: sectionData.memberships && sectionData.memberships.length > 0,
            isSimple: false
        },
        {
            key: 'professional_services',
            title: 'Professional Services',
            hasData: sectionData.professional_services && sectionData.professional_services.length > 0,
            isSimple: false
        },
        {
            key: 'training_attended',
            title: 'Training/Conferences Attended',
            hasData: sectionData.training_attended && sectionData.training_attended.length > 0,
            isSimple: false
        },
        {
            key: 'training_conducted',
            title: 'Training/Conferences Conducted',
            hasData: sectionData.training_conducted && sectionData.training_conducted.length > 0,
            isSimple: false
        }
    ];

    // Render section content
    const renderSectionContent = (section) => {
        if (section.key === 'research') {
            return (
                <div className="section-content">
                    <p>{faculty.research_areas}</p>
                </div>
            );
        }

        const data = sectionData[section.key];
        if (!data || data.length === 0) return null;

        return (
            <div className="section-content">
                {section.key === 'publications' && (
                    <div>
                        {data.map((item, index) => (
                            <div key={index} className="publication-item">
                                <div className="publication-title">{item.title}</div>
                                <div className="publication-details">
                                    {item.authors && <div><strong>Authors:</strong> {item.authors}</div>}
                                    {item.journal && <div><strong>Journal:</strong> {item.journal}</div>}
                                    {item.conference && <div><strong>Conference:</strong> {item.conference}</div>}
                                    {item.publisher && <div><strong>Publisher:</strong> {item.publisher}</div>}
                                    {item.isbn && <div><strong>ISBN:</strong> {item.isbn}</div>}
                                    {item.doi && <div><strong>DOI:</strong> {item.doi}</div>}
                                </div>
                                {item.year && <div className="publication-year">Year: {item.year}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {section.key === 'courses' && (
                    <div>
                        {data.map((item, index) => (
                            <div key={index} className="course-item">
                                <div className="course-title">{item.course_name}</div>
                                <div className="course-details">
                                    {item.course_code && <div><strong>Course Code:</strong> {item.course_code}</div>}
                                    {item.semester && <div><strong>Semester:</strong> {item.semester}</div>}
                                    {item.academic_year && <div><strong>Academic Year:</strong> {item.academic_year}</div>}
                                    {item.level && <div><strong>Level:</strong> {item.level}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(section.key === 'qualifications' || section.key === 'research_guidance' || 
                  section.key === 'funded_projects' || section.key === 'awards' || 
                  section.key === 'memberships' || section.key === 'professional_services' ||
                  section.key === 'training_attended' || section.key === 'training_conducted') && (
                    <ul className="content-list">
                        {data.map((item, index) => (
                            <li key={index}>
                                {typeof item === 'string' ? item : 
                                 item.title || item.name || item.description || 
                                 item.degree || item.qualification || 
                                 item.organization || item.institution || 
                                 item.award_name || item.position ||
                                 JSON.stringify(item)}
                                {item.year && ` (${item.year})`}
                                {item.date && ` (${formatDate(item.date)})`}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="faculty-details-page">
                <div className="faculty-details-container">
                    <div className="loading-state">
                        Loading faculty details...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !faculty) {
        return (
            <div className="faculty-details-page">
                <div className="faculty-details-container">
                    <div className="error-state">
                        <p>{error || 'Faculty not found'}</p>
                        <button className="retry-btn" onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`faculty-details-page ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="faculty-details-container">
                {/* Back Button */}
                <button className="back-button" onClick={() => navigate('/faculty')}>
                    <i className="fas fa-arrow-left"></i>
                    Back to Faculty
                </button>

                {/* Main Content */}
                <div className="faculty-main-content">
                    {/* Left Column - Faculty Image and Basic Info */}
                    <div className="faculty-left-column">
                        <img 
                            src={getImagePath(faculty.profile_image, faculty.department)} 
                            alt={faculty.full_name}
                            className="faculty-detail-image"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/386x380/E5E7EB/6B7280?text=Faculty';
                            }}
                        />
                        <div className="faculty-title-section">
                            <h2 className="faculty-designation">{faculty.designation}</h2>
                            <h1 className="faculty-name">{faculty.full_name}</h1>
                            <p className="faculty-department">{getDepartmentFullName(faculty.department)}</p>
                            
                            {/* Social Links */}
                            <div className="social-links">
                                {faculty.linkedin_url && (
                                    <a href={faculty.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                )}
                                {faculty.google_scholar_url && (
                                    <a href={faculty.google_scholar_url} target="_blank" rel="noopener noreferrer" className="social-link google-scholar">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-3.926-.333-5.441-1.486-1.515 1.153-3.339 1.63-5.441 1.486-1.126-.077-1.779-.999-1.779-2.177 0-1.515 1.291-2.61 2.806-2.61.486 0 .927.099 1.368.297-.198-.594-.297-1.242-.297-1.89 0-2.007 1.593-3.69 3.6-3.69s3.6 1.683 3.6 3.69c0 .648-.099 1.296-.297 1.89.441-.198.882-.297 1.368-.297 1.515 0 2.806 1.095 2.806 2.61 0 1.178-.653 2.1-1.779 2.177z"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="faculty-right-column">
                        {/* Personal Information Section */}
                        <div className="personal-information-section">
                            <div className="section-header-main">
                                <h2>Personal Information</h2>
                            </div>
                            <div className="personal-info-grid">
                                <div className="info-item">
                                    <span className="info-label">Name:</span>
                                    <span className="info-value">{faculty.full_name}</span>
                                </div>
                                {faculty.gender && (
                                    <div className="info-item">
                                        <span className="info-label">Gender:</span>
                                        <span className="info-value">{faculty.gender}</span>
                                    </div>
                                )}
                                {faculty.date_of_birth && (
                                    <div className="info-item">
                                        <span className="info-label">Birth Date:</span>
                                        <span className="info-value">{formatDate(faculty.date_of_birth)}</span>
                                    </div>
                                )}
                                <div className="info-item">
                                    <span className="info-label">Designation:</span>
                                    <span className="info-value">{faculty.designation}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Department:</span>
                                    <span className="info-value">{getDepartmentFullName(faculty.department)}</span>
                                </div>
                                {faculty.date_of_joining && (
                                    <div className="info-item">
                                        <span className="info-label">Date of Joining:</span>
                                        <span className="info-value">{formatDate(faculty.date_of_joining)}</span>
                                    </div>
                                )}
                                <div className="info-item">
                                    <span className="info-label">Research/Teaching Experience:</span>
                                    <span className="info-value">
                                        {faculty.experience_description || calculateExperience(faculty.date_of_joining)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="contact-information-section">
                            <div className="section-header-main">
                                <h2>Contact Information</h2>
                            </div>
                            <div className="contact-info-grid">
                                <div className="contact-item full-width">
                                    <span className="contact-label">Address:</span>
                                    <span className="contact-value">
                                        {faculty.office_address || 
                                        "Department of Computer Science & Engineering, National Institute of Technology Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703"}
                                    </span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Email Address:</span>
                                    <span className="contact-value">
                                        <a href={`mailto:${faculty.email}`}>{faculty.email}</a>
                                    </span>
                                </div>
                                {faculty.phone && (
                                    <div className="contact-item">
                                        <span className="contact-label">Phone [Residence]:</span>
                                        <span className="contact-value">{faculty.phone}</span>
                                    </div>
                                )}
                                {faculty.mobile && (
                                    <div className="contact-item">
                                        <span className="contact-label">Phone [Mobile]:</span>
                                        <span className="contact-value">{faculty.mobile}</span>
                                    </div>
                                )}
                                {faculty.office_extension && (
                                    <div className="contact-item">
                                        <span className="contact-label">Office Extension:</span>
                                        <span className="contact-value">{faculty.office_extension}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expandable Sections - Only show sections with data */}
                <div className="expandable-sections">
                    {availableSections
                        .filter(section => section.hasData)
                        .map((section) => (
                            <div key={section.key} className="expandable-section">
                                <button 
                                    className={`section-header ${expandedSections[section.key] ? 'active' : ''}`}
                                    onClick={() => toggleSection(section.key)}
                                >
                                    <span>{section.title}</span>
                                    <i className={`fas fa-chevron-down`}></i>
                                </button>
                                {expandedSections[section.key] && renderSectionContent(section)}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default FacultyDetailsNew;
