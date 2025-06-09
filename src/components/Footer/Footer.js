import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import logo from '../../assets/images/Home/NIT_LOGO.png';
import { navigationConfig } from '../../utils/navigationConfig';

const Footer = () => {
    const navigate = useNavigate();

    const navigateToPage = (url) => {
        // Handle navigation - external links open in new tab, internal routes use React Router
        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            // Use React Router for internal navigation
            navigate(url);
        }
    };
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
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.quickLinks.about)}>About NIT Goa</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.quickLinks.admissions)}>Admissions</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.quickLinks.academicPrograms)}>Academic Programs</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.quickLinks.research)}>Research</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.quickLinks.campusLife)}>Campus Life</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.quickLinks.careerServices)}>Career Services</button></li>
                            </ul>
                        </div>

                        {/* Academic */}
                        <div className="footer-section">
                            <h4>Academics</h4>
                            <ul className="footer-links">
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.departments.cse)}>Computer Science & Engineering</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.departments.ece)}>Electronics & Communication</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.departments.me)}>Mechanical Engineering</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.departments.ce)}>Civil Engineering</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.departments.ee)}>Electrical Engineering</button></li>
                                <li><button className="footer-link-btn" onClick={() => navigateToPage(navigationConfig.dropdowns.departments.mac)}>Mathematics & Computing</button></li>
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
                            <button className="footer-bottom-btn" onClick={() => navigateToPage(navigationConfig.external.privacyPolicy)}>Privacy Policy</button>
                            <button className="footer-bottom-btn" onClick={() => navigateToPage(navigationConfig.external.termsOfUse)}>Terms of Use</button>
                            <button className="footer-bottom-btn" onClick={() => navigateToPage(navigationConfig.external.rti)}>RTI</button>
                            <button className="footer-bottom-btn" onClick={() => navigateToPage(navigationConfig.external.sitemap)}>Sitemap</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
