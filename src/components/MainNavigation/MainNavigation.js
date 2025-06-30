import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainNavigation.css';
import { navigationConfig } from '../../utils/navigationConfig';

const MainNavigation = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigateToPage = (url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            navigate(url);
        }
        setActiveDropdown(null);
        setIsMobileMenuOpen(false); // Close mobile menu after navigation
    };

    return (
        <nav className="main-navigation-overlay">
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>
            <div className="nav-overlay-container">
                <ul className={`nav-overlay-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li className="nav-overlay-item">
                        <button className="nav-overlay-link" onClick={() => navigateToPage(navigationConfig.internal.home)}>
                            Home
                        </button>
                    </li>
                    
                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('administration')}
                        >
                            Administration
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'administration' ? 'show' : ''}`}>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.director)}>Director</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.registrar)}>Registrar</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.deans)}>Deans</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.hods)}>Heads of Departments</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.administration.adminStaff)}>Administrative Staff</button></li>
                        </ul>
                    </li>

                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('academics')}
                        >
                            Academics
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'academics' ? 'show' : ''}`}>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.departments)}>Departments</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.programs)}>Programs</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.calendar)}>Academic Calendar</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.syllabus)}>Syllabus</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.academics.regulations)}>Academic Regulations</button></li>
                        </ul>
                    </li>

                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('admission')}
                        >
                            Admission
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'admission' ? 'show' : ''}`}>
                            <li className="overlay-dropdown-item-with-submenu">
                                <button className="overlay-dropdown-link">
                                    B.Tech
                                    <span className="overlay-submenu-arrow">▶</span>
                                </button>
                                <ul className="overlay-submenu">
                                    <li><button className="overlay-submenu-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.btechJosaa)}>JoSAA/CSAB</button></li>
                                    <li><button className="overlay-submenu-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.btechDasa)}>DASA</button></li>
                                    <li><button className="overlay-submenu-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.btechFacilities)}>Facilities</button></li>
                                    <li><button className="overlay-submenu-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.btechStrengths)}>Strengths of NIT Goa</button></li>
                                </ul>
                            </li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.mtech)}>M.Tech</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.phd)}>PhD</button></li>
                            <li className="overlay-dropdown-item-with-submenu">
                                <button className="overlay-dropdown-link">
                                    Hostels
                                    <span className="overlay-submenu-arrow">▶</span>
                                </button>
                                <ul className="overlay-submenu">
                                    <li><button className="overlay-submenu-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.btechHostel)}>B.Tech Students</button></li>
                                    <li><button className="overlay-submenu-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.mtechHostel)}>M.Tech Students</button></li>
                                </ul>
                            </li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.brochure)}>Admission Brochure</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.fees)}>Fee Structure</button></li>
                        </ul>
                    </li>

                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('facultyStaff')}
                        >
                            Faculty & Staff
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'facultyStaff' ? 'show' : ''}`}>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.internal.faculty)}>All Faculty</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage('/faculty?dept=cse')}>Computer Science</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage('/faculty?dept=ece')}>Electronics</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage('/faculty?dept=eee')}>Electrical</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage('/faculty?dept=mce')}>Mechanical</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage('/faculty?dept=cve')}>Civil</button></li>
                        </ul>
                    </li>

                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('research')}
                        >
                            Research
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'research' ? 'show' : ''}`}>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.rdProjects)}>R & D Projects</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.researchConsultancy)}>Research & Consultancy</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.mouDetails)}>Details Of MoUs</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.iprPolicy)}>IPR Policy</button></li>
                        </ul>
                    </li>

                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('outreach')}
                        >
                            Outreach activities
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'outreach' ? 'show' : ''}`}>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.outreach.community)}>Community Programs</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.outreach.workshops)}>Workshops</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.outreach.conferences)}>Conferences</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.outreach.extension)}>Extension Activities</button></li>
                        </ul>
                    </li>

                    <li className="nav-overlay-item">
                        <button className="nav-overlay-link" onClick={() => navigateToPage(navigationConfig.internal.nirf)}>
                            NIRF
                        </button>
                    </li>

                    <li className="nav-overlay-item">
                        <button className="nav-overlay-link" onClick={() => navigateToPage(navigationConfig.external.alumni)}>
                            Alumni
                        </button>
                    </li>

                    <li className="nav-overlay-item">
                        <button className="nav-overlay-link" onClick={() => navigateToPage(navigationConfig.external.feePayment)}>
                            Fee payment
                        </button>
                    </li>

                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('hostel')}
                        >
                            Hostel
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'hostel' ? 'show' : ''}`}>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.hostel.facilities)}>Hostel Facilities</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.hostel.rules)}>Rules & Regulations</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.hostel.allocation)}>Room Allocation</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.hostel.mess)}>Mess Services</button></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default MainNavigation;
