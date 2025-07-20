import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import './FacultyDetailsNew.css';

// Import detailed faculty data
import veenaData from './data/veena';
import DamodarData from './data/damodar';
import keshavamurthyData from './data/keshavamurthy';
import miniData from './data/mini';
import pravatiData from './data/pravati';
import venkatanareshbabuData from './data/venkatanareshbabu';

// Import faculty images for fallback
import VeenaThenkanidiyoor from '../../../assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png';
import DamodarReddyEdla from '../../../assets/images/Faculty/CSE/Dr. Damodar Reddy Edla.png';
import Purushothama from '../../../assets/images/Faculty/CSE/Dr. Purushothama.jpg';
import KeshavamurthyBN from '../../../assets/images/Faculty/CSE/Dr. Keshavamurthy B.N..png';
import SMini from '../../../assets/images/Faculty/CSE/Dr. S. Mini.png';
import VenkatanareshbabuKuppili from '../../../assets/images/Faculty/CSE/Dr. Venkatanareshbabu Kuppili.jpg';
import ModiChiragNavinchandra from '../../../assets/images/Faculty/CSE/Dr. Modi Chirag Navinchandra.png';
import Antara from '../../../assets/images/Faculty/CSE/Antara.jpg';
import Kashinath from '../../../assets/images/Faculty/CSE/kashinath.jpg';
import MeenakshiPanda from '../../../assets/images/Faculty/CSE/meenakshipanda.jpeg';
import ParavatiCSE from '../../../assets/images/Faculty/CSE/paravati_cse.png';
import Pasha from '../../../assets/images/Faculty/CSE/pasha.jpg';
import Srividya from '../../../assets/images/Faculty/CSE/srividya.jpeg';

const FacultyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        research: true,
        courses: false,
        academic: false,
        papers: false,
        research_guidance: false,
        funded_projects: false,
        awards: false,
        memberships: false,
        professional_services: false,
        training_attended: false,
        training_conducted: false
    });

    // Mapping of faculty IDs to their detailed data
    const facultyDetailedData = {
        'veena-thenkanidiyoor': {
            ...veenaData,
            image: VeenaThenkanidiyoor,
            id: 'veena-thenkanidiyoor'
        },
        'damodar-reddy-edla': {
            ...DamodarData,
            image: DamodarReddyEdla,
            id: 'damodar-reddy-edla'
        },
        'keshavamurthy-bn': {
            ...keshavamurthyData,
            image: KeshavamurthyBN,
            id: 'keshavamurthy-bn'
        },
        's-mini': {
            ...miniData,
            image: SMini,
            id: 's-mini'
        },
        'paravati': {
            ...pravatiData,
            image: ParavatiCSE,
            id: 'paravati'
        },
        'venkatanareshbabu-kuppili': {
            ...venkatanareshbabuData,
            image: VenkatanareshbabuKuppili,
            id: 'venkatanareshbabu-kuppili'
        }
    };

    // Fallback data for faculty without detailed information
    const createFallbackData = (id) => {
        const facultyImages = {
            'purushothama-br': { name: 'Dr. Purushothama B.R', image: Purushothama },
            'modi-chirag-navinchandra': { name: 'Dr. Modi Chirag Navinchandra', image: ModiChiragNavinchandra },
            'suniliya-s': { name: 'Ms. Suniliya S.', image: Srividya },
            'meenakshi-panda': { name: 'Dr. Meenakshi Panda', image: MeenakshiPanda },
            'antara': { name: 'Ms. Antara', image: Antara },
            'kashinath': { name: 'Mr. Kashinath', image: Kashinath },
            'pasha': { name: 'Mr. Pasha', image: Pasha }
        };

        const defaultFaculty = facultyImages[id];
        if (!defaultFaculty) return null;

        // Use sample data from existing faculty for structure
        const sampleData = veenaData;
        
        return {
            basicInfo: {
                name: defaultFaculty.name,
                position: "Associate Professor",
                department: "Computer Science and Engineering",
                qualification: "B.Tech., M.Tech., Ph.D.",
                specialization: "Computer Science and Engineering",
                experience: "10+ years",
                joiningDate: "2015"
            },
            contactInfo: {
                office: {
                    address: "Department of Computer Science & Engineering, National Institute of Technology Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703",
                    email: `${id.replace(/-/g, '.')}@nitgoa.ac.in`,
                    phone: {
                        residence: "-",
                        mobile: "-",
                        extension: "Extension No.: - (Internal)"
                    }
                }
            },
            researchAreas: sampleData.researchAreas.slice(0, 4), // Use first 4 research areas as sample
            education: sampleData.education.slice(0, 3), // Sample education
            coursesTeaching: {
                undergraduate: sampleData.coursesTeaching.undergraduate.slice(0, 5),
                postgraduate: sampleData.coursesTeaching.postgraduate.slice(0, 3)
            },
            publications: {
                journals: sampleData.publications.journals.slice(0, 3),
                conferences: sampleData.publications.conferences?.slice(0, 2) || []
            },
            professionalExperience: sampleData.professionalExperience?.slice(0, 2) || [],
            awards: sampleData.awards?.slice(0, 2) || [],
            memberships: sampleData.memberships?.slice(0, 2) || [],
            image: defaultFaculty.image,
            id: id
        };
    };

    useEffect(() => {
        const fetchFacultyDetails = async () => {
            try {
                setLoading(true);
                
                // Check if detailed data exists for this faculty
                let facultyData = facultyDetailedData[id];
                
                // If no detailed data, create fallback data
                if (!facultyData) {
                    facultyData = createFallbackData(id);
                }
                
                if (facultyData) {
                    setFaculty(facultyData);
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

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderPersonalInformation = () => (
        <div className="personal-information-section">
            <div className="section-header-main">
                <h2>Personal Information</h2>
            </div>
            <div className="personal-info-grid">
                <div className="info-item">
                    <span className="info-label">Name :</span>
                    <span className="info-value">{faculty?.basicInfo?.name || faculty?.personalInfo?.name || faculty?.name}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Gender :</span>
                    <span className="info-value">{faculty?.personal?.gender || "-"}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Birth Date :</span>
                    <span className="info-value">{faculty?.personal?.birthDate || "-"}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Designation :</span>
                    <span className="info-value">{faculty?.basicInfo?.position || faculty?.personalInfo?.designation || faculty?.designation}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Department :</span>
                    <span className="info-value">{faculty?.basicInfo?.department || faculty?.department}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Date of Joining :</span>
                    <span className="info-value">{faculty?.basicInfo?.joiningDate || faculty?.personalInfo?.joiningDate || faculty?.personal?.dateOfJoining}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Research/Teaching Experience :</span>
                    <span className="info-value">{faculty?.basicInfo?.experience || faculty?.personal?.experience || "10+ years"} at NIT Goa</span>
                </div>
            </div>
        </div>
    );

    const renderContactInformation = () => (
        <div className="contact-information-section">
            <div className="section-header-main">
                <h2>Contact Information</h2>
            </div>
            <div className="contact-info-grid">
                <div className="contact-item full-width">
                    <span className="contact-label">Address :</span>
                    <span className="contact-value">
                        {faculty?.contactInfo?.office?.address || faculty?.contact?.address || 
                        "National Institute of Technology Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703"}
                    </span>
                </div>
                <div className="contact-item">
                    <span className="contact-label">Email Address :</span>
                    <span className="contact-value">
                        <a href={`mailto:${faculty?.contactInfo?.office?.email || faculty?.contactInfo?.emailPrimary || faculty?.contact?.email || faculty?.email}`}>
                            {faculty?.contactInfo?.office?.email || faculty?.contactInfo?.emailPrimary || faculty?.contact?.email || faculty?.email}
                        </a>
                    </span>
                </div>
                <div className="contact-item">
                    <span className="contact-label">Phone [Residence] :</span>
                    <span className="contact-value">{faculty?.contactInfo?.office?.phone?.residence || faculty?.contact?.phone || "-"}</span>
                </div>
                <div className="contact-item">
                    <span className="contact-label">Phone [Mobile] :</span>
                    <span className="contact-value">{faculty?.contactInfo?.office?.phone?.mobile || faculty?.contact?.mobile || "-"}</span>
                </div>
                <div className="contact-item">
                    <span className="contact-label">Office Extension :</span>
                    <span className="contact-value">{faculty?.contactInfo?.office?.phone?.extension || faculty?.contact?.office || "-"}</span>
                </div>
            </div>
        </div>
    );

    const renderExpandableSection = (sectionKey, title, content) => (
        <div className="expandable-section">
            <button 
                className={`section-header ${expandedSections[sectionKey] ? 'active' : ''}`}
                onClick={() => toggleSection(sectionKey)}
            >
                <div className="expand-icon">
                    <i className={`fas fa-${expandedSections[sectionKey] ? 'minus' : 'plus'}`}></i>
                </div>
                {title}
                <div className="chevron">
                    <i className={`fas fa-chevron-${expandedSections[sectionKey] ? 'up' : 'down'}`}></i>
                </div>
            </button>
            {expandedSections[sectionKey] && (
                <div className="section-content">
                    {content}
                </div>
            )}
        </div>
    );

    const renderResearchAreas = () => (
        <ul className="research-list">
            {(faculty?.researchAreas || []).map((area, index) => (
                <li key={index}>{area}</li>
            ))}
        </ul>
    );

    const renderCoursesTeaching = () => (
        <div className="courses-grid">
            <div className="course-category">
                <h4>Undergraduate Courses</h4>
                <ul>
                    {(faculty?.coursesTeaching?.undergraduate || []).map((course, index) => (
                        <li key={index}>{course}</li>
                    ))}
                </ul>
            </div>
            <div className="course-category">
                <h4>Postgraduate Courses</h4>
                <ul>
                    {(faculty?.coursesTeaching?.postgraduate || []).map((course, index) => (
                        <li key={index}>{course}</li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const renderEducation = () => (
        <div className="academic-table">
            <table>
                <thead>
                    <tr>
                        <th>Degree</th>
                        <th>Institution</th>
                        <th>Year</th>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {(faculty?.education || faculty?.educationalBackground || []).map((edu, index) => (
                        <tr key={index}>
                            <td>{edu.degree}</td>
                            <td>{edu.institution}</td>
                            <td>{edu.year}</td>
                            <td>{edu.subject || edu.field}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderPublications = () => (
        <div className="publications-section">
            <div className="pub-category">
                <h4>Journal Publications</h4>
                <ul>
                    {(faculty?.publications?.journals || []).slice(0, 10).map((pub, index) => (
                        <li key={index}>
                            <strong>{pub.title}</strong><br/>
                            {pub.authors}<br/>
                            <em>{pub.journal}</em>
                            {pub.volume && `, Volume ${pub.volume}`}
                            {pub.pages && `, Pages ${pub.pages}`}
                            , {pub.year}
                            {pub.month && ` (${pub.month})`}
                        </li>
                    ))}
                </ul>
            </div>
            {faculty?.publications?.conferences && faculty.publications.conferences.length > 0 && (
                <div className="pub-category">
                    <h4>Conference Publications</h4>
                    <ul>
                        {faculty.publications.conferences.slice(0, 10).map((pub, index) => (
                            <li key={index}>
                                <strong>{pub.title}</strong><br/>
                                {pub.authors}<br/>
                                <em>{pub.conference}</em>
                                {pub.location && `, ${pub.location}`}
                                , {pub.year}
                                {pub.month && ` (${pub.month})`}
                                {pub.note && <br/>}
                                {pub.note && <span style={{color: 'var(--brand-primary)', fontWeight: 'bold'}}>{pub.note}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const renderResearchGuidance = () => (
        <div className="research-guidance-section">
            {faculty?.researchGuidance?.current && faculty.researchGuidance.current.length > 0 && (
                <div className="guidance-category">
                    <h4>Current Research Students</h4>
                    <ul>
                        {faculty.researchGuidance.current.map((student, index) => (
                            <li key={index}>
                                <strong>{student.student}</strong><br/>
                                Topic: {student.topic}<br/>
                                Status: {student.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const renderTrainingAttended = () => (
        <div className="training-section">
            <div className="academic-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Month/Year</th>
                            <th>Training/Workshop Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(faculty?.trainingsAttended || []).map((training, index) => (
                            <tr key={index}>
                                <td>{training.srNo}</td>
                                <td>{training.month} {training.year}</td>
                                <td>{training.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderTrainingConducted = () => (
        <div className="training-section">
            <div className="academic-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Month/Year</th>
                            <th>Training/Workshop Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(faculty?.trainingsConducted || []).map((training, index) => (
                            <tr key={index}>
                                <td>{training.srNo}</td>
                                <td>{training.month} {training.year}</td>
                                <td>{training.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="faculty-details-page">
                <div className="faculty-details-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading faculty details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="faculty-details-page">
                <div className="faculty-details-container">
                    <div className="error-container">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button className="back-btn" onClick={() => navigate('/faculty')}>
                            <i className="fas fa-arrow-left"></i> Back to Faculty Directory
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!faculty) return null;

    return (
        <div className={`faculty-details-page ${theme}`}>
            <div className="faculty-details-container">
                <button className="back-button" onClick={() => navigate('/faculty')}>
                    <i className="fas fa-arrow-left"></i> Back to Faculty Directory
                </button>

                <div className="faculty-main-content">
                    <div className="faculty-left-column">
                        <img 
                            src={faculty.image} 
                            alt={faculty?.basicInfo?.name || faculty?.personalInfo?.name}
                            className="faculty-detail-image" 
                        />
                        <div className="faculty-title-section">
                            <h2 className="faculty-designation">
                                {faculty?.basicInfo?.position || faculty?.personalInfo?.designation}
                            </h2>
                            <div className="title-divider"></div>
                            <h1 className="faculty-name">
                                {faculty?.basicInfo?.name || faculty?.personalInfo?.name}
                            </h1>
                            <p className="faculty-department">
                                {faculty?.basicInfo?.department}
                            </p>
                        </div>
                    </div>

                    <div className="faculty-right-column">
                        {renderPersonalInformation()}
                        {renderContactInformation()}
                    </div>
                </div>

                <div className="expandable-sections">
                    {renderExpandableSection('research', 'Research Area', renderResearchAreas())}
                    {renderExpandableSection('courses', 'Courses Taught', renderCoursesTeaching())}
                    {renderExpandableSection('academic', 'Academic Information', renderEducation())}
                    {renderExpandableSection('papers', 'Paper Published', renderPublications())}
                    
                    {faculty?.researchGuidance && renderExpandableSection('research_guidance', 'Research Guidance', renderResearchGuidance())}
                    
                    {faculty?.fundedProjects && renderExpandableSection('funded_projects', 'Funded Research Project',
                        <div>Funded research project information will be displayed here.</div>
                    )}
                    
                    {faculty?.awards && renderExpandableSection('awards', 'Award and Honor',
                        <div>Awards and honors will be displayed here.</div>
                    )}
                    
                    {faculty?.memberships && renderExpandableSection('memberships', 'Membership and Professional Society',
                        <div>Membership information will be displayed here.</div>
                    )}
                    
                    {faculty?.professionalServices && renderExpandableSection('professional_services', 'Professional Services',
                        <div>Professional services information will be displayed here.</div>
                    )}
                    
                    {faculty?.trainingsAttended && renderExpandableSection('training_attended', 'Training/Conferences/Short Term Courses Attended', renderTrainingAttended())}
                    
                    {faculty?.trainingsConducted && renderExpandableSection('training_conducted', 'Training/Conferences/Short Term Courses Conducted', renderTrainingConducted())}
                </div>
            </div>
        </div>
    );
};

export default FacultyDetails;
