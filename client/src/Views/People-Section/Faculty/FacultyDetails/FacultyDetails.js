import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import { EditPermission } from '../../../../components/ConditionalRender/ConditionalRender';
import SocialLinks from '../../../../components/SVGIcons/SocialLinks';
import './FacultyDetails.css';

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
                
                const response = await fetch(`/api/faculty-details/${id}/details`);
                const result = await response.json();
                
                if (response.ok) {
                    // Add image path to the faculty data
                    const facultyWithImage = {
                        ...result,
                        image: result.profile?.profile_image ? 
                            (result.profile.profile_image.startsWith('/') ? result.profile.profile_image : `/${result.profile.profile_image}`) : 
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
            <div className="expandable-section">
                <div className="section-header-main">
                    <div 
                        className="section-header" 
                        onClick={() => toggleSection(key)}
                    >
                        <div className="section-icon">
                            <i className={`fas fa-${expandedSections[key] ? 'minus' : 'plus'}`}></i>
                        </div>
                        <h2>{title}</h2>
                        <i className={`fas fa-chevron-${expandedSections[key] ? 'up' : 'down'}`}></i>
                    </div>
                </div>
                <div className={`section-content ${expandedSections[key] ? 'expanded' : 'collapsed'}`}>
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
                return faculty.trainingConferencesAndShortTermCoursesAttended;
            case 'coursesConducted':
                return faculty.trainingConferencesAndShortTermCoursesConducted;
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
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading faculty details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="faculty-details-page">
                <div className="error-container">
                    <h2>Error Loading Faculty Details</h2>
                    <p>{error}</p>
                    <button onClick={handleBackToFaculty} className="back-button">
                        ← Back to Faculty
                    </button>
                </div>
            </div>
        );
    }

    if (!faculty) {
        return (
            <div className="faculty-details-page">
                <div className="error-container">
                    <h2>Faculty member not found</h2>
                    <button onClick={handleBackToFaculty} className="back-button">
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
                    <button onClick={handleBackToFaculty} className="back-button">
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
                            <div className="section-header-main">
                                <h2>Personal Information</h2>
                            </div>
                            
                            {expandedSections.personalInfo && (
                                <div className="info-grid">
                                    <div className="info-row">
                                        <span className="info-label">Name :</span>
                                        <span className="info-value">{faculty.personalInformation?.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Gender :</span>
                                        <span className="info-value">{faculty.personalInformation?.gender}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Birth Date :</span>
                                        <span className="info-value">{faculty.personalInformation?.birthDate || '-'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Date of Joining :</span>
                                        <span className="info-value">{faculty.personalInformation?.dateOfJoining}</span>
                                    </div>
                                    <div className="info-row full-width">
                                        <span className="info-label">Research/Teaching Experience :</span>
                                        <span className="info-value">{faculty.personalInformation?.experience}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Information Section */}
                        <div className="info-section contact-info-section">
                            <div className="section-header-main">
                                <h2>Contact Information</h2>
                            </div>
                            
                            {expandedSections.contactInfo && (
                                <div className="info-grid">
                                    <div className="info-row">
                                        <span className="info-label">Email Address :</span>
                                        <span className="info-value">{faculty.contactInformation?.email}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Phone [Residence] :</span>
                                        <span className="info-value">-</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Phone [Mobile] :</span>
                                        <span className="info-value">{faculty.contactInformation?.phoneMobile}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Office Extension :</span>
                                        <span className="info-value">-</span>
                                    </div>
                                     <div className="info-row full-width">
                                        <span className="info-label">Address :</span>
                                        <span className="info-value">{faculty.contactInformation?.address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expandable Sections */}
                <div className="expandable-sections">
                    {renderExpandableSection(
                        "Research Area",
                        "researchAreas",
                        <div className="research-areas-enhanced">
                            <div className="research-category">
                                {/* <h4>Primary Research Areas</h4> */}
                                <div className="research-areas">
                                    {faculty.profile?.researchAreaSummary?.map((area, index) => (
                                        <span key={index} className="research-tag">{area}</span>
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
                                                                                    {faculty.coursesTaught.ug.map((course, index) => (
                                                                                        <li key={index}>{course}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                        {faculty.coursesTaught.pg && faculty.coursesTaught.pg.length > 0 && (
                                                                            <div className="course-category">
                                                                                <h4>Postgraduate Courses</h4>
                                                                                <ul>
                                                                                    {faculty.coursesTaught.pg.map((course, index) => (
                                                                                        <li key={index}>{course}</li>
                                                                                    ))}
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
                                                                        <td className="degree-cell">{edu.degree}</td>
                                                                        <td className="institute-cell">{edu.institute}</td>
                                                                        <td className="subject-cell">{edu.subject}</td>
                                                                        <td className="year-cell">{edu.year}</td>
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
                                                                    
                                                                    const yearMatch = pub.match ? pub.match(/\b(19|20)\d{2}\b/) : null;
                                                                    const monthMatch = pub.match ? pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i) : null;
                                                                    const year = yearMatch ? yearMatch[0] : '-';
                                                                    const month = monthMatch ? monthMatch[1] : '-';
                                                                    
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td className="publication-title">{pub}</td>
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
                                                                    
                                                                    const yearMatch = pub.match ? pub.match(/\b(19|20)\d{2}\b/) : null;
                                                                    const monthMatch = pub.match ? pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i) : null;
                                                                    const year = yearMatch ? yearMatch[0] : '-';
                                                                    const month = monthMatch ? monthMatch[1] : '-';
                                                                    
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td className="publication-title">{pub}</td>
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
                                                    const yearMatch = pub.match(/\b(19|20)\d{2}\b/);
                                                    const monthMatch = pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i);
                                                    const year = yearMatch ? yearMatch[0] : '-';
                                                    const month = monthMatch ? monthMatch[1] : '-';
                                                    
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td className="publication-title">{pub}</td>
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
                                                    const yearMatch = pub.match(/\b(19|20)\d{2}\b/);
                                                    const monthMatch = pub.match(/(JAN|FEB|MAR|APRIL|MAY|JUN|JULY|AUG|SEPT|OCT|NOV|DEC)\s+(19|20)\d{2}/i);
                                                    const year = yearMatch ? yearMatch[0] : '-';
                                                    const month = monthMatch ? monthMatch[1] : '-';
                                                    
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td className="publication-title">{pub}</td>
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
                            {faculty.researchGuidance?.map((student, index) => {
                                if (!student) return null; // Skip null/undefined entries
                                
                                // Extract student name, degree type, and status from the text
                                const degreeMatch = student.match ? student.match(/(Ph\.?D\.?|M\.?Tech\.?|M\.?S\.?|B\.?Tech\.?)/i) : null;
                                const statusMatch = student.match ? student.match(/(completed|ongoing|submitted|awarded)/i) : null;
                                const yearMatch = student.match ? student.match(/\b(19|20)\d{2}\b/) : null;
                                
                                const degree = degreeMatch ? degreeMatch[0] : 'Research';
                                const status = statusMatch ? statusMatch[0] : 'Ongoing';
                                const year = yearMatch ? yearMatch[0] : '';
                                
                                return (
                                    <div key={index} className="guidance-card">
                                        <div className="guidance-header">
                                            <div className="guidance-degree-badge">{degree}</div>
                                            <div className={`guidance-status-badge ${status.toLowerCase()}`}>
                                                {status}
                                            </div>
                                        </div>
                                        <div className="guidance-content">
                                            <p className="guidance-text">{student}</p>
                                            {year && <div className="guidance-year">{year}</div>}
                                        </div>
                                    </div>
                                );
                            })}
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
                                                /(funded by|funding agency|sponsored by)\s*([^,\n\.]+)/i,
                                                /\b([A-Z]{2,}[^,\n\.]*(?:Council|Agency|Ministry|Department|Foundation|Fund)[^,\n\.]*)/i
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
                                {faculty.membershipAndProfessionalSociety && faculty.membershipAndProfessionalSociety.length > 0 
                                    ? faculty.membershipAndProfessionalSociety.map((membership, index) => (
                                        <li key={index}>
                                            {membership}
                                        </li>
                                    ))
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
                                        <th>Course/Conference Details</th>
                                        <th>Year</th>
                                        <th>Duration</th>
                                        <th>Venue/Place</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.trainingConferencesAndShortTermCoursesAttended?.map((course, index) => {
                                        if (!course || !course.info) return null; // Skip null/undefined entries
                                        
                                        // Extract year, duration, and venue from course info
                                        const yearMatch = course.info.match ? course.info.match(/\b(19|20)\d{2}\b/) : null;
                                        const durationMatch = course.info.match ? course.info.match(/(\d+)\s*(day|week|month)s?/i) : null;
                                        
                                        // Enhanced venue extraction - get city/location from end of string
                                        let venue = '-';
                                        // Try to extract venue from various patterns
                                        const venuePatterns = [
                                            /,\s*([^,\n.]+)\.?\s*$/,  // Last item after comma
                                            /\),\s*([^,\n.]+)\.?\s*$/,  // After closing parenthesis
                                            /(Barcelona, Spain|Macau, Hong Kong|Trivandrum|Rourkela|Bhuvaneswar)/i,  // Specific locations
                                            /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*(?:[A-Z][a-z]+)?\s*\.?$/  // City names at end
                                        ];
                                        
                                        for (let pattern of venuePatterns) {
                                            const match = course.info.match ? course.info.match(pattern) : null;
                                            if (match) {
                                                venue = match[1] ? match[1].trim().replace(/\.$/, '') : match[0].trim().replace(/\.$/, '');
                                                break;
                                            }
                                        }
                                        
                                        const year = yearMatch ? yearMatch[0] : '-';
                                        const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}${durationMatch[1] > 1 ? 's' : ''}` : '-';
                                        
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="course-details-cell">{course.info}</td>
                                                <td className="year-cell">{year}</td>
                                                <td className="duration-cell">{duration}</td>
                                                <td className="venue-cell">{venue}</td>
                                            </tr>
                                        );
                                    })}
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
                                        <th>Course/Conference Details</th>
                                        <th>Year</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.coursesConducted?.map((course, index) => {
                                        if (!course || !course.info) return null; // Skip null/undefined entries
                                        
                                        // Extract year, duration, and venue from course info
                                        const yearMatch = course.info.match ? course.info.match(/\b(19|20)\d{2}\b/) : null;
                                        
                                        // Enhanced duration extraction for various patterns
                                        let duration = '-';
                                        const durationPatterns = [
                                            /(\d+)\s*-\s*(\d+)\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i,  // Date ranges like "3-13 July"
                                            /(\d+)(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,  // Single date like "8th July", "19 Jan"
                                            /(\d+)\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*,?\s*(\d{4})/i,  // Single date with year
                                            /(\d+)\s*-\s*(\d+)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,  // Date ranges with short months like "1-6 April"
                                            /(\d+)\s*-\s*(\d+)\s+(March|April|May|June|July|December)/i,  // Date ranges with full month names
                                            /(25\s*-\s*27\s+October|3-13\s+July|March\s+17|5-9\s+December|12-18\s+December|5\s+June|23\s+January|1-6\s+April|4\s*-\s*5\s+March|6-10\s+July|4\s+July|5\s+May)/i  // Specific date patterns
                                        ];
                                        
                                        for (let pattern of durationPatterns) {
                                            const match = course.info.match ? course.info.match(pattern) : null;
                                            if (match) {
                                                if (pattern === durationPatterns[0]) {
                                                    // Date range like "3-13 July"
                                                    duration = `${match[1]}-${match[2]} ${match[3]}`;
                                                } else if (pattern === durationPatterns[1]) {
                                                    // Single date like "8th July" or "19 Jan"
                                                    duration = `${match[1]} ${match[2]}`;
                                                } else if (pattern === durationPatterns[2]) {
                                                    // Single date with year like "23 January, 2020"
                                                    duration = `${match[1]} ${match[2]}`;
                                                } else if (pattern === durationPatterns[3] || pattern === durationPatterns[4]) {
                                                    // Date ranges like "1-6 April"
                                                    duration = `${match[1]}-${match[2]} ${match[3]}`;
                                                } else {
                                                    // Specific dates
                                                    duration = match[0];
                                                }
                                                break;
                                            }
                                        }
                                        
                                        const year = yearMatch ? yearMatch[0] : '-';
                                        
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="course-details-cell">{course.info}</td>
                                                <td className="year-cell">{year}</td>
                                                <td className="duration-cell">{duration}</td>
                                            </tr>
                                        );
                                    })}
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
