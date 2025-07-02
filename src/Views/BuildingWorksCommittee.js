import React from 'react';
import './BuildingWorksCommittee.css';

const BuildingWorksCommittee = () => {
  return (
    <div className="building-works-committee-container">
      <div className="content-wrapper">
        <header className="page-header">
          <h1>Building and Works Committee</h1>
        </header>
        
        <div className="building-works-committee-content">
          <div className="table-container">
            <table>
              <tbody>
                <tr>
                  <th>Sr.No</th>
                  <th>NIT Statute Section: 12</th>
                  <th>Designation</th>
                  <th>Name & Address</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>(i)</td>
                  <td>Director, Ex-officio Chairman</td>
                  <td>Prof. O.R. Jaiswal Director NIT Goa</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>(ii)</td>
                  <td>Deputy Secretary, MoE dealing with NIT Member</td>
                  <td>Ms. Garima Sharma, Deputy Secretary, MoE</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>(ii)</td>
                  <td>MoE, dealing with Finance Member</td>
                  <td>Shri. Narayan Singh Bisht, Deputy Secretary, IFD, MoE</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>(iii)</td>
                  <td>Nominee of BoG Member</td>
                  <td>Prof. R.K. Tripathi, Professor Dept. of Civil Engineering & Dean (P&D), NIT Raipur</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>(iv)</td>
                  <td>Registrar, Ex-officio Member Secretary</td>
                  <td>Dr. Shashidhar K. Kudari</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>(v)</td>
                  <td>Dean (P&D) Member</td>
                  <td>Dr. Velavan Kathirvelu</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td rowSpan="2">(vi)</td>
                  <td rowSpan="2">One Expert each from Civil & Electrical wing of Central or State or any autonomous body. Members.</td>
                  <td>Prof. Krishna Kant Pathak Professor Dept. of Civil Engineering IIT BHU</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>Shri A.K Jain Former DDG (Works), CPWD Delhi</td>
                </tr>
              </tbody>
            </table>
            
            <div className="minutes-section">
              <h3>Minutes of BWC Meeting</h3>
              <div className="minutes-links">
                <a href="/pdf/Administration/buildingworkscommittee/BWC-2.pdf" target="_blank" rel="noopener noreferrer">BWC-2</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-3.pdf" target="_blank" rel="noopener noreferrer">BWC-3</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-4.pdf" target="_blank" rel="noopener noreferrer">BWC-4</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-5.pdf" target="_blank" rel="noopener noreferrer">BWC-5</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-6.pdf" target="_blank" rel="noopener noreferrer">BWC-6</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-7.pdf" target="_blank" rel="noopener noreferrer">BWC-7</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-8.pdf" target="_blank" rel="noopener noreferrer">BWC-8</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-9.pdf" target="_blank" rel="noopener noreferrer">BWC-9</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/BWC-10.pdf" target="_blank" rel="noopener noreferrer">BWC-10</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/MoM 11th BWC.pdf" target="_blank" rel="noopener noreferrer">BWC-11</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/MoM 12th BWC.pdf" target="_blank" rel="noopener noreferrer">BWC-12</a> | {' '}
                <a href="/pdf/Administration/buildingworkscommittee/MoM 13BWC.pdf" target="_blank" rel="noopener noreferrer">BWC-13</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingWorksCommittee;
