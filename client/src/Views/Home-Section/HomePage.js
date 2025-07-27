import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './HomePage.css';
import { QuickLinkIcons } from './QuickLinkIcons';
import HeroSlider from './HeroSlider';
import useScrollToTop from '../../utils/useScrollToTop';
import homeData from './home.json';

// Temporarily comment out problematic chart import
// import { initializeChart } from './placement&StatisticsChart';

// PDF Preview Component with lazy loading
const PDFPreview = React.memo(({ src, title, className, isLarge = false }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
        setHasError(false);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(false);
    };

    const handlePreviewClick = () => {
        setShouldLoad(true);
    };

    // Show placeholder until user clicks to load
    if (!shouldLoad || hasError) {
        return (
            <div className="pdf-placeholder" onClick={handlePreviewClick} style={{ cursor: 'pointer' }}>
                <div className={isLarge ? "pdf-icon-large" : "pdf-icon-small"}>
                    <svg viewBox="0 0 24 24" className="pdf-svg">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                    </svg>
                </div>
                <div className="pdf-preview-text">
                    <h4 style={{ fontSize: isLarge ? '1.1rem' : '0.95rem' }}>{title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary-blue)' }}>
                        {hasError ? 'Click to retry loading preview' : 'Click to load PDF preview'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <iframe
            src={`${src}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-width&view=FitH`}
            title={title}
            frameBorder="0"
            scrolling="yes"
            className={className}
            onLoad={handleLoad}
            onError={handleError}
            style={{ opacity: isLoaded ? 1 : 0 }}
        />
    );
});

const HomePage = React.memo(() => {
    // Handle smooth scroll to top for quick link navigation
    useScrollToTop();
    
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
        return homeData.home_page.news_and_events;
    }, []);

    // Load notice board data from home.json
    const noticeBoard = useMemo(() => {
        return homeData.home_page.notice_board;
    }, []);

    // Load newsletters data from home.json
    const newsletters = useMemo(() => {
        return homeData.home_page.newsletters;
    }, []);

    // Load Lore magazine data from home.json
    const loreMagazine = useMemo(() => {
        return homeData.home_page.LoreMagazine;
    }, []);

    // Load national portals data from home.json
    const nationalPortals = useMemo(() => {
        return homeData.home_page.national_portals;
    }, []);

    // Optimized dependency tracking
    const prevDepsRef = useRef({});
    const currentDeps = {
        heroImages: heroImages?.length,
        announcements: announcements?.length,
        newsAndEvents: newsAndEvents?.length,
        noticeBoard: noticeBoard?.length,
        newsletters: newsletters?.length,
        loreMagazine: loreMagazine?.length,
        nationalPortals: nationalPortals?.length
    };
    
    // Update previous dependencies
    prevDepsRef.current = currentDeps;

    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);
    const [announcementSlideDirection, setAnnouncementSlideDirection] = useState('right');
    const [countsAnimated, setCountsAnimated] = useState(false);
    const [activeAboutTab, setActiveAboutTab] = useState('about');
    const [isAboutAutoSwitching, setIsAboutAutoSwitching] = useState(true);
    const [isNewslettersExpanded, setIsNewslettersExpanded] = useState(false);
    const [chartInitialized, setChartInitialized] = useState(false);
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
            if (aboutSwitchIntervalRef.current) {
                clearInterval(aboutSwitchIntervalRef.current);
            }
        };
    }, []);
    // Auto-switch About section tabs every 6 seconds
    useEffect(() => {
        if (!isAboutAutoSwitching) return;

        const tabs = ['about', 'vision', 'mission'];
        let currentIndex = tabs.indexOf(activeAboutTab);

        aboutSwitchIntervalRef.current = setInterval(() => {
            currentIndex = (currentIndex + 1) % tabs.length;
            setActiveAboutTab(tabs[currentIndex]);
        }, 6000);

        return () => {
            if (aboutSwitchIntervalRef.current) {
                clearInterval(aboutSwitchIntervalRef.current);
            }
        };
    }, [activeAboutTab, isAboutAutoSwitching]);

    // Simple Google Charts initialization - inline implementation with dark mode support
    useEffect(() => {
        let chart = null;
        
        const loadGoogleCharts = () => {
            if (window.google?.charts) {
                // Charts already loaded
                drawChart();
            } else {
                // Load Google Charts
                const script = document.createElement('script');
                script.src = 'https://www.gstatic.com/charts/loader.js';
                script.onload = () => {
                    window.google.charts.load('current', { packages: ['corechart'] });
                    window.google.charts.setOnLoadCallback(drawChart);
                };
                document.head.appendChild(script);
            }
        };

        const drawChart = () => {
            try {
                if (!chartRef.current) return;

                // Check for dark mode from body class (theme toggle)
                const isDarkMode = document.body.classList.contains('dark-mode') || 
                                 document.documentElement.classList.contains('dark-mode') ||
                                 document.documentElement.getAttribute('data-theme') === 'dark';

                const data = window.google.visualization.arrayToDataTable([
                    ['Batch', 'Highest Package', 'Average Package'],
                    ['UG 2021', 20, 7.61],
                    ['UG 2022', 44, 13.10],
                    ['UG 2023', 26, 11.34],
                    ['PG 2022', 21.69, 11.35],
                    ['PG 2023', 37, 15.94]
                ]);

                const options = {
                    title: 'Placement & Statistics',
                    titleTextStyle: {
                        color: isDarkMode ? '#e0e0e0' : '#333',
                        fontSize: 16
                    },
                    width: '100%',
                    height: '100%',
                    isStacked: true,
                    backgroundColor: isDarkMode ? '#1a1a1a' : 'transparent',
                    colors: isDarkMode ? ['#4285f4', '#34a853'] : ['#1f77b4', '#ff7f0e'],
                    vAxis: {
                        title: 'Lakhs Per Annum',
                        titleTextStyle: {
                            color: isDarkMode ? '#e0e0e0' : '#666'
                        },
                        textStyle: {
                            color: isDarkMode ? '#b0b0b0' : '#333'
                        },
                        gridlines: {
                            color: isDarkMode ? '#404040' : '#e0e0e0'
                        },
                        minValue: 0
                    },
                    hAxis: {
                        title: 'Batch',
                        titleTextStyle: {
                            color: isDarkMode ? '#e0e0e0' : '#666'
                        },
                        textStyle: {
                            color: isDarkMode ? '#b0b0b0' : '#333'
                        },
                        gridlines: {
                            color: isDarkMode ? '#404040' : '#e0e0e0'
                        }
                    },
                    annotations: {
                        alwaysOutside: true,
                        textStyle: {
                            fontSize: 12,
                            auraColor: 'none',
                            color: isDarkMode ? '#b0b0b0' : '#555'
                        }
                    },
                    legend: { 
                        position: 'bottom',
                        textStyle: {
                            color: isDarkMode ? '#e0e0e0' : '#333'
                        }
                    }
                };

                if (!chart) {
                    chart = new window.google.visualization.ColumnChart(chartRef.current);
                }
                chart.draw(data, options);
                setChartInitialized(true);
            } catch (error) {
                console.warn('Chart initialization failed:', error);
            }
        };

        // Initial load
        if (!chartInitialized && chartRef.current) {
            loadGoogleCharts();
        }

        // Listen for theme changes
        const handleThemeChange = () => {
            if (chartInitialized && window.google?.visualization) {
                drawChart();
            }
        };

        // Create a MutationObserver to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
                    handleThemeChange();
                }
            });
        });

        // Watch for changes on both body and html elements
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

        // Also listen for custom theme change events
        document.addEventListener('themechange', handleThemeChange);
        window.addEventListener('themeToggle', handleThemeChange);

        return () => {
            observer.disconnect();
            document.removeEventListener('themechange', handleThemeChange);
            window.removeEventListener('themeToggle', handleThemeChange);
        };
    }, [chartInitialized]);

    // Handle theme changes for chart - simple implementation
    useEffect(() => {
        // Theme change handling can be added later
    }, []);
    
    const statsRef = useRef(null);
    const announcementIntervalRef = useRef(null);
    const aboutSwitchIntervalRef = useRef(null);
    const chartRef = useRef(null);

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

    // Smooth scroll to top handler for quick links
    const handleQuickLinkClick = useCallback((e, href, isExternal = false) => {
        // For external links, let them open normally
        if (isExternal) return;
        
        e.preventDefault();
        
        // Store the scroll-to-top flag in sessionStorage for the destination page
        sessionStorage.setItem('scrollToTop', 'true');
        
        // Navigate immediately
        window.location.href = href;
    }, []);

    // Toggle newsletters expansion
    const toggleNewsletters = useCallback(() => {
        setIsNewslettersExpanded(!isNewslettersExpanded);
    }, [isNewslettersExpanded]);

    // Handle about tab manual selection (stop auto-switching temporarily)
    const handleAboutTabClick = useCallback((tab) => {
        setActiveAboutTab(tab);
        // Temporarily pause auto-switching by setting a flag
        setIsAboutAutoSwitching(false);
        
        // Resume auto-switching after 10 seconds
        setTimeout(() => {
            setIsAboutAutoSwitching(true);
        }, 10000);
    }, []);

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
                        <a 
                            href="/academics/departments" 
                            className="quick-link-card"
                            onClick={(e) => handleQuickLinkClick(e, '/academics/departments')}
                        >
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Departments />
                            </div>
                            <div className="quick-link-title">Departments</div>
                            <div className="quick-link-description">Explore our academic departments and programs</div>
                        </a>

                        <a 
                            href="https://mis.nitgoa.ac.in/misnitgoa/Default.aspx" 
                            className="quick-link-card" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => handleQuickLinkClick(e, 'https://mis.nitgoa.ac.in/misnitgoa/Default.aspx', true)}
                        >
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.MISPortal />
                            </div>
                            <div className="quick-link-title">MIS Portal</div>
                            <div className="quick-link-description">Management Information System for students and faculty</div>
                        </a>

                        <a 
                            href="/research/rd-projects" 
                            className="quick-link-card"
                            onClick={(e) => handleQuickLinkClick(e, '/research/rd-projects')}
                        >
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Research />
                            </div>
                            <div className="quick-link-title">Research</div>
                            <div className="quick-link-description">R&D projects and research initiatives</div>
                        </a>

                        <a 
                            href="/tenders" 
                            className="quick-link-card"
                            onClick={(e) => handleQuickLinkClick(e, '/tenders')}
                        >
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Tenders />
                            </div>
                            <div className="quick-link-title">Tenders</div>
                            <div className="quick-link-description">Current tenders and procurement notices</div>
                        </a>

                        <a 
                            href="/training-placement" 
                            className="quick-link-card"
                            onClick={(e) => handleQuickLinkClick(e, '/training-placement')}
                        >
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.TNP />
                            </div>
                            <div className="quick-link-title">Training & Placements</div>
                            <div className="quick-link-description">Career opportunities and placement services</div>
                        </a>

                        <a 
                            href="/contact-us" 
                            className="quick-link-card"
                            onClick={(e) => handleQuickLinkClick(e, '/contact-us')}
                        >
                            <div className="quick-link-icon-wrapper">
                                <QuickLinkIcons.Contact />
                            </div>
                            <div className="quick-link-title">Contact Us</div>
                            <div className="quick-link-description">Get in touch with our administration</div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Content Cards Section */}
            <section className="homepage-content-cards-section">
                <div className="homepage-container">
                    <h2 className="section-title">Featured Content</h2>
                    <div className="homepage-content-cards-grid">
                        {/* Card 1: Interactive Google Chart */}
                        <div className="homepage-content-card chart-card">
                            <div className="homepage-card-header">
                                <h3 className="homepage-card-title">Placement Statistics</h3>
                                <p className="homepage-card-subtitle">Interactive placement data visualization</p>
                            </div>
                            <div className="homepage-card-content">
                                <div 
                                    ref={chartRef}
                                    id="placement-chart" 
                                    className="chart-container"
                                ></div>
                            </div>
                        </div>

                        {/* Card 2: Synapse Newsletter */}
                        <div className="homepage-content-card newsletter-card">
                            <div className="homepage-card-header">
                                <h3 className="homepage-card-title">Synapse Newsletter</h3>
                                <p className="homepage-card-subtitle">Biannual newsletter publications</p>
                            </div>
                            <div className="homepage-card-content">
                                <div className="newsletter-preview">
                                    <div className="homepage-newsletter-image">
                                        <img 
                                            src="/images/synapse_newsletter.png" 
                                            alt="Synapse Newsletter"
                                            className="homepage-synapse-image"
                                        />
                                    </div>
                                    <div className="homepage-newsletter-info">
                                        <span className="homepage-newsletter-count">{newsletters.length} Issues Available</span>
                                        <span className="homepage-newsletter-latest">Latest: {newsletters[newsletters.length - 1]?.title}</span>
                                    </div>
                                </div>
                                <button 
                                    className="homepage-expand-button"
                                    onClick={toggleNewsletters}
                                    aria-expanded={isNewslettersExpanded}
                                >
                                    {isNewslettersExpanded ? 'Hide Newsletters' : 'View All Newsletters'}
                                    <svg 
                                        viewBox="0 0 24 24" 
                                        className={`homepage-expand-icon ${isNewslettersExpanded ? 'expanded' : ''}`}
                                    >
                                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Card 3: Lore Magazine */}
                        <div className="homepage-content-card magazine-card">
                            <div className="homepage-card-header">
                                <h3 className="homepage-card-title">Lore Magazine</h3>
                                <p className="homepage-card-subtitle">Institute annual magazine</p>
                            </div>
                            <div className="homepage-card-content">
                                <div className="homepage-magazine-preview">
                                    <div className="pdf-preview-container">
                                        <PDFPreview
                                            src={loreMagazine[0]?.link}
                                            title={loreMagazine[0]?.title}
                                            className="magazine-pdf-preview"
                                            isLarge={true}
                                        />
                                    </div>
                                    <a 
                                        href={loreMagazine[0]?.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="homepage-magazine-button"
                                    >
                                        Read Full Magazine
                                        <svg viewBox="0 0 24 24" className="homepage-external-icon">
                                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="currentColor"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expandable Newsletters Section (4a) */}
                <div className={`newsletters-expanded ${isNewslettersExpanded ? 'expanded' : ''}`}>
                    <div className="homepage-container">
                        <div className="newsletters-header">
                            <h3>All Newsletter Issues</h3>
                            {/* <button 
                                className="close-button"
                                onClick={toggleNewsletters}
                                aria-label="Close newsletters"
                            >
                                <svg viewBox="0 0 24 24" className="close-icon">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                                </svg>
                            </button> */}
                        </div>
                        <div className="newsletters-grid">
                            {newsletters.map((newsletter, index) => (
                                <div key={index} className="newsletter-item">
                                    <div className="newsletter-preview-card">
                                        <div className="newsletter-thumb">
                                            <PDFPreview
                                                src={newsletter.link}
                                                title={newsletter.title}
                                                className="newsletter-pdf-preview"
                                                isLarge={false}
                                            />
                                        </div>
                                        <div className="newsletter-details">
                                            <h4 className="newsletter-title">{newsletter.title}</h4>
                                            <a 
                                                href={newsletter.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="newsletter-link"
                                            >
                                                Read Full Newsletter
                                                <svg viewBox="0 0 24 24" className="external-icon">
                                                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="currentColor"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
            <section className="homepage-about-section">
                <div className="homepage-container">
                    <div className="homepage-about-content">
                        <div className="homepage-about-image">
                            <img src={heroImages[0]} alt="NIT Goa Campus" />
                        </div>
                        <div className="homepage-about-text">
                            <div className="homepage-about-buttons">
                                <button 
                                    className={`homepage-about-btn ${activeAboutTab === 'about' ? 'active' : ''}`}
                                    onClick={() => handleAboutTabClick('about')}
                                >
                                    About
                                </button>
                                <button 
                                    className={`homepage-about-btn ${activeAboutTab === 'vision' ? 'active' : ''}`}
                                    onClick={() => handleAboutTabClick('vision')}
                                >
                                    Vision
                                </button>
                                <button 
                                    className={`homepage-about-btn ${activeAboutTab === 'mission' ? 'active' : ''}`}
                                    onClick={() => handleAboutTabClick('mission')}
                                >
                                    Mission
                                </button>
                            </div>
                            <div className="homepage-about-text-content">
                                <p key={activeAboutTab} className={`homepage-about-paragraph ${activeAboutTab}`}>
                                    {aboutContent[activeAboutTab]}
                                </p>
                            </div>
                            <div className="homepage-about-read-more">
                                <a href="/about" className="homepage-enhanced-link">
                                    Read more 
                                    <svg viewBox="0 0 24 24" className="homepage-arrow-icon">
                                        <path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z" fill="currentColor"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer National Portals */}
            <section className="homepage-national-portals">
                <div className="homepage-container">
                    <h2 className="section-title">National Portals</h2>
                    <div className="homepage-enhanced-portals">
                        {nationalPortals.map((portal, index) => (
                            <a 
                                key={index}
                                href={portal.portal_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="homepage-portal-card"
                                title={portal.title}
                            >
                                <img 
                                    src={portal.image_link} 
                                    alt={portal.title}
                                    className="homepage-portal-image"
                                />
                                <h3 className="homepage-portal-name">{portal.title}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
});

export default HomePage;