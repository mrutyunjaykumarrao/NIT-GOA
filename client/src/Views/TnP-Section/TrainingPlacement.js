import React, { useState } from 'react';
import './TrainingPlacement.css';
import tnpData from './tnp.json';

const TrainingPlacement = () => {
    const [activeSection, setActiveSection] = useState('home');

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleDownload = (url) => {
        if (url && url !== '#') {
            window.open(url, '_blank');
        }
    };

    // Extract data from new JSON structure
    const data = tnpData.training_and_placement_cell;
    const sections = data.sections;

    return (
        <div className="tnp-page">
            <div className="tnp-container">
                {/* Page Header */}
                <div className="tnp-page-header">
                    <h1>Training & Placement</h1>
                    <p className="tnp-page-subtitle">Bridging Academia and Industry</p>
                </div>

                {/* Main Content Layout */}
                <div className="tnp-main-layout">
                    {/* Sidebar Navigation */}
                    <aside className="tnp-sidebar">
                        <nav className="tnp-nav">
                            <ul className="tnp-nav-list">
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'home' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('home')}
                                    >
                                        Home
                                    </button>
                                </li>
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'directors-message' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('directors-message')}
                                    >
                                        Director's Message
                                    </button>
                                </li>
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'announcements' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('announcements')}
                                    >
                                        Announcements
                                    </button>
                                </li>
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'training' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('training')}
                                    >
                                        Training & Internship
                                    </button>
                                </li>
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'placement-records' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('placement-records')}
                                    >
                                        Placement Records
                                    </button>
                                </li>
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'why-recruit' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('why-recruit')}
                                    >
                                        Why Recruit
                                    </button>
                                </li>
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'for-recruiters' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('for-recruiters')}
                                    >
                                        For Recruiters
                                    </button>
                                </li>
                                <li className="tnp-nav-item">
                                    <button 
                                        className={`tnp-nav-link ${activeSection === 'contact' ? 'tnp-nav-active' : ''}`}
                                        onClick={() => handleSectionChange('contact')}
                                    >
                                        Contact Us
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="tnp-content">
                        {/* Home Section */}
                        {activeSection === 'home' && (
                            <section className="tnp-section">
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-hero-section">
                                        <img 
                                            src={sections.home.image_url} 
                                            alt="NIT Goa Campus" 
                                            className="tnp-hero-image"
                                        />
                                        <div className="tnp-hero-content">
                                            <p className="tnp-intro-text">
                                                {sections.home.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Downloads Section */}
                                    <div className="tnp-downloads-section">
                                        <h3>Quick Downloads</h3>
                                        <div className="tnp-downloads-grid">
                                            {sections.home.downloads?.map((item, index) => (
                                                <div key={index} className="tnp-download-card">
                                                    <h4>{item.file_name}</h4>
                                                    <button 
                                                        className="tnp-download-btn"
                                                        onClick={() => handleDownload(item.link)}
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                            <polyline points="7,10 12,15 17,10"/>
                                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                                        </svg>
                                                        Download
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* News Section */}
                                    <div className="tnp-news-section">
                                        <h3>Latest News</h3>
                                        <div className="tnp-news-list">
                                            {sections.home.news?.map((item, index) => (
                                                <div key={index} className="tnp-news-item">
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                        {item.title}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Director's Message Section */}
                        {activeSection === 'directors-message' && (
                            <section className="tnp-section">
                                <div className="tnp-section-header">
                                    <h2>{sections.directors_message.title}</h2>
                                </div>
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-directors-message">
                                        <div className="tnp-director-image">
                                            <img 
                                                src={sections.directors_message.image_url} 
                                                alt="Director NIT Goa" 
                                                className="tnp-director-photo"
                                            />
                                        </div>
                                        <div className="tnp-message-content">
                                            {sections.directors_message.description?.map((para, index) => (
                                                <p key={index} className="tnp-message-paragraph">
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Announcements Section */}
                        {activeSection === 'announcements' && (
                            <section className="tnp-section">
                                <div className="tnp-section-header">
                                    <h2>Announcements</h2>
                                </div>
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-announcements-grid">
                                        {/* Visiting Companies */}
                                        <div className="tnp-announcement-card">
                                            <h3>{sections.announcements.visiting_companies.title}</h3>
                                            <div className="tnp-visiting-companies-content">
                                                {sections.announcements.visiting_companies.content === 'Coming Soon' ? (
                                                    <div className="tnp-coming-soon">
                                                        {sections.announcements.visiting_companies.content}
                                                    </div>
                                                ) : (
                                                    <p>{sections.announcements.visiting_companies.content}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Past Speakers */}
                                        <div className="tnp-announcement-card">
                                            <h3>{sections.announcements.past_speakers.title}</h3>
                                            {sections.announcements.past_speakers.speakers?.map((speaker, index) => (
                                                <p key={index}>• {speaker}</p>
                                            ))}
                                        </div>
                                        
                                        {/* GITIC Program */}
                                        <div className="tnp-announcement-card">
                                            <h3>{sections.announcements.gitic_program.title}</h3>
                                            <a href={sections.announcements.gitic_program.link} target="_blank" rel="noopener noreferrer" className="tnp-announcement-link">
                                                View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Training & Internship Section */}
                        {activeSection === 'training' && (
                            <section className="tnp-section">
                                <div className="tnp-section-header">
                                    <h2>{sections.training.title}</h2>
                                </div>
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-training-content">
                                        {sections.training.description?.map((para, index) => (
                                            <p key={index} className="tnp-training-paragraph">
                                                {para}
                                            </p>
                                        ))}
                                        
                                        {sections.training.image_gallery?.map((img, index) => (
                                            <div key={index} className="tnp-training-image-section">
                                                <h3>{img.title}</h3>
                                                <img 
                                                    src={img.url} 
                                                    alt={img.title}
                                                    className="tnp-training-image"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Placement Records Section */}
                        {activeSection === 'placement-records' && (
                            <section className="tnp-section">
                                <div className="tnp-section-header">
                                    <h2>{sections.placement_records.title}</h2>
                                </div>
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-placement-records">
                                        <div className="tnp-placement-category">
                                            <h3>B.Tech Placement Records</h3>
                                            <div className="tnp-records-grid">
                                                {sections.placement_records.b_tech?.map((record, index) => (
                                                    <div key={index} className="tnp-record-card">
                                                        <h4>
                                                            B.Tech {record.year}
                                                            {record.status && (
                                                                <span className="tnp-record-status">
                                                                    <br /><small>{record.status}</small>
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <button 
                                                            className="tnp-download-btn"
                                                            onClick={() => handleDownload(record.link)}
                                                            disabled={record.link === '#'}
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                                <polyline points="7,10 12,15 17,10"/>
                                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                                            </svg>
                                                            {record.link === '#' ? 'Coming Soon' : 'Download PDF'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="tnp-placement-category">
                                            <h3>M.Tech Placement Records</h3>
                                            <div className="tnp-records-grid">
                                                {sections.placement_records.m_tech?.map((record, index) => (
                                                    <div key={index} className="tnp-record-card">
                                                        <h4>
                                                            M.Tech {record.year}
                                                            {record.status && (
                                                                <span className="tnp-record-status">
                                                                    <br /><small>{record.status}</small>
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <button 
                                                            className="tnp-download-btn"
                                                            onClick={() => handleDownload(record.link)}
                                                            disabled={record.link === '#'}
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                                <polyline points="7,10 12,15 17,10"/>
                                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                                            </svg>
                                                            {record.link === '#' ? 'Coming Soon' : 'Download PDF'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Why Recruit Section */}
                        {activeSection === 'why-recruit' && (
                            <section className="tnp-section">
                                <div className="tnp-section-header">
                                    <h2>{sections.why_recruit.title}</h2>
                                </div>
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-why-recruit-content">
                                        {sections.why_recruit.description?.map((para, index) => (
                                            <p key={index} className="tnp-why-recruit-paragraph">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* For Recruiters Section */}
                        {activeSection === 'for-recruiters' && (
                            <section className="tnp-section">
                                <div className="tnp-section-header">
                                    <h2>For Recruiters</h2>
                                </div>
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-recruiters-content">
                                        {/* Placement Procedure */}
                                        <div className="tnp-recruiter-section">
                                            <h3>Placement Procedure & Policies</h3>
                                            <div className="tnp-documents-grid">
                                                {sections.for_recruiters.placement_documents?.map((doc, index) => (
                                                    <div key={index} className="tnp-document-card">
                                                        <h4>{doc.file_name}</h4>
                                                        <button 
                                                            className="tnp-download-btn"
                                                            onClick={() => handleDownload(doc.link)}
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                                <polyline points="7,10 12,15 17,10"/>
                                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                                            </svg>
                                                            Download PDF
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Facilities */}
                                        <div className="tnp-recruiter-section">
                                            <h3>{sections.for_recruiters.facilities.title}</h3>
                                            <p className="tnp-facilities-description">
                                                {sections.for_recruiters.facilities.description}
                                            </p>
                                            <ul className="tnp-facilities-list">
                                                {sections.for_recruiters.facilities.points?.map((point, index) => (
                                                    <li key={index}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Quick Links */}
                                        <div className="tnp-recruiter-section">
                                            <h3>Quick Links</h3>
                                            <div className="tnp-quick-links">
                                                <div className="tnp-quick-link-card">
                                                    <h4>Job Announcement Form (JAF)</h4>
                                                    <a 
                                                        href={sections.for_recruiters.jaf_link}
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="tnp-link-btn"
                                                    >
                                                        Fill JAF Form
                                                    </a>
                                                </div>
                                                <div className="tnp-quick-link-card">
                                                    <h4>Placement Brochure</h4>
                                                    <a 
                                                        href={sections.for_recruiters.brochure_link}
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="tnp-link-btn"
                                                    >
                                                        View Brochure
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Contact Us Section */}
                        {activeSection === 'contact' && (
                            <section className="tnp-section">
                                <div className="tnp-section-header">
                                    <h2>{sections.contact_us.title}</h2>
                                </div>
                                <div className="tnp-content-wrapper">
                                    <div className="tnp-contact-content">
                                        <p className="tnp-contact-description">
                                            {sections.contact_us.description}
                                        </p>

                                        {/* Contact Information */}
                                        <div className="tnp-contact-info">
                                            <h3>Contact Information</h3>
                                            <div className="tnp-contact-card">
                                                <h4>{sections.contact_us.office_contact.name}</h4>
                                                <p><strong>Address:</strong> {sections.contact_us.office_contact.address}</p>
                                                <p><strong>Phone:</strong> {sections.contact_us.office_contact.phone}</p>
                                                <p><strong>Email:</strong> {sections.contact_us.office_contact.email}</p>
                                            </div>
                                        </div>

                                        {/* Faculty Coordinators */}
                                        <div className="tnp-faculty-coordinators">
                                            <h3>Faculty Coordinators</h3>
                                            <div className="tnp-coordinators-grid">
                                                {sections.contact_us.faculty_coordinators?.map((faculty, index) => (
                                                    <div key={index} className="tnp-coordinator-card">
                                                        <h4>{faculty.name}</h4>
                                                        <p className="tnp-coordinator-role">{faculty.role}</p>
                                                        <p className="tnp-coordinator-email">
                                                            <strong>Email:</strong> 
                                                            <a href={`mailto:${faculty.email}`}>{faculty.email}</a>
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TrainingPlacement;
