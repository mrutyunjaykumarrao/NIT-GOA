
import React from 'react';
import './RTI.css';
import rtiData from './rti.json';

const RTI = () => {
  return (
    <div className="rti-page-container">
      <div className="rti-page-content">
        <h1 className="rti-page-title">{rtiData.page_header.title}</h1>
        <hr className="rti-page-title-divider" />

        <div className="rti-page-section">
          <h2 className="rti-page-section-title">RTI Officers</h2>
          <div className="rti-officers-list">
            {rtiData.officers.map((officer) => (
              <div className="rti-officer-card" key={officer.title}>
                <div className="rti-officer-title">{officer.title}</div>
                <div className="rti-officer-name">{officer.name}</div>
                <div className="rti-officer-contact">Contact No: {officer.contact}</div>
                <div className="rti-officer-email">E-Mail: <a href={`mailto:${officer.email}`}>{officer.email}</a></div>
              </div>
            ))}
          </div>
        </div>

        {rtiData.sections.map((section) => {
          // Render BoG and FC minutes in horizontal, pipe-separated style
          const isMinutesSection =
            section.title === 'Minutes of BoG Meeting' || section.title === 'Minutes of FC Meeting';
          return (
            <div className="rti-page-section" key={section.title}>
              <h2 className="rti-page-section-title">{section.title}</h2>
              <div className={isMinutesSection ? 'rti-page-list rti-minutes-list' : 'rti-page-list'}>
                {isMinutesSection ? (
                  <>
                    {section.links.map((link) => {
                      let href = '';
                      if (link.type === 'external') {
                        href = link.file;
                      } else {
                        href = `/pdf/RTI/${link.file}`;
                      }
                      return (
                        <a
                          key={link.name}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rti-page-link rti-minutes-link"
                        >
                          {link.name}
                        </a>
                      );
                    })}
                  </>
                ) : (
                  section.links.map((link) => {
                    let href = '';
                    if (link.type === 'external') {
                      href = link.file;
                    } else {
                      href = `/pdf/RTI/${link.file}`;
                    }
                    return (
                      <a
                        key={link.name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rti-page-link"
                      >
                        {link.name}
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RTI;
