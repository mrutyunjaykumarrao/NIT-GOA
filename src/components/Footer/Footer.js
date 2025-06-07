import React from 'react';
import './Footer.css';
import logo from '../../assets/images/LOGO.png';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="container">
                    <div className="footer-sections">
                        {/* About Section */}
                        <div className="footer-section">
                            <div className="footer-logo">
                                <img src={logo} alt="NIT Goa Logo" />
                                <div className="footer-institute-info">
                                    <h3>NIT Goa</h3>
                                    <p>National Institute of Technology Goa</p>
                                </div>
                            </div>
                            <p className="footer-description">
                                An Institute of National Importance established by an Act of Parliament, 
                                committed to excellence in technical education and research.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul className="footer-links">
                                <li><a href="#">About NIT Goa</a></li>
                                <li><a href="#">Admissions</a></li>
                                <li><a href="#">Academic Programs</a></li>
                                <li><a href="#">Research</a></li>
                                <li><a href="#">Campus Life</a></li>
                                <li><a href="#">Career Services</a></li>
                            </ul>
                        </div>

                        {/* Academic */}
                        <div className="footer-section">
                            <h4>Academics</h4>
                            <ul className="footer-links">
                                <li><a href="#">Computer Science & Engineering</a></li>
                                <li><a href="#">Electronics & Communication</a></li>
                                <li><a href="#">Mechanical Engineering</a></li>
                                <li><a href="#">Civil Engineering</a></li>
                                <li><a href="#">Electrical Engineering</a></li>
                                <li><a href="#">Mathematics & Computing</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-section">
                            <h4>Contact Us</h4>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <strong>Address:</strong>
                                    <p>National Institute of Technology Goa<br/>
                                    Farmagudi, Ponda, Goa - 403401<br/>
                                    India</p>
                                </div>
                                <div className="contact-item">
                                    <strong>Phone:</strong>
                                    <p>+91-832-2404100</p>
                                </div>
                                <div className="contact-item">
                                    <strong>Email:</strong>
                                    <p>director@nitgoa.ac.in</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <p>&copy; 2024 National Institute of Technology Goa. All rights reserved.</p>
                        </div>
                        <div className="footer-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Use</a>
                            <a href="#">RTI</a>
                            <a href="#">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
