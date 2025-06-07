import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/images/LOGO.png';
import constitutionLogo from '../../assets/images/75YearsOf Constitution.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    return (
        <>
            {/* Top Navigation Bar */}
            <div className="top-nav">
                <div className="top-nav-container">
                    <div className="top-nav-left">
                        <a href="#" className="top-nav-link">Home</a>
                        <a href="#" className="top-nav-link">Faculty & Staff</a>
                        <a href="#" className="top-nav-link">Alumni</a>
                        <a href="#" className="top-nav-link">Tenders</a>
                        <a href="#" className="top-nav-link">GIAN</a>
                        <a href="#" className="top-nav-link">RAJBHASHA</a>
                    </div>
                    <div className="top-nav-right">
                        <select className="language-selector">
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="main-header">
                <div className="header-container">
                    <div className="header-left">
                        <img src={logo} alt="NIT Goa Logo" className="main-logo" />
                        <div className="institute-info">
                            <h1 className="institute-name-hindi">राष्ट्रीय प्रौद्योगिकी संस्थान गोवा</h1>
                            <h2 className="institute-name-english">National Institute of Technology Goa</h2>
                        </div>
                    </div>
                    <div className="header-right">
                        <img src={constitutionLogo} alt="75 Years of Constitution" className="constitution-logo" />
                    </div>
                </div>
            </header>

            {/* Main Navigation */}
            <nav className="main-nav">
                <div className="nav-container">
                    <div className="hamburger" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    
                    <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
                        <li className="nav-item">
                            <a href="#" className="nav-link">Home</a>
                        </li>
                        
                        <li className="nav-item dropdown">
                            <button 
                                className="nav-link dropdown-toggle"
                                onClick={() => handleDropdown('administration')}
                            >
                                Administration
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <ul className={`dropdown-menu ${activeDropdown === 'administration' ? 'show' : ''}`}>
                                <li><a href="#" className="dropdown-link">Director</a></li>
                                <li><a href="#" className="dropdown-link">Registrar</a></li>
                                <li><a href="#" className="dropdown-link">Deans</a></li>
                                <li><a href="#" className="dropdown-link">Heads of Departments</a></li>
                                <li><a href="#" className="dropdown-link">Administrative Staff</a></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <button 
                                className="nav-link dropdown-toggle"
                                onClick={() => handleDropdown('academics')}
                            >
                                Academics
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <ul className={`dropdown-menu ${activeDropdown === 'academics' ? 'show' : ''}`}>
                                <li><a href="#" className="dropdown-link">Departments</a></li>
                                <li><a href="#" className="dropdown-link">Programs</a></li>
                                <li><a href="#" className="dropdown-link">Academic Calendar</a></li>
                                <li><a href="#" className="dropdown-link">Syllabus</a></li>
                                <li><a href="#" className="dropdown-link">Academic Regulations</a></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <button 
                                className="nav-link dropdown-toggle"
                                onClick={() => handleDropdown('admission')}
                            >
                                Admission
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <ul className={`dropdown-menu ${activeDropdown === 'admission' ? 'show' : ''}`}>
                                <li><a href="#" className="dropdown-link">B.Tech</a></li>
                                <li><a href="#" className="dropdown-link">M.Tech</a></li>
                                <li><a href="#" className="dropdown-link">PhD</a></li>
                                <li><a href="#" className="dropdown-link">Admission Process</a></li>
                                <li><a href="#" className="dropdown-link">Fee Structure</a></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <button 
                                className="nav-link dropdown-toggle"
                                onClick={() => handleDropdown('training')}
                            >
                                Training&Placement
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <ul className={`dropdown-menu ${activeDropdown === 'training' ? 'show' : ''}`}>
                                <li><a href="#" className="dropdown-link">Placement Statistics</a></li>
                                <li><a href="#" className="dropdown-link">Training Programs</a></li>
                                <li><a href="#" className="dropdown-link">Industry Relations</a></li>
                                <li><a href="#" className="dropdown-link">Career Services</a></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <button 
                                className="nav-link dropdown-toggle"
                                onClick={() => handleDropdown('research')}
                            >
                                Research
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <ul className={`dropdown-menu ${activeDropdown === 'research' ? 'show' : ''}`}>
                                <li><a href="#" className="dropdown-link">Research Areas</a></li>
                                <li><a href="#" className="dropdown-link">Publications</a></li>
                                <li><a href="#" className="dropdown-link">Projects</a></li>
                                <li><a href="#" className="dropdown-link">Research Facilities</a></li>
                                <li><a href="#" className="dropdown-link">Collaborations</a></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">Outreach activities</a>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">NIRF</a>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">Fee payment</a>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">Hostel</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;