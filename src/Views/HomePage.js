import React, { useState, useEffect } from 'react';
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
                <div className="container">
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
                <div className="container">
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

            {/* Placement Statistics Section */}
            <section className="placement-section">
                <div className="container">
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
            <section className="statistics-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">7</div>
                            <div className="stat-label">Departments</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">913</div>
                            <div className="stat-label">Students</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">55</div>
                            <div className="stat-label">Faculties</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">1611</div>
                            <div className="stat-label">Publications</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">18</div>
                            <div className="stat-label">Patents</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="container">
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
                <div className="container">
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