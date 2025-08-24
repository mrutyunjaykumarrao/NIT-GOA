import React from 'react';
import './BTechJosaa.css';
import josaaData from './BTechJosaa.json';

const BTechJosaa = () => {
    return (
        <div className="btech-josaa-admissions-page">
            <div className="btech-josaa-admissions-container">
                {/* Header Section */}
                <div className="btech-josaa-admissions-hero">
                    <div className="btech-josaa-hero-content">
                        <h1>{josaaData.title}</h1>
                        <p className="btech-josaa-hero-subtitle">{josaaData.subtitle}</p>
                        <div className="btech-josaa-ccmt-info">
                            <span className="btech-josaa-ccmt-label">Through {josaaData.examInfo.title}</span>
                            <span className="btech-josaa-ccmt-desc">{josaaData.examInfo.description}</span>
                        </div>
                    </div>
                </div>

                {/* Admission Process Overview */}
                <section className="btech-josaa-programs-section">
                    <h2 className="btech-josaa-section-title">{josaaData.admissionProcess.title}</h2>
                    <div className="btech-josaa-admission-overview">
                        <div className="btech-josaa-process-card">
                            <h3>Eligibility & Examination</h3>
                            <p>
                                {josaaData.admissionProcess.description}
                            </p>
                            <div className="btech-josaa-key-points">
                                {josaaData.admissionProcess.steps.map((step, index) => (
                                    <div key={index} className="btech-josaa-point-item">
                                        <span className="btech-josaa-point-icon">✓</span>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section className="btech-josaa-programs-section">
                    <h2 className="btech-josaa-section-title">B.Tech Programs Offered</h2>
                    <div className="btech-josaa-programs-tiles">
                        {josaaData.programs.map((program, index) => (
                            <div key={index} className="btech-josaa-program-tile">
                                <h3>{program.department}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Resources */}
                <section className="btech-josaa-quick-access-section">
                    <h2 className="btech-josaa-section-title">Important Resources</h2>
                    <div className="btech-josaa-quick-links-grid">
                        {josaaData.resources.map((resource, index) => (
                            <a key={index} href={resource.link} target="_blank" rel="noopener noreferrer" className="btech-josaa-quick-link-card">
                                <h3>{resource.title}</h3>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Contact Information */}
                <section className="btech-josaa-info-section">
                    <h2 className="btech-josaa-section-title">Contact Information</h2>
                    <div className="btech-josaa-info-grid">
                        <div className="btech-josaa-info-card">
                            <h3>{josaaData.contact.name}</h3>
                            <p>{josaaData.contact.designation}</p>
                            <p>{josaaData.contact.institute}</p>
                            <p>{josaaData.contact.address}</p>
                            <div className="btech-josaa-contact-details">
                                <div className="btech-josaa-contact-item">
                                    <span className="btech-josaa-contact-label">E-Mail:</span>
                                    <span>
                                        <a href={`mailto:${josaaData.contact.email}`}>{josaaData.contact.email}</a>
                                        {josaaData.contact.additionalEmail && (
                                            <> | <a href={`mailto:${josaaData.contact.additionalEmail}`}>{josaaData.contact.additionalEmail}</a></>
                                        )}
                                    </span>
                                </div>
                                <div className="btech-josaa-contact-item">
                                    <span className="btech-josaa-contact-label">Ph. No.:</span>
                                    <span><a href={`tel:${josaaData.contact.phone}`}>{josaaData.contact.phone}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Important Note */}
                <section className="btech-josaa-info-section">
                    <div className="btech-josaa-info-grid">
                        <div className="btech-josaa-info-card">
                            <div className="btech-josaa-note">{/*  */}
                                <p><strong>Note:</strong> {josaaData.notes[0]}</p>
                                <p>{josaaData.notes[1]}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BTechJosaa;