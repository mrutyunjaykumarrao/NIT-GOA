import React, { useState, useEffect, useMemo } from 'react';
import './OutreachActivities.css';

const OutreachActivities = () => {
  // Carousel state for each card
  const [carouselStates, setCarouselStates] = useState({
    card1: { currentSlide: 0, isAutoRotating: true },
    card2: { currentSlide: 0, isAutoRotating: true },
    card3: { currentSlide: 0, isAutoRotating: true },
    card4: { currentSlide: 0, isAutoRotating: true },
    card5: { currentSlide: 0, isAutoRotating: true },
    card6: { currentSlide: 0, isAutoRotating: true },
    card7: { currentSlide: 0, isAutoRotating: true },
    card8: { currentSlide: 0, isAutoRotating: true },
    card9: { currentSlide: 0, isAutoRotating: true }
  });

  // Auto-rotation interval (4 seconds)
  const ROTATION_INTERVAL = 4000;

  // Image data for each card - using useMemo to prevent re-creation
  const cardImages = useMemo(() => ({
    card1: [
      "https://www.nitgoa.ac.in/static/SPIEdamodarschool.jpg",
      "https://www.nitgoa.ac.in/static/SPIEmushtfund.jpg",
      "https://www.nitgoa.ac.in/static/stem3.jpg"
    ],
    card2: [
      "https://www.nitgoa.ac.in/static/SCIENCE FAIR.jpg",
      "https://www.nitgoa.ac.in/static/RAA.jpg",
      "https://www.nitgoa.ac.in/static/stem4.jpg"
    ],
    card3: [
      "https://www.nitgoa.ac.in/static/swachhata 21march2024.jpg",
      "https://www.nitgoa.ac.in/static/swachhata.jpg",
      "https://www.nitgoa.ac.in/static/SHRAMDHAAN1.jpg"
    ],
    card4: [
      "https://www.nitgoa.ac.in/static/arduino(1).jpg",
      "https://www.nitgoa.ac.in/static/arduino(2).jpg",
      "https://www.nitgoa.ac.in/static/stem5.jpg"
    ],
    card5: [
      "https://www.nitgoa.ac.in/static/UBA1.png",
      "https://www.nitgoa.ac.in/static/SURVEY IN KALAY1.jpg",
      "https://www.nitgoa.ac.in/static/KALAY_GRAMSABHA.jpg"
    ],
    card6: [
      "https://www.nitgoa.ac.in/static/School Visit.jpg",
      "https://www.nitgoa.ac.in/static/Permanent_Campus.jpeg",
      "https://www.nitgoa.ac.in/static/Industrial visit(1).jpg"
    ],
    card7: [
      "https://www.nitgoa.ac.in/static/img 16march2024.jpeg",
      "https://www.nitgoa.ac.in/static/SHRAMDHAAN2.jpg",
      "https://www.nitgoa.ac.in/static/img12march2024.jpg"
    ],
    card8: [
      "https://www.nitgoa.ac.in/static/enggday1.jpg",
      "https://www.nitgoa.ac.in/static/enggday2.jpg",
      "https://www.nitgoa.ac.in/static/enggday3.jpg"
    ],
    card9: [
      "https://www.nitgoa.ac.in/static/stem1.jpg",
      "https://www.nitgoa.ac.in/static/stem2.jpg",
      "https://www.nitgoa.ac.in/static/stem3.jpg"
    ]
  }), []);

  // Auto-rotation effect
  useEffect(() => {
    const intervals = {};

    Object.keys(carouselStates).forEach(cardId => {
      if (carouselStates[cardId].isAutoRotating) {
        intervals[cardId] = setInterval(() => {
          setCarouselStates(prev => ({
            ...prev,
            [cardId]: {
              ...prev[cardId],
              currentSlide: (prev[cardId].currentSlide + 1) % cardImages[cardId].length
            }
          }));
        }, ROTATION_INTERVAL);
      }
    });

    // Cleanup intervals on unmount or when auto-rotation stops
    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [carouselStates, cardImages, ROTATION_INTERVAL]);

  // Pause auto-rotation when user interacts
  const pauseAutoRotation = (cardId) => {
    setCarouselStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        isAutoRotating: false
      }
    }));

    // Resume auto-rotation after 8 seconds of inactivity
    setTimeout(() => {
      setCarouselStates(prev => ({
        ...prev,
        [cardId]: {
          ...prev[cardId],
          isAutoRotating: true
        }
      }));
    }, 8000);
  };

  // Navigation functions for carousel
  const nextSlide = (cardId) => {
    pauseAutoRotation(cardId);
    setCarouselStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        currentSlide: (prev[cardId].currentSlide + 1) % cardImages[cardId].length
      }
    }));
  };

  const prevSlide = (cardId) => {
    pauseAutoRotation(cardId);
    setCarouselStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        currentSlide: prev[cardId].currentSlide === 0 
          ? cardImages[cardId].length - 1 
          : prev[cardId].currentSlide - 1
      }
    }));
  };

  const goToSlide = (cardId, slideIndex) => {
    pauseAutoRotation(cardId);
    setCarouselStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        currentSlide: slideIndex
      }
    }));
  };

  // Carousel component
  const ImageCarousel = ({ cardId, images, alt }) => {
    const currentSlide = carouselStates[cardId].currentSlide;
    
    return (
      <div className="outreach-image-carousel">
        <div 
          className="outreach-carousel-container"
          style={{
            transform: `translateX(-${currentSlide * 33.333}%)`
          }}
        >
          {images.map((imgSrc, index) => (
            <div key={index} className="outreach-carousel-slide">
              <img
                src={imgSrc}
                alt={`${alt} ${index + 1}`}
                className="outreach-activity-image"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                }}
              />
            </div>
          ))}
        </div>
        
        <button 
          className="outreach-carousel-nav outreach-carousel-prev"
          onClick={() => prevSlide(cardId)}
          aria-label="Previous image"
        >
          &#8249;
        </button>
        
        <button 
          className="outreach-carousel-nav outreach-carousel-next"
          onClick={() => nextSlide(cardId)}
          aria-label="Next image"
        >
          &#8250;
        </button>
        
        <div className="outreach-carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`outreach-carousel-dot ${index === currentSlide ? 'active' : ''} ${
                carouselStates[cardId]?.isAutoRotating && index === currentSlide ? 'auto-rotating' : ''
              }`}
              onClick={() => goToSlide(cardId, index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="outreach-container">
      <div className="outreach-hero">
        <h1>Outreach Activities</h1>
        <p>Connecting with communities through education, innovation, and social responsibility</p>
      </div>

      <div className="outreach-content">
        
        {/* Main Story */}
        <section className="outreach-featured-story">
          <div className="outreach-featured-story-content">
            <div className="outreach-featured-story-text">
              <div className="outreach-story-category">Featured Initiative</div>
              <h2>Women in STEM Workshop</h2>
              <p>The SPIE Student Chapter NIT Goa conducted an inspiring workshop at Sharada Mandir School, Panjim, focusing on sparking interest in STEM fields among middle school girls through hands-on experiments in physics, optics, and robotics.</p>
              <div className="outreach-story-date">March 2024</div>
            </div>
            <div className="outreach-featured-story-image">
              <img 
                src="https://www.nitgoa.ac.in/static/img6march2024.jpg" 
                alt="Women in STEM Initiative by SPIE Student Chapter" 
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}}
              />
            </div>
          </div>
        </section>

        {/* Recent Activities Grid */}
        <section className="outreach-activities-section">
          <h2 className="outreach-section-title">Recent Activities</h2>
          
          <div className="outreach-activities-grid">
            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card1" 
                images={cardImages.card1} 
                alt="Light & Optics Workshop"
              />
              <div className="outreach-activity-content">
                <h3>Light & Optics Workshops</h3>
                <p>SPIE student chapter organized workshops at Mustifund High School and Damodar Higher Secondary School, introducing students to the fascinating world of light and optics through interactive demonstrations.</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card2" 
                images={cardImages.card2} 
                alt="All Goa Science Fair"
              />
              <div className="outreach-activity-content">
                <h3>All Goa Science Fair</h3>
                <p>The inaugural All Goa Science Fair brought together 42 teams of grades 8-10 students to showcase innovative projects on "Science and technology for a clean and green tomorrow".</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card3" 
                images={cardImages.card3} 
                alt="Swachh Bharat Initiative"
              />
              <div className="outreach-activity-content">
                <h3>Swachhata Hi Seva Campaign</h3>
                <p>NIT Goa conducted comprehensive cleanliness drives in collaboration with Cuncolim Municipality Corporation, cleaning Demani Village adjacent to our campus and promoting environmental awareness.</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card4" 
                images={cardImages.card4} 
                alt="Arduino Workshop"
              />
              <div className="outreach-activity-content">
                <h3>Arduino & Electronics Workshops</h3>
                <p>Hands-on Arduino workshops introduce school students to basic electronics and programming concepts, fostering understanding of microcontroller applications in modern technology.</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card5" 
                images={cardImages.card5} 
                alt="Village Development Programs"
              />
              <div className="outreach-activity-content">
                <h3>Village Development Program</h3>
                <p>Through Unnat Bharat Abhiyan, NIT Goa actively engages with adopted villages Kalay and Guirdolim, conducting surveys, participating in Gramsabha meetings, and implementing development initiatives.</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card6" 
                images={cardImages.card6} 
                alt="Campus Visit Program"
              />
              <div className="outreach-activity-content">
                <h3>School Campus Visit Program</h3>
                <p>Government High School students from Vidhyanagar, Aquem, Margao visited NIT Goa campus as part of the new Education Policy, attending lectures on Experimental Physics, Chemistry, and Mathematics.</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card7" 
                images={cardImages.card7} 
                alt="Health Awareness Programs"
              />
              <div className="outreach-activity-content">
                <h3>Health & Safety Initiatives</h3>
                <p>NIT Goa organizes blood donation camps, health awareness programs, and Safai Mitra Suraksha Shivirs focusing on worker safety, hygiene, and overall community well-being.</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card8" 
                images={cardImages.card8} 
                alt="Engineering Day Celebrations"
              />
              <div className="outreach-activity-content">
                <h3>Engineering Day & Innovation Showcase</h3>
                <p>Annual Engineering Day celebrations feature technical exhibitions, project demonstrations, and interactive sessions with school students, showcasing the latest research and innovations from all departments.</p>
              </div>
            </div>

            <div className="outreach-activity-card">
              <ImageCarousel 
                cardId="card9" 
                images={cardImages.card9} 
                alt="STEM Activities"
              />
              <div className="outreach-activity-content">
                <h3>STEM Educational Programs</h3>
                <p>Comprehensive STEM programs introducing students to hands-on learning experiences in science, technology, engineering, and mathematics through interactive workshops and demonstrations.</p>
              </div>
            </div>

            <div className="outreach-activity-card outreach-text-only-card">
              <div className="outreach-activity-content">
                <h3>Rural Outreach Programs</h3>
                <p>Rural outreach initiatives focusing on technology transfer, skill development, and infrastructure improvement to enhance quality of life in local villages through sustained community engagement. These programs include community surveys, skill development workshops, digital literacy training, and sustainable development projects that directly benefit rural communities around NIT Goa.</p>
              </div>
            </div>

            <div className="outreach-activity-card outreach-text-only-card">
              <div className="outreach-activity-content">
                <h3>Student Excellence & Recognition</h3>
                <p>NIT Goa students consistently excel in national and international competitions, research projects, and innovation challenges, bringing recognition to the institute through their outstanding achievements. Students have won prestigious awards in robotics competitions, hackathons, research symposiums, and technical festivals across the country, showcasing the quality of education and innovation culture at NIT Goa.</p>
              </div>
            </div>

            <div className="outreach-activity-card outreach-text-only-card">
              <div className="outreach-activity-content">
                <h3>Special Events & Celebrations</h3>
                <p>Cultural festivals, awareness campaigns, and special events that bring together the academic community and local residents in celebration of shared values and community spirit. These events include Independence Day celebrations, Republic Day ceremonies, cultural festivals, environmental awareness campaigns, and community gatherings that strengthen the bond between NIT Goa and the local community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="outreach-impact-section">
          <div className="outreach-impact-content">
            <h2>Our Impact</h2>
            <div className="outreach-impact-stats">
              <div className="outreach-stat-item">
                <div className="outreach-stat-number">500+</div>
                <div className="outreach-stat-label">Students Reached</div>
              </div>
              <div className="outreach-stat-item">
                <div className="outreach-stat-number">15+</div>
                <div className="outreach-stat-label">Schools Visited</div>
              </div>
              <div className="outreach-stat-item">
                <div className="outreach-stat-number">10+</div>
                <div className="outreach-stat-label">Communities Served</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default OutreachActivities;