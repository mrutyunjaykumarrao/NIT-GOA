import React, { useState } from 'react';
import './Director.css';
import directorData from './director.json';
import directorImage from '../../assets/images/administration/director2023.jpeg';

const Director = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="director-page">
      <div className="container">
        <div className="director-page-header">
          <h1>{directorData.page_info.title}</h1>
        </div>

        <div className="director-content">
          <div className="director-profile">
            <div className="director-combined-section">
              <div className="director-left-content">
                <div className="director-image-container">
                  {!imageError ? (
                    <img 
                      src={directorImage} 
                      alt={directorData.director.name}
                      className="director-image"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="director-image-placeholder">
                      <div className="director-placeholder-avatar">👨‍🎓</div>
                      <p>{directorData.director.name}</p>
                      <span>{directorData.director.designation}, {directorData.director.institute}</span>
                    </div>
                  )}
                </div>
                
                <div className="director-name-title-section">
                  <h2>{directorData.director.name}</h2>
                  <p className="director-designation">{directorData.director.designation}</p>
                  <p className="director-institute">{directorData.director.institute}</p>
                </div>
                
                <div className="director-contact-info">
                  <a href={`mailto:${directorData.director.email}`} className="director-email">
                    {directorData.director.email}
                  </a><br />
                  {directorData.director.office_location}
                </div>
              </div>
              
              <div className="director-right-content">
                <h3>About Director</h3>
                <div className="director-about-content">
                  {directorData.director.about.map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Director;
