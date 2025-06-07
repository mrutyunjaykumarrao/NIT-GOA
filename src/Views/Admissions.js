import React from 'react';
import './Admissions.css';

const Admissions = () => {
    return (
        <div className="admissions-page">
            <div className="container">
                <div className="page-header">
                    <h1>Admissions</h1>
                    <p className="page-subtitle">Apply for undergraduate and postgraduate programs at NIT Goa</p>
                </div>

                <section className="admission-programs">
                    <h2>Programs Offered</h2>
                    <div className="programs-grid">
                        <div className="program-card">
                            <h3>B.Tech</h3>
                            <p>4-year undergraduate programs in various engineering disciplines</p>
                            <ul>
                                <li>Computer Science & Engineering</li>
                                <li>Electronics & Communication Engineering</li>
                                <li>Mechanical Engineering</li>
                                <li>Civil Engineering</li>
                                <li>Electrical Engineering</li>
                                <li>Mathematics & Computing</li>
                            </ul>
                        </div>
                        <div className="program-card">
                            <h3>M.Tech</h3>
                            <p>2-year postgraduate programs for specialized engineering studies</p>
                            <ul>
                                <li>Computer Science & Engineering</li>
                                <li>Electronics & Communication Engineering</li>
                                <li>Mechanical Engineering</li>
                                <li>Civil Engineering</li>
                            </ul>
                        </div>
                        <div className="program-card">
                            <h3>Ph.D</h3>
                            <p>Research programs leading to Doctor of Philosophy degree</p>
                            <ul>
                                <li>All Engineering Departments</li>
                                <li>Science & Humanities</li>
                                <li>Management Studies</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="admission-process">
                    <h2>Admission Process</h2>
                    <div className="process-timeline">
                        <div className="timeline-item">
                            <h3>B.Tech Admission</h3>
                            <p>Through JEE Main counseling conducted by JoSAA (Joint Seat Allocation Authority)</p>
                        </div>
                        <div className="timeline-item">
                            <h3>M.Tech Admission</h3>
                            <p>Through GATE score and institute-specific counseling process</p>
                        </div>
                        <div className="timeline-item">
                            <h3>Ph.D Admission</h3>
                            <p>Through qualifying examination and interview process</p>
                        </div>
                    </div>
                </section>

                <section className="important-dates">
                    <h2>Important Dates</h2>
                    <div className="dates-grid">
                        <div className="date-card">
                            <h4>JEE Main 2024</h4>
                            <p>January & April Sessions</p>
                        </div>
                        <div className="date-card">
                            <h4>GATE 2024</h4>
                            <p>February 3-11, 2024</p>
                        </div>
                        <div className="date-card">
                            <h4>JoSAA Counseling</h4>
                            <p>June-July 2024</p>
                        </div>
                    </div>
                </section>

                <section className="contact-info">
                    <h2>Contact Information</h2>
                    <div className="contact-details">
                        <p><strong>Academic Office</strong></p>
                        <p>National Institute of Technology Goa</p>
                        <p>Farmagudi, Ponda, Goa - 403401</p>
                        <p>Phone: +91-832-2404200</p>
                        <p>Email: admissions@nitgoa.ac.in</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admissions;
