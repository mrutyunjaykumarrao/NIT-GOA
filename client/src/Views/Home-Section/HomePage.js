import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './HomePage.css';

const HomePage = () => {
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

    // Announcements data
    const announcements = [
        "Submit your original and unpublished research work to IEEE Conference STPEC 2025 at NIT Goa.",
        "Call for Post Doctoral Fellow (PDF) Positions 2024-25 Session (May-2025)",
        "Call for Paper 1st International Conference on Sustainability and Economic Growth",
        "Registration open for B.Tech Admissions 2025-26 through JoSAA/CSAB",
        "Workshop on Advanced Computing and Data Analytics - Registration Now Open",
        "National Science Day Celebration - February 28, 2025",
        "Industry-Academia Interface Program 2025 - Applications Invited"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(1); // Start at 1 for infinite loop
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [countsAnimated, setCountsAnimated] = useState(false);
    const [activeAboutTab, setActiveAboutTab] = useState('about');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [counts, setCounts] = useState({
        departments: 0,
        students: 0,
        faculties: 0,
        publications: 0,
        patents: 0
    });
    const statsRef = useRef(null);
    const sliderRef = useRef(null);
    const autoSlideRef = useRef(null);

    // About section content
    const aboutContent = {
        about: "The National Institute of Technology Goa (NIT Goa) is a premier national-level technical institute in India established in 2010 by an act of parliament (NIT Act, 2007 and NIT (Amendment) Act, 2012). NIT Goa is an autonomous institute functioning under the aegis of Ministry of Education (MoE), Government of India, and has been declared an \"Institute of National Importance\".",
        vision: "National Institute of Technology Goa shall emerge as one of the nation's pre-eminent institutions. Through its excellence, it shall serve the Goan society, India and humanity at large with all the challenges and opportunities.",
        mission: "NIT Goa strives for quality faculty, good students and excellent infrastructure. Strives for excellence, through dissemination, generation and application of knowledge by laying stress on interdisciplinary approach in all the branches of Science, Engineering, Technology, Humanities and Management with emphasis on human values and ethics."
    };

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

    // Helper function to handle infinite loop transitions
    const handleTransitionEnd = useCallback(() => {
        if (!isTransitioning) return;
        
        setIsTransitioning(false);
        
        // Jump to the corresponding real image without transition
        if (currentImageIndex === heroImages.length + 1) {
            // We're at the duplicated first image, jump to the real first image
            setCurrentImageIndex(1);
        } else if (currentImageIndex === 0) {
            // We're at the duplicated last image, jump to the real last image
            setCurrentImageIndex(heroImages.length);
        }
    }, [currentImageIndex, heroImages.length, isTransitioning]);

    // Auto-cycle images every 8 seconds (slowed down)
    useEffect(() => {
        if (heroImages.length === 0) return;
        
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentImageIndex((prevIndex) => {
                if (prevIndex === heroImages.length) {
                    return heroImages.length + 1; // Go to duplicated first image
                }
                return prevIndex + 1;
            });
        }, 8000);

        autoSlideRef.current = interval;
        return () => clearInterval(interval);
    }, [heroImages.length]);

    // Function to restart auto-cycle after user interaction
    const restartAutoSlide = useCallback(() => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
        }
        
        if (heroImages.length === 0) return;
        
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentImageIndex((prevIndex) => {
                if (prevIndex === heroImages.length) {
                    return heroImages.length + 1; // Go to duplicated first image
                }
                return prevIndex + 1;
            });
        }, 8000);
        
        autoSlideRef.current = interval;
    }, [heroImages.length]);

    // Reset slider position when heroImages are loaded
    useEffect(() => {
        if (heroImages.length > 0 && currentImageIndex === 1) {
            // Ensure we start at the first real image (index 1)
            setCurrentImageIndex(1);
            setIsTransitioning(false);
        }
    }, [heroImages.length, currentImageIndex]);

    // Auto-cycle announcements every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAnnouncementIndex((prevIndex) => 
                prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [announcements.length]);

    const goToPrevious = () => {
        setIsTransitioning(true);
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex === 1) {
                return 0; // Go to duplicated last image
            }
            return prevIndex - 1;
        });
        restartAutoSlide();
    };

    const goToNext = () => {
        setIsTransitioning(true);
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex === heroImages.length) {
                return heroImages.length + 1; // Go to duplicated first image
            }
            return prevIndex + 1;
        });
        restartAutoSlide();
    };

    // Counting animation for statistics
    useEffect(() => {
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
                <div className="hero-background">
                    <div className="hero-slider-container">
                        {heroImages.length > 0 ? (
                            <div 
                                ref={sliderRef}
                                className="hero-images-wrapper"
                                style={{
                                    transform: `translateX(-${currentImageIndex * 100}%)`,
                                    transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
                                }}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {/* Duplicate last image at the beginning for smooth infinite loop */}
                                {heroImages.length > 1 && (
                                    <div className="hero-image-slide">
                                        <img 
                                            src={heroImages[heroImages.length - 1]} 
                                            alt={`NIT Goa Campus ${heroImages.length}`} 
                                            className="hero-campus-image"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                
                                {/* Original images */}
                                {heroImages.map((image, index) => (
                                    <div key={`original-${index}`} className="hero-image-slide">
                                        <img 
                                            src={image} 
                                            alt={`NIT Goa Campus ${index + 1}`} 
                                            className="hero-campus-image"
                                            loading={index === 0 ? "eager" : "lazy"}
                                            onError={(e) => {
                                                console.warn('Failed to load hero image:', e.target.src);
                                            }}
                                        />
                                    </div>
                                ))}
                                
                                {/* Duplicate first image at the end for smooth infinite loop */}
                                {heroImages.length > 1 && (
                                    <div className="hero-image-slide">
                                        <img 
                                            src={heroImages[0]} 
                                            alt="NIT Goa Campus 1" 
                                            className="hero-campus-image"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hero-loading">
                                <p>Loading campus images...</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Navigation Arrows - Only show if we have multiple images */}
                    {heroImages.length > 1 && (
                        <>
                            <button className="hero-nav-arrow hero-nav-left" onClick={goToPrevious}>
                                <span>❮</span>
                            </button>
                            <button className="hero-nav-arrow hero-nav-right" onClick={goToNext}>
                                <span>❯</span>
                            </button>
                        </>
                    )}
                    
                    {/* Image Indicators - Only show if we have multiple images */}
                    {heroImages.length > 1 && (
                        <div className="hero-indicators">
                            {heroImages.map((_, index) => {
                                // Map currentImageIndex to actual image for indicator active state
                                const realIndex = currentImageIndex === 0 ? heroImages.length - 1 : 
                                                currentImageIndex === heroImages.length + 1 ? 0 : 
                                                currentImageIndex - 1;
                                return (
                                    <button
                                        key={index}
                                        className={`hero-indicator ${index === realIndex ? 'active' : ''}`}
                                        onClick={() => {
                                            setIsTransitioning(true);
                                            setCurrentImageIndex(index + 1); // Add 1 because real images start at index 1
                                            restartAutoSlide();
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
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
                                <p className="announcement-text">{announcements[currentAnnouncementIndex]}</p>
                            </div>
                        </div>
                        <div className="announcement-indicators">
                            {announcements.map((_, index) => (
                                <span 
                                    key={index}
                                    className={`announcement-dot ${index === currentAnnouncementIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentAnnouncementIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="more-announcements">
                        <button className="more-btn">View All Announcements →</button>
                    </div>
                </div>
            </section>

            {/* Three Column Section */}
            <section className="three-column-section">
                <div className="homepage-container">
                    <div className="three-column-grid">
                        {/* News And Events */}
                        <div className="column-card">
                            <h3 className="column-title">News And Events</h3>
                            <div className="column-content">
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Call for Post Doctoral Fellow (PDF) Positions 2024-25 Session (May-2025)</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Call for Paper 1st International Conference of TASS on "Sustainability and Economic Growth and Global Prosperity" Agartala</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Ph.D Advertisement for AY-2025-26 (July Session) - Full Time with scholarship/Part Time/Self Finance (without)</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Advertisement for Walk-in Interview for Junior Research Fellow (JRF) in PHYSICS Discipline Under ISEA-CSR Project</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Advertisement for Junior Solar Researcher Development</p>
                                </div>
                            </div>
                            <button className="more-btn">More →</button>
                        </div>

                        {/* Notice Board */}
                        <div className="column-card">
                            <h3 className="column-title">Notice Board</h3>
                            <div className="column-content">
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Call for Post Doctoral Fellow (PDF) Positions 2024-25 Session (May-2025)</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Call for Paper 1st International Conference of TASS on "Sustainability and Economic Growth and Global Prosperity" Agartala</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Ph.D Advertisement for AY-2025-26 (July Session) - Full Time with scholarship/Part Time/Self Finance (without)</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Advertisement for Walk-in Interview for Junior Research Fellow (JRF) in PHYSICS Discipline Under ISEA-CSR Project</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Advertisement for Walk-in Interview for Junior Research Fellow (JRF) in Discipline under ISEA-CSR Project</p>
                                </div>
                            </div>
                            <button className="more-btn">More →</button>
                        </div>

                        {/* Tenders */}
                        <div className="column-card">
                            <h3 className="column-title">Tenders</h3>
                            <div className="column-content">
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Call for Post Doctoral Fellow (PDF) Positions 2024-25 Session (May-2025)</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Call for Paper 1st International Conference of TASS on "Sustainability and Economic Growth and Global Prosperity" Agartala</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Ph.D Advertisement for AY-2025-26 (July Session) - Full Time with scholarship/Part Time/Self Finance (without)</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Advertisement for Walk-in Interview for Junior Research Fellow (JRF) in PHYSICS Discipline Under ISEA-CSR Project</p>
                                </div>
                                <div className="news-item">
                                    <span className="news-bullet">→</span>
                                    <p>Advertisement for Walk-in Interview for Junior Research Fellow (JRF) in Development</p>
                                </div>
                            </div>
                            <button className="more-btn">More →</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="quick-links-section">
                <div className="homepage-container">
                    <h2 className="section-title">Quick Links</h2>
                    <div className="quick-links-grid">
                        <a href="/admissions" className="quick-link-card">
                            <div className="quick-link-icon">🎓</div>
                            <div className="quick-link-title">Admissions</div>
                            <div className="quick-link-description">Apply for undergraduate and postgraduate programs</div>
                            <div className="quick-link-stats">
                                <div className="quick-stat">
                                    <span className="quick-stat-number">7</span>
                                    <span className="quick-stat-label">Programs</span>
                                </div>
                                <div className="quick-stat">
                                    <span className="quick-stat-number">900+</span>
                                    <span className="quick-stat-label">Students</span>
                                </div>
                            </div>
                        </a>

                        <a href="/academics" className="quick-link-card">
                            <div className="quick-link-icon">📚</div>
                            <div className="quick-link-title">Academics</div>
                            <div className="quick-link-description">Explore our academic programs and curriculum</div>
                            <div className="quick-link-stats">
                                <div className="quick-stat">
                                    <span className="quick-stat-number">7</span>
                                    <span className="quick-stat-label">Departments</span>
                                </div>
                                <div className="quick-stat">
                                    <span className="quick-stat-number">55</span>
                                    <span className="quick-stat-label">Faculty</span>
                                </div>
                            </div>
                        </a>

                        <a href="/placements" className="quick-link-card">
                            <div className="quick-link-icon">💼</div>
                            <div className="quick-link-title">Placements</div>
                            <div className="quick-link-description">Career opportunities and placement statistics</div>
                            <div className="quick-link-stats">
                                <div className="quick-stat">
                                    <span className="quick-stat-number">95%</span>
                                    <span className="quick-stat-label">Placement</span>
                                </div>
                                <div className="quick-stat">
                                    <span className="quick-stat-number">50+</span>
                                    <span className="quick-stat-label">Companies</span>
                                </div>
                            </div>
                        </a>

                        <a href="/research" className="quick-link-card">
                            <div className="quick-link-icon">🔬</div>
                            <div className="quick-link-title">Research</div>
                            <div className="quick-link-description">Innovation and research initiatives</div>
                            <div className="quick-link-stats">
                                <div className="quick-stat">
                                    <span className="quick-stat-number">1600+</span>
                                    <span className="quick-stat-label">Publications</span>
                                </div>
                                <div className="quick-stat">
                                    <span className="quick-stat-number">18</span>
                                    <span className="quick-stat-label">Patents</span>
                                </div>
                            </div>
                        </a>

                        <a href="/campus-life" className="quick-link-card">
                            <div className="quick-link-icon">🏫</div>
                            <div className="quick-link-title">Campus Life</div>
                            <div className="quick-link-description">Student activities and campus facilities</div>
                            <div className="quick-link-stats">
                                <div className="quick-stat">
                                    <span className="quick-stat-number">10+</span>
                                    <span className="quick-stat-label">Clubs</span>
                                </div>
                                <div className="quick-stat">
                                    <span className="quick-stat-number">24/7</span>
                                    <span className="quick-stat-label">Facilities</span>
                                </div>
                            </div>
                        </a>

                        <a href="/contact" className="quick-link-card">
                            <div className="quick-link-icon">📞</div>
                            <div className="quick-link-title">Contact Us</div>
                            <div className="quick-link-description">Get in touch with our administration</div>
                            <div className="quick-link-stats">
                                <div className="quick-stat">
                                    <span className="quick-stat-number">24/7</span>
                                    <span className="quick-stat-label">Support</span>
                                </div>
                                <div className="quick-stat">
                                    <span className="quick-stat-label">Help Desk</span>
                                </div>
                            </div>
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
};

export default HomePage;