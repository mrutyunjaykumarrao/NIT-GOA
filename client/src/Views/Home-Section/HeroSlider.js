import React, { useState, useEffect, useRef, useCallback } from 'react';

const HeroSlider = React.memo(({ heroImages }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(1); // Start at 1 for infinite loop
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sliderRef = useRef(null);
    const autoSlideRef = useRef(null);

        // Helper function to handle infinite loop transitions
    const handleTransitionEnd = useCallback((e) => {
        if (!isTransitioning) return;
        
        setIsTransitioning(false);
        
        // Jump to the corresponding real image without transition
        setCurrentImageIndex((currentIndex) => {
            if (currentIndex === heroImages.length + 1) {
                // We're at the duplicated first image, jump to the real first image
                return 1;
            } else if (currentIndex === 0) {
                // We're at the duplicated last image, jump to the real last image
                return heroImages.length;
            }
            return currentIndex; // No change needed
        });
    }, [isTransitioning, heroImages.length]);

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

    // Reset slider position when heroImages are loaded - only run once when images are loaded
    useEffect(() => {
        if (heroImages.length > 0) {
            // Ensure we start at the first real image (index 1)
            setCurrentImageIndex(1);
            setIsTransitioning(false);
        }
    }, [heroImages.length]);

    const goToPrevious = useCallback(() => {
        setIsTransitioning(true);
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex === 1) {
                return 0; // Go to duplicated last image
            }
            return prevIndex - 1;
        });
        restartAutoSlide();
    }, [restartAutoSlide]);

    const goToNext = useCallback(() => {
        setIsTransitioning(true);
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex === heroImages.length) {
                return heroImages.length + 1; // Go to duplicated first image
            }
            return prevIndex + 1;
        });
        restartAutoSlide();
    }, [heroImages.length, restartAutoSlide]);

    return (
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
    );
});

export default HeroSlider;
