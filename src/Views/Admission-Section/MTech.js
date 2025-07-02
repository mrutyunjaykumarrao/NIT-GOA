import React from 'react';
import './Admissions.css';

const Admissions = () => {
    // M.Tech Program data - clean and professional
    const mtechData = {
        title: "M.Tech Admissions",
        subtitle: "Master of Technology Programs at NIT Goa",
        ccmtInfo: {
            title: "CCMT-2025",
            description: "Centralized Counselling for M.Tech/M.Plan",
            website: "https://ccmt.admissions.nic.in/"
        },
        programs: [
            {
                department: "Computer Science and Engineering",
                specialization: "Computer Science and Engineering",
                seats: "23 + 2*",
                description: "The M. Tech. programme in Computer Science and Engineering is aimed at preparing Computer professionals for research, academics, design and development in hardware, software and co-design technologies. The purpose of the programme is to generate human resource capable of supporting Research and Development activities in critical areas of computer science and engineering. The programme focuses on practical implementations of the ideas by means of research oriented projects and courses in collaboration with the industries to bring in acclaimed professionals to share their knowledge and experience. The Post graduate programme offers an opportunity to work on latest research topics in Computer Science and Engineering.",
                objectives: [
                    "To provide students with a strong foundation in Computer Science & Engineering to formulate, solve and analyze engineering problems and to prepare them for graduate studies, R&D and consultancy",
                    "Students will establish themselves as effective professionals by solving real problems through the use of computer science knowledge",
                    "To provide exposure to emerging cutting edge technologies, adequate training & opportunities to work as teams on multidisciplinary projects with effective communication skills and leadership qualities"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/admissions/uploaded_files/PG_Academic_Handbook_M._Tech_(CSE).pdf"
            },
            {
                department: "Electronics and Communication Engineering",
                specialization: "VLSI",
                seats: "23 + 2*",
                description: "Semiconductor industry has been witnessing tremendous growth over the past few years with rising demand for electronic products. India has a well-developed semiconductor design industry with more than 120 design units. Various global semiconductor companies have established their design centres in the country with design revenues comparable with developed countries. India Semiconductor Association (ISA) estimated that semiconductor and electronics driven products will drive the US$ 400 billion to Indian electronics market by 2020. These advances demand for the skilled engineers. Productivity of the Workforce is the main challenge faced by the semiconductor industry. Companies still have to spend a huge amount of time/money in training fresh B.Tech graduates. The hiring trend for VLSI related jobs require a deeper level of expertise, preferably Masters and Ph. D in VLSI domain. Thus academic institutions like NIT GOA can play a key role in developing quality human resource through domain specific M.Tech and Ph. D programmes.",
                objectives: [
                    "To provide hands-on design capabilities for Analog, Digital, and Mixed signal IC design in low power Nanometric Technology",
                    "To provide exposure in terms of Design, Model, Simulate and Implementation methodologies using EDA and TCAD Tools",
                    "To introduce with new emerging Technologies in VLSI/ULSI for ultra-low-power applications"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/admissions/uploaded_files/MTech_Curriculum_Final__on_23-04-14.pdf"
            },
            {
                department: "Electrical and Electronics Engineering",
                specialization: "Power Electronics and Power Systems",
                seats: "22 + 2*",
                description: "Power Electronics is the application of solid-state electronics for the control and conversion of electric power. It refers to a subject of research in Electrical and Electronics Engineering which deals with design, control, computation and integration of nonlinear, time varying energy processing electronic systems with fast dynamics.",
                objectives: [
                    "To train graduate engineers in the field of Power Electronics and Power Systems",
                    "To make them versatile in new emerging Technologies for high power applications",
                    "To train competent engineers and professionals, who can meet the demands of the industries as well as academia in the fields of power electronics and power systems"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/admissions/uploaded_files/PG_M.Tech_(PEPS)_EEE_Syllabus.pdf"
            }
        ],
        contact: {
            name: "Dr. Venkatanareshbabu Kuppili",
            designation: "Centre In-Charge, CCMT/PG Admissions",
            institute: "National Institute of Technology Goa",
            address: "Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703",
            email: "pgadmissions@nitgoa.ac.in",
            phone: "9049436708"
        },
        resources: [
            {
                title: "CCMT Information Brochure 2025",
                link: "https://www.nitgoa.ac.in/uploads/ccmtbrochure2025.pdf"
            },
            {
                title: "Fee Structure 2025-26",
                link: "https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf"
            },
            {
                title: "CCMT Schedule 2025",
                link: "https://ccmt.admissions.nic.in/schedule/"
            },
            {
                title: "Admission Brochure 2024",
                link: "https://www.nitgoa.ac.in/uploads/AdmissionBrochure2024.pdf"
            }
        ]
    };

    return (
        <div className="admissions-page">
            <div className="admissions-container">
                {/* Header Section */}
                <div className="admissions-hero">
                    <div className="hero-content">
                        <h1>{mtechData.title}</h1>
                        <p className="hero-subtitle">{mtechData.subtitle}</p>
                        <div className="ccmt-info">
                            <span className="ccmt-label">Through {mtechData.ccmtInfo.title}</span>
                            <span className="ccmt-desc">{mtechData.ccmtInfo.description}</span>
                        </div>
                    </div>
                </div>
                {/* Programs Section */}
                <section className="programs-section">
                    <h2 className="section-title">Programs Offered</h2>
                    <div className="programs-list">
                        {mtechData.programs.map((program, index) => (
                            <div key={index} className="program-section">
                                <div className="program-header">
                                    <h3 className="program-title">{program.department}</h3>
                                    <div className="program-meta">
                                        <span className="specialization">Specialization: {program.specialization}</span>
                                        <span className="seats">Seats Available: {program.seats}</span>
                                    </div>
                                </div>
                                
                                <div className="program-content">
                                    <div className="program-description">
                                        <h4>About the Program</h4>
                                        <p>{program.description}</p>
                                    </div>
                                    
                                    <div className="program-objectives">
                                        <h4>Program Objectives</h4>
                                        <ul>
                                            {program.objectives.map((objective, idx) => (
                                                <li key={idx}>{objective}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="program-actions">
                                        <a href={program.syllabusLink} target="_blank" rel="noopener noreferrer" className="syllabus-link">
                                            Download Syllabus
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hostel Accommodation Note */}
                <section className="hostel-note-section">
                    <div className="hostel-note">
                        <p><strong>Note:</strong> Secure and separate hostel accommodation for boys and girls are available for all branches.</p>
                    </div>
                </section>

                {/* Important Resources */}
                <section className="quick-access-section">
                    <h2 className="section-title">Important Resources</h2>
                    <div className="quick-links-grid">
                        {mtechData.resources.map((resource, index) => (
                            <a key={index} href={resource.link} target="_blank" rel="noopener noreferrer" className="quick-link-card">
                                <h3>{resource.title}</h3>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Contact Information */}
                <section className="info-section">
                    <h2 className="section-title">Contact Information</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>{mtechData.contact.name}</h3>
                            <p>{mtechData.contact.designation}</p>
                            <p>{mtechData.contact.institute}</p>
                            <p>{mtechData.contact.address}</p>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <span className="contact-label">E-Mail:</span>
                                    <span><a href={`mailto:${mtechData.contact.email}`}>{mtechData.contact.email}</a></span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Ph. No.:</span>
                                    <span>{mtechData.contact.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Important Note */}
                <section className="info-section">
                    <div className="info-grid">
                        <div className="info-card">
                            <div className="note">
                                <p><strong>Note:</strong> *2 seats are meant for sponsored candidates. Secure and separate hostel accommodation is available for all branches.</p>
                                <p>For detailed information about the admission process, visit the <a href={mtechData.ccmtInfo.website} target="_blank" rel="noopener noreferrer">CCMT official website</a>.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admissions;