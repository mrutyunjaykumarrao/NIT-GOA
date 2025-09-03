import React, { useState } from 'react';
import './GIAN.css';
import gianData from './gian.json';

const GIAN = () => {
    const [activeSection, setActiveSection] = useState(() => {
        // Get saved section from localStorage or default to 'home'
        return localStorage.getItem('gian-active-section') || 'home';
    });

    const handleSectionChange = (section) => {
        setActiveSection(section);
        // Save the current section to localStorage
        localStorage.setItem('gian-active-section', section);
        // Smooth scroll to section header when changing sections
        setTimeout(() => {
            const sectionHeader = document.querySelector('.gian-section-header');
            if (sectionHeader) {
                const headerOffset = 120; // Offset to account for navbar height
                const elementPosition = sectionHeader.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100); // Small delay to ensure DOM is updated
    };

    return (
        <div className="gian-page">
            <div className="gian-container">
                {/* Page Header */}
                <div className="gian-page-header">
                    <h1>{gianData.page_header.title}</h1>
                    <p className="gian-page-subtitle">{gianData.page_header.subtitle}</p>
                </div>

                {/* Main Content Layout */}
                <div className="gian-main-layout">
                    {/* Sidebar Navigation */}
                    <aside className="gian-sidebar">
                        <nav className="gian-nav">
                            <ul className="gian-nav-list">
                                {gianData.navigation.map((navItem) => (
                                    <li key={navItem.id} className="gian-nav-item">
                                        <button 
                                            className={`gian-nav-link ${activeSection === navItem.id ? 'gian-nav-active' : ''}`}
                                            onClick={() => handleSectionChange(navItem.id)}
                                        >
                                            {navItem.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="gian-content">
                        {/* Home Section */}
                        {activeSection === 'home' && (
                            <section className="gian-section">
                                <div className="gian-content-wrapper">
                                    {gianData.home.intro_texts.map((text, index) => (
                                        <p key={index} className="gian-intro-text">
                                            {text}
                                        </p>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Objective Section */}
                        {activeSection === 'objective' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>{gianData.objective.title}</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    <ul className="gian-objectives-list">
                                        {gianData.objective.objectives.map((objective, index) => (
                                            <li key={index}>{objective}</li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}

                        {/* Guidelines Section */}
                        {activeSection === 'guidelines' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>{gianData.guidelines.title}</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    <div className="gian-guidelines-content">
                                        {gianData.guidelines.guidelines.map((guideline, index) => (
                                            <div key={index} className="gian-guideline-item">
                                                <p><strong>{guideline.number}.</strong> {guideline.text}</p>
                                                {guideline.subpoints && (
                                                    <ul>
                                                        {guideline.subpoints.map((subpoint, subIndex) => (
                                                            <li key={subIndex}>{subpoint}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {guideline.details && guideline.details.map((detail, detailIndex) => (
                                                    <p key={detailIndex}>{detail}</p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Upcoming Courses Section */}
                        {activeSection === 'upcoming' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>{gianData.upcoming.title}</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    <div className="gian-upcoming-container">
                                        {gianData.upcoming.courses.map((course, index) => (
                                            <div key={index} className="gian-upcoming-course">
                                                <div className="gian-course-number">• {course.number}:</div>
                                                <div className="gian-course-details-upcoming">
                                                    <h3 className="gian-course-title-upcoming">{course.title}</h3>
                                                    <div className="gian-course-faculty-info">
                                                        <p><strong>Foreign Faculty:</strong> {course.foreign_faculty}</p>
                                                        <p><strong>Host Faculty:</strong> {course.host_faculty}</p>
                                                    </div>
                                                    <div className="gian-course-schedule">
                                                        <p><strong>Date:</strong> {course.date}</p>
                                                    </div>
                                                    <div className="gian-course-brochure">
                                                        <a href={course.brochure_url} target="_blank" rel="noopener noreferrer" className="gian-brochure-link">
                                                            BROCHURE
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Completed Courses Section */}
                        {activeSection === 'completed' && (
                            <section className="gian-section">
                                <div className="gian-completed-header">
                                    <div className="gian-completed-title-container">
                                        <h2 className="gian-completed-main-title">{gianData.completed.title}</h2>
                                        <div className="gian-completed-subtitle">{gianData.completed.subtitle}</div>
                                    </div>
                                    <div className="gian-completed-stats">
                                        <div className="gian-completed-stat">
                                            <span className="gian-completed-number">{gianData.completed.stats.number}</span>
                                            <span className="gian-completed-label">{gianData.completed.stats.label}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="gian-completed-container">
                                    <div className="gian-completed-grid">
                                        {gianData.completed.courses.map((course, index) => (
                                            <div key={index} className="gian-completed-card">
                                                <div className="gian-completed-content">
                                                    <div className="gian-completed-number-badge">{course.number}</div>
                                                    <h3 className="gian-completed-title">{course.id ? `${course.id} : ${course.title}` : course.title}</h3>
                                                    <div className="gian-completed-faculty">
                                                        <div className="gian-faculty-item">
                                                            <span className="gian-faculty-label">Foreign Faculty</span>
                                                            <span className="gian-faculty-name">{course.foreign_faculty}</span>
                                                        </div>
                                                        <div className="gian-faculty-item">
                                                            <span className="gian-faculty-label">Host Faculty</span>
                                                            <span className="gian-faculty-name">{course.host_faculty}</span>
                                                        </div>
                                                    </div>
                                                    <div className="gian-completed-date">{course.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Contact Section */}
                        {activeSection === 'contact' && (
                            <section className="gian-section">
                                <div className="gian-section-header">
                                    <h2>{gianData.contact.title}</h2>
                                </div>
                                <div className="gian-content-wrapper">
                                    {/* Main Contact Card */}
                                    <div className="gian-contact-main-card">
                                        <div className="gian-contact-content">
                                            <h3>{gianData.contact.main_contact.name}</h3>
                                            <p className="gian-contact-title">{gianData.contact.main_contact.title}</p>
                                            
                                            <div className="gian-contact-details">
                                                {gianData.contact.contact_items.map((item, index) => (
                                                    <div key={index} className="gian-contact-item">
                                                        <div className="gian-contact-item-icon">
                                                            <span>{item.icon}</span>
                                                        </div>
                                                        <div className="gian-contact-item-text">
                                                            <strong>{item.title}</strong>
                                                            <p dangerouslySetInnerHTML={{ __html: item.text.replace(/\n/g, '<br/>') }}></p>
                                                        </div>
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

export default GIAN;
