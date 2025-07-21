import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import './FacultyDetails.css';

// Import the Damodar Reddy Edla JSON data
import damodarData from './data/cse_json/Damodar_Reddy_Edla.json';

// Import faculty images
import DamodarReddyEdla from '../../../../assets/images/Faculty/CSE/Dr. Damodar Reddy Edla.png';

const FacultyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
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
        coursesConducted: false
    });

    const [expandedPublications, setExpandedPublications] = useState({
        journal: false,
        proceedings: false,
        bookChapters: false,
        booksAuthored: false
    });

    useEffect(() => {
        // For now, we'll use the hardcoded Damodar Reddy Edla data for all faculty
        // Later this can be replaced with dynamic data fetching
        setFaculty({
            ...damodarData,
            image: DamodarReddyEdla
        });
        setLoading(false);
    }, [id]);

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

    const renderExpandableSection = (title, key, content, isExpanded = false) => (
        <div className="expandable-section">
            <div 
                className="section-header" 
                onClick={() => toggleSection(key)}
            >
                <div className="section-icon">
                    <i className={`fas fa-${expandedSections[key] ? 'minus' : 'plus'}`}></i>
                </div>
                <h3>{title}</h3>
                <i className={`fas fa-chevron-${expandedSections[key] ? 'up' : 'down'}`}></i>
            </div>
            <div className={`section-content ${expandedSections[key] ? 'expanded' : 'collapsed'}`}>
                {content}
            </div>
        </div>
    );

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
                <button onClick={handleBackToFaculty} className="back-button">
                    <i className="fas fa-arrow-left"></i>
                    Back To Faculty
                </button>

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
                                    e.target.src = '/api/placeholder/300/350';
                                }}
                            />
                        </div>
                        
                        <div className="faculty-basic-info">
                            <p className="facultydetails-designation">{faculty.profile?.designation}</p>
                            <div className="title-divider"></div>
                            <h1 className="faculty-details-name">{faculty.profile?.name}</h1>
                            <p className="faculty-details-department">{faculty.profile?.department}</p>
                            
                            {/* Social/Contact Links */}
                            <div className="faculty-links">
                                <div className="faculty-details-social-link">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="faculty-details-social-link">
                                    <i className="fab fa-linkedin"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="faculty-details-content">
                        {/* Personal Information Section */}
                        <div className="info-section personal-info-section">
                            <div className="section-header-main">
                                <h2>Personal Information</h2>
                                <button 
                                    className="edit-button"
                                    onClick={() => toggleSection('personalInfo')}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
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
                                <button 
                                    className="edit-button"
                                    onClick={() => toggleSection('contactInfo')}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
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
                            {/* {faculty.researchAreas && faculty.researchAreas.length > 0 && (
                                // <div className="research-category">
                                //     <h4>Detailed Research Areas</h4>
                                //     <ul className="research-list">
                                //         {faculty.researchAreas.map((area, index) => (
                                //             <li key={index}>{area}</li>
                                //         ))}
                                //     </ul>
                                // </div>
                            )} */}
                        </div>
                    )}

                    {renderExpandableSection(
                        "Courses Taught",
                        "coursesTaught",
                        <div className="courses-section">
                            <div className="course-category">
                                <h4>Undergraduate Courses</h4>
                                <ul>
                                    {faculty.coursesTaught?.ug?.map((course, index) => (
                                        <li key={index}>{course}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="course-category">
                                <h4>Postgraduate Courses</h4>
                                <ul>
                                    {faculty.coursesTaught?.pg?.map((course, index) => (
                                        <li key={index}>{course}</li>
                                    ))}
                                </ul>
                            </div>
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
                        </div>
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
                        </div>
                    )}

                    {renderExpandableSection(
                        "Research Guidance",
                        "researchGuidance",
                        <div className="research-guidance">
                            <ul>
                                {faculty.researchGuidance?.map((student, index) => (
                                    <li key={index}>{student}</li>
                                ))}
                            </ul>
                        </div>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.fundedProjects?.map((project, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="project-details-cell">{project}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {renderExpandableSection(
                        "Award and Honor",
                        "awards",
                        <div className="awards-section">
                            <ul>
                                {faculty.awardsAndHonors?.map((award, index) => (
                                    <li key={index}>{award}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {renderExpandableSection(
                        "Membership and Professional Society",
                        "memberships",
                        <div className="memberships-section">
                            <ul>
                                {faculty.memberships?.map((membership, index) => (
                                    <li key={index}>{membership}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {renderExpandableSection(
                        "Professional Services",
                        "professionalServices",
                        <div className="professional-services">
                            <ul>
                                {faculty.professionalServices?.map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                        </div>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.coursesAttended?.map((course, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="course-details-cell">{course.info}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.coursesConducted?.map((course, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="course-details-cell">{course.info}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyDetails;
