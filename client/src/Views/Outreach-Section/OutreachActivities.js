import React, { useState, useEffect, useMemo } from 'react';
import './OutreachActivities.css';
import outreachData from './outreachActivities.json';

const OutreachActivities = () => {
  // Initialize carousel states based on activities that have images
  const activitiesWithCarousels = outreachData.activities.cards.filter(card => card.type === 'carousel');
  const initialCarouselStates = {};
  activitiesWithCarousels.forEach(card => {
    initialCarouselStates[card.id] = { currentSlide: 0, isAutoRotating: true };
  });

  // Carousel state for each card
  const [carouselStates, setCarouselStates] = useState(initialCarouselStates);

  // Auto-rotation interval from JSON
  const ROTATION_INTERVAL = outreachData.settings.carousel.rotation_interval;

  // Image data for each card - using useMemo to create from JSON data
  const cardImages = useMemo(() => {
    const images = {};
    activitiesWithCarousels.forEach(card => {
      images[card.id] = card.images;
    });
    return images;
  }, [activitiesWithCarousels]);

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

    // Resume auto-rotation after configured duration of inactivity
    setTimeout(() => {
      setCarouselStates(prev => ({
        ...prev,
        [cardId]: {
          ...prev[cardId],
          isAutoRotating: true
        }
      }));
    }, outreachData.settings.carousel.auto_rotation_pause_duration);
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
        <h1>{outreachData.hero.title}</h1>
        <p>{outreachData.hero.subtitle}</p>
      </div>

      <div className="outreach-content">
        
        {/* Main Story */}
        <section className="outreach-featured-story">
          <div className="outreach-featured-story-content">
            <div className="outreach-featured-story-text">
              <div className="outreach-story-category">{outreachData.featured_story.category}</div>
              <h2>{outreachData.featured_story.title}</h2>
              <p>{outreachData.featured_story.description}</p>
              <div className="outreach-story-date">{outreachData.featured_story.date}</div>
            </div>
            <div className="outreach-featured-story-image">
              <img 
                src={outreachData.featured_story.image} 
                alt={outreachData.featured_story.alt} 
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}}
              />
            </div>
          </div>
        </section>

        {/* Recent Activities Grid */}
        <section className="outreach-activities-section">
          <h2 className="outreach-section-title">{outreachData.activities.title}</h2>
          
          <div className="outreach-activities-grid">
            {outreachData.activities.cards.map((activity, index) => (
              <div key={index} className={`outreach-activity-card ${activity.type === 'text_only' ? 'outreach-text-only-card' : ''}`}>
                {activity.type === 'carousel' && (
                  <ImageCarousel 
                    cardId={activity.id} 
                    images={cardImages[activity.id]} 
                    alt={activity.alt}
                  />
                )}
                <div className="outreach-activity-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="outreach-impact-section">
          <div className="outreach-impact-content">
            <h2>{outreachData.impact.title}</h2>
            <div className="outreach-impact-stats">
              {outreachData.impact.stats.map((stat, index) => (
                <div key={index} className="outreach-stat-item">
                  <div className="outreach-stat-number">{stat.number}</div>
                  <div className="outreach-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default OutreachActivities;