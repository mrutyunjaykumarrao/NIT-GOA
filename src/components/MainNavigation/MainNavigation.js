import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainNavigation.css';
import { navigationConfig } from '../../utils/navigationConfig';

const MainNavigation = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();

    const handleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const navigateToPage = (url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            navigate(url);
        }
        setActiveDropdown(null);
    };

    return (
        <nav className="main-navigation-overlay">
            <div className="nav-overlay-container">
                <ul className="nav-overlay-menu">
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
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.btech)}>B.Tech</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.mtech)}>M.Tech</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.phd)}>PhD</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.process)}>Admission Process</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.admission.fees)}>Fee Structure</button></li>
                        </ul>
                    </li>

                    <li className="nav-overlay-item dropdown">
                        <button 
                            className="nav-overlay-link dropdown-toggle"
                            onClick={() => handleDropdown('training')}
                        >
                            Training&Placement
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <ul className={`overlay-dropdown-menu ${activeDropdown === 'training' ? 'show' : ''}`}>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.overview)}>Overview</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.statistics)}>Placement Statistics</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.companies)}>Recruiting Companies</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.internships)}>Internships</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.training.calendar)}>Training Calendar</button></li>
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
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.centers)}>Research Centers</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.projects)}>Ongoing Projects</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.publications)}>Publications</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.funding)}>Research Funding</button></li>
                            <li><button className="overlay-dropdown-link" onClick={() => navigateToPage(navigationConfig.dropdowns.research.collaborations)}>Collaborations</button></li>
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
                        <button className="nav-overlay-link" onClick={() => navigateToPage(navigationConfig.external.nirf)}>
                            NIRF
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
