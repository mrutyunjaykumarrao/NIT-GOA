import React from 'react';
import './Research.css';

const Research = () => {
    return (
        <div className="research-page">
            <div className="research-container">
                <div className="page-header">
                    <h1>Research</h1>
                    <p className="page-subtitle">Cutting-edge research initiatives and innovation at NIT Goa</p>
                </div>

                <section className="research-areas">
                    <h2>Research Areas</h2>
                    <div className="areas-grid">
                        <div className="area-card">
                            <h3>Artificial Intelligence & Machine Learning</h3>
                            <p>Advanced research in AI algorithms, deep learning, and intelligent systems</p>
                            <ul>
                                <li>Computer Vision</li>
                                <li>Natural Language Processing</li>
                                <li>Robotics</li>
                                <li>Data Mining</li>
                            </ul>
                        </div>
                        <div className="area-card">
                            <h3>Renewable Energy Systems</h3>
                            <p>Sustainable energy solutions and green technology development</p>
                            <ul>
                                <li>Solar Energy Systems</li>
                                <li>Wind Energy</li>
                                <li>Energy Storage</li>
                                <li>Smart Grid Technologies</li>
                            </ul>
                        </div>
                        <div className="area-card">
                            <h3>Advanced Materials</h3>
                            <p>Development of novel materials for engineering applications</p>
                            <ul>
                                <li>Nanomaterials</li>
                                <li>Composite Materials</li>
                                <li>Biomaterials</li>
                                <li>Smart Materials</li>
                            </ul>
                        </div>
                        <div className="area-card">
                            <h3>Communication Systems</h3>
                            <p>Next-generation communication technologies and networks</p>
                            <ul>
                                <li>5G/6G Networks</li>
                                <li>IoT Systems</li>
                                <li>Wireless Communication</li>
                                <li>Signal Processing</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="research-facilities">
                    <h2>Research Facilities</h2>
                    <div className="facilities-grid">
                        <div className="facility-card">
                            <h3>Central Computing Facility</h3>
                            <p>High-performance computing resources for computational research</p>
                        </div>
                        <div className="facility-card">
                            <h3>Advanced Instrumentation Lab</h3>
                            <p>State-of-the-art equipment for materials characterization and analysis</p>
                        </div>
                        <div className="facility-card">
                            <h3>Innovation & Incubation Center</h3>
                            <p>Supporting startup development and technology transfer</p>
                        </div>
                        <div className="facility-card">
                            <h3>Central Library</h3>
                            <p>Extensive collection of research journals and digital resources</p>
                        </div>
                    </div>
                </section>

                <section className="research-stats">
                    <h2>Research Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>150+</h3>
                            <p>Research Publications</p>
                        </div>
                        <div className="stat-card">
                            <h3>25+</h3>
                            <p>Ongoing Projects</p>
                        </div>
                        <div className="stat-card">
                            <h3>₹10 Cr+</h3>
                            <p>Research Funding</p>
                        </div>
                        <div className="stat-card">
                            <h3>50+</h3>
                            <p>Industry Collaborations</p>
                        </div>
                    </div>
                </section>

                <section className="research-collaborations">
                    <h2>Research Collaborations</h2>
                    <div className="collaborations-content">
                        <div className="collaboration-section">
                            <h3>Industry Partners</h3>
                            <p>Strategic partnerships with leading technology companies and research organizations</p>
                            <ul>
                                <li>Indian Space Research Organisation (ISRO)</li>
                                <li>Defence Research and Development Organisation (DRDO)</li>
                                <li>Tata Consultancy Services (TCS)</li>
                                <li>Infosys Limited</li>
                                <li>Larsen & Toubro</li>
                            </ul>
                        </div>
                        <div className="collaboration-section">
                            <h3>International Collaborations</h3>
                            <p>Global research partnerships and exchange programs</p>
                            <ul>
                                <li>Technical University of Munich, Germany</li>
                                <li>University of California, USA</li>
                                <li>Nanyang Technological University, Singapore</li>
                                <li>Monash University, Australia</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="contact-research">
                    <h2>Research Opportunities</h2>
                    <div className="research-contact">
                        <p>Interested in research opportunities at NIT Goa? Contact our research office for more information about ongoing projects, funding opportunities, and collaboration possibilities.</p>
                        <div className="contact-details">
                            <p><strong>Research & Development Office</strong></p>
                            <p>Email: research@nitgoa.ac.in</p>
                            <p>Phone: +91-832-2404210</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Research;
