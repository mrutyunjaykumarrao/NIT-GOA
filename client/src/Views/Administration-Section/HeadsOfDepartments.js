import React from 'react';
import './HeadsOfDepartments.css';
import hodData from './headsOfDepartments.json';

// Import head of department images
import VeenathenkanidiyoorImg from '../../assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png';
import SureshMikkiliImg from '../../assets/images/Faculty/EEE/Dr. Suresh Mikkili.png';
import VeerakumarImg from '../../assets/images/Faculty/ECE/drveerakumar.jpeg';
import ShangerganeshImg from '../../assets/images/Faculty/APS/Dr. L. Shangerganesh.png';
import PrasenjitDeyImg from '../../assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png';
import HarikumarImg from '../../assets/images/Faculty/CVE/Dr. Harikumar M.png';

const HeadsOfDepartments = () => {
  // Image mapping object
  const imageMap = {
    VeenathenkanidiyoorImg,
    SureshMikkiliImg,
    VeerakumarImg,
    ShangerganeshImg,
    PrasenjitDeyImg,
    HarikumarImg
  };

  const renderHodProfile = (head) => (
    <div className="hod-profile">
      <div className="hod-image">
        {imageMap[head.image_key] ? (
          <img src={imageMap[head.image_key]} alt={head.name} />
        ) : (
          <div className="hod-image-placeholder">
            👤
          </div>
        )}
      </div>
      <div className="hod-info">
        <div className="hod-name">{head.name}</div>
        <div className="hod-designation">Head of Department</div>
        <a href={`mailto:${head.email}`} className="hod-email">
          {head.email}
        </a>
        <a href={`tel:${head.phone}`} className="hod-phone">
          {head.phone}
        </a>
      </div>
    </div>
  );

  return (
    <div className="heads-of-departments-page">
      <div className="heads-of-departments-container">
        <div className="heads-of-departments-page-header">
          <h1>{hodData.page_info.title}</h1>
        </div>

        <div className="hod-cards-grid">
          {hodData.department_heads.map((head, index) => (
            <div key={index} className="hod-card">
              <div className="hod-card-header">
                <h2 className="hod-department-title">{head.short_dept}</h2>
                <div className="hod-department-full">{head.department}</div>
              </div>
              
              <div className="hod-card-body">
                <div className="hod-section">
                  <div className="hod-section-title">Head of Department</div>
                  {renderHodProfile(head)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeadsOfDepartments;
