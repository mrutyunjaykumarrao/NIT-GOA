import React, { useState } from 'react';
import './BTech.css';

const BTech = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="btech-admissions">
            {/* Hero Section */}
            <div className="btech-hero">
                <div className="hero-content">
                    <h1>B.Tech Admissions</h1>
                    <p>Bachelor of Technology Programs at NIT Goa</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">6</span>
                            <span className="stat-label">Departments</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">8</span>
                            <span className="stat-label">B.Tech Programs</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">4</span>
                            <span className="stat-label">Years Duration</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="btech-tabs">
                <div className="tabs-container">
                    <button 
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Program Overview
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'eligibility' ? 'active' : ''}`}
                        onClick={() => setActiveTab('eligibility')}
                    >
                        Eligibility
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'admission' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admission')}
                    >
                        Admission Process
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'seats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seats')}
                    >
                        Seat Matrix
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'fees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('fees')}
                    >
                        Fee Structure
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Required Documents
                    </button>
                </div>
            </div>

            {/* Content Sections */}
            <div className="btech-content">
                
                {/* Program Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <div className="content-section">
                            <h2>B.Tech Programs Offered</h2>
                            <div className="programs-grid">
                                <div className="program-card">
                                    <div className="program-icon">💻</div>
                                    <h3>Computer Science & Engineering</h3>
                                    <p>[Content to be added - Program details, curriculum highlights, career prospects]</p>
                                </div>
                                <div className="program-card">
                                    <div className="program-icon">⚡</div>
                                    <h3>Electronics & Communication Engineering</h3>
                                    <p>[Content to be added - Program details, curriculum highlights, career prospects]</p>
                                </div>
                                <div className="program-card">
                                    <div className="program-icon">🔌</div>
                                    <h3>Electrical & Electronics Engineering</h3>
                                    <p>[Content to be added - Program details, curriculum highlights, career prospects]</p>
                                </div>
                                <div className="program-card">
                                    <div className="program-icon">⚙️</div>
                                    <h3>Mechanical Engineering</h3>
                                    <p>[Content to be added - Program details, curriculum highlights, career prospects]</p>
                                </div>
                                <div className="program-card">
                                    <div className="program-icon">🏗️</div>
                                    <h3>Civil Engineering</h3>
                                    <p>[Content to be added - Program details, curriculum highlights, career prospects]</p>
                                </div>
                                <div className="program-card">
                                    <div className="program-icon">🧮</div>
                                    <h3>Mathematics & Computing</h3>
                                    <p>[Content to be added - Program details, curriculum highlights, career prospects]</p>
                                </div>
                            </div>
                        </div>

                        <div className="content-section">
                            <h2>Why Choose NIT Goa for B.Tech?</h2>
                            <div className="highlights-grid">
                                <div className="highlight-item">
                                    <h4>Excellence in Education</h4>
                                    <p>[Content to be added - Academic excellence, faculty expertise, research opportunities]</p>
                                </div>
                                <div className="highlight-item">
                                    <h4>Industry Connections</h4>
                                    <p>[Content to be added - Industry partnerships, internship opportunities, placement records]</p>
                                </div>
                                <div className="highlight-item">
                                    <h4>Modern Infrastructure</h4>
                                    <p>[Content to be added - State-of-the-art labs, libraries, campus facilities]</p>
                                </div>
                                <div className="highlight-item">
                                    <h4>Research Opportunities</h4>
                                    <p>[Content to be added - Research projects, publications, innovation culture]</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Eligibility Tab */}
                {activeTab === 'eligibility' && (
                    <div className="tab-content">
                        <div className="content-section">
                            <h2>Eligibility Criteria</h2>
                            <div className="eligibility-card">
                                <h3>Educational Qualification</h3>
                                <p>[Content to be added - 12th class requirements, subjects, minimum marks]</p>
                            </div>
                            <div className="eligibility-card">
                                <h3>Entrance Examination</h3>
                                <p>[Content to be added - JEE Main requirements, qualifying marks, ranking criteria]</p>
                            </div>
                            <div className="eligibility-card">
                                <h3>Age Criteria</h3>
                                <p>[Content to be added - Age limits, relaxations for reserved categories]</p>
                            </div>
                            <div className="eligibility-card">
                                <h3>Nationality</h3>
                                <p>[Content to be added - Indian nationals, NRI/Foreign nationals criteria]</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Admission Process Tab */}
                {activeTab === 'admission' && (
                    <div className="tab-content">
                        <div className="content-section">
                            <h2>Admission Process</h2>
                            <div className="process-timeline">
                                <div className="timeline-item">
                                    <div className="timeline-marker">1</div>
                                    <div className="timeline-content">
                                        <h3>JEE Main Examination</h3>
                                        <p>[Content to be added - JEE Main exam dates, registration process]</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker">2</div>
                                    <div className="timeline-content">
                                        <h3>JoSAA Counselling</h3>
                                        <p>[Content to be added - JoSAA registration, choice filling, seat allotment]</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker">3</div>
                                    <div className="timeline-content">
                                        <h3>Document Verification</h3>
                                        <p>[Content to be added - Required documents, verification process]</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker">4</div>
                                    <div className="timeline-content">
                                        <h3>Seat Confirmation</h3>
                                        <p>[Content to be added - Fee payment, seat acceptance process]</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="content-section">
                            <h2>Important Links</h2>
                            <div className="links-grid">
                                <button className="link-card">
                                    <h4>JEE Main Official Website</h4>
                                    <p>National Testing Agency</p>
                                </button>
                                <button className="link-card">
                                    <h4>JoSAA Official Website</h4>
                                    <p>Joint Seat Allocation Authority</p>
                                </button>
                                <button className="link-card">
                                    <h4>CSAB Official Website</h4>
                                    <p>Central Seat Allocation Board</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Seat Matrix Tab */}
                {activeTab === 'seats' && (
                    <div className="tab-content">
                        <div className="content-section">
                            <h2>Seat Matrix for B.Tech Programs</h2>
                            <div className="seat-matrix-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Program</th>
                                            <th>Total Seats</th>
                                            <th>General</th>
                                            <th>OBC-NCL</th>
                                            <th>SC</th>
                                            <th>ST</th>
                                            <th>EWS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Computer Science & Engineering</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                        </tr>
                                        <tr>
                                            <td>Electronics & Communication Engineering</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                        </tr>
                                        <tr>
                                            <td>Electrical & Electronics Engineering</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                        </tr>
                                        <tr>
                                            <td>Mechanical Engineering</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                        </tr>
                                        <tr>
                                            <td>Civil Engineering</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                        </tr>
                                        <tr>
                                            <td>Mathematics & Computing</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                            <td>[Content to be added]</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fee Structure Tab */}
                {activeTab === 'fees' && (
                    <div className="tab-content">
                        <div className="content-section">
                            <h2>Fee Structure</h2>
                            <div className="fee-cards">
                                <div className="fee-card">
                                    <h3>Tuition Fee</h3>
                                    <div className="fee-amount">[Content to be added]</div>
                                    <p>Per semester</p>
                                </div>
                                <div className="fee-card">
                                    <h3>Hostel Fee</h3>
                                    <div className="fee-amount">[Content to be added]</div>
                                    <p>Per semester</p>
                                </div>
                                <div className="fee-card">
                                    <h3>Mess Fee</h3>
                                    <div className="fee-amount">[Content to be added]</div>
                                    <p>Per semester</p>
                                </div>
                                <div className="fee-card">
                                    <h3>Other Fees</h3>
                                    <div className="fee-amount">[Content to be added]</div>
                                    <p>Registration, Library, etc.</p>
                                </div>
                            </div>

                            <div className="fee-notes">
                                <h3>Important Notes</h3>
                                <ul>
                                    <li>[Content to be added - Fee payment schedules]</li>
                                    <li>[Content to be added - Scholarship information]</li>
                                    <li>[Content to be added - Fee refund policy]</li>
                                    <li>[Content to be added - Late fee charges]</li>
                                </ul>
                            </div>

                            <div className="fee-download">
                                <a href="https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf" 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className="download-btn">
                                    📄 Download Complete Fee Structure
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="tab-content">
                        <div className="content-section">
                            <h2>Required Documents</h2>
                            <div className="documents-grid">
                                <div className="document-category">
                                    <h3>Academic Documents</h3>
                                    <ul>
                                        <li>[Content to be added - 10th marksheet]</li>
                                        <li>[Content to be added - 12th marksheet]</li>
                                        <li>[Content to be added - JEE Main scorecard]</li>
                                        <li>[Content to be added - Migration certificate]</li>
                                    </ul>
                                </div>
                                <div className="document-category">
                                    <h3>Identity Documents</h3>
                                    <ul>
                                        <li>[Content to be added - Aadhar card]</li>
                                        <li>[Content to be added - Birth certificate]</li>
                                        <li>[Content to be added - Passport size photos]</li>
                                        <li>[Content to be added - Character certificate]</li>
                                    </ul>
                                </div>
                                <div className="document-category">
                                    <h3>Category Certificates</h3>
                                    <ul>
                                        <li>[Content to be added - Caste certificate (if applicable)]</li>
                                        <li>[Content to be added - Income certificate]</li>
                                        <li>[Content to be added - Domicile certificate]</li>
                                        <li>[Content to be added - PWD certificate (if applicable)]</li>
                                    </ul>
                                </div>
                                <div className="document-category">
                                    <h3>Medical Documents</h3>
                                    <ul>
                                        <li>[Content to be added - Medical fitness certificate]</li>
                                        <li>[Content to be added - Medical examination report]</li>
                                        <li>[Content to be added - Vaccination certificate]</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="document-notes">
                                <h3>Important Instructions</h3>
                                <ul>
                                    <li>[Content to be added - Document verification process]</li>
                                    <li>[Content to be added - Original vs photocopy requirements]</li>
                                    <li>[Content to be added - Document submission deadlines]</li>
                                    <li>[Content to be added - Contact information for queries]</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <button className="action-card">
                        <div className="action-icon">📋</div>
                        <h3>Application Form</h3>
                        <p>Apply through JoSAA</p>
                    </button>
                    <button className="action-card">
                        <div className="action-icon">📊</div>
                        <h3>Previous Year Cutoffs</h3>
                        <p>Check admission trends</p>
                    </button>
                    <button className="action-card">
                        <div className="action-icon">📞</div>
                        <h3>Contact Admissions</h3>
                        <p>Get help and support</p>
                    </button>
                    <a href="https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="action-card">
                        <div className="action-icon">💰</div>
                        <h3>Fee Structure</h3>
                        <p>Download fee details</p>
                    </a>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-container">
                    <div className={`faq-item ${expandedSection === 'faq1' ? 'expanded' : ''}`}>
                        <button className="faq-question" onClick={() => toggleSection('faq1')}>
                            <span>What is the admission process for B.Tech at NIT Goa?</span>
                            <span className="faq-icon">{expandedSection === 'faq1' ? '−' : '+'}</span>
                        </button>
                        <div className="faq-answer">
                            <p>[Content to be added - Detailed admission process explanation]</p>
                        </div>
                    </div>
                    
                    <div className={`faq-item ${expandedSection === 'faq2' ? 'expanded' : ''}`}>
                        <button className="faq-question" onClick={() => toggleSection('faq2')}>
                            <span>What are the eligibility criteria for B.Tech admission?</span>
                            <span className="faq-icon">{expandedSection === 'faq2' ? '−' : '+'}</span>
                        </button>
                        <div className="faq-answer">
                            <p>[Content to be added - Eligibility criteria details]</p>
                        </div>
                    </div>
                    
                    <div className={`faq-item ${expandedSection === 'faq3' ? 'expanded' : ''}`}>
                        <button className="faq-question" onClick={() => toggleSection('faq3')}>
                            <span>How many seats are available for each B.Tech program?</span>
                            <span className="faq-icon">{expandedSection === 'faq3' ? '−' : '+'}</span>
                        </button>
                        <div className="faq-answer">
                            <p>[Content to be added - Seat matrix information]</p>
                        </div>
                    </div>
                    
                    <div className={`faq-item ${expandedSection === 'faq4' ? 'expanded' : ''}`}>
                        <button className="faq-question" onClick={() => toggleSection('faq4')}>
                            <span>What is the fee structure for B.Tech programs?</span>
                            <span className="faq-icon">{expandedSection === 'faq4' ? '−' : '+'}</span>
                        </button>
                        <div className="faq-answer">
                            <p>[Content to be added - Fee structure details]</p>
                        </div>
                    </div>
                    
                    <div className={`faq-item ${expandedSection === 'faq5' ? 'expanded' : ''}`}>
                        <button className="faq-question" onClick={() => toggleSection('faq5')}>
                            <span>What documents are required for admission?</span>
                            <span className="faq-icon">{expandedSection === 'faq5' ? '−' : '+'}</span>
                        </button>
                        <div className="faq-answer">
                            <p>[Content to be added - Required documents list]</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BTech;
