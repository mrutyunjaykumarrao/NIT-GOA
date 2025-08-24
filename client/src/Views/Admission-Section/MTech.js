import React from 'react';
import './MTech.css';
import mtechData from './MTech.json';

const MTech = () => {

    return (
        <div className="mtech-page">
            <div className="mtech-container">
                {/* Header Section */}
                <div className="mtech-hero">
                    <div className="mtech-hero-content">
                        <h1>{mtechData.title}</h1>
                        <p className="mtech-hero-subtitle">{mtechData.subtitle}</p>
                        <div className="mtech-ccmt-info">
                            <span className="mtech-ccmt-label">Through {mtechData.ccmtInfo.title}</span>
                            <span className="mtech-ccmt-desc">{mtechData.ccmtInfo.description}</span>
                        </div>
                    </div>
                </div>
                {/* Programs Section */}
                <section className="mtech-programs-section">
                    <h2 className="mtech-section-title">Programs Offered</h2>
                    <div className="mtech-programs-list">
                        {mtechData.programs.map((program, index) => (
                            <div key={index} className="mtech-program-section">
                                <div className="mtech-program-header">
                                    <h3 className="mtech-program-title">{program.department}</h3>
                                    <div className="mtech-program-meta">
                                        <span className="mtech-specialization">Specialization: {program.specialization}</span>
                                        <span className="mtech-seats">Seats Available: {program.seats}</span>
                                    </div>
                                </div>
                                
                                <div className="mtech-program-content">
                                    <div className="mtech-program-description">
                                        <h4>About the Program</h4>
                                        <p>{program.description}</p>
                                    </div>
                                    
                                    <div className="mtech-program-objectives">
                                        <h4>Program Objectives</h4>
                                        <ul>
                                            {program.objectives.map((objective, idx) => (
                                                <li key={idx}>{objective}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="mtech-program-actions">
                                        <a href={program.syllabusLink} target="_blank" rel="noopener noreferrer" className="mtech-syllabus-link">
                                            Download Syllabus
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hostel Accommodation Note */}
                <section className="mtech-hostel-note-section">
                    <div className="mtech-hostel-note">
                        <p><strong>Note:</strong> {mtechData.notes[1]}</p>
                    </div>
                </section>

                {/* Important Resources */}
                <section className="mtech-quick-access-section">
                    <h2 className="mtech-section-title">Important Resources</h2>
                    <div className="mtech-quick-links-grid">
                        {mtechData.resources.map((resource, index) => (
                            <a key={index} href={resource.link} target="_blank" rel="noopener noreferrer" className="mtech-quick-link-card">
                                <h3>{resource.title}</h3>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Contact Information */}
                <section className="mtech-info-section">
                    <h2 className="mtech-section-title">Contact Information</h2>
                    <div className="mtech-info-grid">
                        <div className="mtech-info-card">
                            <h3>{mtechData.contact.name}</h3>
                            <p>{mtechData.contact.designation}</p>
                            <p>{mtechData.contact.institute}</p>
                            <p>{mtechData.contact.address}</p>
                            <div className="mtech-contact-details">
                                <div className="mtech-contact-item">
                                    <span className="mtech-contact-label">E-Mail:</span>
                                    <span><a href={`mailto:${mtechData.contact.email}`}>{mtechData.contact.email}</a></span>
                                </div>
                                <div className="mtech-contact-item">
                                    <span className="mtech-contact-label">Ph. No.:</span>
                                    <span><a href={`tel:${mtechData.contact.phone}`}>{mtechData.contact.phone}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Important Note */}
                <section className="mtech-info-section">
                    <div className="mtech-info-grid">
                        <div className="mtech-info-card">
                            <div className="mtech-note">
                                <p><strong>Note:</strong> {mtechData.notes[0]}</p>
                                <p>For detailed information about the admission process, visit the <a href={mtechData.ccmtInfo.website} target="_blank" rel="noopener noreferrer">CCMT official website</a>.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MTech;