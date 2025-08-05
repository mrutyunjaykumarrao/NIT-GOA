import React from 'react';
import './BuildingWorksCommittee.css';

const BuildingWorksCommittee = () => {
  // Array of BWC PDF files with public folder paths
  const bwcPDFs = [
    { number: 2, file: '/pdf/Administration/buildingworkscommittee/BWC-2.pdf' },
    { number: 3, file: '/pdf/Administration/buildingworkscommittee/BWC-3.pdf' },
    { number: 4, file: '/pdf/Administration/buildingworkscommittee/BWC-4.pdf' },
    { number: 5, file: '/pdf/Administration/buildingworkscommittee/BWC-5.pdf' },
    { number: 6, file: '/pdf/Administration/buildingworkscommittee/BWC-6.pdf' },
    { number: 7, file: '/pdf/Administration/buildingworkscommittee/BWC-7.pdf' },
    { number: 8, file: '/pdf/Administration/buildingworkscommittee/BWC-8.pdf' },
    { number: 9, file: '/pdf/Administration/buildingworkscommittee/BWC-9.pdf' },
    { number: 10, file: '/pdf/Administration/buildingworkscommittee/BWC-10.pdf' },
    { number: 11, file: '/pdf/Administration/buildingworkscommittee/MoM 11th BWC.pdf' },
    { number: 12, file: '/pdf/Administration/buildingworkscommittee/MoM 12th BWC.pdf' },
    { number: 13, file: '/pdf/Administration/buildingworkscommittee/MoM 13BWC.pdf' },
  ];

  return (
    <div className="building-works-committee-page">
      <div className="building-works-committee-wrapper">
        <header className="building-works-committee-page-header">
          <h1>Building and Works Committee</h1>
          <p className="building-works-committee-subtitle">National Institute of Technology Goa</p>
          <p className="building-works-committee-description">Infrastructure Development & Management</p>
        </header>
        
        <div className="building-works-committee-main-content">
          <div className="building-works-committee-table-container">
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
            
            <div className="minutes-section bwc-page-section">
              <h2 className="bwc-page-section-title">Minutes of BWC Meeting</h2>
              <div className="bwc-page-list bwc-minutes-list">
                {bwcPDFs.map((bwc) => (
                  <a
                    key={bwc.number}
                    href={bwc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bwc-page-link bwc-minutes-link"
                  >
                    BWC-{bwc.number}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingWorksCommittee;
