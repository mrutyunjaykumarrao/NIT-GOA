import React from 'react';
import './HeadsOfDepartments.css';

// Import head of department images
import VeenathenkanidiyoorImg from '../../assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png';
import SureshMikkiliImg from '../../assets/images/Faculty/EEE/Dr. Suresh Mikkili.png';
import VeerakumarImg from '../../assets/images/Faculty/ECE/drveerakumar.jpeg';
import ShangerganeshImg from '../../assets/images/Faculty/APS/Dr. L. Shangerganesh.png';
import PrasenjitDeyImg from '../../assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png';
import HarikumarImg from '../../assets/images/Faculty/CVE/Dr. Harikumar M.png';

const HeadsOfDepartments = () => {
  const departmentHeads = [
    {
      name: 'Dr. Veena Thenkanidiyoor',
      department: 'Computer Science and Engineering',
      shortDept: 'CSE',
      email: 'hod.cse@nitgoa.ac.in',
      phone: '0832-2404432',
      image: VeenathenkanidiyoorImg
    },
    {
      name: 'Dr. Suresh Mikkili',
      department: 'Electrical and Electronics Engineering',
      shortDept: 'EEE',
      email: 'hod.eee@nitgoa.ac.in',
      phone: '0832-2404645',
      image: SureshMikkiliImg
    },
    {
      name: 'Dr. Veerakumar T',
      department: 'Electronics and Communication Engineering',
      shortDept: 'ECE',
      email: 'hod.ece@nitgoa.ac.in',
      phone: '0832-2404520',
      image: VeerakumarImg
    },
    {
      name: 'Dr. L. Shangerganesh',
      department: 'Applied Sciences and Humanities & Social Sciences',
      shortDept: 'APS',
      email: 'hod.hs@nitgoa.ac.in',
      phone: '0832-2404728',
      image: ShangerganeshImg
    },
    {
      name: 'Dr. Prasenjit Dey',
      department: 'Mechanical Engineering',
      shortDept: 'MCE',
      email: 'hod.mech@nitgoa.ac.in',
      phone: '0832-2404834',
      image: PrasenjitDeyImg
    },
    {
      name: 'Dr. Harikumar M',
      department: 'Civil Engineering',
      shortDept: 'CVE',
      email: 'hod.civil@nitgoa.ac.in',
      phone: '0832-2404846',
      image: HarikumarImg
    }
  ];

  const renderHodProfile = (head) => (
    <div className="hod-profile">
      <div className="hod-image">
        {head.image ? (
          <img src={head.image} alt={head.name} />
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
        <div className="hod-phone">{head.phone}</div>
      </div>
    </div>
  );

  return (
    <div className="heads-of-departments-page">
      <div className="heads-of-departments-container">
        <div className="heads-of-departments-page-header">
          <h1>Heads of Departments</h1>
        </div>

        <div className="hod-cards-grid">
          {departmentHeads.map((head, index) => (
            <div key={index} className="hod-card">
              <div className="hod-card-header">
                <h2 className="hod-department-title">{head.shortDept}</h2>
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
