import React, { useState } from 'react';
import './Director.css';
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
          <h1>Director</h1>
        </div>

        <div className="director-content">
          <div className="director-profile">
            <div className="director-combined-section">
              <div className="director-left-content">
                <div className="director-image-container">
                  {!imageError ? (
                    <img 
                      src={directorImage} 
                      alt="Prof. O. R. Jaiswal"
                      className="director-image"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="director-image-placeholder">
                      <div className="director-placeholder-avatar">👨‍🎓</div>
                      <p>Prof. O. R. Jaiswal</p>
                      <span>Director, NIT Goa</span>
                    </div>
                  )}
                </div>
                
                <div className="director-name-title-section">
                  <h2>Prof. O. R. Jaiswal</h2>
                  <p className="director-designation">Director</p>
                  <p className="director-institute">National Institute of Technology Goa</p>
                </div>
                
                <div className="director-contact-info">
                  director@nitgoa.ac.in<br />
                  Sardar Patel Administrative Complex
                </div>
              </div>
              
              <div className="director-right-content">
                <h3>About Director</h3>
                <div className="director-about-content">
                  <p>
                    Prof. O. R. Jaiswal, took over the charge as Director of NIT Goa on 8th June 2023. He is on deputation from the Visvesvaraya National Institute of Technology (VNIT), Nagpur, wherein, he is a Professor at the Department of Applied Mechanics. His basic field is Structural Engineering with research work in the areas related to earthquake analysis of structures, tuned mass dampers for seismic and wind response control, Dynamic response of Railway Tracks etc.
                  </p>
                  
                  <p>
                    He had graduated in Civil Engineering from Visvesvaraya Regional Engineering College (VRCE), Nagpur (Now, VNIT) in 1987; completed his Masters in 1991 and Doctoral degree in 1995 from the Indian Institute of Science, Bangalore. Subsequently, he was a post-doctoral fellow at the University of Liverpool for a period of about two years.
                  </p>
                  
                  <p>
                    He joined as faculty at VRCE in 1998. After becoming Professor in 2008, he was Head of the Department from 2010 to 2012 and then Dean (Academics) from 2013 to 2016. During his deanship, VNIT Nagpur had initiated the Student Mentor Program (SMP), wherein, first year UG students were mentored by third year students. This SMP is very effective in handling the anxiety and curiosity of new entrants at early stage.
                  </p>
                  
                  <p>
                    Professor Jaiswal has coordinated funded R&D projects from MHRD, DST, CSIR and World Bank. In a collaborative project with IIT Kanpur, he developed Guidelines for Seismic Design of Liquid Storage Tanks. He is a member of BIS committees for earthquake and wind codes. He has supervised seven Ph.D. students. He has more than eighty scholarly papers to his credit.
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

export default Director;
