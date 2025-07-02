import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import ThemeToggle from '../../Views/ThemeToggle/ThemeToggle';
import nitLogo from '../../assets/images/Home/NIT_LOGO_192.png';

const Navbar = ({ user, onLogout }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const ticking = useRef(false);
  const navigate = useNavigate();

  const handleMouseEnter = (dropdownName) => {
    setOpenDropdown(dropdownName);
    // Clear submenu when switching main dropdowns
    if (dropdownName !== 'admissions') {
      setActiveSubmenu(null);
    }
  };

  const handleMouseLeave = () => {
    // Instant response for fast cursor movement
    setOpenDropdown(null);
    setActiveSubmenu(null);
  };

  const handleSubmenuEnter = (submenuName) => {
    setActiveSubmenu(submenuName);
  };

  const handleSubmenuLeave = () => {
    setActiveSubmenu(null);
  };

  const handleDropdownMouseEnter = (dropdownName) => {
    setOpenDropdown(dropdownName);
  };

  // Throttled scroll handler for smooth progressive scaling and top nav hiding
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const startScroll = 10; // Start shrinking earlier
        const maxScroll = 80; // Shorter distance for complete shrink
        
        // Calculate smooth progress from 0 to 1 with easing
        const rawProgress = (scrollTop - startScroll) / (maxScroll - startScroll);
        const progress = Math.max(0, Math.min(rawProgress, 1));
        
        // Apply easing function for smoother animation
        const easedProgress = progress * progress * (3 - 2 * progress); // Smoothstep function
        
        setScrollProgress(easedProgress);

        // Top navbar hiding logic
        const scrollDelta = scrollTop - lastScrollY;
        const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show

        if (Math.abs(scrollDelta) > scrollThreshold) {
          if (scrollTop > 100) { // Only hide after scrolling past 100px
            if (scrollDelta > 0) {
              // Scrolling down - hide top nav
              setIsTopNavHidden(true);
            } else {
              // Scrolling up - show top nav
              setIsTopNavHidden(false);
            }
          } else {
            // Always show top nav when near the top
            setIsTopNavHidden(false);
          }
          setLastScrollY(scrollTop);
        }
        
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Mobile menu handlers
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileOpenDropdown(null); // Close any open mobile dropdowns
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileOpenDropdown(null);
  };

  const toggleMobileDropdown = (dropdownName) => {
    setMobileOpenDropdown(mobileOpenDropdown === dropdownName ? null : dropdownName);
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <div 
      className={`navbar-wrapper ${isTopNavHidden ? 'navbar-compact' : ''}`}
      style={{
        '--scroll-progress': scrollProgress,
      }}
    >
      {/* Top Header */}
      <div className={`top-header ${isTopNavHidden ? 'top-header-hidden' : ''}`}>
        <div className="top-header-content">
          <div className="top-nav-controls">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Login/User Section */}
            <div className="auth-section">
              {user && user.role !== 'guest' ? (          <div className="user-menu">
            <a href="https://www.nitgoa.ac.in/alumni/" target="_blank" rel="noopener noreferrer" className="nav-btn nav-btn--link">Alumni</a>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer" className="nav-btn nav-btn--link">Rajbhasha</a>
            <span className="user-greeting">
                    Welcome, {user.username}
                  </span>
                  {user.role === 'admin' && (
                    <button 
                      className="nav-btn nav-btn--admin"
                      onClick={() => navigate('/admin')}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      Admin Panel
                    </button>
                  )}
                  <button 
                    className="nav-btn nav-btn--logout"
                    onClick={onLogout}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  className="nav-btn nav-btn--login"
                  onClick={() => navigate('/login')}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Login
                </button>
              )}
            </div>
          </div>
          
          <nav className="top-nav">
            <a href="https://www.nitgoa.ac.in/alumni/" target="_blank" rel="noopener noreferrer">Alumni</a>
            <a href="/tenders">Tenders</a>
            <a href="/gian">GIAN</a>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer">RAJBHASHA</a>
          </nav>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <a href="/" className="logo-link">
              <img src={nitLogo} alt="NIT Goa Logo" className="nit-logo" />
              <div className="institute-info">
                <h1 className="institute-name-hindi">राष्ट्रीय प्रौद्योगिकी संस्थान गोवा</h1>
                <h2 className="institute-name-english">National Institute of Technology Goa</h2>
              </div>
            </a>
            {/* Hamburger Menu Button - Only visible on mobile */}
          <button 
            className={`hamburger-btn ${isMobileMenuOpen ? 'hamburger-active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="main-navigation">
        <div className="nav-content">
          <a href="/" className="nav-item">Home</a>

          {/* Administration Dropdown */}
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter('administration')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Administration</span>
            {openDropdown === 'administration' && (
              <div className="dropdown-menu">
                <a href="/administration/board-of-governors">Board of Governors</a>
                <a href="/administration/director">Director</a>
                <a href="/administration/registrar">Registrar</a>
                <a href="/administration/senate">Senate</a>
                <a href="/administration/deans">Deans</a>
                <a href="/administration/committees">Committees</a>
                <a href="/administration/finance-committee">Finance Committee</a>
                <a href="/administration/building-works-committee">Building and Works Committee</a>
                <a href="/heads-of-departments">Heads of Departments</a>
                <a href="https://www.nitgoa.ac.in/uploads/NITGoaStatute-2023.pdf" target="_blank" rel="noopener noreferrer">NIT Goa(Amendment) Statute 2023</a>
                <a href="/pdf/Administration/organisationalstructure/Org_Chart.pdf" target="_blank" rel="noopener noreferrer">Organizational Structure</a>
                <a href="/reports">Reports</a>
              </div>
            )}
          </div>

          {/* Academics Dropdown */}
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter('academics')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Academics</span>
            {openDropdown === 'academics' && (
              <div className="dropdown-menu">
                <a href="/academic-calendar">Academic Calendar</a>
                <a href="/academics/regulations">Regulations and Curriculum</a>
                <a href="/academics/dissertation-formats">Dissertation Formats</a>
                <a href="https://mis.nitgoa.ac.in/misnitgoa/result.aspx" target="_blank" rel="noopener noreferrer">Results</a>
                <a href="/academics/departments">Departments</a>
                <a href="https://www.nitgoa.ac.in/academics/library.html" target="_blank" rel="noopener noreferrer">Library</a>
              </div>
            )}
          </div>
          {/* Admissions Dropdown */}
                <div 
                className="nav-item dropdown"
                onMouseEnter={() => handleMouseEnter('admissions')}
                onMouseLeave={handleMouseLeave}
                >
                <span>Admissions</span>
                {openDropdown === 'admissions' && (
                  <div 
                  className="dropdown-menu"
                  onMouseEnter={() => handleDropdownMouseEnter('admissions')}
                  onMouseLeave={handleMouseLeave}
                  >
                  <div 
                    className="dropdown-item-with-submenu"
                    onMouseEnter={() => handleSubmenuEnter('btech')}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <span className="submenu-item">
                    B.Tech
                    <span className="submenu-arrow">▶</span>
                    </span>
                    {activeSubmenu === 'btech' && (
                    <div className="submenu">
                      <a href="/admissions/btech/josaa-csab">JoSAA/CSAB</a>
                      <a href="/admissions/btech/dasa">DASA</a>
                      <a href="/admissions/btech/facilities">Facilities</a>
                      <a href="/admissions/btech/strengths">Strengths of NIT Goa</a>
                    </div>
                    )}
                  </div>
                  <a href="/admissions/mtech">M.Tech</a>
                  <a href="/admissions/phd">Ph.D</a>
                  <a href="/admission-brochure">Admission Brochure</a>
                  <a href="/fee-structure">Fee Structure</a>
                  <div 
                    className="dropdown-item-with-submenu"
                    onMouseEnter={() => handleSubmenuEnter('hostels')}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <span className="submenu-item">
                    Hostels
                    <span className="submenu-arrow">▶</span>
                    </span>
                    {activeSubmenu === 'hostels' && (
                    <div className="submenu hostels-submenu">
                      <a href="https://www.nitgoa.ac.in/static/Rules_of_NIT_Goa_Hostel_18July2022.pdf" target="_blank" rel="noopener noreferrer">B.Tech Students</a>
                      <a href="https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf" target="_blank" rel="noopener noreferrer">M.Tech Students</a>
                    </div>
                    )}
                  </div>
                  </div>
                )}
                </div>

                {/* Training & Placement Dropdown */}
                <div 
                className="nav-item dropdown"
                onMouseEnter={() => handleMouseEnter('training')}
                onMouseLeave={handleMouseLeave}
                >
                <span>Training & Placement</span>
                {openDropdown === 'training' && (
                  <div className="dropdown-menu">
                  <a href="https://www.nitgoa.ac.in/placementcell/" target="_blank" rel="noopener noreferrer">T & P</a>
                  <a href="/company-login">Company Login</a>
                  <a href="/forms-guidelines">Forms & Guidelines</a>
                  </div>
                )}
                </div>
                
                {/* People Dropdown */}
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter('people')}
            onMouseLeave={handleMouseLeave}
          >
            <span>People</span>
            {openDropdown === 'people' && (
              <div className="dropdown-menu">
                <a href="/faculty">Faculty</a>
                <a href="/technical-staff">Technical Staff</a>
                <a href="/administrative-staff">Administrative Staff</a>
                <a href="/telephone-directory">Telephone Directory</a>
              </div>
            )}
          </div>

          {/* Research Dropdown */}
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter('research')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Research</span>
            {openDropdown === 'research' && (
              <div className="dropdown-menu">
                <a href="/research/rd-projects">R & D Projects</a>
                <a href="https://www.nitgoa.ac.in/research/Research_Consultancy/research_consultancy.html" target="_blank" rel="noopener noreferrer">Research & Consultancy</a>
                <a href="/research/mou-details">Details Of MoUs</a>
                <a href="https://www.nitgoa.ac.in/static/NIT_Goa_IPR_10Nov2015.pdf" target="_blank" rel="noopener noreferrer">IPR Policy</a>
              </div>
            )}
          </div>

          <a href="/outreach-activities" className="nav-item">Outreach Activities</a>
          <a href="/nirf" className="nav-item">NIRF</a>
          <a href="https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx" target="_blank" rel="noopener noreferrer" className="nav-item">Fee Payment</a>
          <a href="https://www.nitgoa.ac.in/hostels.html" target="_blank" rel="noopener noreferrer" className="nav-item">Hostels</a>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <button className="mobile-menu-close" onClick={closeMobileMenu}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="mobile-menu-content">
              {/* Home */}
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/')}>Home</button>
              </div>

              {/* Administration */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('administration')}
                >
                  Administration
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'administration' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'administration' && (
                  <div className="mobile-dropdown-menu">
                    <button onClick={() => handleMobileNavigation('/administration/board-of-governors')}>Board of Governors</button>
                    <button onClick={() => handleMobileNavigation('/administration/director')}>Director</button>
                    <button onClick={() => handleMobileNavigation('/administration/registrar')}>Registrar</button>
                    <button onClick={() => handleMobileNavigation('/administration/senate')}>Senate</button>
                    <button onClick={() => handleMobileNavigation('/administration/deans')}>Deans</button>
                    <button onClick={() => handleMobileNavigation('/administration/committees')}>Committees</button>
                    <button onClick={() => handleMobileNavigation('/administration/finance-committee')}>Finance Committee</button>
                    <button onClick={() => handleMobileNavigation('/administration/building-works-committee')}>Building and Works Committee</button>
                    <button onClick={() => handleMobileNavigation('/heads-of-departments')}>Heads of Departments</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/uploads/NITGoaStatute-2023.pdf', '_blank')}>NIT Goa(Amendment) Statute 2023</button>
                    <button onClick={() => window.open('/pdf/Administration/organisationalstructure/Org_Chart.pdf', '_blank')}>Organizational Structure</button>
                    <button onClick={() => handleMobileNavigation('/reports')}>Reports</button>
                  </div>
                )}
              </div>

              {/* Academics */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('academics')}
                >
                  Academics
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'academics' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'academics' && (
                  <div className="mobile-dropdown-menu">
                    <button onClick={() => handleMobileNavigation('/academic-calendar')}>Academic Calendar</button>
                    <button onClick={() => handleMobileNavigation('/academics/regulations')}>Regulations and Curriculum</button>
                    <button onClick={() => handleMobileNavigation('/academics/dissertation-formats')}>Dissertation Formats</button>
                    <button onClick={() => window.open('https://mis.nitgoa.ac.in/misnitgoa/result.aspx', '_blank')}>Results</button>
                    <button onClick={() => handleMobileNavigation('/academics/departments')}>Departments</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/academics/library.html', '_blank')}>Library</button>
                  </div>
                )}
              </div>

              {/* Admissions */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('admissions')}
                >
                  Admissions
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'admissions' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'admissions' && (
                  <div className="mobile-dropdown-menu">
                    <button onClick={() => handleMobileNavigation('/admissions/btech/josaa-csab')}>JoSAA/CSAB</button>
                    <button onClick={() => handleMobileNavigation('/admissions/btech/dasa')}>DASA</button>
                    <button onClick={() => handleMobileNavigation('/admissions/btech/facilities')}>Facilities</button>
                    <button onClick={() => handleMobileNavigation('/admissions/btech/strengths')}>Strengths of NIT Goa</button>
                    <button onClick={() => handleMobileNavigation('/admissions/mtech')}>M.Tech</button>
                    <button onClick={() => handleMobileNavigation('/admissions/phd')}>Ph.D</button>
                    <button onClick={() => handleMobileNavigation('/fee-structure')}>Fee Structure</button>
                    <button onClick={() => handleMobileNavigation('/admission-notices')}>Admission Notices</button>
                  </div>
                )}
              </div>

              {/* Training & Placement */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('training')}
                >
                  Training & Placement
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'training' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'training' && (
                  <div className="mobile-dropdown-menu">
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/placementcell/', '_blank')}>T & P</button>
                    <button onClick={() => handleMobileNavigation('/company-login')}>Company Login</button>
                    <button onClick={() => handleMobileNavigation('/forms-guidelines')}>Forms & Guidelines</button>
                  </div>
                )}
              </div>

              {/* People */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('people')}
                >
                  People
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'people' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'people' && (
                  <div className="mobile-dropdown-menu">
                    <button onClick={() => handleMobileNavigation('/faculty')}>Faculty</button>
                    <button onClick={() => handleMobileNavigation('/technical-staff')}>Technical Staff</button>
                    <button onClick={() => handleMobileNavigation('/administrative-staff')}>Administrative Staff</button>
                    <button onClick={() => handleMobileNavigation('/telephone-directory')}>Telephone Directory</button>
                  </div>
                )}
              </div>

              {/* Research */}
              <div className="mobile-nav-item">
                <button 
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('research')}
                >
                  Research
                  <svg className={`dropdown-icon ${mobileOpenDropdown === 'research' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {mobileOpenDropdown === 'research' && (
                  <div className="mobile-dropdown-menu">
                    <button onClick={() => handleMobileNavigation('/research/rd-projects')}>R & D Projects</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/research/Research_Consultancy/research_consultancy.html', '_blank')}>Research & Consultancy</button>
                    <button onClick={() => handleMobileNavigation('/research/mou-details')}>Details Of MoUs</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/static/NIT_Goa_IPR_10Nov2015.pdf', '_blank')}>IPR Policy</button>
                  </div>
                )}
              </div>

              {/* Single Items */}
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/outreach-activities')}>Outreach Activities</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/nirf')}>NIRF</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => window.open('https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx', '_blank')}>Fee Payment</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => window.open('https://www.nitgoa.ac.in/hostels.html', '_blank')}>Hostel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
