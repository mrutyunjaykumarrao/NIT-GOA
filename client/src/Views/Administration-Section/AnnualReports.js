import React from 'react';
import './AnnualReports.css';
import annualReportsData from './annualReports.json';

const AnnualReports = () => {
  return (
    <div className="annual-reports-page">
      <div className="annual-reports-container">
        <div className="page-header">
          <h1>{annualReportsData.page_info.title}</h1>
        </div>
        {annualReportsData.annual_reports_data.map((block, i) => (
          <div key={i} className="reports-section">
            <h2 className="section-title">
              {block.section}
            </h2>
            <div className="reports-list">
              {block.entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="report-card"
                >
                  <div className="report-title">
                    {entry.title}
                  </div>
                  <button
                    className="pretty-download-btn"
                    onClick={() =>
                      window.open(entry.file, '_blank')
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ marginRight: 8 }}
                    >
                      <rect
                        width="18"
                        height="22"
                        x="3"
                        y="1"
                        fill="#fff"
                        stroke="#1976d2"
                        strokeWidth="1.5"
                        rx="3"
                      />
                      <rect
                        width="14"
                        height="2"
                        x="5"
                        y="4"
                        fill="#e3eafc"
                      />
                      <rect
                        width="10"
                        height="2"
                        x="7"
                        y="8"
                        fill="#e3eafc"
                      />
                      <rect
                        width="10"
                        height="2"
                        x="7"
                        y="12"
                        fill="#e3eafc"
                      />
                      <rect
                        width="10"
                        height="2"
                        x="7"
                        y="16"
                        fill="#e3eafc"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnualReports;
