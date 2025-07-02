import React from 'react';
import './OrganizationalStructure.css';

const OrganizationalStructure = () => {
  const handleDownloadChart = () => {
    window.open('/pdf/Administration/organisationalstructure/Org_Chart.pdf', '_blank');
  };

  return (
    <div className="organizational-structure-page">
      <div className="container">
        <div className="page-header">
          <h1>Organizational Structure</h1>
        </div>

        <div className="org-structure-content">
          <div className="structure-info">
            <p>
              The organizational structure of NIT Goa outlines the hierarchical framework 
              and administrative setup of the institute. This structure ensures efficient 
              governance and management of academic and administrative activities.
            </p>
          </div>

          <div className="download-section">
            <div className="download-card">
              <h3>📊 Organizational Chart</h3>
              <p>Download the complete organizational structure chart showing the hierarchy and reporting relationships within NIT Goa.</p>
              <button 
                className="download-btn"
                onClick={handleDownloadChart}
              >
                📥 Download Organizational Chart
              </button>
            </div>
          </div>

          <div className="structure-overview">
            <h2>Key Administrative Positions</h2>
            <div className="positions-grid">
              <div className="position-card">
                <h4>Director</h4>
                <p>Chief Executive Officer of the Institute</p>
              </div>
              <div className="position-card">
                <h4>Registrar</h4>
                <p>Chief Administrative Officer</p>
              </div>
              <div className="position-card">
                <h4>Deans</h4>
                <p>Academic and Administrative Deans</p>
              </div>
              <div className="position-card">
                <h4>Heads of Departments</h4>
                <p>Department-wise Academic Leadership</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalStructure;
