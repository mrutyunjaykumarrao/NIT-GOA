import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [animateCounter, setAnimateCounter] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  // Initialize visitor counter from localStorage or set default
  useEffect(() => {
    const initializeVisitorCounter = () => {
      const storedCount = localStorage.getItem('nitgoa_visitor_count');
      const storedDate = localStorage.getItem('nitgoa_last_visit');
      const today = new Date().toDateString();

      if (storedCount && storedDate === today) {
        // Same day visit - just use stored count
        setVisitorCount(parseInt(storedCount));
      } else {
        // New day or first visit - increment counter
        const baseCount = storedCount ? parseInt(storedCount) : 1247892;
        const newCount = baseCount + Math.floor(Math.random() * 15) + 1;
        
        setVisitorCount(newCount);
        localStorage.setItem('nitgoa_visitor_count', newCount.toString());
        localStorage.setItem('nitgoa_last_visit', today);
        
        // Animate the counter on first load
        setTimeout(() => {
          setAnimateCounter(true);
          setTimeout(() => setAnimateCounter(false), 1000);
        }, 500);
      }
    };

    initializeVisitorCounter();
    setLastUpdated(new Date());
  }, []);

  // Simulate realistic visitor counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1; // 1-3 visitors
      setVisitorCount(prev => {
        const newCount = prev + increment;
        localStorage.setItem('nitgoa_visitor_count', newCount.toString());
        return newCount;
      });
      setAnimateCounter(true);
      setLastUpdated(new Date());
      setTimeout(() => setAnimateCounter(false), 800);
    }, Math.random() * 30000 + 15000); // Random interval between 15-45 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle navigation with smooth scroll
  const handleLinkClick = (e, path, hash = '') => {
    e.preventDefault();
    
    // Store current scroll position
    sessionStorage.setItem('footerScrollPosition', window.scrollY.toString());
    
    // Navigate to page
    navigate(path + hash);
    
    // Smooth scroll to top or specific section
    setTimeout(() => {
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle back navigation - scroll to footer
  useEffect(() => {
    const handlePopState = () => {
      const savedPosition = sessionStorage.getItem('footerScrollPosition');
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPosition), behavior: 'smooth' });
        }, 100);
        sessionStorage.removeItem('footerScrollPosition');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Format visitor count with leading zeros
  const formatVisitorCount = (count) => {
    return count.toString().padStart(7, '0').split('');
  };

  // Format last updated date with time
  const formatLastUpdated = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* College Name at Center Top */}
        <h3 className="footer-institute-name">National Institute of Technology Goa</h3>
        
        <div className="footer-content">
          {/* Institute Info & Visitor Counter */}
          <div className="footer-section footer-institute-info">
            
            {/* Visitor Counter */}
            <div className="footer-visitor-counter">
              <div className="footer-counter-display">
                <span className="footer-counter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Total Visitors
                </span>
                <div className={`footer-counter-digits ${animateCounter ? 'footer-counter-animate' : ''}`}>
                  {formatVisitorCount(visitorCount).map((digit, index) => (
                    <span key={index} className="footer-digit">{digit}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="footer-social-media-inline">
              <h4>Connect With Us</h4>
              <div className="footer-social-icons">
                <a href="https://www.youtube.com/c/NationalInstituteofTechnologyGoa" className="footer-social-icon youtube" aria-label="YouTube" title="YouTube" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/school/nitgoa/" className="footer-social-icon linkedin" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://x.com/NITGoa_Official" className="footer-social-icon twitter" aria-label="X (Twitter)" title="X (Twitter)" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/nitgoa/" className="footer-social-icon facebook" aria-label="Facebook" title="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/nitgoa/?hl=en" className="footer-social-icon instagram" aria-label="Instagram" title="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Important Links (not in navbar) */}
          <div className="footer-section">
            
            <div className="footer-links-card">
              <h5 className="footer-contact-main-title">Important Links</h5>
              <ul>
                <li><a href="/academics/regulations#ug-curriculum" onClick={(e) => handleLinkClick(e, '/academics/regulations', '#ug-curriculum')}>Syllabus</a></li>
                <li><a href="/e-downloads" onClick={(e) => handleLinkClick(e, '/e-downloads')}>e-Downloads</a></li>
                <li><a href="https://mis.nitgoa.ac.in/misnitgoa/result.aspx" target="_blank" rel="noopener noreferrer">Results</a></li>
                <li><a href="/rti" onClick={(e) => handleLinkClick(e, '/rti')}>RTI</a></li>
                <li><a href="/sc-st-cell" onClick={(e) => handleLinkClick(e, '/sc-st-cell')}>SC/ST Cell</a></li>
                <li><a href="/administration/committees#anti-ragging-committee" onClick={(e) => handleLinkClick(e, '/administration/committees', '#anti-ragging-committee')}>Anti-Ragging</a></li>
                <li><a href="/administration/committees#grievance-redressal-committee" onClick={(e) => handleLinkClick(e, '/administration/committees', '#grievance-redressal-committee')}>Grievance Portal</a></li>
              </ul>
            </div>
          </div> 

          {/* Contact & Location with Map */}
          <div className="footer-section footer-contact-section">
            
            <div className="footer-contact-main-card">
              <h5 className="footer-contact-main-title">
                <a href="/contact-us" style={{color: 'inherit', textDecoration: 'none', fontSize: '24px', fontWeight: '700'}}>Contact Us</a>
              </h5>
              <div className="footer-contact-cards-container">
                {/* Contact Details Card - Now First */}
                <div className="footer-contact-card footer-details-card">
                  <div className="footer-contact-details">
                    <div className="footer-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div>
                        <p>National Institute of Technology Goa</p>
                        <p>Kottamoll Plateau, Cuncolim Municipal Area,</p>
                        <p>Salcete Taluka, South Goa District,</p>
                        <p>Goa - 403703</p>
                        <p>Website: www.nitgoa.ac.in</p>
                      </div>
                    </div>
                    
                    <div className="footer-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <p>+91 832 2404 200</p>
                    </div>
                    
                    <div className="footer-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <p>registrar@nitgoa.ac.in</p>
                    </div>
                  </div>
                </div>

                {/* Map Card - Now Second */}
                <div className="footer-contact-card footer-map-card">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46349.55478460737!2d74.01610674087917!3d15.195724063648544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbe4dade7a19b97%3A0x9db46cb6ea1d0d3f!2sNational%20Institute%20of%20Technology%20Goa!5e1!3m2!1sen!2sin!4v1751339725832!5m2!1sen!2sin"
                    style={{ border: 0, borderRadius: '6px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NIT Goa Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 National Institute of Technology Goa</p>
          </div>
          {/* Footer Last Updated - Bottom Most */}
        <div className="footer-last-updated-bottom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '12px', height: '12px', marginRight: '0px', verticalAlign: 'middle'}}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          Last Updated: {formatLastUpdated(lastUpdated)}
        </div>
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;