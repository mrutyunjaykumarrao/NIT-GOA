import React from 'react';
import './Placement.css';

const Placement = () => {
    return (
        <div className="placement-page">
            <div className="container">
                <div className="page-header">
                    <h1>Training & Placement</h1>
                    <p className="page-subtitle">Career opportunities and industry partnerships for bright futures</p>
                </div>

                <section className="placement-stats">
                    <h2>Placement Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>95%</h3>
                            <p>Placement Rate</p>
                        </div>
                        <div className="stat-card">
                            <h3>₹25 LPA</h3>
                            <p>Highest Package</p>
                        </div>
                        <div className="stat-card">
                            <h3>₹8.5 LPA</h3>
                            <p>Average Package</p>
                        </div>
                        <div className="stat-card">
                            <h3>150+</h3>
                            <p>Companies Visited</p>
                        </div>
                    </div>
                </section>

                <section className="top-recruiters">
                    <h2>Top Recruiters</h2>
                    <div className="recruiters-grid">
                        <div className="recruiter-category">
                            <h3>Information Technology</h3>
                            <div className="companies">
                                <span>Tata Consultancy Services</span>
                                <span>Infosys</span>
                                <span>Wipro</span>
                                <span>Tech Mahindra</span>
                                <span>Cognizant</span>
                                <span>Accenture</span>
                            </div>
                        </div>
                        <div className="recruiter-category">
                            <h3>Core Engineering</h3>
                            <div className="companies">
                                <span>Larsen & Toubro</span>
                                <span>Godrej Group</span>
                                <span>Mahindra & Mahindra</span>
                                <span>Bajaj Auto</span>
                                <span>Tata Motors</span>
                                <span>ONGC</span>
                            </div>
                        </div>
                        <div className="recruiter-category">
                            <h3>Public Sector</h3>
                            <div className="companies">
                                <span>Indian Railways</span>
                                <span>BHEL</span>
                                <span>NTPC</span>
                                <span>SAIL</span>
                                <span>GAIL</span>
                                <span>HAL</span>
                            </div>
                        </div>
                        <div className="recruiter-category">
                            <h3>Banking & Finance</h3>
                            <div className="companies">
                                <span>ICICI Bank</span>
                                <span>HDFC Bank</span>
                                <span>Axis Bank</span>
                                <span>SBI</span>
                                <span>Yes Bank</span>
                                <span>Kotak Mahindra</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="placement-process">
                    <h2>Placement Process</h2>
                    <div className="process-timeline">
                        <div className="timeline-step">
                            <div className="step-number">1</div>
                            <h3>Registration</h3>
                            <p>Students register for placement activities through the online portal</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-number">2</div>
                            <h3>Pre-Placement Training</h3>
                            <p>Comprehensive training on aptitude, technical skills, and soft skills</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-number">3</div>
                            <h3>Company Registration</h3>
                            <p>Companies register and submit job descriptions and requirements</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-number">4</div>
                            <h3>Pre-Placement Talk</h3>
                            <p>Companies present their organization and job opportunities</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-number">5</div>
                            <h3>Selection Process</h3>
                            <p>Written test, technical interview, and HR interview rounds</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-number">6</div>
                            <h3>Final Selection</h3>
                            <p>Job offers and final placement confirmation</p>
                        </div>
                    </div>
                </section>

                <section className="training-programs">
                    <h2>Training Programs</h2>
                    <div className="training-grid">
                        <div className="training-card">
                            <h3>Technical Skills</h3>
                            <p>Enhancement of core technical competencies</p>
                            <ul>
                                <li>Programming Languages</li>
                                <li>System Design</li>
                                <li>Database Management</li>
                                <li>Software Development</li>
                            </ul>
                        </div>
                        <div className="training-card">
                            <h3>Aptitude Training</h3>
                            <p>Quantitative and logical reasoning skills</p>
                            <ul>
                                <li>Quantitative Aptitude</li>
                                <li>Logical Reasoning</li>
                                <li>Verbal Ability</li>
                                <li>Data Interpretation</li>
                            </ul>
                        </div>
                        <div className="training-card">
                            <h3>Soft Skills</h3>
                            <p>Communication and interpersonal skills development</p>
                            <ul>
                                <li>Communication Skills</li>
                                <li>Group Discussions</li>
                                <li>Presentation Skills</li>
                                <li>Interview Techniques</li>
                            </ul>
                        </div>
                        <div className="training-card">
                            <h3>Industry Readiness</h3>
                            <p>Preparation for professional work environment</p>
                            <ul>
                                <li>Professional Ethics</li>
                                <li>Team Work</li>
                                <li>Time Management</li>
                                <li>Leadership Skills</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="career-services">
                    <h2>Career Services</h2>
                    <div className="services-content">
                        <div className="service-item">
                            <h3>Career Counseling</h3>
                            <p>Individual guidance for career planning and development</p>
                        </div>
                        <div className="service-item">
                            <h3>Resume Building</h3>
                            <p>Professional assistance in creating effective resumes</p>
                        </div>
                        <div className="service-item">
                            <h3>Mock Interviews</h3>
                            <p>Practice sessions to build confidence and improve performance</p>
                        </div>
                        <div className="service-item">
                            <h3>Industry Interactions</h3>
                            <p>Regular sessions with industry experts and alumni</p>
                        </div>
                        <div className="service-item">
                            <h3>Internship Support</h3>
                            <p>Assistance in securing summer internships and projects</p>
                        </div>
                        <div className="service-item">
                            <h3>Higher Studies Guidance</h3>
                            <p>Support for students planning to pursue higher education</p>
                        </div>
                    </div>
                </section>

                <section className="contact-placement">
                    <h2>Contact Training & Placement Cell</h2>
                    <div className="contact-details">
                        <div className="contact-info">
                            <h3>Office Information</h3>
                            <p><strong>Training & Placement Officer</strong></p>
                            <p>National Institute of Technology Goa</p>
                            <p>Farmagudi, Ponda, Goa - 403401</p>
                            <p>Phone: +91-832-2404215</p>
                            <p>Email: placement@nitgoa.ac.in</p>
                        </div>
                        <div className="office-hours">
                            <h3>Office Hours</h3>
                            <p>Monday - Friday: 9:00 AM - 5:30 PM</p>
                            <p>Saturday: 9:00 AM - 1:00 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Placement;
