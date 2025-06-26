import React from 'react';
import './BTechJosaa.css';

const BTechJosaa = () => {
    // JoSAA/CSAB program data - following M.Tech page pattern
    const josaaData = {
        title: "B.Tech Admissions - JoSAA/CSAB",
        subtitle: "Joint Seat Allocation Authority & Central Seat Allocation Board",
        examInfo: {
            title: "JEE Main 2025",
            description: "Joint Entrance Examination (Main)",
            website: "https://jeemain.nta.nic.in/"
        },
        programs: [
            {
                department: "Computer Science & Engineering",
                specialization: "Computer Science & Engineering",
                seats: "120",
                description: "Our Computer Science & Engineering program offers comprehensive education in software development, artificial intelligence, machine learning, and data science. Students gain practical experience through hands-on projects and industry collaborations.",
                objectives: [
                    "To provide strong foundation in computer science principles and software engineering practices",
                    "To develop skills in emerging technologies like AI, ML, and cybersecurity",
                    "To prepare students for leadership roles in technology industries and research organizations"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/academics/ComputerScience.html"
            },
            {
                department: "Electronics & Communication Engineering",
                specialization: "Electronics & Communication Engineering", 
                seats: "60",
                description: "The ECE program focuses on communication systems, VLSI design, signal processing, and IoT technologies. Students learn to design and develop electronic systems for various applications in telecommunications and embedded systems.",
                objectives: [
                    "To provide expertise in analog and digital communication systems",
                    "To develop skills in VLSI design and embedded system development", 
                    "To prepare students for careers in telecommunications and electronics industries"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/academics/Electronics.html"
            },
            {
                department: "Electrical & Electronics Engineering",
                specialization: "Electrical & Electronics Engineering",
                seats: "60", 
                description: "Our EEE program covers power systems, control systems, power electronics, and renewable energy technologies. Students gain knowledge in electrical power generation, transmission, and utilization systems.",
                objectives: [
                    "To provide comprehensive knowledge in electrical power systems and electronics",
                    "To develop expertise in renewable energy and smart grid technologies",
                    "To prepare students for careers in power industry and electrical consultancy"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/academics/Electrical.html"
            },
            {
                department: "Civil Engineering",
                specialization: "Civil Engineering",
                seats: "60",
                description: "The Civil Engineering program encompasses structural engineering, environmental engineering, transportation, and construction management. Students learn to design and construct sustainable infrastructure projects.",
                objectives: [
                    "To provide strong foundation in structural and environmental engineering",
                    "To develop skills in sustainable construction and project management",
                    "To prepare students for careers in infrastructure development and consultancy"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/academics/Civil.html"
            },
            {
                department: "Mechanical Engineering", 
                specialization: "Mechanical Engineering",
                seats: "60",
                description: "Our Mechanical Engineering program covers manufacturing, design, thermal systems, and robotics. Students gain expertise in mechanical system design, analysis, and manufacturing processes.",
                objectives: [
                    "To provide comprehensive knowledge in mechanical design and manufacturing",
                    "To develop expertise in automation and robotics technologies",
                    "To prepare students for careers in automotive, aerospace, and manufacturing industries"
                ],
                syllabusLink: "https://www.nitgoa.ac.in/academics/Mechnical.html"
            }
        ],
        contact: {
            name: "Dr. Ravi Ragoju",
            designation: "Centre In-Charge, UG Admissions (JoSAA/CSAB)",
            institute: "National Institute of Technology Goa",
            address: "Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703",
            email: "ravi@nitgoa.ac.in",
            additionalEmail: "ugadmissions@nitgoa.ac.in",
            phone: "9404715466"
        },
        resources: [
            {
                title: "JoSAA Official Portal",
                link: "http://josaa.nic.in"
            },
            {
                title: "CSAB Official Portal", 
                link: "http://csab.nic.in"
            },
            {
                title: "JoSAA 2024 Online Reporting Schedule",
                link: "https://cdnbbsr.s3waas.gov.in/s313111c20aee51aeb480ecbd988cd8cc9/uploads/2024/06/2024062757.pdf"
            },
            {
                title: "JoSAA 2024 Business Rules",
                link: "https://cdnbbsr.s3waas.gov.in/s313111c20aee51aeb480ecbd988cd8cc9/uploads/2024/06/2024062773.pdf"
            },
            {
                title: "Opening & Closing Ranks (CSAB Special Round-II)",
                link: "https://admissions.nic.in/csabspl/Applicant/SeatAllotmentResult/CurrentORCR.aspx"
            },
            {
                title: "Opening & Closing Ranks (JoSAA Round-6)",
                link: "https://josaa.admissions.nic.in/applicant/SeatAllotmentResult/CurrentORCR.aspx"
            }
        ]
    };

    return (
        <div className="admissions-page">
            <div className="admissions-container">
                {/* Header Section */}
                <div className="admissions-hero">
                    <div className="hero-content">
                        <h1>{josaaData.title}</h1>
                        <p className="hero-subtitle">{josaaData.subtitle}</p>
                        <div className="ccmt-info">
                            <span className="ccmt-label">Through {josaaData.examInfo.title}</span>
                            <span className="ccmt-desc">{josaaData.examInfo.description}</span>
                        </div>
                    </div>
                </div>

                {/* Admission Process Overview */}
                <section className="programs-section">
                    <h2 className="section-title">Admission Process</h2>
                    <div className="admission-overview">
                        <div className="process-card">
                            <h3>Eligibility & Examination</h3>
                            <p>
                                Admission to Undergraduate Engineering Programs for candidates from India at NITs, IIITs, 
                                and other centrally funded Technical Institutions is based on performance in Class 12/other 
                                Qualifying Examination and Joint Entrance Examination (JEE Main).
                            </p>
                            <div className="key-points">
                                <div className="point-item">
                                    <span className="point-icon">✓</span>
                                    <span>Qualify JEE Main examination</span>
                                </div>
                                <div className="point-item">
                                    <span className="point-icon">✓</span>
                                    <span>Register for JoSAA counselling</span>
                                </div>
                                <div className="point-item">
                                    <span className="point-icon">✓</span>
                                    <span>Fill choice preferences</span>
                                </div>
                                <div className="point-item">
                                    <span className="point-icon">✓</span>
                                    <span>Participate in seat allotment rounds</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section className="programs-section">
                    <h2 className="section-title">B.Tech Programs Offered</h2>
                    <div className="programs-list">
                        {josaaData.programs.map((program, index) => (
                            <div key={index} className="program-section">
                                <div className="program-header">
                                    <h3 className="program-title">{program.department}</h3>
                                    <div className="program-meta">
                                        <span className="specialization">Program: {program.specialization}</span>
                                        <span className="seats">Total Seats: {program.seats}</span>
                                    </div>
                                </div>
                                
                                <div className="program-content">
                                    <div className="program-description">
                                        <h4>About the Program</h4>
                                        <p>{program.description}</p>
                                    </div>
                                    
                                    <div className="program-objectives">
                                        <h4>Program Highlights</h4>
                                        <ul>
                                            {program.objectives.map((objective, idx) => (
                                                <li key={idx}>{objective}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="program-actions">
                                        <a href={program.syllabusLink} target="_blank" rel="noopener noreferrer" className="syllabus-link">
                                            View Department Details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Resources */}
                <section className="quick-access-section">
                    <h2 className="section-title">Important Resources</h2>
                    <div className="quick-links-grid">
                        {josaaData.resources.map((resource, index) => (
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
                            <h3>{josaaData.contact.name}</h3>
                            <p>{josaaData.contact.designation}</p>
                            <p>{josaaData.contact.institute}</p>
                            <p>{josaaData.contact.address}</p>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <span className="contact-label">E-Mail:</span>
                                    <span>
                                        <a href={`mailto:${josaaData.contact.email}`}>{josaaData.contact.email}</a>
                                        {josaaData.contact.additionalEmail && (
                                            <> | <a href={`mailto:${josaaData.contact.additionalEmail}`}>{josaaData.contact.additionalEmail}</a></>
                                        )}
                                    </span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Ph. No.:</span>
                                    <span>{josaaData.contact.phone}</span>
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
                                <p><strong>Note:</strong> For the latest updates and detailed information about the admission process, 
                                regularly visit the <a href="http://josaa.nic.in" target="_blank" rel="noopener noreferrer">JoSAA official website</a> 
                                and <a href="http://csab.nic.in" target="_blank" rel="noopener noreferrer">CSAB official website</a>.</p>
                                <p>Secure and separate hostel accommodation for boys and girls is available for all branches.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BTechJosaa;
