import React, { useState, useEffect, useRef, useCallback } from 'react';
import './HomePage.css';
import heroImg1 from '../assets/images/Home/HeroImages/HeroImg1.jpg';
import heroImg2 from '../assets/images/Home/HeroImages/HeroImg2.jpg';
import heroImg3 from '../assets/images/Home/HeroImages/HeroImg3.jpg';
import heroImg4 from '../assets/images/Home/HeroImages/HeroImg4.jpeg';
import heroImg5 from '../assets/images/Home/HeroImages/HeroImg5.jpeg';
import heroImg6 from '../assets/images/Home/HeroImages/HeroImg6.jpg';
import heroImg7 from '../assets/images/Home/HeroImages/HeroImg7.jpg';
import heroImg8 from '../assets/images/Home/HeroImages/HeroImg8.jpg';
import heroImg13 from '../assets/images/Home/HeroImages/HeroImg13.jpg';
import heroImg14 from '../assets/images/Home/HeroImages/HeroImg14.jpg';
import heroImg15 from '../assets/images/Home/HeroImages/HeroImg15.jpg';
import heroImg16 from '../assets/images/Home/HeroImages/HeroImg16.png';
import heroImg17 from '../assets/images/Home/HeroImages/HeroImg17.jpeg';
import heroImg18 from '../assets/images/Home/HeroImages/HeroImg18.jpg';
import heroImg19 from '../assets/images/Home/HeroImages/HeroImg19.jpg';
import heroImg20 from '../assets/images/Home/HeroImages/HeroImg20.jpg';
import heroImg21 from '../assets/images/Home/HeroImages/HeroImg21.png';
import placementStats from '../assets/images/Home/placement_statistics.png';
import synapseNewsletter from '../assets/images/Home/synapse_newsletter.png';
import moeImage from '../assets/images/Home/moe.png';
import diiImage from '../assets/images/Home/dii.png';
import digilockerImage from '../assets/images/Home/digilocker_nad.png';
import fitIndiaImage from '../assets/images/Home/fit_india.png';
import swachhBharatImage from '../assets/images/Home/swach_bharath.png';
import makeInIndiaImage from '../assets/images/Home/MakeInIndia.png';
import MainNavigation from '../components/MainNavigation/MainNavigation';

const HomePage = () => {
    const heroImages = [
        heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, 
        heroImg6, heroImg7, heroImg8, heroImg13, heroImg14, 
        heroImg15, heroImg16, heroImg17, heroImg18, heroImg19, 
        heroImg20, heroImg21
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [countsAnimated, setCountsAnimated] = useState(false);
    const [counts, setCounts] = useState({
        departments: 0,
        students: 0,
        faculties: 0,
        publications: 0,
        patents: 0
    });
    const statsRef = useRef(null);

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

    // Auto-cycle images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [heroImages.length]);

    const goToPrevious = () => {
        setCurrentImageIndex(
            currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentImageIndex(
            currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1
        );
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
                    <img src={heroImages[currentImageIndex]} alt="NIT Goa Campus" className="hero-campus-image" />
                    <div className="hero-overlay"></div>
                    <MainNavigation />
                    
                    {/* Navigation Arrows */}
                    <button className="hero-nav-arrow hero-nav-left" onClick={goToPrevious}>
                        <span>❮</span>
                    </button>
                    <button className="hero-nav-arrow hero-nav-right" onClick={goToNext}>
                        <span>❯</span>
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="hero-indicators">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                className={`hero-indicator ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Announcements Section */}
            <section className="announcements-section">
                <div className="homepage-container">
                    <h2 className="section-title">Announcements</h2>
                    <div className="announcements-grid">
                        <div className="announcement-item">
                            <span className="announcement-bullet">→</span>
                            <p>Submit your original and unpublished research work to IEEE Conference 2024-25 Session (May-2025)</p>
                        </div>
                        <div className="announcement-item">
                            <span className="announcement-bullet">→</span>
                            <p>Submit your original and unpublished research work to IEEE Conference 2024-25 Session (May-2025)</p>
                        </div>
                        <div className="announcement-item">
                            <span className="announcement-bullet">→</span>
                            <p>Submit your original and unpublished research work to IEEE Conference 2024-25 Session (May-2025)</p>
                        </div>
                    </div>
                    <div className="more-announcements">
                        <button className="more-btn">More →</button>
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
                            <img src={placementStats} alt="Placement Statistics" />
                        </div>
                        <div className="placement-info">
                            <div className="synapse-logo">
                                <img src={synapseNewsletter} alt="Synapse Newsletter" />
                            </div>
                            <div className="tweets-section">
                                <h3>Tweets</h3>
                                <div className="tweet-content">
                                    <p>Social media content and updates from NIT Goa</p>
                                </div>
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
                            <img src={heroImg2} alt="NIT Goa Campus" />
                        </div>
                        <div className="about-text">
                            <div className="about-buttons">
                                <button className="about-btn active">About</button>
                                <button className="about-btn">Vision</button>
                                <button className="about-btn">Mission</button>
                            </div>
                            <p>
                                The National Institute of Technology Goa (NIT Goa) is a premier national level technical institute in India 
                                established in 2010 by an act of parliament (NIT Act, 2007 and NIT (Amendment) Act, 2012). NIT Goa is an 
                                autonomous institute functioning under the aegis of Ministry of Education (MoE), Government of India, and 
                                has been declared an "Institute of National Importance".
                            </p>
                            <button className="read-more-link">Read more {'>'} {'>'}</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer National Portals */}
            <section className="national-portals">
                <div className="homepage-container">
                    <h3>National Portals</h3>
                    <div className="portals-grid">
                        <img src={moeImage} alt="Ministry of Education" />
                        <img src={diiImage} alt="Digital India" />
                        <img src={digilockerImage} alt="DigiLocker NAD" />
                        <img src={fitIndiaImage} alt="FIT India" />
                        <img src={swachhBharatImage} alt="Swachh Bharat" />
                        <img src={makeInIndiaImage} alt="Make in India" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;