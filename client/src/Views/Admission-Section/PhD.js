import React from 'react';
import './PhD.css';
import phdData from './PhD.json';

const PhD = () => {

    return (
        <div className="phd-phd-page">
            <div className="phd-phd-container">
                {/* Header Section */}
                <div className="phd-phd-hero">
                    <div className="phd-hero-content">
                        <h1>{phdData.title}</h1>
                        <p className="phd-hero-subtitle">{phdData.subtitle}</p>
                        <div className="phd-session-info">
                            <span className="phd-session-label">{phdData.currentSession}</span>
                        </div>
                    </div>
                </div>

                {/* Important Links */}
                <section className="phd-links-section">
                    <h2 className="phd-section-title">Important Links</h2>
                    <div className="phd-links-grid">
                        {phdData.importantLinks.map((link, index) => (
                            <a key={index} href={link.link} target="_blank" rel="noopener noreferrer" className="phd-link-card">
                                <h3>{link.title}</h3>
                                <p>{link.description}</p>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PhD;