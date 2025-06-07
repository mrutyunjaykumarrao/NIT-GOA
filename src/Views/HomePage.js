import React from 'react';
import './HomePage.css';
import heroImage from '../assets/images/HeroImage1.png';

const HomePage = () => {
    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">Welcome to NIT Goa</h1>
                        <p className="hero-subtitle">
                            Leading Institute of National Importance in Technical Education, Research and Innovation
                        </p>
                        <p className="hero-description">
                            National Institute of Technology Goa is committed to excellence in engineering education, 
                            cutting-edge research, and fostering innovation for societal development.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary">Explore Academics</button>
                            <button className="btn btn-outline">Campus Tour</button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={heroImage} alt="NIT Goa Campus" />
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="quick-links-section">
                <div className="container">
                    <h2 className="section-title">Quick Links</h2>
                    <div className="quick-links-grid">
                        <div className="quick-link-card">
                            <h3>Admissions</h3>
                            <p>Apply for undergraduate and postgraduate programs</p>
                            <a href="#" className="link-button">Learn More</a>
                        </div>
                        <div className="quick-link-card">
                            <h3>Research</h3>
                            <p>Explore our cutting-edge research initiatives</p>
                            <a href="#" className="link-button">Learn More</a>
                        </div>
                        <div className="quick-link-card">
                            <h3>Campus Life</h3>
                            <p>Discover student activities and facilities</p>
                            <a href="#" className="link-button">Learn More</a>
                        </div>
                        <div className="quick-link-card">
                            <h3>Placements</h3>
                            <p>Career opportunities and industry partnerships</p>
                            <a href="#" className="link-button">Learn More</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* News & Events Section */}
            <section className="news-section">
                <div className="container">
                    <h2 className="section-title">Latest News & Events</h2>
                    <div className="news-grid">
                        <div className="news-card">
                            <div className="news-date">Dec 15, 2024</div>
                            <h3>Annual Technical Festival</h3>
                            <p>NIT Goa's annual tech fest showcasing innovation and creativity...</p>
                        </div>
                        <div className="news-card">
                            <div className="news-date">Dec 10, 2024</div>
                            <h3>Research Publication</h3>
                            <p>Faculty members publish groundbreaking research in renewable energy...</p>
                        </div>
                        <div className="news-card">
                            <div className="news-date">Dec 5, 2024</div>
                            <h3>Industry Partnership</h3>
                            <p>New collaboration with leading technology companies announced...</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Departments Section */}
            <section className="departments-section">
                <div className="container">
                    <h2 className="section-title">Academic Departments</h2>
                    <div className="departments-grid">
                        <div className="department-card">
                            <h3>Computer Science & Engineering</h3>
                            <p>Leading programs in software development, AI, and data science</p>
                        </div>
                        <div className="department-card">
                            <h3>Electronics & Communication</h3>
                            <p>Advanced studies in communication systems and electronics</p>
                        </div>
                        <div className="department-card">
                            <h3>Mechanical Engineering</h3>
                            <p>Innovation in design, manufacturing, and thermal sciences</p>
                        </div>
                        <div className="department-card">
                            <h3>Civil Engineering</h3>
                            <p>Sustainable infrastructure and environmental engineering</p>
                        </div>
                        <div className="department-card">
                            <h3>Electrical Engineering</h3>
                            <p>Power systems, control systems, and renewable energy</p>
                        </div>
                        <div className="department-card">
                            <h3>Mathematics & Computing</h3>
                            <p>Mathematical modeling and computational sciences</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;