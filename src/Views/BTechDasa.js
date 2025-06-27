import React from 'react';
import './BTechDasa.css';

const BTechDasa = () => {
    // DASA program data - following JoSAA page pattern
    const dasaData = {
        title: "B.Tech Admissions - DASA",
        subtitle: "Direct Admission of Students Abroad",
        examInfo: {
            title: "JEE Main 2025",
            description: "Joint Entrance Examination (Main)",
            website: "https://jeemain.nta.nic.in/"
        },
        programs: [
            {
                department: "Computer Science & Engineering",
                link: "https://www.nitgoa.ac.in/academics/ComputerScience.html"
            },
            {
                department: "Electronics & Communication Engineering",
                link: "https://www.nitgoa.ac.in/academics/Electronics.html"
            },
            {
                department: "Electrical & Electronics Engineering",
                link: "https://www.nitgoa.ac.in/academics/Electrical.html"
            },
            {
                department: "Civil Engineering",
                link: "https://www.nitgoa.ac.in/academics/Civil.html"
            },
            {
                department: "Mechanical Engineering",
                link: "https://www.nitgoa.ac.in/academics/Mechnical.html"
            }
        ],
        contact: {
            headquarters: {
                title: "Headquarters",
                email: "dasa2024help@nitrr.ac.in"
            },
            nitgoa: {
                name: "Dr. Ragoju Ravi",
                designation: "Centre In-Charge, Admissions (DASA)",
                institute: "National Institute of Technology Goa",
                address: "Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703",
                email: "ravi@nitgoa.ac.in | dasa@nitgoa.ac.in",
                phone: "+91 9404715466 | 0832-2404743"
            }
        },
        resources: [
            {
                title: "Schedule of DASA 2024 UG Counselling",
                link: "https://www.nitgoa.ac.in/uploads/DASA%20Schedule%202024.pdf"
            },
            {
                title: "DASA UG Brochure 2024",
                link: "https://www.nitgoa.ac.in/uploads/DASA%20Brochure%202024.pdf"
            },
            {
                title: "DASA Official Website",
                link: "https://dasanit.org"
            }
        ]
    };

    return (
        <div className="admissions-page">
            <div className="admissions-container">
                {/* Header Section */}
                <div className="admissions-hero" style={{textAlign: 'center'}}>
                    <div className="hero-content" style={{textAlign: 'center'}}>
                        <h1 style={{textAlign: 'center'}}>{dasaData.title}</h1>
                        <p className="hero-subtitle" style={{textAlign: 'center'}}>{dasaData.subtitle}</p>
                        <div className="ccmt-info">
                            <span className="ccmt-label">Through {dasaData.examInfo.title}</span>
                            <span className="ccmt-desc">{dasaData.examInfo.description}</span>
                        </div>
                    </div>
                </div>

                {/* Admission Process Overview */}
                <section className="programs-section">
                    <h2 className="section-title">DASA Scheme 2025</h2>
                    <div className="admission-overview">
                        <div className="process-card">
                            <h3>Eligibility & Examination</h3>
                            <p>
                                The UG admissions for academic year 2025-26 under DASA scheme shall be on the 
                                basis of the ranks obtained by the students in JEE(Main).
                            </p>
                            <p>
                                Admissions are open for <strong>Foreign Nationals / Persons of Indian Origin (PIOs) / 
                                Non-Resident Indians (NRIs)</strong> under Direct Admission of Students Abroad (DASA) 
                                Scheme to National Institutes of Technology (NITs), IIITs and other premier Technical 
                                Institutions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section className="programs-section">
                    <h2 className="section-title">B.Tech Programs Offered</h2>
                    <div className="programs-tiles">
                        {dasaData.programs.map((program, index) => (
                            <div key={index} className="program-tile" style={{textAlign: 'center'}}>
                                <h3 style={{textAlign: 'center'}}>{program.department}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Resources */}
                <section className="quick-access-section">
                    <h2 className="section-title">Important Resources</h2>
                    <div className="quick-links-grid">
                        {dasaData.resources.map((resource, index) => (
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
                            <h3>{dasaData.contact.headquarters.title}</h3>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <span className="contact-label">E-Mail:</span>
                                    <span>
                                        <a href={`mailto:${dasaData.contact.headquarters.email}`}>{dasaData.contact.headquarters.email}</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="info-card">
                            <h3>{dasaData.contact.nitgoa.name}</h3>
                            <p>{dasaData.contact.nitgoa.designation}</p>
                            <p>{dasaData.contact.nitgoa.institute}</p>
                            <p>{dasaData.contact.nitgoa.address}</p>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <span className="contact-label">E-Mail:</span>
                                    <span>{dasaData.contact.nitgoa.email}</span>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Ph. No.:</span>
                                    <span>{dasaData.contact.nitgoa.phone}</span>
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
                                regularly visit the <a href="https://dasanit.org" target="_blank" rel="noopener noreferrer">DASA official website</a>.</p>
                                <p>Secure and separate hostel accommodation for boys and girls is available for all branches.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BTechDasa;
