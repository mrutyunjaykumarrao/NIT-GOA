import React from 'react';
import './BTechDasa.css';
import dasaData from './BTechDasa.json';

const BTechDasa = () => {

    return (
        <div className="btech-dasa-admissions-page">
            <div className="btech-dasa-admissions-container">
                {/* Header Section */}
                <div className="btech-dasa-admissions-hero" style={{textAlign: 'center'}}>
                    <div className="btech-dasa-hero-content" style={{textAlign: 'center'}}>
                        <h1 style={{textAlign: 'center'}}>{dasaData.title}</h1>
                        <p className="btech-dasa-hero-subtitle" style={{textAlign: 'center'}}>{dasaData.subtitle}</p>
                        <div className="btech-dasa-ccmt-info">
                            <span className="btech-dasa-ccmt-label">Through {dasaData.examInfo.title}</span>
                            <span className="btech-dasa-ccmt-desc">{dasaData.examInfo.description}</span>
                        </div>
                    </div>
                </div>

                {/* Admission Process Overview */}
                <section className="btech-dasa-programs-section">
                    <h2 className="btech-dasa-section-title">{dasaData.dasaScheme.title}</h2>
                    <div className="btech-dasa-admission-overview">
                        <div className="btech-dasa-process-card">
                            <h3>Eligibility & Examination</h3>
                            <p>
                                {dasaData.dasaScheme.eligibility}
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
                <section className="btech-dasa-programs-section">
                    <h2 className="btech-dasa-section-title">B.Tech Programs Offered</h2>
                    <div className="btech-dasa-programs-tiles">
                        {dasaData.programs.map((program, index) => (
                            <div key={index} className="btech-dasa-program-tile" style={{textAlign: 'center'}}>
                                <h3 style={{textAlign: 'center'}}>{program.department}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Resources */}
                <section className="btech-dasa-quick-access-section">
                    <h2 className="btech-dasa-section-title">Important Resources</h2>
                    <div className="btech-dasa-quick-links-grid">
                        {dasaData.resources.map((resource, index) => (
                            <a key={index} href={resource.link} target="_blank" rel="noopener noreferrer" className="btech-dasa-quick-link-card">
                                <h3>{resource.title}</h3>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Contact Information */}
                <section className="btech-dasa-info-section">
                    <h2 className="btech-dasa-section-title">Contact Information</h2>
                    <div className="btech-dasa-info-grid">
                        <div className="btech-dasa-info-card">
                            <h3>{dasaData.contact.headquarters.title}</h3>
                            <div className="btech-dasa-contact-details">
                                <div className="btech-dasa-contact-item">
                                    <span className="btech-dasa-contact-label">E-Mail:</span>
                                    <span>
                                        <a href={`mailto:${dasaData.contact.headquarters.email}`}>{dasaData.contact.headquarters.email}</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="btech-dasa-info-card">
                            <h3>{dasaData.contact.nitgoa.name}</h3>
                            <p>{dasaData.contact.nitgoa.designation}</p>
                            <p>{dasaData.contact.nitgoa.institute}</p>
                            <p>{dasaData.contact.nitgoa.address}</p>
                            <div className="btech-dasa-contact-details">
                                <div className="btech-dasa-contact-item">
                                    <span className="btech-dasa-contact-label">E-Mail:</span>
                                    <span><a href={`mailto:${dasaData.contact.nitgoa.email}`}>{dasaData.contact.nitgoa.email}</a></span>
                                </div>
                                <div className="btech-dasa-contact-item">
                                    <span className="btech-dasa-contact-label">Ph. No.:</span>
                                    <span><a href={`tel:${dasaData.contact.nitgoa.phone}`}>{dasaData.contact.nitgoa.phone}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Important Note */}
                <section className="btech-dasa-info-section">
                    <div className="btech-dasa-info-grid">
                        <div className="btech-dasa-info-card">
                            <div className="btech-dasa-note">
                                <p><strong>Note:</strong> {dasaData.notes[0]}</p>
                                <p>{dasaData.notes[1]}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BTechDasa;