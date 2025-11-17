import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import { EditPermission } from '../../../../components/ConditionalRender/ConditionalRender';
import SocialLinks from '../../../../components/SVGIcons/SocialLinks';
import './FacultyDetails.css';

// Simple date formatting functions
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    let date = dateString;
    // If it's an ISO string with time, extract just the date part
    if (dateString.includes('T')) {
        date = dateString.split('T')[0];
    }
    // Convert YYYY-MM-DD to DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }
    return date;
};

const FacultyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        personalInfo: true,
        contactInfo: true,
        researchAreas: false,
        coursesTaught: false,
        academicInfo: false,
        publications: false,
        researchGuidance: false,
        fundedProjects: false,
        awards: false,
        memberships: false,
        professionalServices: false,
        coursesAttended: false,
        coursesConducted: false,
        biography: false,
        socialLinks: false
    });

    const [expandedPublications, setExpandedPublications] = useState({
        journal: false,
        proceedings: false,
        bookChapters: false,
        booksAuthored: false
    });

    // Edit mode states - Remove these, we'll use the permission hook instead
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchFacultyDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Scroll to top when component mounts
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                
                const response = await fetch(`/api/faculty-details/${id}`);
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Extract data from the API response structure
                    const facultyData = result.data;
                    
                    // Add image path to the faculty data
                    const facultyWithImage = {
                        ...facultyData,
                        image: facultyData.profile?.profile_image ? 
                            (facultyData.profile.profile_image.startsWith('/') ? facultyData.profile.profile_image : `/${facultyData.profile.profile_image}`) : 
                            '/images/fallback-profile.svg'
                    };
                    setFaculty(facultyWithImage);
                } else {
                    setError(result.error || 'Faculty not found');
                }
            } catch (err) {
                console.error('Error fetching faculty details:', err);
                setError('Failed to load faculty details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFacultyDetails();
        }
    }, [id]);

    // Remove this authentication check - we'll use the AuthContext instead
    // useEffect(() => {
    //     const token = localStorage.getItem('authToken');
    //     const user = localStorage.getItem('user');
    //     
    //     if (token && user) {
    //         try {
    //             const parsedUser = JSON.parse(user);
    //             setIsAuthenticated(true);
    //             setUserRole(parsedUser.role);
    //         } catch (error) {
    //             console.error('Error parsing user data:', error);
    //             setIsAuthenticated(false);
    //             setUserRole(null);
    //         }
    //     } else {
    //         setIsAuthenticated(false);
    //         setUserRole(null);
    //     }
    // }, []);

    // Function to get department code for image path
    // eslint-disable-next-line no-unused-vars
    const getDepartmentCode = (department) => {
        if (!department) return '';
        
        if (department.includes('Computer Science')) return 'CSE';
        if (department.includes('Electronics') && department.includes('Communication')) return 'ECE';
        if (department.includes('Electrical')) return 'EEE';
        if (department.includes('Mechanical')) return 'MCE';
        if (department.includes('Civil')) return 'CVE';
        if (department.includes('Applied') || department.includes('Physics') || department.includes('Sciences')) return 'APS';
        if (department.includes('Humanities')) return 'HSS';
        
        return 'CSE'; // default fallback
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const togglePublicationSubSection = (subSection) => {
        setExpandedPublications(prev => ({
            ...prev,
            [subSection]: !prev[subSection]
        }));
    };

    const handleBackToFaculty = () => {
        navigate('/faculty');
    };

    // Remove this function - we'll use the permission component instead
    // const canEdit = () => {
    //     if (!isAuthenticated) return false;
    //     return userRole === 'Admin' || userRole === 'Faculty';
    // };

    // Helper function to check if data exists and is not empty
    const hasData = (data) => {
        if (!data) return false;
        if (Array.isArray(data)) return data.length > 0;
        if (typeof data === 'object') {
            return Object.values(data).some(value => {
                if (Array.isArray(value)) return value.length > 0;
                return value !== null && value !== undefined && value !== '';
            });
        }
        return data !== null && data !== undefined && data !== '';
    };

    const renderExpandableSection = (title, key, content, isExpanded = false) => {
        // Don't render the section if it doesn't have data
        if (!hasData(getDataForSection(key))) {
            return null;
        }

        return (
            <div className="faculty-details-expandable-section">
                <div className="section-header-main">
                    <div 
                        className="faculty-details-section-header" 
                        onClick={() => toggleSection(key)}
                    >
                        <div className="section-icon">
                            <i className={`fas fa-${expandedSections[key] ? 'minus' : 'plus'}`}></i>
                        </div>
                        <h2>{title}</h2>
                        <i className={`fas fa-chevron-${expandedSections[key] ? 'up' : 'down'}`}></i>
                    </div>
                </div>
                <div className={`faculty-details-section-content ${expandedSections[key] ? 'expanded' : 'collapsed'}`}>
                    {content}
                </div>
            </div>
        );
    };

    // Helper function to get data for a specific section
    const getDataForSection = (sectionKey) => {
        if (!faculty) return null;
        
        switch (sectionKey) {
            case 'researchAreas':
                return faculty.profile?.researchAreaSummary;
            case 'coursesTaught':
                return faculty.coursesTaught;
            case 'academicInfo':
                return faculty.academicInformation;
            case 'publications':
                return faculty.publications;
            case 'researchGuidance':
                return faculty.researchGuidance;
            case 'fundedProjects':
                return faculty.fundedProjects;
            case 'awards':
                return faculty.awardsAndHonors;
            case 'memberships':
                return faculty.memberships || faculty.membershipAndProfessionalSociety;
            case 'professionalServices':
                return faculty.professionalServices || faculty.professionalService;
            case 'coursesAttended':
                return faculty.trainingAttended;
            case 'coursesConducted':
                return faculty.trainingConducted;
            default:
                return null;
        }
    };

    const renderPublicationSubSection = (title, key, content) => (
        <div className="publication-sub-section">
            <div 
                className="publication-sub-header" 
                onClick={() => togglePublicationSubSection(key)}
            >
                <h4>{title}</h4>
                <i className={`fas fa-chevron-${expandedPublications[key] ? 'up' : 'down'}`}></i>
            </div>
            <div className={`publication-sub-content ${expandedPublications[key] ? 'expanded' : 'collapsed'}`}>
                {content}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="faculty-details-page">
                <div className="faculty-details-loading-container">
                    <div className="faculty-details-loading-spinner"></div>
                    <p>Loading faculty details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="faculty-details-page">
                <div className="faculty-details-error-container">
                    <h2>Error Loading Faculty Details</h2>
                    <p>{error}</p>
                    <button onClick={handleBackToFaculty} className="faculty-details-back-button">
                        ← Back to Faculty
                    </button>
                </div>
            </div>
        );
    }

    if (!faculty) {
        return (
            <div className="faculty-details-page">
                <div className="faculty-details-error-container">
                    <h2>Faculty member not found</h2>
                    <button onClick={handleBackToFaculty} className="faculty-details-back-button">
                        ← Back to Faculty
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`faculty-details-page ${theme}`} data-theme={theme}>
            <div className="faculty-details-container">
                {/* Back Button */}
                <div className="faculty-header-actions">
                    <button onClick={handleBackToFaculty} className="faculty-details-back-button">
                        <i className="fas fa-arrow-left"></i>
                        Back To Faculty
                    </button>
                    
                    {/* Use the new permission-based conditional rendering */}
                    <EditPermission facultyId={id}>
                        <button 
                            onClick={() => navigate(`/faculty/${id}/edit`)} 
                            className="edit-profile-button"
                            title="Edit Faculty Profile"
                        >
                            <i className="fas fa-edit"></i>
                            Edit Profile
                        </button>
                    </EditPermission>
                </div>

                {/* Main Content */}
                <div className="faculty-main-content">
                    {/* Left Column - Profile Image and Basic Info */}
                    <div className="faculty-profile-card">
                        <div className="faculty-details-image-container">
                            <img 
                                src={faculty.image} 
                                alt={faculty.profile?.name}
                                className="faculty-details-image"
                                onError={(e) => {
                                    e.target.src = '/images/fallback-profile.svg';
                                }}
                            />
                        </div>
                        
                        <div className="faculty-basic-info">
                            <p className="facultydetails-designation">{faculty.profile?.designation}</p>
                            <div className="title-divider"></div>
                            <h1 className="faculty-details-name">{faculty.profile?.name}</h1>
                            <p className="faculty-details-department">{faculty.profile?.department}</p>
                            
                            {/* Social/Contact Links */}
                            {faculty.socialLinks && Object.keys(faculty.socialLinks).length > 0 && (
                                <div className="faculty-links">
                                    <SocialLinks 
                                        socialLinks={faculty.socialLinks} 
                                        size={24}
                                        className="faculty-social-links"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="faculty-details-content">
                        {/* Personal Information Section */}
                        <div className="info-section personal-info-section">
                            <div className="section-header-main personalInfo">
                                <h2>Personal Information</h2>
                            </div>
                            
                            {expandedSections.personalInfo && (
                                <div className="faculty-details-info-grid">
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Name :</span>
                                        <span className="faculty-details-info-value">{faculty.personalInformation?.name}</span>
                                    </div>
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Gender :</span>
                                        <span className="faculty-details-info-value">{faculty.personalInformation?.gender}</span>
                                    </div>
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Birth Date :</span>
                                        <span className="faculty-details-info-value">{formatDateForDisplay(faculty.personalInformation?.birthDate) || '-'}</span>
                                    </div>
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Date of Joining :</span>
                                        <span className="faculty-details-info-value">{formatDateForDisplay(faculty.personalInformation?.dateOfJoining) || '-'}</span>
                                    </div>
                                    <div className="faculty-details-info-row full-width">
                                        <span className="faculty-details-info-label">Research/Teaching Experience :</span>
                                        <span className="faculty-details-info-value">{faculty.personalInformation?.experience}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Information Section */}
                        <div className="info-section contact-info-section">
                            <div className="section-header-main personalInfo">
                                <h2>Contact Information</h2>
                            </div>
                            
                            {expandedSections.contactInfo && (
                                <div className="faculty-details-info-grid">
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Email Address :</span>
                                        <span className="faculty-details-info-value">{faculty.contactInformation?.email}</span>
                                    </div>
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Phone [Residence] :</span>
                                        <span className="faculty-details-info-value">-</span>
                                    </div>
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Phone [Mobile] :</span>
                                        <span className="faculty-details-info-value">{faculty.contactInformation?.phoneMobile}</span>
                                    </div>
                                    <div className="faculty-details-info-row">
                                        <span className="faculty-details-info-label">Office Extension :</span>
                                        <span className="faculty-details-info-value">-</span>
                                    </div>
                                     <div className="faculty-details-info-row full-width">
                                        <span className="faculty-details-info-label">Address :</span>
                                        <span className="faculty-details-info-value">{faculty.contactInformation?.address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expandable Sections */}
                <div className="faculty-details-expandable-sections">
                    {renderExpandableSection(
                        "Research Area",
                        "researchAreas",
                        <div className="research-areas-enhanced">
                            <div className="research-category">
                                {/* <h4>Primary Research Areas</h4> */}
                                <div className="research-areas">
                                    {faculty.profile?.researchAreaSummary?.map((area, index) => (
                                        <span key={index} className="faculty-details-research-tag">{area}</span>
                                    ))}
                                </div>
                                    </div>
                                </div>,
                        false
                    )}

                                                {renderExpandableSection(
                                                    "Courses Taught",
                                                    "coursesTaught",
                                                    <div className="courses-section">
                                                        {/* Check if courses taught data exists and handle different data structures */}
                                                        {faculty.coursesTaught && (
                                                            <>
                                                                {/* Handle array format */}
                                                                {Array.isArray(faculty.coursesTaught) && faculty.coursesTaught.length > 0 && (
                                                                    <div className="course-category">
                                                                        <h4>Courses Taught</h4>
                                                                        <ul>
                                                                            {faculty.coursesTaught.map((course, index) => (
                                                                                <li key={index}>{course}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Handle object format with ug/pg separation */}
                                                                {!Array.isArray(faculty.coursesTaught) && (
                                                                    <>
                                                                        {faculty.coursesTaught.ug && faculty.coursesTaught.ug.length > 0 && (
                                                                            <div className="course-category">
                                                                                <h4>Undergraduate Courses</h4>
                                                                                <ul>
                                                                                    {faculty.coursesTaught.ug.map((course, index) => {
                                                                                        if (typeof course === 'string') return <li key={index}>{course}</li>;
                                                                                        
                                                                                        // Build display string with only available fields
                                                                                        let displayText = '';
                                                                                        if (course.course_code) displayText += course.course_code;
                                                                                        if (course.course_name) {
                                                                                            displayText += (displayText ? ' - ' : '') + course.course_name;
                                                                                        }
                                                                                        if (course.credits) {
                                                                                            displayText += ` (${course.credits} credits)`;
                                                                                        }
                                                                                        if (course.semester) {
                                                                                            displayText += ` - ${course.semester} Semester`;
                                                                                        }
                                                                                        
                                                                                        return <li key={index}>{displayText || 'Course details not available'}</li>;
                                                                                    })}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                        {faculty.coursesTaught.pg && faculty.coursesTaught.pg.length > 0 && (
                                                                            <div className="course-category">
                                                                                <h4>Postgraduate Courses</h4>
                                                                                <ul>
                                                                                    {faculty.coursesTaught.pg.map((course, index) => {
                                                                                        if (typeof course === 'string') return <li key={index}>{course}</li>;
                                                                                        
                                                                                        // Build display string with only available fields
                                                                                        let displayText = '';
                                                                                        if (course.course_code) displayText += course.course_code;
                                                                                        if (course.course_name) {
                                                                                            displayText += (displayText ? ' - ' : '') + course.course_name;
                                                                                        }
                                                                                        if (course.credits) {
                                                                                            displayText += ` (${course.credits} credits)`;
                                                                                        }
                                                                                        if (course.semester) {
                                                                                            displayText += ` - ${course.semester} Semester`;
                                                                                        }
                                                                                        
                                                                                        return <li key={index}>{displayText || 'Course details not available'}</li>;
                                                                                    })}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                        
                                                        {/* Show message if no courses data */}
                                                        {(!faculty.coursesTaught || 
                                                          (Array.isArray(faculty.coursesTaught) && faculty.coursesTaught.length === 0) ||
                                                          (!Array.isArray(faculty.coursesTaught) && 
                                                           (!faculty.coursesTaught.ug || faculty.coursesTaught.ug.length === 0) &&
                                                           (!faculty.coursesTaught.pg || faculty.coursesTaught.pg.length === 0))) && (
                                                            <div className="no-data-message">
                                                                <p>No courses information available</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {renderExpandableSection(
                                                    "Academic Information",
                                                    "academicInfo",
                                                    <div className="academic-info-table-container">
                                                        <table className="academic-info-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Degree</th>
                                                                    <th>Institute</th>
                                                                    <th>Subject</th>
                                                                    <th>Year</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {faculty.academicInformation?.map((edu, index) => (
                                                                    <tr key={index}>
                                                                        <td className="degree-cell">{edu.degree || '-'}</td>
                                                                        <td className="institute-cell">{edu.institute || '-'}</td>
                                                                        <td className="subject-cell">{edu.discipline || edu.subject || '-'}</td>
                                                                        <td className="year-cell">{edu.graduation_year || edu.year || '-'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>,
                                                    false
                                                )}

                                                {renderExpandableSection(
                                                    "Paper Published",
                                                    "publications",
                                                    <div className="publications-section">
                                                        {/* Journal Publications Sub-dropdown */}
                                            {faculty.publications?.journal && faculty.publications.journal.length > 0 && 
                                                renderPublicationSubSection(
                                                    `Publications Table (${faculty.publications.journal.length})`,
                                                    "journal",
                                                    <div className="publications-scrollable-container">
                                                        <table className="publications-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Sr. No.</th>
                                                                    <th>Publication Details</th>
                                                                    <th>Year</th>
                                                                    <th>Month</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {faculty.publications.journal.map((pub, index) => {
                                                                    if (!pub) return null; // Skip null/undefined publications
                                                                    
                                                                    // Handle both old string format and new object format
                                                                    const title = typeof pub === 'string' ? pub : pub.title;
                                                                    const year = typeof pub === 'string' ? 
                                                                        (pub.match(/\b(19|20)\d{2}\b/) ? pub.match(/\b(19|20)\d{2}\b/)[0] : '-') :
                                                                        (pub.publication_year || '-');
                                                                    const month = typeof pub === 'string' ? 
                                                                        (pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i) ? pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i)[1] : '-') :
                                                                        (pub.publication_month || '-');
                                                                    
                                                                    return (
                                                                        <tr key={pub.publication_id || index}>
                                                                            <td>{index + 1}</td>
                                                                            <td className="publication-title">{title}</td>
                                                                            <td className="publication-year">{year}</td>
                                                                            <td className="publication-month">{month}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )
                                            }
                            
                            {/* Conference Proceedings Sub-dropdown */}
                                            {faculty.publications?.proceedings && faculty.publications.proceedings.length > 0 && 
                                                renderPublicationSubSection(
                                                    `Conference Proceedings Table (${faculty.publications.proceedings.length})`,
                                                    "proceedings",
                                                    <div className="publications-scrollable-container">
                                                        <table className="publications-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Sr. No.</th>
                                                                    <th>Publication Details</th>
                                                                    <th>Year</th>
                                                                    <th>Month</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {faculty.publications.proceedings.map((pub, index) => {
                                                                    if (!pub) return null;
                                                                    
                                                                    // Handle both old string format and new object format
                                                                    const title = typeof pub === 'string' ? pub : pub.title;
                                                                    const year = typeof pub === 'string' ? 
                                                                        (pub.match(/\b(19|20)\d{2}\b/) ? pub.match(/\b(19|20)\d{2}\b/)[0] : '-') :
                                                                        (pub.publication_year || '-');
                                                                    const month = typeof pub === 'string' ? 
                                                                        (pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i) ? pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i)[1] : '-') :
                                                                        (pub.publication_month || '-');
                                                                    
                                                                    return (
                                                                        <tr key={pub.publication_id || index}>
                                                                            <td>{index + 1}</td>
                                                                            <td className="publication-title">{title}</td>
                                                                            <td className="publication-year">{year}</td>
                                                                            <td className="publication-month">{month}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )
                                            }

                            {/* Book Chapters Sub-dropdown */}
                            {faculty.publications?.bookChapters && faculty.publications.bookChapters.length > 0 && 
                                renderPublicationSubSection(
                                    `Book Chapters Table (${faculty.publications.bookChapters.length})`,
                                    "bookChapters",
                                    <div className="publications-scrollable-container">
                                        <table className="publications-table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Publication Details</th>
                                                    <th>Year</th>
                                                    <th>Month</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {faculty.publications.bookChapters.map((pub, index) => {
                                                    if (!pub) return null;
                                                    
                                                    // Handle both old string format and new object format
                                                    const title = typeof pub === 'string' ? pub : pub.title;
                                                    const year = typeof pub === 'string' ? 
                                                        (pub.match(/\b(19|20)\d{2}\b/) ? pub.match(/\b(19|20)\d{2}\b/)[0] : '-') :
                                                        (pub.publication_year || '-');
                                                    const month = typeof pub === 'string' ? 
                                                        (pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i) ? pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i)[1] : '-') :
                                                        (pub.publication_month || '-');
                                                    
                                                    return (
                                                        <tr key={pub.publication_id || index}>
                                                            <td>{index + 1}</td>
                                                            <td className="publication-title">{title}</td>
                                                            <td className="publication-year">{year}</td>
                                                            <td className="publication-month">{month}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }

                            {/* Books Authored Sub-dropdown */}
                            {faculty.publications?.booksAuthored && faculty.publications.booksAuthored.length > 0 && 
                                renderPublicationSubSection(
                                    `Books Authored Table (${faculty.publications.booksAuthored.length})`,
                                    "booksAuthored",
                                    <div className="publications-scrollable-container">
                                        <table className="publications-table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Publication Details</th>
                                                    <th>Year</th>
                                                    <th>Month</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {faculty.publications.booksAuthored.map((pub, index) => {
                                                    if (!pub) return null;
                                                    
                                                    // Handle both old string format and new object format
                                                    const title = typeof pub === 'string' ? pub : pub.title;
                                                    const year = typeof pub === 'string' ? 
                                                        (pub.match(/\b(19|20)\d{2}\b/) ? pub.match(/\b(19|20)\d{2}\b/)[0] : '-') :
                                                        (pub.publication_year || '-');
                                                    const month = typeof pub === 'string' ? 
                                                        (pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i) ? pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i)[1] : '-') :
                                                        (pub.publication_month || '-');
                                                    
                                                    return (
                                                        <tr key={pub.publication_id || index}>
                                                            <td>{index + 1}</td>
                                                            <td className="publication-title">{title}</td>
                                                            <td className="publication-year">{year}</td>
                                                            <td className="publication-month">{month}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }
                        </div>,
                        false
                    )}

                    {renderExpandableSection(
                        "Research Guidance",
                        "researchGuidance",
                        <div className="research-guidance-cards">
                            {faculty.researchGuidance?.map((student, index) => (
                                <div key={student.guidance_id || index} className="guidance-card">
                                    <div className="guidance-header">
                                        <div className="guidance-degree-badge">Ph.D.</div>
                                        <div className={`guidance-status-badge ${student.status?.toLowerCase().replace(/\s+/g, '-') || 'ongoing'}`}>
                                            {student.status || 'Ongoing'}
                                        </div>
                                    </div>
                                    <div className="guidance-content">
                                        <h4 className="student-name">
                                            {student.student_honorific && `${student.student_honorific} `}
                                            {student.student_name}
                                        </h4>
                                        {student.research_topic && (
                                            <p className="research-topic">{student.research_topic}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>,
                        false
                    )}

                    {renderExpandableSection(
                        "Funded Research Project",
                        "fundedProjects",
                        <div className="funded-projects-table-container">
                            <table className="funded-projects-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Project Details</th>
                                        <th>Funding Agency</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.fundedProjects?.map((project, index) => {
                                        // Extract funding agency and amount from project text
                                        const extractAgency = (text) => {
                                            if (!text) return '-';
                                            
                                            const agencyPatterns = [
                                                /(The Research Council of Norway[^,]*)/i,
                                                /(DST-SERB|SERB[^,]*)/i,
                                                /(The PMU Cybersecurity Center[^,]*)/i,
                                                /(ARTPARK[^,]*)/i,
                                                /(funded by|funding agency|sponsored by)\s*([^,\n.]+)/i,
                                                /\b([A-Z]{2,}[^,\n.]*(?:Council|Agency|Ministry|Department|Foundation|Fund)[^,\n.]*)/i
                                            ];
                                            
                                            for (let pattern of agencyPatterns) {
                                                const match = text.match(pattern);
                                                if (match) {
                                                    return match[1] || match[2] || match[0];
                                                }
                                            }
                                            return '-';
                                        };
                                        
                                        const extractAmount = (text) => {
                                            if (!text) return '-';
                                            
                                            const amountPatterns = [
                                                /(₹\s*[\d,]+(?:\.\d+)?\s*(?:Crores?|Lakhs?|K)?)/i,
                                                /(USD\s*[\d,]+(?:\.\d+)?)/i,
                                                /(Rs\.?\s*[\d,]+(?:\.\d+)?\s*(?:Crores?|Lakhs?)?)/i,
                                                /(\$\s*[\d,]+(?:\.\d+)?)/i,
                                                /([\d,]+(?:\.\d+)?\s*(?:Crores?|Lakhs?|USD|Rs\.?))/i
                                            ];
                                            
                                            for (let pattern of amountPatterns) {
                                                const match = text.match(pattern);
                                                if (match) {
                                                    return match[1];
                                                }
                                            }
                                            return '-';
                                        };
                                        
                                        const agency = extractAgency(project);
                                        const amount = extractAmount(project);
                                        
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="project-details-cell">{project}</td>
                                                <td className="agency-cell">{agency}</td>
                                                <td className="amount-cell">{amount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>,
                        false
                    )}

                    {renderExpandableSection(
                        "Award and Honor",
                        "awards",
                        <div className="awards-timeline">
                            {faculty.awardsAndHonors?.map((award, index) => {
                                // Determine award type/category
                                const awardType = award.toLowerCase().includes('best') ? 'excellence' :
                                                 award.toLowerCase().includes('recognition') ? 'recognition' :
                                                 award.toLowerCase().includes('honor') ? 'honor' : 'achievement';
                                
                                return (
                                    <div key={index} className="award-item">
                                        <div className="award-timeline-marker">
                                            <i className={`fas ${awardType === 'excellence' ? 'fa-trophy' : 
                                                                awardType === 'recognition' ? 'fa-medal' :
                                                                awardType === 'honor' ? 'fa-star' : 'fa-award'}`}></i>
                                        </div>
                                        <div className="award-content">
                                            <h4 className="award-title">{award}</h4>
                                            <div className={`award-category ${awardType}`}>
                                                {awardType.charAt(0).toUpperCase() + awardType.slice(1)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>,
                        false
                    )}

                    {renderExpandableSection(
                        "Membership and Professional Society",
                        "memberships",
                        <div className="memberships-section">
                            <ul>
                                {faculty.memberships && faculty.memberships.length > 0 
                                    ? faculty.memberships.map((membership, index) => {
                                        // Handle both string format and object format
                                        if (typeof membership === 'string') {
                                            return <li key={index}>{membership}</li>;
                                        }
                                        // Object format from backend: {organization_name, membership_type, is_active}
                                        const displayText = membership.membership_type 
                                            ? `${membership.organization_name} (${membership.membership_type})`
                                            : membership.organization_name;
                                        return <li key={membership.membership_id || index}>{displayText}</li>;
                                    })
                                    : <li>No memberships available</li>
                                }
                            </ul>
                        </div>,
                        false
                    )}

                    {renderExpandableSection(
                        "Professional Services",
                        "professionalServices",
                        <div className="professional-services-section">
                            <ul>
                                {faculty.professionalService?.map((service, index) => (
                                    <li key={index}>
                                        {service}
                                    </li>
                                )) || <li>No professional services available</li>}
                            </ul>
                        </div>,
                        true
                    )}

                    {renderExpandableSection(
                        "Training/Conferences/Short Term Courses Attended",
                        "coursesAttended",
                        <div className="courses-attended-table-container">
                            <table className="courses-attended-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Month</th>
                                        <th>Year</th>
                                        <th>Training Attended Information</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.trainingAttended?.map((training, index) => (
                                        <tr key={training.training_id || index}>
                                            <td>{index + 1}</td>
                                            <td className="month-cell">{training.month || '-'}</td>
                                            <td className="year-cell">{training.year || '-'}</td>
                                            <td className="training-details-cell">{training.training_information || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>,
                        true
                    )}

                    {renderExpandableSection(
                        "Training/Conferences/Short Term Courses Conducted",
                        "coursesConducted",
                        <div className="courses-conducted-table-container">
                            <table className="courses-conducted-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Month</th>
                                        <th>Year</th>
                                        <th>Training Conducted Information</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.trainingConducted?.map((training, index) => (
                                        <tr key={training.training_id || index}>
                                            <td>{index + 1}</td>
                                            <td className="month-cell">{training.month || '-'}</td>
                                            <td className="year-cell">{training.year || '-'}</td>
                                            <td className="training-details-cell">{training.training_information || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>,
                        true
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyDetails;
