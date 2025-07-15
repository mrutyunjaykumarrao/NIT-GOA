import React from 'react';
import './GIAN.css';

const GIAN = () => {
    return (
        <div className="gian-page">
            <div className="gian-container">
                <div className="page-header">
                    <h1>GIAN</h1>
                    <p className="page-subtitle">Global Initiative of Academic Networks</p>
                </div>

                <section className="gian-overview">
                    <div className="overview-content">
                        <h2>About GIAN</h2>
                        <p>
                            The Global Initiative of Academic Networks (GIAN) is a program of the Government of India 
                            which aims to tap the talent pool of scientists and entrepreneurs globally to encourage 
                            their engagement with the institutes of higher education in India so as to augment the 
                            country's existing academic resources, accelerate the pace of quality reform, and elevate 
                            India's scientific and technological capacity to global excellence.
                        </p>
                        
                        <div className="objectives-grid">
                            <div className="objective-card">
                                <h3>International Collaboration</h3>
                                <p>Facilitate collaboration between Indian institutions and global experts</p>
                            </div>
                            <div className="objective-card">
                                <h3>Knowledge Exchange</h3>
                                <p>Promote exchange of knowledge and best practices in higher education</p>
                            </div>
                            <div className="objective-card">
                                <h3>Quality Enhancement</h3>
                                <p>Improve the quality of education and research in Indian institutions</p>
                            </div>
                            <div className="objective-card">
                                <h3>Innovation Promotion</h3>
                                <p>Foster innovation and entrepreneurship through international expertise</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="gian-courses">
                    <h2>GIAN Courses at NIT Goa</h2>
                    <div className="courses-grid">
                        <div className="course-card current">
                            <div className="course-status">Current</div>
                            <h3>Controller Design: Evolution from Classical to Machine Learning Framework</h3>
                            <div className="course-details">
                                <p><strong>Duration:</strong> 5 Days</p>
                                <p><strong>Department:</strong> Electrical & Electronics Engineering</p>
                                <p><strong>Coordinator:</strong> Faculty of EEE Department</p>
                                <p><strong>Focus Areas:</strong> Control Systems, Machine Learning, Advanced Controllers</p>
                            </div>
                            <div className="course-topics">
                                <h4>Key Topics:</h4>
                                <ul>
                                    <li>Classical Control Theory</li>
                                    <li>Modern Control Techniques</li>
                                    <li>Machine Learning in Control</li>
                                    <li>Adaptive and Robust Control</li>
                                </ul>
                            </div>
                        </div>

                        <div className="course-card upcoming">
                            <div className="course-status">Upcoming</div>
                            <h3>Blockchain Evolution and its Applications</h3>
                            <div className="course-details">
                                <p><strong>Duration:</strong> 10 Days</p>
                                <p><strong>Department:</strong> Computer Science & Engineering</p>
                                <p><strong>Dates:</strong> March 10-20, 2025</p>
                                <p><strong>Focus Areas:</strong> Blockchain Technology, Cryptocurrency, Smart Contracts</p>
                            </div>
                            <div className="course-topics">
                                <h4>Key Topics:</h4>
                                <ul>
                                    <li>Blockchain Fundamentals</li>
                                    <li>Cryptocurrency Technology</li>
                                    <li>Smart Contract Development</li>
                                    <li>Decentralized Applications</li>
                                </ul>
                            </div>
                        </div>

                        <div className="course-card">
                            <h3>Advanced Techniques in Inverse Problem Solving</h3>
                            <div className="course-details">
                                <p><strong>Duration:</strong> 5 Days (Online)</p>
                                <p><strong>Department:</strong> Mathematics & Computing</p>
                                <p><strong>Focus Areas:</strong> Regularization, Deep Learning, Mathematical Modeling</p>
                                <p><strong>Sponsor:</strong> SERB, DST, Govt. of India</p>
                            </div>
                            <div className="course-topics">
                                <h4>Key Topics:</h4>
                                <ul>
                                    <li>Inverse Problem Theory</li>
                                    <li>Regularization Methods</li>
                                    <li>Deep Learning Applications</li>
                                    <li>Mathematical Optimization</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="gian-benefits">
                    <h2>Benefits of GIAN Courses</h2>
                    <div className="benefits-container">
                        <div className="benefits-grid">
                            <div className="benefit-item">
                                <div className="benefit-icon">👨‍🏫</div>
                                <h3>International Faculty</h3>
                                <p>Learn from renowned international experts and academicians</p>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-icon">🎓</div>
                                <h3>Certificate</h3>
                                <p>Receive certificates recognized by academic and industry circles</p>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-icon">🌐</div>
                                <h3>Global Exposure</h3>
                                <p>Gain exposure to global best practices and methodologies</p>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-icon">🔬</div>
                                <h3>Research Opportunities</h3>
                                <p>Explore collaborative research opportunities with international experts</p>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-icon">💡</div>
                                <h3>Innovation</h3>
                                <p>Access to cutting-edge technologies and innovative approaches</p>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-icon">🤝</div>
                                <h3>Networking</h3>
                                <p>Build professional networks with international academic community</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="gian-process">
                    <h2>How to Participate</h2>
                    <div className="process-steps">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Course Announcement</h3>
                                <p>Keep track of GIAN course announcements on the official website and institute notices</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Registration</h3>
                                <p>Register for the course through the GIAN portal or institute registration system</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Fee Payment</h3>
                                <p>Complete the fee payment as per the course requirements and participant category</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Participation</h3>
                                <p>Attend the course sessions and complete all required assignments and assessments</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Certification</h3>
                                <p>Receive your completion certificate upon successful completion of the course</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="gian-contact">
                    <h2>Contact Information</h2>
                    <div className="contact-grid">
                        <div className="contact-card">
                            <h3>GIAN Coordinator</h3>
                            <p><strong>National Institute of Technology Goa</strong></p>
                            <p>Farmagudi, Ponda, Goa - 403401</p>
                            <p><strong>Email:</strong> gian@nitgoa.ac.in</p>
                            <p><strong>Phone:</strong> +91-832-2404200</p>
                        </div>
                        <div className="contact-card">
                            <h3>GIAN National Portal</h3>
                            <p><strong>Official Website:</strong></p>
                            <p><a href="https://www.gian.iitkgp.ac.in/" target="_blank" rel="noopener noreferrer">www.gian.iitkgp.ac.in</a></p>
                            <p><strong>For general queries about GIAN program</strong></p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GIAN;
