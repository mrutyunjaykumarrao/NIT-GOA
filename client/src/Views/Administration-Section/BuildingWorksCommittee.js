import React from 'react';
import './BuildingWorksCommittee.css';
import bwcData from './buildingWorksCommittee.json';

const BuildingWorksCommittee = () => {
  return (
    <div className="building-works-committee-page">
      <div className="building-works-committee-wrapper">
        <header className="building-works-committee-page-header">
          <h1>{bwcData.page_info.title}</h1>
          <p className="building-works-committee-subtitle">{bwcData.page_info.subtitle}</p>
          <p className="building-works-committee-description">{bwcData.page_info.description}</p>
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
                {bwcData.bwc_members.map((member, index) => (
                  <tr key={index}>
                    <td>{member.sr_no}</td>
                    <td>
                      {member.nit_statute_section && (
                        member.rowspan ? (
                          index === 6 ? 
                            <span rowSpan={member.rowspan}>{member.nit_statute_section}</span> : 
                            null
                        ) : member.nit_statute_section
                      )}
                    </td>
                    <td>
                      {member.designation && (
                        member.rowspan ? (
                          index === 6 ? 
                            <span rowSpan={member.rowspan}>{member.designation}</span> : 
                            null
                        ) : member.designation
                      )}
                    </td>
                    <td>{member.name_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="minutes-section bwc-page-section">
              <h2 className="bwc-page-section-title">Minutes of BWC Meeting</h2>
              <div className="bwc-page-list bwc-minutes-list">
                {bwcData.bwc_pdfs.map((bwc) => (
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
