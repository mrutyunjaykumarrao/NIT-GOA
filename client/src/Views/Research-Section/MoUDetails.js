import React from 'react';
import './MoUDetails.css';
import mouData from './mouDetails.json';

const MoUDetails = () => {
  return (
    <div className="mou-details-page">
      <div className="mou-details-wrapper">
        <header className="mou-details-page-header">
          <h1>{mouData.page_info.title}</h1>
          <p className="mou-details-subtitle">{mouData.page_info.subtitle}</p>
          <p className="mou-details-description">{mouData.page_info.description}</p>
        </header>
        
        <div className="mou-details-main-content">
          <div className="mou-details-table-container">
            <table>
              <thead>
                <tr>
                  {mouData.table_headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mouData.mous.map((mou, index) => (
                  <tr key={index}>
                    <td>{mou.sno}</td>
                    <td>{mou.date}</td>
                    <td>{mou.duration}</td>
                    <td>{mou.organization}</td>
                    <td>{mou.scope}</td>
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

export default MoUDetails;
