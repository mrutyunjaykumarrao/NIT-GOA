import React from 'react';
import './HeadsOfDepartments.css';

// Import head of department images
import VeenathenkanidiyoorImg from '../assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png';
import SunilKhushImg from '../assets/images/Faculty/ECE/Dr. Trilochan Panigrahi.jpg';
import VeerananjanImg from '../assets/images/Faculty/ECE/Dr. Vasantha (1).jpg';
import ShangerganeshImg from '../assets/images/Faculty/APS/Dr. L. Shangerganesh.png';
import PrasenjitDeyImg from '../assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png';
import HarikumarImg from '../assets/images/Faculty/CVE/Dr. Harikumar M.png';

const HeadsOfDepartments = () => {
  const departmentHeads = [
    {
      name: 'Dr. Veena Thenkanidiyoor',
      department: 'Computer Science and Engineering',
      email: 'hodcse@nitgoa.ac.in',
      phone: '0832-2404432',
      image: VeenathenkanidiyoorImg
    },
    {
      name: 'Dr. Sunil Khusch',
      department: 'Electrical and Electronics Engineering',
      email: 'hodece@nitgoa.ac.in',
      phone: '0832-2404845',
      image: SunilKhushImg
    },
    {
      name: 'Dr. Veerananjanl T',
      department: 'Electronics and Communication Engineering',
      email: 'hodece@nitgoa.ac.in',
      phone: '0832-2404520',
      image: VeerananjanImg
    },
    {
      name: 'Dr. L. Shangerganesh',
      department: 'Applied Sciences and Humanities & Social Sciences',
      email: 'hodhs@nitgoa.ac.in',
      phone: '0832-2404728',
      image: ShangerganeshImg
    },
    {
      name: 'Dr. Prasenjit Dey',
      department: 'Mechanical Engineering',
      email: 'hodme@nitgoa.ac.in',
      phone: '0832-2404834',
      image: PrasenjitDeyImg
    },
    {
      name: 'Dr. Harikumar M',
      department: 'Civil Engineering',
      email: 'hodciv@nitgoa.ac.in',
      phone: '0832-2404846',
      image: HarikumarImg
    }
  ];

  return (
    <div className="heads-of-departments-page">
      <div className="heads-of-departments-wrapper">
        <header className="heads-of-departments-page-header">
          <h1>Head Of Departments</h1>
        </header>
        
        <div className="heads-of-departments-main-content">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>E-Mail</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {departmentHeads.map((head, index) => (
                  <tr key={index}>
                    <td>
                      <div className="head-info">
                        <img src={head.image} alt={head.name} className="head-image" />
                        <span className="head-name">{head.name}</span>
                      </div>
                    </td>
                    <td>{head.department}</td>
                    <td>
                      <a href={`mailto:${head.email}`} className="email-link">
                        {head.email}
                      </a>
                    </td>
                    <td>{head.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadsOfDepartments;
