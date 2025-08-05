import React, { useState } from 'react';
import './Registrar.css';
import registrarData from './registrar.json';
import registrarImage from '../../assets/images/administration/registrar2023.jpeg';

const Registrar = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="registrar-page">
      <div className="container">
        <div className="registrar-page-header">
          <h1>{registrarData.page_info.title}</h1>
        </div>

        <div className="registrar-content">
          <div className="registrar-profile">
            <div className="registrar-combined-section">
              <div className="registrar-left-content">
                <div className="registrar-image-container">
                  {!imageError ? (
                    <img 
                      src={registrarImage} 
                      alt={registrarData.registrar.name}
                      className="registrar-image"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="registrar-image-placeholder">
                      <div className="registrar-placeholder-avatar">👨‍💼</div>
                      <p>{registrarData.registrar.name}</p>
                      <span>{registrarData.registrar.designation}, {registrarData.registrar.institute}</span>
                    </div>
                  )}
                </div>
                
                <div className="registrar-name-title-section">
                  <h2>{registrarData.registrar.name}</h2>
                  <p className="registrar-designation">{registrarData.registrar.designation}</p>
                  <p className="registrar-institute">{registrarData.registrar.institute}</p>
                </div>
                
                <div className="registrar-contact-info">
                  {registrarData.registrar.email}<br />
                  {registrarData.registrar.office_location}
                </div>
              </div>
              
              <div className="registrar-right-content">
                <h3>About Registrar</h3>
                <div className="registrar-about-content">
                  {registrarData.registrar.about.map((paragraph, index) => (
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

export default Registrar;
