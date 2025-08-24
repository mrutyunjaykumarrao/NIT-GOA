import React from 'react';
import './Tenders.css';
import useScrollToTop from '../../utils/useScrollToTop';
import tendersData from './tenders.json';

const Tenders = () => {
    // Handle smooth scroll to top for quick link navigation
    useScrollToTop();
    
    // All tenders from tender.html (complete list in chronological order)
    const tenders = tendersData.tenders;

    const handleDownload = (pdfPath) => {
        window.open(pdfPath, '_blank');
    };

    return (
        <div className="tender-page-container">
            <div className="tender-page-header">
                    <h1 className="tender-page-title">{tendersData.page_header.title}</h1>
            </div>
            <div className="tender-page-content">
                <div className="tender-page-section">
                    <div className="tender-page-list">
                        {tenders.map(tender => (
                            <a 
                                key={tender.pdfPath}
                                href={tender.pdfPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tender-page-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(tender.pdfPath);
                                }}
                            >
                                {tender.title}
                                {tender.isNew && <span className="tender-page-new-badge">NEW</span>}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tenders;
