import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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

  const handleDropdownMouseLeave = () => {
    // Keep the dropdown open when moving within the dropdown area
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
              {user && user.role !== 'guest' ? (
                <div className="user-menu">
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
            <a href="/Alumini">Alumini</a>
            <a href="/tenders">Tenders</a>
            <a href="/gian">GIAN</a>
            <a href="/rajbhasha">RAJBHASHA</a>
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
                <a href="/board-of-governors">Board of Governors</a>
                <a href="/director">Director</a>
                <a href="/registrar">Registrar</a>
                <a href="/senate">Senate</a>
                <a href="/deans">Deans</a>
                <a href="/committees">Committees</a>
                <a href="/finance-committee">Finance Committee</a>
                <a href="/building-works-committee">Building and Works Committee</a>
                <a href="/heads-of-departments">Heads of Departments</a>
                <a href="/nit-goa-amendment-statute-2023">NIT Goa(Amendment) Statute 2023</a>
                <a href="/organizational-structure">Organizational Structure</a>
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
                <a href="/academics">Academics Overview</a>
                <a href="/academics/programs">Programs</a>
                <a href="/academics/departments">Departments</a>
                <a href="/academic-calendar">Academic Calendar</a>
                <a href="/academics/regulations">Regulations and Curriculum</a>
                <a href="/academics/dissertation-formats">Dissertation Formats</a>
                <a href="/academics/results">Results</a>
                <a href="/academics/library">Library</a>
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
                      <a href="/admissions/hostel/btech">B.Tech Students</a>
                      <a href="/admissions/hostel/mtech">M.Tech Students</a>
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
                  <a href="/placement">Training & Placement</a>
                  <a href="/tnp">T & P</a>
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
                <a href="/research">Research Overview</a>
                <a href="/research/rd-projects">R & D Projects</a>
                <a href="/research/mou-details">Details Of MoUs</a>
                <a href="/research-consultancy">Research & Consultancy</a>
                <a href="/ipr-policy">IPR Policy</a>
              </div>
            )}
          </div>

          <a href="/outreach-activities" className="nav-item">Outreach Activities</a>
          <a href="/nirf" className="nav-item">NIRF</a>
          <a href="/fee-payment" className="nav-item">Fee Payment</a>
          <a href="/hostels" className="nav-item">Hostels</a>
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
                    <button onClick={() => handleMobileNavigation('/board-of-governors')}>Board of Governors</button>
                    <button onClick={() => handleMobileNavigation('/director')}>Director</button>
                    <button onClick={() => handleMobileNavigation('/registrar')}>Registrar</button>
                    <button onClick={() => handleMobileNavigation('/senate')}>Senate</button>
                    <button onClick={() => handleMobileNavigation('/deans')}>Deans</button>
                    <button onClick={() => handleMobileNavigation('/committees')}>Committees</button>
                    <button onClick={() => handleMobileNavigation('/finance-committee')}>Finance Committee</button>
                    <button onClick={() => handleMobileNavigation('/building-works-committee')}>Building and Works Committee</button>
                    <button onClick={() => handleMobileNavigation('/heads-of-departments')}>Heads of Departments</button>
                    <button onClick={() => handleMobileNavigation('/nit-goa-amendment-statute-2023')}>NIT Goa(Amendment) Statute 2023</button>
                    <button onClick={() => handleMobileNavigation('/organizational-structure')}>Organizational Structure</button>
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
                    <button onClick={() => handleMobileNavigation('/academics')}>Academics Overview</button>
                    <button onClick={() => handleMobileNavigation('/academics/programs')}>Programs</button>
                    <button onClick={() => handleMobileNavigation('/academics/departments')}>Departments</button>
                    <button onClick={() => handleMobileNavigation('/academic-calendar')}>Academic Calendar</button>
                    <button onClick={() => handleMobileNavigation('/academics/regulations')}>Regulations and Curriculum</button>
                    <button onClick={() => handleMobileNavigation('/academics/dissertation-formats')}>Dissertation Formats</button>
                    <button onClick={() => handleMobileNavigation('/academics/results')}>Results</button>
                    <button onClick={() => handleMobileNavigation('/academics/library')}>Library</button>
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
                    <button onClick={() => handleMobileNavigation('/placement')}>Training & Placement</button>
                    <button onClick={() => handleMobileNavigation('/tnp')}>T & P</button>
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
                    <button onClick={() => handleMobileNavigation('/research')}>Research Overview</button>
                    <button onClick={() => handleMobileNavigation('/research/rd-projects')}>R & D Projects</button>
                    <button onClick={() => handleMobileNavigation('/research/mou-details')}>Details Of MoUs</button>
                    <button onClick={() => handleMobileNavigation('/research-consultancy')}>Research & Consultancy</button>
                    <button onClick={() => handleMobileNavigation('/ipr-policy')}>IPR Policy</button>
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
                <button onClick={() => handleMobileNavigation('/fee-payment')}>Fee Payment</button>
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
