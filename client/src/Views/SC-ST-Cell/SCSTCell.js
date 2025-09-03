import React from 'react';
import './SCSTCell.css';
import scstData from './scstCell.json';

const SCSTCell = () => {
    return (
        <div className="sc-st-cell-page">
            <div className="sc-st-cell-container">
                {/* Hero Section */}
                <div className="sc-st-cell-hero">
                    <div className="sc-st-cell-hero-content">
                        <h1 className="sc-st-cell-hero-title">{scstData.hero.title}</h1>
                        <p className="sc-st-cell-hero-subtitle">{scstData.hero.subtitle}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="sc-st-cell-content">
                    {/* Introduction and Duties Section - Combined */}
                    <section className="sc-st-cell-main-section">
                        <div className="sc-st-cell-content-card">
                            <p className="sc-st-cell-intro-text">
                                {scstData.introduction.text}
                            </p>
                            
                            <h2 className="sc-st-cell-section-title">{scstData.duties.title}</h2>
                            <div className="sc-st-cell-duties-list">
                                {scstData.duties.items.map((duty, index) => (
                                    <div key={index} className="sc-st-cell-duty-item">
                                        <span className="sc-st-cell-duty-number">{index + 1}.</span>
                                        <p>{duty}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact and Complaint Section - Combined */}
                    <section className="sc-st-cell-contact-section">
                        <div className="sc-st-cell-content-card">
                            <h2 className="sc-st-cell-section-title">{scstData.contact.title}</h2>
                            
                            {/* Contact Information */}
                            <div className="sc-st-cell-contact-info">
                                <div className="sc-st-cell-contact-item">
                                    <h3>For Your Queries/Complaints</h3>
                                    <p className="sc-st-cell-contact-name"><strong>{scstData.contact.liaison_officer.name}</strong></p>
                                    <p className="sc-st-cell-contact-designation">{scstData.contact.liaison_officer.designation}</p>
                                </div>
                                
                                <div className="sc-st-cell-contact-item">
                                    <p style={{textAlign: 'center'}}>{scstData.contact.email.text} <a href={`mailto:${scstData.contact.email.address}`} className="sc-st-cell-email-link">{scstData.contact.email.address}</a></p>
                                </div>

                                <div className="sc-st-cell-contact-item">
                                    <p>
                                        {scstData.contact.grievance_info}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Complaint Form */}
                            <div className="sc-st-cell-complaint-form-container">
                                <h3 className="sc-st-cell-form-title">{scstData.complaint_form.title}</h3>
                                <p className="sc-st-cell-form-description">
                                    {scstData.complaint_form.description}
                                </p>
                                <a 
                                    href={scstData.complaint_form.form_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="sc-st-cell-complaint-btn"
                                >
                                    {scstData.complaint_form.button_text}
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SCSTCell;
