import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginModal } from '../../contexts/LoginModalContext';
import './Navbar.css';
import ThemeToggle from '../../Views/ThemeToggle/ThemeToggle';
// import nitLogo from '../../assets/images/Home/NIT_LOGO_192.png'; // Now using public logo192.png

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
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

  // Language change handlers
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    setIsLanguageDropdownOpen(false);
    // Here you can add actual language change logic
    // For example, update context, localStorage, or call an API
  };

  return (
    <div 
      className={`navbar-wrapper ${isTopNavHidden ? 'navbar-compact' : ''}`}
      style={{
        '--scroll-progress': scrollProgress,
      }}
    >
      {/* Top Header */}
      <div className={`navbar-top-header ${isTopNavHidden ? 'navbar-top-header-hidden' : ''}`}>
        <div className="navbar-top-header-content">
          {/* Desktop Controls */}
          <div className="navbar-top-nav-controls desktop-only">
            {/* Language Selector */}
            <div className="navbar-language-selector">
              <button 
                className="navbar-language-btn"
                onClick={toggleLanguageDropdown}
                aria-label="Change language"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                </svg>
                {currentLanguage === 'english' ? 'EN' : 'हि'}
                <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="navbar-language-dropdown">
                  <button onClick={() => changeLanguage('english')}>
                    🇺🇸 English
                  </button>
                  <button onClick={() => changeLanguage('hindi')}>
                    🇮🇳 हिंदी
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Desktop Top Nav */}
          <nav className="navbar-top-nav desktop-only">
            <a href="https://www.nitgoa.ac.in/alumni/" target="_blank" rel="noopener noreferrer">Alumni</a>
            <a href="/nirf">NIRF</a>
            <a href="/tenders">Tenders</a>
            <a href="/gian">GIAN</a>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer">RAJBHASHA</a>
            {/* Login/User Section */}
            <div className="auth-section">
              {isAuthenticated && user ? (
                <div className="user-menu">
                  <span className="user-greeting">
                    Welcome, {user.name || user.username}
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
                    onClick={logout}
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
                  onClick={openLoginModal}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Login
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Top Nav */}
          <nav className="navbar-top-nav mobile-only">
            <a href="/tenders">Tenders</a>
            <a href="/gian">GIAN</a>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer">RAJBHASHA</a>
          </nav>

          {/* Mobile Login Button */}
          <div className="mobile-auth mobile-only">
            {isAuthenticated && user ? (
              <button 
                className="nav-btn nav-btn--logout mobile-logout"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <button 
                className="nav-btn nav-btn--login mobile-login"
                onClick={openLoginModal}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="navbar-main-header">
        <div className="navbar-header-content">
          <div className="navbar-logo-section">
            <a href="/" className="navbar-logo-link">
              <img src="/logo192.png" alt="NIT Goa Logo" className="navbar-nit-logo" />
              <div className="navbar-institute-info">
                <h1 className="navbar-institute-name-hindi">राष्ट्रीय प्रौद्योगिकी संस्थान गोवा</h1>
                <h2 className="navbar-institute-name-english">National Institute of Technology Goa</h2>
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
      <nav className="navbar-main-navigation">
        <div className="navbar-nav-content">
          <a href="/" className="navbar-nav-item">Home</a>

          {/* Administration Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('administration')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Administration</span>
            {openDropdown === 'administration' && (
              <div className="navbar-dropdown-menu">
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
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('academics')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Academics</span>
            {openDropdown === 'academics' && (
              <div className="navbar-dropdown-menu">
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
                className="navbar-nav-item navbar-dropdown"
                onMouseEnter={() => handleMouseEnter('admissions')}
                onMouseLeave={handleMouseLeave}
                >
                <span>Admissions</span>
                {openDropdown === 'admissions' && (
                  <div 
                  className="navbar-dropdown-menu"
                  onMouseEnter={() => handleDropdownMouseEnter('admissions')}
                  onMouseLeave={handleMouseLeave}
                  >
                  <div 
                    className="navbar-dropdown-item-with-submenu"
                    onMouseEnter={() => handleSubmenuEnter('btech')}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <span className="navbar-submenu-item">
                    B.Tech
                    <span className="navbar-submenu-arrow">▶</span>
                    </span>
                    {activeSubmenu === 'btech' && (
                    <div className="navbar-submenu">
                      <a href="/admissions/btech/josaa-csab">JoSAA/CSAB</a>
                      <a href="/admissions/btech/dasa">DASA</a>
                      <a href="/admissions/btech/facilities">Facilities</a>
                      <a href="/admissions/btech/strengths">Strengths of NIT Goa</a>
                    </div>
                    )}
                  </div>
                  <a href="/admissions/mtech">M.Tech</a>
                  <a href="/admissions/phd">Ph.D</a>
                  <a href="https://www.nitgoa.ac.in/uploads/AdmissionBrochure%202august2024.pdf" target="_blank" rel="noopener noreferrer">Admission Brochure</a>
                  <a href="https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf" target="_blank" rel="noopener noreferrer">Fee Structure</a>
                  <div 
                    className="navbar-dropdown-item-with-submenu"
                    onMouseEnter={() => handleSubmenuEnter('hostels')}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <span className="navbar-submenu-item">
                    Hostels
                    <span className="navbar-submenu-arrow">▶</span>
                    </span>
                    {activeSubmenu === 'hostels' && (
                    <div className="navbar-submenu hostels-submenu">
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
                className="navbar-nav-item navbar-dropdown"
                onMouseEnter={() => handleMouseEnter('training')}
                onMouseLeave={handleMouseLeave}
                >
                <span>Training & Placement</span>
                {openDropdown === 'training' && (
                  <div className="navbar-dropdown-menu">
                  <a href="/training-placement">T & P</a>
                  <a href="/company-login">Company Login</a>
                  <a href="/forms-guidelines">Forms & Guidelines</a>
                  </div>
                )}
                </div>
                
                {/* People Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('people')}
            onMouseLeave={handleMouseLeave}
          >
            <span>People</span>
            {openDropdown === 'people' && (
              <div className="navbar-dropdown-menu">
                <a href="/faculty">Faculty</a>
                <a href="/technical-staff">Technical Staff</a>
                <a href="/administrative-staff">Administrative Staff</a>
                <a href="https://www.nitgoa.ac.in/static/TelephoneDirectory.pdf" target="_blank" rel="noopener noreferrer">Telephone Directory</a>
              </div>
            )}
          </div>

          {/* Research Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('research')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Research</span>
            {openDropdown === 'research' && (
              <div className="navbar-dropdown-menu">
                <a href="/research/rd-projects">R & D Projects</a>
                <a href="https://www.nitgoa.ac.in/research/Research_Consultancy/research_consultancy.html" target="_blank" rel="noopener noreferrer">Research & Consultancy</a>
                <a href="/research/mou-details">Details Of MoUs</a>
                <a href="https://www.nitgoa.ac.in/static/NIT_Goa_IPR_10Nov2015.pdf" target="_blank" rel="noopener noreferrer">IPR Policy</a>
              </div>
            )}
          </div>

          <a href="/outreach-activities" className="navbar-nav-item">Outreach Activities</a>
          <a href="https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx" target="_blank" rel="noopener noreferrer" className="navbar-nav-item">Fee Payment</a>
          <a href="/hostels" className="navbar-nav-item">Hostels</a>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-theme">
                <ThemeToggle />
                
                {/* Mobile Language Selector */}
                <div className="navbar-language-selector mobile-language">
                  <button 
                    className="navbar-language-btn mobile-language-btn"
                    onClick={toggleLanguageDropdown}
                    aria-label="Change language"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                    </svg>
                    {currentLanguage === 'english' ? 'EN' : 'हि'}
                  </button>
                  
                  {isLanguageDropdownOpen && (
                    <div className="navbar-language-dropdown mobile-language-dropdown">
                      <button onClick={() => changeLanguage('english')}>
                        🇺🇸 English
                      </button>
                      <button onClick={() => changeLanguage('hindi')}>
                        🇮🇳 हिंदी
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf', '_blank')}>Fee Structure</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/uploads/AdmissionBrochure%202august2024.pdf', '_blank')}>Admission Brochure</button>
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
                    <button onClick={() => handleMobileNavigation('/training-placement')}>T & P</button>
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
                <button onClick={() => window.open('https://www.nitgoa.ac.in/alumni/', '_blank')}>Alumni</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => window.open('https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx', '_blank')}>Fee Payment</button>
              </div>
              <div className="mobile-nav-item">
                <button onClick={() => handleMobileNavigation('/hostels')}>Hostel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;