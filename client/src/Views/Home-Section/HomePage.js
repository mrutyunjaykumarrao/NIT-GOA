import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './HomePage.css';
import { QuickLinkIcons } from './QuickLinkIcons';
import HeroSlider from './HeroSlider';
import homeData from './home.json';

const HomePage = React.memo(() => {
    // Render tracking for performance monitoring
    const renderRef = useRef(0);
    renderRef.current++;

    // Dynamically import all images from the HeroImages folder
    const heroImages = useMemo(() => {
        function importAll(r) {
            let images = {};
            r.keys().forEach((item, index) => {
                images[item.replace('./', '')] = r(item);
            });
            return images;
        }

        // Import all images from the HeroImages folder
        const images = importAll(require.context('../../assets/images/Home/HeroImages', false, /\.(png|jpe?g|svg)$/));
        
        // Convert to array and sort by filename for consistent order
        return Object.keys(images)
            .sort((a, b) => {
                // Extract numbers from filenames for proper sorting (HeroImg1, HeroImg2, etc.)
                const getNumber = (filename) => {
                    const match = filename.match(/(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                };
                return getNumber(a) - getNumber(b);
            })
            .map(key => images[key]);
    }, []);

    // Load announcements from home.json
    const announcements = useMemo(() => {
        return homeData.home_page.announcements;
    }, []);

    // Load news and events from home.json
    const newsAndEvents = useMemo(() => {
        return homeData.home_page.news_and_events; // Load all items, not limited
    }, []);

    // Load notice board data from home.json
    const noticeBoard = useMemo(() => {
        return homeData.home_page.notice_board; // Load all items, not limited
    }, []);

    // Optimized dependency tracking
    const prevDepsRef = useRef({});
    const currentDeps = {
        heroImages: heroImages?.length,
        announcements: announcements?.length,
        newsAndEvents: newsAndEvents?.length,
        noticeBoard: noticeBoard?.length
    };
    
    // Update previous dependencies
    prevDepsRef.current = currentDeps;

    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);
    const [announcementSlideDirection, setAnnouncementSlideDirection] = useState('right');
    const [countsAnimated, setCountsAnimated] = useState(false);
    const [activeAboutTab, setActiveAboutTab] = useState('about');
    const [counts, setCounts] = useState({
        departments: 0,
        students: 0,
        faculties: 0,
        publications: 0,
        patents: 0
    });

    // Optimized state change tracking
    useEffect(() => {
        // State changes are now properly isolated
    }, [currentAnnouncementIndex, isAnnouncementPaused, announcementSlideDirection]);

    // Component lifecycle management
    useEffect(() => {
        return () => {
            if (announcementIntervalRef.current) {
                clearInterval(announcementIntervalRef.current);
            }
        };
    }, []);
    
    const statsRef = useRef(null);
    const announcementIntervalRef = useRef(null);

    // About section content - Memoized to prevent re-renders
    const aboutContent = useMemo(() => ({
        about: "The National Institute of Technology Goa (NIT Goa) is a premier national-level technical institute in India established in 2010 by an act of parliament (NIT Act, 2007 and NIT (Amendment) Act, 2012). NIT Goa is an autonomous institute functioning under the aegis of Ministry of Education (MoE), Government of India, and has been declared an \"Institute of National Importance\".",
        vision: "National Institute of Technology Goa shall emerge as one of the nation's pre-eminent institutions. Through its excellence, it shall serve the Goan society, India and humanity at large with all the challenges and opportunities.",
        mission: "NIT Goa strives for quality faculty, good students and excellent infrastructure. Strives for excellence, through dissemination, generation and application of knowledge by laying stress on interdisciplinary approach in all the branches of Science, Engineering, Technology, Humanities and Management with emphasis on human values and ethics."
    }), []);

    const animateCounts = useCallback(() => {
        const finalCounts = {
            departments: 7,
            students: 913,
            faculties: 55,
            publications: 1611,
            patents: 18
        };

        const duration = 2000; // 2 seconds
        const steps = 60; // 60 FPS
        const increment = duration / steps;

        Object.keys(finalCounts).forEach((key) => {
            const finalValue = finalCounts[key];
            let currentValue = 0;
            const stepValue = finalValue / steps;

            const counter = setInterval(() => {
                currentValue += stepValue;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(counter);
                }

                setCounts(prev => ({
                    ...prev,
                    [key]: Math.floor(currentValue)
                }));
            }, increment);
        });
    }, []);

    // Auto-cycle announcements every 6 seconds - Optimized performance
    useEffect(() => {
        // Clear any existing interval first
        if (announcementIntervalRef.current) {
            clearInterval(announcementIntervalRef.current);
            announcementIntervalRef.current = null;
        }

        // Don't auto-slide if paused, only one announcement, or no announcements
        if (isAnnouncementPaused || announcements.length <= 1) {
            return;
        }

        // Start auto-slide interval
        announcementIntervalRef.current = setInterval(() => {
            setAnnouncementSlideDirection('right');
            setCurrentAnnouncementIndex((prevIndex) => {
                const nextIndex = prevIndex === announcements.length - 1 ? 0 : prevIndex + 1;
                return nextIndex;
            });
        }, 6000);

        // Cleanup on unmount or dependency change
        return () => {
            if (announcementIntervalRef.current) {
                clearInterval(announcementIntervalRef.current);
                announcementIntervalRef.current = null;
            }
        };
    }, [announcements.length, isAnnouncementPaused]);

    // Simple pause/play toggle - FlexSlider style
    const toggleAnnouncementPlayPause = useCallback(() => {
        setIsAnnouncementPaused(!isAnnouncementPaused);
    }, [isAnnouncementPaused]);

    // Navigation functions - Stop auto-slide when manually navigating
    const goToPreviousAnnouncement = useCallback(() => {
        if (announcements.length <= 1) return;
        
        // Stop auto-slide permanently when user manually navigates
        setIsAnnouncementPaused(true);
        setAnnouncementSlideDirection('left');
        setCurrentAnnouncementIndex((prevIndex) => {
            const newIndex = prevIndex === 0 ? announcements.length - 1 : prevIndex - 1;
            return newIndex;
        });
    }, [announcements.length]);

    const goToNextAnnouncement = useCallback(() => {
        if (announcements.length <= 1) return;
        
        // Stop auto-slide permanently when user manually navigates
        setIsAnnouncementPaused(true);
        setAnnouncementSlideDirection('right');
        setCurrentAnnouncementIndex((prevIndex) => {
            const newIndex = prevIndex === announcements.length - 1 ? 0 : prevIndex + 1;
            return newIndex;
        });
    }, [announcements.length]);

    // Counting animation for statistics - Optimized to prevent re-renders
    useEffect(() => {
        if (countsAnimated) return; // Don't create observer if already animated
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !countsAnimated) {
                        setCountsAnimated(true);
                        animateCounts();
                    }
                });
            },
            { threshold: 0.5 }
        );

        const currentStatsRef = statsRef.current;
        if (currentStatsRef) {
            observer.observe(currentStatsRef);
        }

        return () => {
            if (currentStatsRef) {
                observer.unobserve(currentStatsRef);
            }
        };
    }, [countsAnimated, animateCounts]);

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <HeroSlider heroImages={heroImages} />
            </section>

            {/* Announcements Section */}
            <section className="announcements-section">
                <div className="homepage-container">
                    <h2 className="section-title">Announcements</h2>
                    <div className="announcement-marquee">
                        <div className="announcement-card">
                            <div className="notice-badge">
                                <span className="notice-text">NOTICE</span>
                            </div>
                            <div className="announcement-content">
                                <p 
                                    key={`announcement-${currentAnnouncementIndex}`} 
                                    className={`announcement-text ${
                                        announcements.length === 1 
                                            ? 'single-announcement' 
                                            : announcementSlideDirection === 'right' 
                                                ? 'slide-in-right' 
                                                : 'slide-in-left'
                                    }`}
                                >
                                    <a 
                                        href={announcements[currentAnnouncementIndex]?.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="announcement-link"
                                    >
                                        {announcements[currentAnnouncementIndex]?.title}
                                    </a>
                                </p>
                            </div>
                            <div className="announcement-controls">
                                {announcements.length > 1 && (
                                    <button 
                                        className="announcement-nav-btn announcement-nav-left"
                                        onClick={goToPreviousAnnouncement}
                                        aria-label="Previous announcement"
                                        title="Previous announcement"
                                    >
                                        <svg viewBox="0 0 24 24" className="nav-arrow-svg">
                                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                )}
                                <button 
                                    className="announcement-play-pause"
                                    onClick={toggleAnnouncementPlayPause}
                                    aria-label={isAnnouncementPaused ? "Play announcements" : "Pause announcements"}
                                    title={isAnnouncementPaused ? "Play announcements" : "Pause announcements"}
                                >
                                    <svg viewBox="0 0 24 24" className="play-pause-svg">
                                        {isAnnouncementPaused ? (
                                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                                        ) : (
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
                                        )}
                                    </svg>
                                </button>
                                {announcements.length > 1 && (
                                    <button 
                                        className="announcement-nav-btn announcement-nav-right"
                                        onClick={goToNextAnnouncement}
                                        aria-label="Next announcement"
                                        title="Next announcement"
                                    >
                                        <svg viewBox="0 0 24 24" className="nav-arrow-svg">
                                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Announcement indicators for multiple announcements */}
                        {announcements.length > 1 && (
                            <div className="announcement-indicators">
                                {announcements.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`announcement-indicator ${index === currentAnnouncementIndex ? 'active' : ''}`}
                                        onClick={() => {
                                            // Stop auto-slide when user clicks indicator
                                            setIsAnnouncementPaused(true);
                                            setAnnouncementSlideDirection(index > currentAnnouncementIndex ? 'right' : 'left');
                                            setCurrentAnnouncementIndex(index);
                                        }}
                                        aria-label={`Go to announcement ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Two Column Section (Previously Three Column) */}
            <section className="two-column-section">
                <div className="homepage-container">
                    <div className="two-column-grid">
                        {/* News And Events */}
                        <div className="column-card">
                            <h3 className="column-title">News And Events</h3>
                            <div className="column-content scrollable-content">
                                {newsAndEvents.map((item, index) => (
                                    <div key={index} className="news-item">
                                        <span className="news-bullet">→</span>
                                        <p>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-link">
                                                {item.title}
                                            </a>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notice Board */}
                        <div className="column-card">
                            <h3 className="column-title">Notice Board</h3>
                            <div className="column-content scrollable-content">
                                {noticeBoard.map((item, index) => (
                                    <div key={index} className="news-item">
                                        <span className="news-bullet">→</span>
                                        <p>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-link">
                                                {item.title}
                                            </a>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="quick-links-section">
                <div className="homepage-container">
                    <h2 className="section-title">Quick Links</h2>
                    <div className="quick-links-grid">
                        <a href="/academics/departments" className="quick-link-card">
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Departments />
                            </div>
                            <div className="quick-link-title">Departments</div>
                            <div className="quick-link-description">Explore our academic departments and programs</div>
                        </a>

                        <a href="https://mis.nitgoa.ac.in/misnitgoa/Default.aspx" className="quick-link-card" target="_blank" rel="noopener noreferrer">
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.MISPortal />
                            </div>
                            <div className="quick-link-title">MIS Portal</div>
                            <div className="quick-link-description">Management Information System for students and faculty</div>
                        </a>

                        <a href="/research/rd-projects" className="quick-link-card">
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Research />
                            </div>
                            <div className="quick-link-title">Research</div>
                            <div className="quick-link-description">R&D projects and research initiatives</div>
                        </a>

                        <a href="/tenders" className="quick-link-card">
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Tenders />
                            </div>
                            <div className="quick-link-title">Tenders</div>
                            <div className="quick-link-description">Current tenders and procurement notices</div>
                        </a>

                        <a href="/training-placement" className="quick-link-card">
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.TNP />
                            </div>
                            <div className="quick-link-title">Training & Placements</div>
                            <div className="quick-link-description">Career opportunities and placement services</div>
                        </a>

                        <a href="/contact-us" className="quick-link-card">
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Contact />
                            </div>
                            <div className="quick-link-title">Contact Us</div>
                            <div className="quick-link-description">Get in touch with our administration</div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Placement Statistics Section */}
            <section className="placement-section">
                <div className="homepage-container">
                    <h2 className="section-title">Placement Statistics</h2>
                    <div className="placement-content">
                        <div className="placement-chart">
                            <img src="/images/placement_statistics.png" alt="Placement Statistics" />
                        </div>
                        <div className="placement-info">
                            <div className="synapse-logo">
                                <img src="/images/synapse_newsletter.png" alt="Synapse Newsletter" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="homepage-statistics-section" ref={statsRef}>
                <div className="homepage-container">
                    <div className="homepage-stats-grid">
                        <div className="homepage-stat-item">
                            <div className="homepage-stat-number">{counts.departments}</div>
                            <div className="homepage-stat-label">Departments</div>
                        </div>
                        <div className="homepage-stat-item">
                            <div className="homepage-stat-number">{counts.students}</div>
                            <div className="homepage-stat-label">Students</div>
                        </div>
                        <div className="homepage-stat-item">
                            <div className="homepage-stat-number">{counts.faculties}</div>
                            <div className="homepage-stat-label">Faculties</div>
                        </div>
                        <div className="homepage-stat-item">
                            <div className="homepage-stat-number">{counts.publications}</div>
                            <div className="homepage-stat-label">Publications</div>
                        </div>
                        <div className="homepage-stat-item">
                            <div className="homepage-stat-number">{counts.patents}</div>
                            <div className="homepage-stat-label">Patents</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="homepage-container">
                    <div className="about-content">
                        <div className="about-image">
                            <img src={heroImages[0]} alt="NIT Goa Campus" />
                        </div>
                        <div className="about-text">
                            <div className="about-buttons">
                                <button 
                                    className={`about-btn ${activeAboutTab === 'about' ? 'active' : ''}`}
                                    onClick={() => setActiveAboutTab('about')}
                                >
                                    About
                                </button>
                                <button 
                                    className={`about-btn ${activeAboutTab === 'vision' ? 'active' : ''}`}
                                    onClick={() => setActiveAboutTab('vision')}
                                >
                                    Vision
                                </button>
                                <button 
                                    className={`about-btn ${activeAboutTab === 'mission' ? 'active' : ''}`}
                                    onClick={() => setActiveAboutTab('mission')}
                                >
                                    Mission
                                </button>
                            </div>
                            <p>
                                {aboutContent[activeAboutTab]}
                            </p>
                            <a href="/about" className="read-more-link">Read more {'>'} {'>'}</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer National Portals */}
            <section className="national-portals">
                <div className="homepage-container">
                    <h3>National Portals</h3>
                    <div className="portals-grid">
                        <img src="/images/moe.png" alt="Ministry of Education" />
                        <img src="/images/dii.png" alt="Digital India" />
                        <img src="/images/digilocker_nad.png" alt="DigiLocker NAD" />
                        <img src="/images/fit_india.png" alt="FIT India" />
                        <img src="/images/swach_bharath.png" alt="Swachh Bharat" />
                        <img src="/images/MakeInIndia.png" alt="Make in India" />
                    </div>
                </div>
            </section>
        </div>
    );
});

export default HomePage;