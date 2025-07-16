import React from 'react';
import './Deans.css';

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
  const deansData = [
    {
      category: "Academics",
      dean: {
        name: "Dr. S. Mini",
        designation: "Associate Professor of CSE",
        email: "dean.acad@nitgoa.ac.in",
        image: drSMini
      },
      associateDean: {
        name: "Dr. Shivnarayan Patidar",
        designation: "Assistant Professor of ECE",
        email: "asd.acad@nitgoa.ac.in",
        image: drShivnarayanPatidar
      },
      officeDetails: {
        roomNo: "16",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404214"
      }
    },
    {
      category: "Students Welfare",
      dean: {
        name: "Dr. Soumitra Das",
        designation: "Associate Professor of EEE",
        email: "dean.sw@nitgoa.ac.in",
        image: drSoumitraDas
      },
      associateDean: {
        name: "Dr. Lokesh Kumar Bramhane",
        designation: "Assistant Professor of ECE",
        email: "asd.sw@nitgoa.ac.in",
        image: drLokeshKumarBramhane
      },
      officeDetails: {
        roomNo: "15",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404213"
      }
    },
    {
      category: "Faculty Welfare",
      dean: {
        name: "Dr. Amol D Rahulkar",
        designation: "Associate Professor of EEE",
        email: "dean.fw@nitgoa.ac.in",
        image: drAmolRahulkar
      },
      associateDean: {
        name: "Dr. Prasenjit Dey",
        designation: "Assistant Professor of Mechanical",
        email: "asd.fw@nitgoa.ac.in",
        image: drPrasanjitDey
      },
      officeDetails: {
        roomNo: "15",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404213"
      }
    },
    {
      category: "Research & Consultancy",
      dean: {
        name: "Dr. Chirag Modi",
        designation: "Associate Professor of CSE",
        email: "dean.rc@nitgoa.ac.in",
        image: drChiragModi
      },
      associateDean: {
        name: "Dr. Sreeraj E.S",
        designation: "Associate Professor of EEE",
        email: "asd.rc@nitgoa.ac.in",
        image: drSreerajES
      },
      officeDetails: {
        roomNo: "18",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404216"
      }
    },
    {
      category: "Planning & Development",
      dean: {
        name: "Dr. Velavan Kathirvelu",
        designation: "Associate Professor of Applied Sciences",
        email: "dean.pd@nitgoa.ac.in",
        image: drVelavanKathirvelu
      },
      associateDean: [
        {
          name: "Dr. Harikumar",
          designation: "Assistant Professor of Civil",
          email: "asd.pd@nitgoa.ac.in",
          image: drHarikumar
        },
        {
          name: "Dr. Sunilkumar",
          designation: "Assistant Professor of Economics",
          email: "asd.fm@nitgoa.ac.in",
          image: drSunilkumar,
          category: "Facility Management"
        }
      ],
      officeDetails: {
        roomNo: "10",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404211"
      }
    },
    {
      category: "Institutional Relations & Alumni Affairs",
      dean: {
        name: "Dr. Trilochan Panigrahi",
        designation: "Associate Professor of ECE",
        email: "dean.iraa@nitgoa.ac.in",
        image: drTrilochanPanigrahi
      },
      associateDean: {
        name: "Dr. Lalat Indu Giri",
        designation: "Assistant Professor of ECE",
        email: "asd.iraa@nitgoa.ac.in",
        image: drLalatInduGiri
      },
      officeDetails: {
        roomNo: "13",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404212"
      }
    }
  ];

  const renderDeanProfile = (person) => (
    <div className="dean-profile">
      <div className="dean-image">
        {person.image ? (
          <img src={person.image} alt={person.name} />
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
        {person.image ? (
          <img src={person.image} alt={person.name} />
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
          <span className="office-detail-value">{officeDetails.roomNo}</span>
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
          <h1>Deans</h1>
        </div>

        <div className="deans-cards-grid">
          {deansData.map((dean, index) => (
            <div key={index} className="dean-card">
              <div className="dean-card-header">
                <h2 className="dean-category-title">{dean.category}</h2>
              </div>
              
              <div className="dean-card-body">
                <div className="dean-section">
                  <div className="dean-section-title">Dean</div>
                  {renderDeanProfile(dean.dean)}
                </div>

                {dean.associateDean && (
                  <div className="associate-deans-section">
                    <div className="dean-section-title">Associate Dean{Array.isArray(dean.associateDean) ? 's' : ''}</div>
                    <div className="associate-deans-grid">
                      {Array.isArray(dean.associateDean) ? (
                        dean.associateDean.map((assocDean, idx) => (
                          <div key={idx}>
                            {renderAssociateDeanProfile(assocDean)}
                          </div>
                        ))
                      ) : (
                        renderAssociateDeanProfile(dean.associateDean)
                      )}
                    </div>
                  </div>
                )}

                {dean.officeDetails && renderOfficeDetails(dean.officeDetails)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deans;
