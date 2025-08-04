import React from 'react';
import './DissertationFormats.css';
import dissertationFormatsDataFile from './dissertationFormatsData.json';

const DissertationFormats = () => {
  const dissertationFormatsData = dissertationFormatsDataFile.dissertation_formats_page.sections;

  return (
    <div className="dissertation-formats-page">
      <div className="dissertation-formats-container">
        <div className="page-header">
          <h1>Dissertation Formats</h1>
        </div>
        {dissertationFormatsData.map((section, i) => (
          <div key={i} className="formats-section">
            <h2 className="section-title">
              {section.section}
            </h2>
            <div className="formats-list">
              {section.entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="format-card"
                >
                  <div className="format-title">
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
                    Download File
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

export default DissertationFormats;