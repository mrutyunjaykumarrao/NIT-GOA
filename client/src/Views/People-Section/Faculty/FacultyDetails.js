import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import './FacultyDetails.css';

// Import faculty data from Faculty component
import { findFacultyById } from './facultyData';

const FacultyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('research');

    useEffect(() => {
        const fetchFacultyDetails = async () => {
            try {
                setLoading(true);
                
                // Find faculty by ID from the imported data
                const facultyMember = findFacultyById(id);
                
                if (facultyMember) {
                    setFaculty({
                        ...facultyMember,
                        full_name: facultyMember.name,
                        profile_image: facultyMember.image,
                        research_areas: facultyMember.researchAreas,
                        date_of_joining: '07/01/2013', // Mock data
                        experience: '9 years of Teaching and Research Experience at NIT Goa' // Mock data
                    });
                    setError(null);
                } else {
                    setError('Faculty member not found');
                }
            } catch (err) {
                console.error('Error fetching faculty details:', err);
                setError('Failed to load faculty details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFacultyDetails();
        }
    }, [id]);

    const getDepartmentFullName = (code) => {
        const deptMap = {
            'CSE': 'Computer Science and Engineering',
            'ECE': 'Electronics & Communication Engineering',
            'EEE': 'Electrical & Electronics Engineering',
            'MCE': 'Mechanical Engineering',
            'CVE': 'Civil Engineering',
            'APS': 'Applied Sciences',
            'HSS': 'Humanities & Social Sciences'
        };
        return deptMap[code] || code;
    };

    const parseResearchAreas = (researchString) => {
        if (!researchString) return [];
        return researchString.split(';').map(area => area.trim()).filter(area => area);
    };

    const parseEducation = (faculty) => {
        // Mock education data - in real implementation, this would come from database
        return [
            {
                degree: 'Ph.D.',
                institute: 'Indian School of Mines, Dhanbad (Presently IIT Dhanbad)',
                year: '2012',
                subject: 'Computer Science & Engineering'
            },
            {
                degree: 'M.Tech.',
                institute: 'Indian School of Mines, Dhanbad (Presently IIT Dhanbad)',
                year: '2009',
                subject: 'Computer Science & Engineering'
            }
        ];
    };

    const mockCourses = {
        ug: [
            'Data Warehousing & Mining',
            'Distributed Computing Systems',
            'Data Structures',
            'Software Engineering',
            'Operating Systems',
            'Object Oriented Programming',
            'Applied Algorithms',
            'Design and Analysis of Algorithms',
            'Soft Computing',
            'Web Engineering',
            'Advanced Operating Systems',
            'Advanced Data Structures',
            'Discrete Mathematics',
            'Computer Programming and Problem Solving',
            'Introduction to Machine Learning'
        ],
        pg: [
            'Mathematical Foundations for Computer Science',
            'Advanced Algorithms and Analysis',
            'Object Oriented Software Engineering',
            'Soft Computing',
            'Number Theory'
        ]
    };

    if (loading) {
        return (
            <>
                
                <div className="faculty-details-page" data-theme={theme}>
                    <div className="faculty-details-container">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading faculty details...</p>
                        </div>
                    </div>
                </div>
                
            </>
        );
    }

    if (error || !faculty) {
        return (
            <>
            
                <div className="faculty-details-page" data-theme={theme}>
                    <div className="faculty-details-container">
                        <div className="error-container">
                            <h2>Faculty Not Found</h2>
                            <p>{error || 'The requested faculty member could not be found.'}</p>
                            <button onClick={() => navigate('/faculty')} className="back-btn">
                                Back to Faculty Directory
                            </button>
                        </div>
                    </div>
                </div>
                
            </>
        );
    }

    const researchAreas = parseResearchAreas(faculty.research_areas);
    const education = parseEducation(faculty);

    return (
        <>
            
            <div className="faculty-details-page" data-theme={theme}>
                <div className="faculty-details-container">
                    {/* Back Button */}
                    <button onClick={() => navigate('/faculty')} className="back-button">
                        <i className="fas fa-arrow-left"></i>
                        Back to Faculty Directory
                    </button>

                    {/* Main Content Layout */}
                    <div className="faculty-main-content">
                        {/* Left Column - Faculty Image and Basic Info */}
                        <div className="faculty-left-column">
                            <img 
                                src={faculty.profile_image || '/placeholder-faculty.svg'} 
                                alt={faculty.full_name}
                                className="faculty-detail-image"
                                onError={(e) => {
                                    e.target.src = '/placeholder-faculty.svg';
                                }}
                            />
                            <div className="faculty-title-section">
                                <h3 className="faculty-designation">{faculty.designation}</h3>
                                <div className="title-divider"></div>
                                <h1 className="faculty-name">{faculty.full_name}</h1>
                                <p className="faculty-department">{getDepartmentFullName(faculty.department)}</p>
                            </div>
                        </div>

                        {/* Right Column - Info Cards */}
                        <div className="faculty-right-column">
                            {/* Personal Information Card */}
                            <div className="info-card personal-info">
                                <h3>Personal Information</h3>
                                <div className="info-row">
                                    <span className="label">Name :</span>
                                    <span className="value">{faculty.full_name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Gender :</span>
                                    <span className="value">-</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Birth Date :</span>
                                    <span className="value">-</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Designation :</span>
                                    <span className="value">{faculty.designation}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Department :</span>
                                    <span className="value">{getDepartmentFullName(faculty.department)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Date of Joining :</span>
                                    <span className="value">{faculty.date_of_joining}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Research/Teaching Experience :</span>
                                    <span className="value">{faculty.experience}</span>
                                </div>
                            </div>

                            {/* Contact Information Card */}
                            <div className="info-card contact-info" style={{ marginTop: '0px', marginBottom: '0px' }}>
                                <h3>Contact Information</h3>
                                <div className="info-row">
                                    <span className="label">Address :</span>
                                    <span className="value">
                                        Department of {getDepartmentFullName(faculty.department)}, National Institute of Technology Goa,
                                        Kotamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Email Address :</span>
                                    <span className="value">
                                        <a href={`mailto:${faculty.email}`}>{faculty.email}</a>
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Phone [Office] :</span>
                                    <span className="value">{faculty.phone || 'Not Available'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Phone [Mobile] :</span>
                                    <span className="value">-</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Office Extension :</span>
                                    <span className="value">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Sections */}
                    <div className="expandable-sections">
                        {/* Research Area */}
                        <div className="expandable-section">
                            <button 
                                className={`section-header ${activeSection === 'research' ? 'active' : ''}`}
                                onClick={() => setActiveSection(activeSection === 'research' ? '' : 'research')}
                            >
                                <span className="expand-icon">
                                    <i className={`fas ${activeSection === 'research' ? 'fa-minus' : 'fa-plus'}`}></i>
                                </span>
                                Research Area
                                <span className="chevron">
                                    <i className={`fas ${activeSection === 'research' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </span>
                            </button>
                            {activeSection === 'research' && (
                                <div className="section-content">
                                    <ul className="research-list">
                                        {researchAreas.map((area, index) => (
                                            <li key={index}>{area}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Courses Taught */}
                        <div className="expandable-section">
                            <button 
                                className={`section-header ${activeSection === 'courses' ? 'active' : ''}`}
                                onClick={() => setActiveSection(activeSection === 'courses' ? '' : 'courses')}
                            >
                                <span className="expand-icon">
                                    <i className={`fas ${activeSection === 'courses' ? 'fa-minus' : 'fa-plus'}`}></i>
                                </span>
                                Courses Taught
                                <span className="chevron">
                                    <i className={`fas ${activeSection === 'courses' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </span>
                            </button>
                            {activeSection === 'courses' && (
                                <div className="section-content">
                                    <div className="courses-grid">
                                        <div className="course-category">
                                            <h4>UG Courses</h4>
                                            <ul>
                                                {mockCourses.ug.map((course, index) => (
                                                    <li key={index}>{course}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="course-category">
                                            <h4>PG Courses</h4>
                                            <ul>
                                                {mockCourses.pg.map((course, index) => (
                                                    <li key={index}>{course}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Academic Information */}
                        <div className="expandable-section">
                            <button 
                                className={`section-header ${activeSection === 'academic' ? 'active' : ''}`}
                                onClick={() => setActiveSection(activeSection === 'academic' ? '' : 'academic')}
                            >
                                <span className="expand-icon">
                                    <i className={`fas ${activeSection === 'academic' ? 'fa-minus' : 'fa-plus'}`}></i>
                                </span>
                                Academic Information
                                <span className="chevron">
                                    <i className={`fas ${activeSection === 'academic' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </span>
                            </button>
                            {activeSection === 'academic' && (
                                <div className="section-content">
                                    <div className="academic-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Degree/Diploma</th>
                                                    <th>Institute / University</th>
                                                    <th>Year</th>
                                                    <th>Subject</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {education.map((edu, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{edu.degree}</td>
                                                        <td>{edu.institute}</td>
                                                        <td>{edu.year}</td>
                                                        <td>{edu.subject}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default FacultyDetails;
