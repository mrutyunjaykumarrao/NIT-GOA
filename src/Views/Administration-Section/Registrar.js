import React, { useState } from 'react';
import './Registrar.css';
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
          <h1>Registrar</h1>
        </div>

        <div className="registrar-content">
          <div className="registrar-profile">
            <div className="registrar-image-section">
              <div className="registrar-image-container">
                {!imageError ? (
                  <img 
                    src={registrarImage} 
                    alt="Dr. Shashidhar K. Kudari"
                    className="registrar-image"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="registrar-image-placeholder">
                    <div className="registrar-placeholder-avatar">👨‍💼</div>
                    <p>Dr. Shashidhar K. Kudari</p>
                    <span>Registrar, NIT Goa</span>
                  </div>
                )}
              </div>
              
              <div className="registrar-info">
                <div className="registrar-name-title-section">
                  <h2>Dr. Shashidhar K. Kudari</h2>
                  <p className="registrar-designation">Registrar</p>
                  <p className="registrar-institute">National Institute of Technology Goa</p>
                </div>
                
                <div className="registrar-tenure-badge">
                  <span className="registrar-tenure-label">Tenure</span>
                  <span className="registrar-tenure-date">February 2021 - Present</span>
                </div>
                
                <div className="registrar-contact-cards">
                  <div className="registrar-contact-card registrar-email-card">
                    <div className="registrar-contact-details">
                      <div className="registrar-contact-label">Email</div>
                      <div className="registrar-contact-value">registrar@nitgoa.ac.in</div>
                    </div>
                  </div>
                  
                  <div className="registrar-contact-card registrar-office-card">
                    <div className="registrar-contact-details">
                      <div className="registrar-contact-label">Office</div>
                      <div className="registrar-contact-value">
                        <div>Sardar Patel Administrative Complex</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="registrar-about-section">
              <h3>About Registrar</h3>
              <div className="registrar-about-content">
                <p>
                  Dr. Shashidhar K. Kudari obtained his B.E (Mechanical Engineering) degree from Karnataka University, Dharwad. He received M. Tech. (Machine Design) and Ph.D. degrees from the Indian Institute of Technology, Kharagpur. He has 34 years of Teaching / Research and Administration experience.
                </p>
                
                <p>
                  He has 55 research publications to his credit; five research scholars obtained Ph.D. degrees under his supervision. His research area includes stress analysis, elastic-plastic fracture, mixed mode fracture and fatigue analysis of engineering materials. He is the adaptation author of book Mechanical Vibrations, by S. G Kelly, Published by Schaum's Outline and Tata Mc Graw Hill.
                </p>
                
                <p>
                  Dr. Kudari joined as the Registrar of NIT Goa in the month of February 2021.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registrar;
