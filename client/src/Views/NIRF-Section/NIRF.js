import React, { useState } from 'react';
import './NIRF.css';
import nirfData from './nirf.json';

const NIRF = () => {
    const [openDropdowns, setOpenDropdowns] = useState({});

    const toggleDropdown = (year) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [year]: !prev[year]
        }));
    };

    return (
        <div className="nirf-page">
            <div className="nirf-container">
                <div className="page-header">
                    <h1>{nirfData.page_header.title}</h1>
                </div>

                <div className="nirf-content">
                    <div className="nirf-forms-section">
                        {nirfData.nirf_data.map((item) => (
                            <div key={item.year} className="nirf-year-section">
                                <div 
                                    className={`nirf-year-header ${openDropdowns[item.year] ? 'active' : ''}`}
                                    onClick={() => toggleDropdown(item.year)}
                                >
                                    <h2>NIRF FORMS-{item.year}</h2>
                                    <div className="nirf-dropdown-arrow">
                                        <svg 
                                            className={`nirf-arrow-icon ${openDropdowns[item.year] ? 'rotated' : ''}`}
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        >
                                            <polyline points="6,9 12,15 18,9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className={`nirf-forms-dropdown ${openDropdowns[item.year] ? 'open' : ''} ${item.year === '2017' ? 'scrollable' : ''}`}>
                                    <div className="nirf-forms-list">
                                        {item.forms.map((form, index) => {
                                            const isExcel = form.url.endsWith('.xlsx') || form.url.endsWith('.xls');
                                            return (
                                                <a 
                                                    key={index}
                                                    href={form.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="nirf-form-link"
                                                >
                                                    <div className="nirf-form-item">
                                                        <div className={`nirf-file-icon ${isExcel ? 'nirf-excel-icon' : 'nirf-pdf-icon'}`}>
                                                            {isExcel ? (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M14,2 L6,2 C4.9,2 4,2.9 4,4 L4,20 C4,21.1 4.9,22 6,22 L18,22 C19.1,22 20,21.1 20,20 L20,8 L14,2 Z"/>
                                                                    <polyline points="14,2 14,8 20,8"/>
                                                                    <line x1="8" y1="13" x2="16" y2="13"/>
                                                                    <line x1="8" y1="17" x2="16" y2="17"/>
                                                                    <line x1="10" y1="9" x2="14" y2="9"/>
                                                                </svg>
                                                            ) : (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M14,2 L6,2 C4.9,2 4,2.9 4,4 L4,20 C4,21.1 4.9,22 6,22 L18,22 C19.1,22 20,21.1 20,20 L20,8 L14,2 Z"/>
                                                                    <polyline points="14,2 14,8 20,8"/>
                                                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                                                    <polyline points="10,9 9,9 8,9"/>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="nirf-form-name">{form.name}</span>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="nirf-contact-info">
                        <p>{nirfData.contact_info.text} <a href={`mailto:${nirfData.contact_info.email}`}>{nirfData.contact_info.email}</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NIRF;
