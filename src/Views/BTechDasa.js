import React from 'react';
import './BTechDasa.css';

const BTechDasa = () => {
    return (
        <div className="btech-dasa">
            <div className="page-header">
                <div className="header-content">
                    <h1>B.Tech Admissions - DASA</h1>
                    <p>Direct Admission of Students Abroad</p>
                </div>
            </div>

            <div className="content-container">
                <div className="content-section">
                    <h2>Admissions Under DASA Scheme-2025</h2>
                    <div className="dasa-info">
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

                <div className="content-section">
                    <h2>List of B.Tech Courses</h2>
                    <div className="courses-list">
                        <a href="https://www.nitgoa.ac.in/academics/ComputerScience.html" 
                           target="_blank" rel="noopener noreferrer" className="course-link">
                            <span className="course-icon">💻</span>
                            <span>Computer Science & Engineering</span>
                        </a>
                        <a href="https://www.nitgoa.ac.in/academics/Electronics.html" 
                           target="_blank" rel="noopener noreferrer" className="course-link">
                            <span className="course-icon">📡</span>
                            <span>Electronics & Communication Engineering</span>
                        </a>
                        <a href="https://www.nitgoa.ac.in/academics/Electrical.html" 
                           target="_blank" rel="noopener noreferrer" className="course-link">
                            <span className="course-icon">⚡</span>
                            <span>Electrical & Electronics Engineering</span>
                        </a>
                        <a href="https://www.nitgoa.ac.in/academics/Mechnical.html" 
                           target="_blank" rel="noopener noreferrer" className="course-link">
                            <span className="course-icon">⚙️</span>
                            <span>Mechanical Engineering</span>
                        </a>
                        <a href="https://www.nitgoa.ac.in/academics/Civil.html" 
                           target="_blank" rel="noopener noreferrer" className="course-link">
                            <span className="course-icon">🏗️</span>
                            <span>Civil Engineering</span>
                        </a>
                    </div>
                </div>

                <div className="content-section">
                    <h2>Important Links</h2>
                    <div className="links-grid">
                        <a href="https://www.nitgoa.ac.in/uploads/DASA%20Schedule%202024.pdf" 
                           target="_blank" rel="noopener noreferrer" className="document-link">
                            <div className="link-icon">📅</div>
                            <div className="link-content">
                                <h3>Schedule of DASA 2024 UG Counselling</h3>
                                <p>Important dates and timeline</p>
                            </div>
                        </a>
                        <a href="https://www.nitgoa.ac.in/uploads/DASA%20Brochure%202024.pdf" 
                           target="_blank" rel="noopener noreferrer" className="document-link">
                            <div className="link-icon">📄</div>
                            <div className="link-content">
                                <h3>DASA UG Brochure 2024</h3>
                                <p>Complete information guide</p>
                            </div>
                        </a>
                        <a href="https://dasanit.org" 
                           target="_blank" rel="noopener noreferrer" className="external-link">
                            <div className="link-icon">🌐</div>
                            <div className="link-content">
                                <h3>DASA Official Website</h3>
                                <p>dasanit.org</p>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="content-section">
                    <h2>Contact Information</h2>
                    <div className="contact-grid">
                        <div className="contact-card headquarters">
                            <h3>Headquarters</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="contact-icon">📧</span>
                                    <span>dasa2024help@nitrr.ac.in</span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-card nit-goa">
                            <h3>NIT Goa</h3>
                            <div className="contact-details">
                                <p><strong>Dr. Ragoju Ravi</strong></p>
                                <p>Centre In-Charge, Admissions (DASA)</p>
                                <p>National Institute of Technology Goa</p>
                                <p>Kottamoll Plateau, Cuncolim Municipal Area,</p>
                                <p>Salcete Taluka, South Goa District, Goa - 403703</p>
                                <div className="contact-info">
                                    <div className="contact-item">
                                        <span className="contact-icon">📧</span>
                                        <span>ravi@nitgoa.ac.in | dasa@nitgoa.ac.in</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-icon">📞</span>
                                        <span>+91 9404715466 | 0832-2404743</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BTechDasa;
