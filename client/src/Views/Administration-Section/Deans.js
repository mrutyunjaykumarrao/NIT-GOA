import React from 'react';
import './Deans.css';
import deansData from './deans.json';

// Import dean images
import drSMini from '../../assets/images/Faculty/CSE/Dr. S. Mini.png';
import drShivnarayanPatidar from '../../assets/images/Faculty/ECE/Dr. Shivnarayan Patidar.png';
import drSoumitraDas from '../../assets/images/Faculty/EEE/Dr. Soumitra Das.png';
import drLokeshKumarBramhane from '../../assets/images/Faculty/ECE/Dr. Lokesh Kumar Bramhane.png';
import drAmolRahulkar from '../../assets/images/Faculty/EEE/Dr. Amol D. Rahulkar.jpg';
import drPrasanjitDey from '../../assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png';
import drChiragModi from '../../assets/images/Faculty/CSE/Dr. Modi Chirag Navinchandra.png';
import drSreerajES from '../../assets/images/Faculty/EEE/Dr. Sreeraj E S.png';
import drHarikumar from '../../assets/images/Faculty/CVE/Dr. Harikumar M.png';
import drTrilochanPanigrahi from '../../assets/images/Faculty/ECE/Dr. Trilochan Panigrahi.jpg';
import drLalatInduGiri from '../../assets/images/Faculty/ECE/Dr. Lalat Indu Giri.png';
import drVelavanKathirvelu from '../../assets/images/Faculty/APS/Dr. Velavan Kathirvelu.png';
import drSunilkumar from '../../assets/images/Faculty/HSS/Dr. Sunil Kumar.png';

const Deans = () => {
  // Image mapping object
  const imageMap = {
    drSMini,
    drShivnarayanPatidar,
    drSoumitraDas,
    drLokeshKumarBramhane,
    drAmolRahulkar,
    drPrasanjitDey,
    drChiragModi,
    drSreerajES,
    drHarikumar,
    drTrilochanPanigrahi,
    drLalatInduGiri,
    drVelavanKathirvelu,
    drSunilkumar
  };
  const renderDeanProfile = (person) => (
    <div className="dean-profile">
      <div className="dean-image">
        {imageMap[person.image_key] ? (
          <img src={imageMap[person.image_key]} alt={person.name} />
        ) : (
          <div className="dean-image-placeholder">
            👤
          </div>
        )}
      </div>
      <div className="dean-info">
        <div className="dean-name">{person.name}</div>
        <div className="dean-designation">{person.designation}</div>
        <a href={`mailto:${person.email}`} className="dean-email">
          {person.email}
        </a>
      </div>
    </div>
  );

  const renderAssociateDeanProfile = (person) => (
    <div className="associate-dean-profile">
      <div className="associate-dean-image">
        {imageMap[person.image_key] ? (
          <img src={imageMap[person.image_key]} alt={person.name} />
        ) : (
          <div className="associate-dean-image-placeholder">
            👤
          </div>
        )}
      </div>
      <div className="associate-dean-info">
        <div className="associate-dean-name">{person.name}</div>
        <div className="associate-dean-designation">{person.designation}</div>
        <a href={`mailto:${person.email}`} className="associate-dean-email">
          {person.email}
        </a>
      </div>
    </div>
  );

  const renderOfficeDetails = (officeDetails) => (
    <div className="office-details-section">
      <div className="dean-section-title">Office Details</div>
      <div className="office-details-grid">
        <div className="office-detail-item">
          <span className="office-detail-label">Room:</span>
          <span className="office-detail-value">{officeDetails.room_no}</span>
        </div>
        <div className="office-detail-item">
          <span className="office-detail-label">Floor:</span>
          <span className="office-detail-value">{officeDetails.floor}</span>
        </div>
        <div className="office-detail-item">
          <span className="office-detail-label">Building:</span>
          <span className="office-detail-value">{officeDetails.building}</span>
        </div>
        <div className="office-detail-item">
          <span className="office-detail-label">Location:</span>
          <span className="office-detail-value">NIT Goa</span>
        </div>
        <div className="office-detail-item">
          <span className="office-detail-label">Phone:</span>
          <span className="office-detail-value">{officeDetails.contact}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="deans-page">
      <div className="deans-container">
        <div className="deans-page-header">
          <h1>{deansData.page_info.title}</h1>
        </div>

        <div className="deans-cards-grid">
          {deansData.deans_data.map((dean, index) => (
            <div key={index} className="dean-card">
              <div className="dean-card-header">
                <h2 className="dean-category-title">{dean.category}</h2>
              </div>
              
              <div className="dean-card-body">
                <div className="dean-section">
                  <div className="dean-section-title">Dean</div>
                  {renderDeanProfile(dean.dean)}
                </div>

                {dean.associate_dean && (
                  <div className="associate-deans-section">
                    <div className="dean-section-title">Associate Dean{Array.isArray(dean.associate_dean) ? 's' : ''}</div>
                    <div className="associate-deans-grid">
                      {Array.isArray(dean.associate_dean) ? (
                        dean.associate_dean.map((assocDean, idx) => (
                          <div key={idx}>
                            {renderAssociateDeanProfile(assocDean)}
                          </div>
                        ))
                      ) : (
                        renderAssociateDeanProfile(dean.associate_dean)
                      )}
                    </div>
                  </div>
                )}

                {dean.office_details && renderOfficeDetails(dean.office_details)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deans;
