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
            <div className="registrar-combined-section">
              <div className="registrar-left-content">
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
                
                <div className="registrar-name-title-section">
                  <h2>Dr. Shashidhar K. Kudari</h2>
                  <p className="registrar-designation">Registrar</p>
                  <p className="registrar-institute">National Institute of Technology Goa</p>
                </div>
                
                <div className="registrar-contact-info">
                  registrar@nitgoa.ac.in<br />
                  Sardar Patel Administrative Complex
                </div>
              </div>
              
              <div className="registrar-right-content">
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
    </div>
  );
};

export default Registrar;
