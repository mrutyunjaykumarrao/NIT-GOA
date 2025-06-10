import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/images/Home/NIT_LOGO.png';
import constitutionLogo from '../../assets/images/Home/75YearsOf Constitution.png';
import { navigationConfig } from '../../utils/navigationConfig';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Hide main navigation on homepage since we have overlay navigation
    const showMainNav = location.pathname !== '/';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const navigateToPage = (url) => {
        // Handle navigation - external links open in new tab, internal routes use React Router
        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            // Use React Router for internal navigation
            navigate(url);
        }
        setIsMenuOpen(false); // Close mobile menu
        setActiveDropdown(null); // Close dropdowns
    };

    return (
        <>
            {/* Top Navigation Bar */}
            <div className="top-nav">
                <div className="top-nav-container">
                    <div className="top-nav-left">
                        <button className="top-nav-link" onClick={() => navigateToPage(navigationConfig.internal.home)}>Home</button>
                        <span className="nav-separator">|</span>
                        
                        <div className="top-nav-dropdown">
                            <button 
                                className="top-nav-link dropdown-toggle" 
                                onClick={() => handleDropdown('facultyStaff')}
                            >
                                Faculty & Staff
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <ul className={`top-dropdown-menu ${activeDropdown === 'facultyStaff' ? 'show' : ''}`}>
                                <li><button className="top-dropdown-link" onClick={() => navigateToPage(navigationConfig.internal.faculty)}>All Faculty</button></li>
                                <li><button className="top-dropdown-link" onClick={() => navigateToPage('/faculty?dept=cse')}>Computer Science</button></li>
                                <li><button className="top-dropdown-link" onClick={() => navigateToPage('/faculty?dept=ece')}>Electronics</button></li>
                                <li><button className="top-dropdown-link" onClick={() => navigateToPage('/faculty?dept=eee')}>Electrical</button></li>
                                <li><button className="top-dropdown-link" onClick={() => navigateToPage('/faculty?dept=mce')}>Mechanical</button></li>
                                <li><button className="top-dropdown-link" onClick={() => navigateToPage('/faculty?dept=cve')}>Civil</button></li>
                            </ul>
                        </div>
                        <span className="nav-separator">|</span>
                        
                        <button className="top-nav-link" onClick={() => navigateToPage(navigationConfig.external.alumni)}>Alumni</button>
                        <span className="nav-separator">|</span>
                        
                        <button className="top-nav-link" onClick={() => navigateToPage(navigationConfig.external.tenders)}>Tenders</button>
                        <span className="nav-separator">|</span>
                        
                        <button className="top-nav-link" onClick={() => navigateToPage(navigationConfig.external.gian)}>GIAN</button>
                        <span className="nav-separator">|</span>
                        
                        <button className="top-nav-link" onClick={() => navigateToPage(navigationConfig.external.rajbhasha)}>RAJBHASHA</button>
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
            {showMainNav && (
            <nav className="main-nav">
                <div className="nav-container">
                    <div className="hamburger" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    
                    <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigateToPage(navigationConfig.internal.home)}>Home</button>
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
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.director)}>Director</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.registrar)}>Registrar</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.deans)}>Deans</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.hods)}>Heads of Departments</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.adminStaff)}>Administrative Staff</button></li>
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
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.departments)}>Departments</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.programs)}>Programs</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.calendar)}>Academic Calendar</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.syllabus)}>Syllabus</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.regulations)}>Academic Regulations</button></li>
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
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.btech)}>B.Tech</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.mtech)}>M.Tech</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.phd)}>PhD</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.process)}>Admission Process</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.fees)}>Fee Structure</button></li>
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
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.statistics)}>Placement Statistics</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.programs)}>Training Programs</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.industry)}>Industry Relations</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.career)}>Career Services</button></li>
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
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.areas)}>Research Areas</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.publications)}>Publications</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.projects)}>Projects</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.facilities)}>Research Facilities</button></li>
                                <li><button className="dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.collaborations)}>Collaborations</button></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigateToPage(navigationConfig.internal.outreach)}>Outreach activities</button>
                        </li>

                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigateToPage(navigationConfig.internal.nirf)}>NIRF</button>
                        </li>

                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigateToPage(navigationConfig.internal.feePayment)}>Fee payment</button>
                        </li>

                        <li className="nav-item">
                            <button className="nav-link" onClick={() => navigateToPage(navigationConfig.internal.hostel)}>Hostel</button>
                        </li>
                    </ul>
                </div>
            </nav>
            )}
        </>
    );
};

export default Navbar;