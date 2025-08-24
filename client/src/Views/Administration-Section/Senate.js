import React from 'react';
import './Senate.css';
import senateData from './senate.json';

const Senate = () => {
  return (
    <div className="senate-page">
      <div className="senate-container">
        <div className="senate-page-header">
          <h1>{senateData.page_info.title}</h1>
          <p className="senate-subtitle">{senateData.page_info.subtitle}</p>
          <p className="senate-description">{senateData.page_info.description}</p>
        </div>

        <div className="senate-content">
          <div className="senate-table-container">
            <table className="senate-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>NIT Act</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {senateData.senate_members.map((member, index) => (
                  <tr key={index}>
                    <td>{member.s_no}</td>
                    <td>{member.nit_act && (member.rowspan ? (index === 3 ? <span rowSpan={member.rowspan}>{member.nit_act}</span> : null) : member.nit_act)}</td>
                    <td>{member.name}</td>
                    <td dangerouslySetInnerHTML={{ __html: member.designation.replace(/\n/g, '<br/>') }}></td>
                    <td>{member.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="minutes-section senate-page-section">
            <h2 className="senate-page-section-title">Minutes of Senate</h2>
            <div className="senate-page-list senate-minutes-list">
              {senateData.senate_pdfs.map((senate) => (
                <a
                  key={senate.number}
                  href={senate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="senate-page-link senate-minutes-link"
                >
                  Senate-{senate.number}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Senate;
