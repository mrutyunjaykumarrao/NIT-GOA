import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGoogleTranslate } from '../../hooks/useGoogleTranslate';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import TranslationConfirmDialog from '../TranslationConfirmDialog/TranslationConfirmDialog';
import ThemeToggle from '../../Views/ThemeToggle/ThemeToggle';
import './Navbar.css';

// Custom logging Link component
const LoggingLink = ({ to, children, className, ...props }) => {
  const { isAuthenticated, user } = useAuth();
  
  const handleClick = () => {
    console.log('🔗 NAVIGATION LINK CLICK:', {
      targetPath: to,
      currentPath: window.location.pathname,
      isAuthenticated,
      user: user ? { id: user.id, role: user.role, username: user.username } : null,
      linkText: typeof children === 'string' ? children : 'Complex content'
    });
  };
  
  return (
    <Link 
      to={to} 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTopNavHidden, setIsTopNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [mobileNestedDropdown, setMobileNestedDropdown] = useState(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] = useState(false);
  const ticking = useRef(false);
  const languageDropdownRef = useRef(null);
  const mobileLanguageDropdownRef = useRef(null);

  // Use the Google Translate hook
  const {
    currentLanguage,
    languages,
    showTranslateConfirm,
    pendingTranslation,
    handleTranslateConfirm,
    changeLanguage,
    getCurrentLanguage
  } = useGoogleTranslate();

  // Get current language object from the hook
  const currentLang = getCurrentLanguage();

  // Custom logout handler that redirects to login with return path
  const handleLogout = () => {
    logout();
    // Navigate to login page with current location as return path
    navigate('/login', { 
      state: { from: location },
      replace: true 
    });
  };

  // Google Translate integration functions
  const initializeGoogleTranslate = useCallback(() => {
    // Check if Google Translate is ready
    if (window.googleTranslateReady) {
      console.log('Google Translate is ready');
      return;
    }
    
    // Wait for Google Translate to be ready
    if (window.google && window.google.translate && !window.googleTranslateInitialized) {
      console.log('Google Translate available, initializing...');
      
      setTimeout(() => {
        try {
          // Check if widget was created
          const selectElement = document.querySelector('#google_translate_element select');
          console.log('Translation select element found:', !!selectElement);
          
          if (selectElement) {
            console.log('Available language options:', 
              Array.from(selectElement.options).map(opt => ({
                value: opt.value, 
                text: opt.text
              }))
            );
          }
        } catch (error) {
          console.error('Error checking Google Translate widget:', error);
        }
      }, 3000);
      
    } else {
      // Retry after a short delay
      setTimeout(initializeGoogleTranslate, 500);
    }
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
      if (mobileLanguageDropdownRef.current && !mobileLanguageDropdownRef.current.contains(event.target)) {
        setIsMobileLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setMobileNestedDropdown(null); // Close any nested dropdowns
  };

  const closeMobileMenu = () => {
    setIsMobileMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosing(false);
      setMobileOpenDropdown(null);
      setMobileNestedDropdown(null);
    }, 300); // Match animation duration
  };

  const toggleMobileDropdown = (dropdownName) => {
    if (mobileOpenDropdown === dropdownName) {
      setMobileOpenDropdown(null);
      setMobileNestedDropdown(null); // Close nested when main closes
    } else {
      setMobileOpenDropdown(dropdownName);
      setMobileNestedDropdown(null); // Close any previous nested
    }
  };

  const toggleMobileNestedDropdown = (nestedName) => {
    setMobileNestedDropdown(mobileNestedDropdown === nestedName ? null : nestedName);
  };

  const handleMobileNavigation = (path) => {
    console.log('📱 MOBILE NAVIGATION CLICK:', {
      targetPath: path,
      currentPath: window.location.pathname,
      isAuthenticated,
      user: user ? { id: user.id, role: user.role, username: user.username } : null
    });
    
    setIsMobileMenuClosing(true);
    setTimeout(() => {
      navigate(path);
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosing(false);
      setMobileOpenDropdown(null);
      setMobileNestedDropdown(null);
    }, 300);
  };

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  // Toggle mobile language dropdown
  const toggleMobileLanguageDropdown = () => {
    setIsMobileLanguageDropdownOpen(!isMobileLanguageDropdownOpen);
  };

  return (
    <div 
      className={`navbar-wrapper ${isTopNavHidden ? 'navbar-compact' : ''}`}
      style={{
        '--scroll-progress': scrollProgress,
        '--navbar-top-header-height': `${35 - scrollProgress * 10}px`,
        '--navbar-main-header-height': `${85 - scrollProgress * 25}px`,
      }}
    >
      {/* Top Header */}
      <div className={`navbar-top-header ${isTopNavHidden ? 'navbar-top-header-hidden' : ''}`}>
        <div className="navbar-top-header-content">
          {/* Desktop Controls - Hidden when hamburger menu is visible */}
          <div className="navbar-top-nav-controls desktop-only">
            {/* Enhanced Language Selector */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              languages={languages}
              isDropdownOpen={isLanguageDropdownOpen}
              onToggleDropdown={toggleLanguageDropdown}
              onLanguageChange={(languageCode) => {
                setIsLanguageDropdownOpen(false); // Close dropdown immediately
                changeLanguage(languageCode);
              }}
              dropdownRef={languageDropdownRef}
            />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Desktop Top Nav */}
          <nav className="navbar-top-nav desktop-only">
            <a href="https://www.nitgoa.ac.in/alumni/" target="_blank" rel="noopener noreferrer">Alumni</a>
            <Link to="/nirf">NIRF</Link>
            <Link to="/tenders">Tenders</Link>
            <Link to="/gian">GIAN</Link>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer">RAJBHASHA</a>
            {/* Login/User Section */}
            <div className="auth-section">
              {isAuthenticated && user ? (
                <div className="user-menu">
                  <span className="user-greeting">
                    Welcome, {user.name || user.username}
                  </span>
                  {user.role === 'Admin' && (
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
                    onClick={handleLogout}
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
          </nav>

          {/* Mobile Top Nav */}
          <nav className="navbar-top-nav mobile-only">
            <Link to="/tenders">Tenders</Link>
            <Link to="/gian">GIAN</Link>
            <a href="https://www.nitgoa.ac.in/rajbhasha/#/" target="_blank" rel="noopener noreferrer">RAJBHASHA</a>
          </nav>

          {/* Mobile Login Button */}
          <div className="mobile-auth mobile-only">
            {isAuthenticated && user ? (
              <button 
                className="nav-btn nav-btn--logout mobile-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button 
                className="nav-btn nav-btn--login mobile-login"
                onClick={() => navigate('/login')}
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
            <Link to="/" className="navbar-logo-link">
              <img src="/logo192.png" alt="NIT Goa Logo" className="navbar-nit-logo" />
              <div className="navbar-institute-info">
                <h1 className="navbar-institute-name-hindi">राष्ट्रीय प्रौद्योगिकी संस्थान गोवा</h1>
                <h2 className="navbar-institute-name-english">National Institute of Technology Goa</h2>
              </div>
            </Link>
          </div>
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
      </header>

      {/* Main Navigation */}
      <nav className="navbar-main-navigation">
        <div className="navbar-nav-content">
          <LoggingLink to="/" className="navbar-nav-item">Home</LoggingLink>

          {/* Administration Dropdown */}
          <div 
            className="navbar-nav-item navbar-dropdown"
            onMouseEnter={() => handleMouseEnter('administration')}
            onMouseLeave={handleMouseLeave}
          >
            <span>Administration</span>
            {openDropdown === 'administration' && (
              <div className="navbar-dropdown-menu">
                <LoggingLink to="/administration/board-of-governors">Board of Governors</LoggingLink>
                <LoggingLink to="/administration/director">Director</LoggingLink>
                <LoggingLink to="/administration/registrar">Registrar</LoggingLink>
                <LoggingLink to="/administration/senate">Senate</LoggingLink>
                <LoggingLink to="/administration/deans">Deans</LoggingLink>
                <LoggingLink to="/administration/committees">Committees</LoggingLink>
                <LoggingLink to="/administration/finance-committee">Finance Committee</LoggingLink>
                <LoggingLink to="/administration/building-works-committee">Building and Works Committee</LoggingLink>
                <LoggingLink to="/heads-of-departments">Heads of Departments</LoggingLink>
                <a href="https://www.nitgoa.ac.in/uploads/NITGoaStatute-2023.pdf" target="_blank" rel="noopener noreferrer">NIT Goa(Amendment) Statute 2023</a>
                <a href="/pdf/Administration/organisationalstructure/Org_Chart.pdf" target="_blank" rel="noopener noreferrer">Organizational Structure</a>
                <Link to="/reports">Reports</Link>
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
                <LoggingLink to="/academic-calendar">Academic Calendar</LoggingLink>
                <LoggingLink to="/academics/regulations">Regulations and Curriculum</LoggingLink>
                <LoggingLink to="/academics/dissertation-formats">Dissertation Formats</LoggingLink>
                <a href="https://mis.nitgoa.ac.in/misnitgoa/result.aspx" target="_blank" rel="noopener noreferrer">Results</a>
                <LoggingLink to="/academics/departments">Departments</LoggingLink>
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
                      <Link to="/admissions/btech/josaa-csab">JoSAA/CSAB</Link>
                      <Link to="/admissions/btech/dasa">DASA</Link>
                      <Link to="/admissions/btech/facilities">Facilities</Link>
                      <Link to="/admissions/btech/strengths">Strengths of NIT Goa</Link>
                    </div>
                    )}
                  </div>
                  <Link to="/admissions/mtech">M.Tech</Link>
                  <Link to="/admissions/phd">Ph.D</Link>
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
                  <Link to="/training-placement">T & P</Link>
                  <Link to="/company-login">Company Login</Link>
                  <Link to="/forms-guidelines">Forms & Guidelines</Link>
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
                <Link to="/faculty">Faculty</Link>
                <Link to="/technical-staff">Technical Staff</Link>
                <Link to="/administrative-staff">Administrative Staff</Link>
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
                <Link to="/research/rd-projects">R & D Projects</Link>
                <a href="https://www.nitgoa.ac.in/research/Research_Consultancy/research_consultancy.html" target="_blank" rel="noopener noreferrer">Research & Consultancy</a>
                <Link to="/research/mou-details">Details Of MoUs</Link>
                <a href="https://www.nitgoa.ac.in/static/NIT_Goa_IPR_10Nov2015.pdf" target="_blank" rel="noopener noreferrer">IPR Policy</a>
              </div>
            )}
          </div>

          <Link to="/outreach-activities" className="navbar-nav-item">Outreach Activities</Link>
          <a href="https://mis.nitgoa.ac.in/misnitgoa/academic/ONLINEFEESCOLLECTION/Payment.aspx" target="_blank" rel="noopener noreferrer" className="navbar-nav-item">Fee Payment</a>
          <a href="/hostels" className="navbar-nav-item">Hostels</a>
        </div>
        
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`mobile-menu-overlay ${isMobileMenuClosing ? 'closing' : ''}`} onClick={closeMobileMenu}>
          <div className={`mobile-menu ${isMobileMenuClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-theme">
                <ThemeToggle />
                
                {/* Mobile Language Selector */}
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  languages={languages}
                  isDropdownOpen={isMobileLanguageDropdownOpen}
                  onToggleDropdown={toggleMobileLanguageDropdown}
                  onLanguageChange={(languageCode) => {
                    setIsMobileLanguageDropdownOpen(false); // Close dropdown immediately
                    changeLanguage(languageCode);
                  }}
                  dropdownRef={mobileLanguageDropdownRef}
                  isMobile={true}
                />
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
                  <div className="mobile-dropdown-menu open">
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
                  <div className="mobile-dropdown-menu open">
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
                  <div className="mobile-dropdown-menu open">
                    {/* B.Tech Submenu */}
                    <button 
                      className="mobile-dropdown-trigger"
                      onClick={() => toggleMobileNestedDropdown('btech')}
                    >
                      B.Tech
                      <svg className={`dropdown-icon ${mobileNestedDropdown === 'btech' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    {mobileNestedDropdown === 'btech' && (
                      <div className="mobile-dropdown-menu open">
                        <button onClick={() => handleMobileNavigation('/admissions/btech/josaa-csab')}>JoSAA/CSAB</button>
                        <button onClick={() => handleMobileNavigation('/admissions/btech/dasa')}>DASA</button>
                        <button onClick={() => handleMobileNavigation('/admissions/btech/facilities')}>Facilities</button>
                        <button onClick={() => handleMobileNavigation('/admissions/btech/strengths')}>Strengths of NIT Goa</button>
                      </div>
                    )}
                    
                    <button onClick={() => handleMobileNavigation('/admissions/mtech')}>M.Tech</button>
                    <button onClick={() => handleMobileNavigation('/admissions/phd')}>Ph.D</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/static/fee_structure_23-24_25july2023.pdf', '_blank')}>Fee Structure</button>
                    <button onClick={() => window.open('https://www.nitgoa.ac.in/uploads/AdmissionBrochure%202august2024.pdf', '_blank')}>Admission Brochure</button>
                    
                    {/* Hostels Submenu */}
                    <button 
                      className="mobile-dropdown-trigger"
                      onClick={() => toggleMobileNestedDropdown('hostels')}
                    >
                      Hostels
                      <svg className={`dropdown-icon ${mobileNestedDropdown === 'hostels' ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    {mobileNestedDropdown === 'hostels' && (
                      <div className="mobile-dropdown-menu open">
                        <button onClick={() => window.open('https://www.nitgoa.ac.in/static/Rules_of_NIT_Goa_Hostel_18July2022.pdf', '_blank')}>B.Tech Students</button>
                        <button onClick={() => window.open('https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf', '_blank')}>M.Tech Students</button>
                      </div>
                    )}
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
                  <div className="mobile-dropdown-menu open">
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
                  <div className="mobile-dropdown-menu open">
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
                  <div className="mobile-dropdown-menu open">
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
                <button onClick={() => handleMobileNavigation('/hostels')}>Hostels</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Translation Confirmation Dialog */}
      <TranslationConfirmDialog
        isOpen={showTranslateConfirm}
        pendingTranslation={pendingTranslation}
        onConfirm={handleTranslateConfirm}
        onCancel={() => handleTranslateConfirm(false)}
      />
    </div>
  );
};

export default Navbar;