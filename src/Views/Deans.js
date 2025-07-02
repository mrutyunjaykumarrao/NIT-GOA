import React from 'react';
import './Deans.css';

// Import dean images
import drSMini from '../assets/images/Faculty/CSE/Dr. S. Mini.png';
import drShivnarayanPatidar from '../assets/images/Faculty/ECE/Dr. Shivnarayan Patidar.png';
import drSoumitraDas from '../assets/images/Faculty/EEE/Dr. Soumitra Das.png';
import drLokeshKumarBramhane from '../assets/images/Faculty/ECE/Dr. Lokesh Kumar Bramhane.png';
import drAmolRahulkar from '../assets/images/Faculty/EEE/Dr. Amol D. Rahulkar.jpg';
import drPrasanjitDey from '../assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png';
import drChiragModi from '../assets/images/Faculty/CSE/Dr. Modi Chirag Navinchandra.png';
import drSreerajES from '../assets/images/Faculty/EEE/Dr. Sreeraj E S.png';
import drHarikumar from '../assets/images/Faculty/CVE/Dr. Harikumar M.png';
import drSureshMikkili from '../assets/images/Faculty/EEE/Dr. Suresh Mikkili.png';
import drTrilochanPanigrahi from '../assets/images/Faculty/ECE/Dr. Trilochan Panigrahi.jpg';
import drLalatInduGiri from '../assets/images/Faculty/ECE/Dr. Lalat Indu Giri.png';

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
        email: "assdean@nitgoa.ac.in",
        image: drShivnarayanPatidar
      },
      officeDetails: {
        roomNo: "14",
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
        email: "deansw@nitgoa.ac.in",
        image: drSoumitraDas
      },
      associateDean: {
        name: "Dr. Lokesh Kumar Bramhane",
        designation: "Assistant Professor of ECE",
        email: "asssw@nitgoa.ac.in",
        image: drLokeshKumarBramhane
      },
      officeDetails: {
        roomNo: "14",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404213"
      }
    },
    {
      category: "Faculty Welfare",
      dean: {
        name: "Dr. Amol D. Rahulkar",
        designation: "Associate Professor of EEE",
        email: "deanfw@nitgoa.ac.in",
        image: drAmolRahulkar
      },
      associateDean: {
        name: "Dr. Prasanjit Dey",
        designation: "Assistant Professor of Mechanical",
        email: "assfw@nitgoa.ac.in",
        image: drPrasanjitDey
      },
      officeDetails: {
        roomNo: "14",
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
        email: "deanrc@nitgoa.ac.in",
        image: drChiragModi
      },
      associateDean: {
        name: "Dr. Sreeraj E S",
        designation: "Assistant Professor of EEE",
        email: "assrc@nitgoa.ac.in",
        image: drSreerajES
      },
      officeDetails: {
        roomNo: "8",
        floor: "1st Floor",
        building: "Sardar Patel Building",
        contact: "0832-2404216"
      }
    },
    {
      category: "Planning & Development",
      dean: {
        name: "Dr. Harikumar",
        designation: "Assistant Professor of Civil",
        email: "deanpd@nitgoa.ac.in",
        image: drHarikumar
      },
      associateDean: [
        {
          name: "Dr. Prasanjit Dey",
          designation: "Assistant Professor of Mechanical",
          email: "asspd@nitgoa.ac.in",
          image: drPrasanjitDey
        },
        {
          name: "Dr. Suresh Mikkili",
          designation: "Assistant Professor of EEE",
          email: "deanfm@nitgoa.ac.in",
          image: drSureshMikkili
        }
      ],
      officeDetails: {
        roomNo: "8",
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
        email: "deaniraa@nitgoa.ac.in",
        image: drTrilochanPanigrahi
      },
      associateDean: {
        name: "Dr. Lalit Indu Giri",
        designation: "Assistant Professor of ECE",
        email: "assiraa@nitgoa.ac.in",
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

  const renderPersonProfile = (person, category, isDean = false) => (
    <div className="person-profile-table">
      <div className="person-image-table">
        {person.image ? (
          <img src={person.image} alt={person.name} />
        ) : (
          <div className="image-placeholder-table">
            👤
          </div>
        )}
      </div>
      <div className="person-info-table">
        <div className="person-category">{category}</div>
        <div className="person-name-table">{person.name}</div>
        <div className="person-designation-table">{person.designation}</div>
        <a href={`mailto:${person.email}`} className="person-email-table">
          {person.email}
        </a>
      </div>
    </div>
  );

  const renderOfficeDetails = (officeDetails) => (
    <div className="office-details-table">
      <div className="office-detail-item">
        <span className="office-label">Room No:</span> {officeDetails.roomNo}
      </div>
      <div className="office-detail-item">
        <span className="office-label">Floor:</span> {officeDetails.floor}
      </div>
      <div className="office-detail-item">
        <span className="office-label">Building:</span> {officeDetails.building}
      </div>
      <div className="office-detail-item">
        <span className="office-label">NIT Goa</span>
      </div>
      <div className="office-detail-item">
        <span className="office-label">Tel No:</span> {officeDetails.contact}
      </div>
    </div>
  );

  return (
    <div className="deans-page">
      <div className="container">
        <div className="page-header">
          <h1>Deans</h1>
        </div>

        <div className="deans-table">
          {/* Table Header */}
          <div className="table-header">
            <div className="header-cell">Dean</div>
            <div className="header-cell">Associate Dean</div>
            <div className="header-cell">Office details</div>
          </div>

          {/* Table Body */}
          <div className="table-body">
            {deansData.map((dean, index) => (
              <div key={index} className="table-row">
                {/* Dean Column */}
                <div className="table-cell">
                  {renderPersonProfile(dean.dean, dean.category, true)}
                </div>

                {/* Associate Dean Column */}
                <div className="table-cell">
                  {dean.associateDean && (
                    Array.isArray(dean.associateDean) ? (
                      <div className="associates-table">
                        {dean.associateDean.map((assocDean, idx) => (
                          <div key={idx}>
                            {renderPersonProfile(assocDean, dean.category, false)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      renderPersonProfile(dean.associateDean, dean.category, false)
                    )
                  )}
                </div>

                {/* Office Details Column */}
                <div className="table-cell">
                  {dean.officeDetails && renderOfficeDetails(dean.officeDetails)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deans;
