import React from 'react';
import './BTechFacilities.css';
import facilitiesData from './BTechFacilities.json';

const BTechFacilities = () => {
    return (
        <div className="btech-facilities">
            <div className="btech-facilities-container">
                {/* Hero Section */}
                <div className="btech-facilities-hero">
                    <div className="btech-facilities-hero-content">
                        <h1>{facilitiesData.title}</h1>
                        <p className="btech-facilities-hero-subtitle">{facilitiesData.subtitle}</p>
                    </div>
                </div>

                <div className="btech-facilities-content-section">
                    <div className="btech-facilities-image">
                        <img src={facilitiesData.heroImage.src} alt={facilitiesData.heroImage.alt} />
                    </div>
                    
                    <div className="btech-facilities-main-content">
                        {facilitiesData.content.map((item, index) => (
                            <p key={index}>
                                {item.paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BTechFacilities;