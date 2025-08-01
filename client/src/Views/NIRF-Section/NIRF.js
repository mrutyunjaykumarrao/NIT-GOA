import React, { useState } from 'react';
import './NIRF.css';

const NIRF = () => {
    const [openDropdowns, setOpenDropdowns] = useState({});

    const toggleDropdown = (year) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [year]: !prev[year]
        }));
    };

    const nirfData = [
        {
            year: '2025',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: 'https://www.nitgoa.ac.in/static/National%20Institute%20of%20Technology%20Goa2025_Engg.pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: 'https://www.nitgoa.ac.in/static/National%20Institute%20of%20Technology%20Goa2025_Overall.pdf' }
            ]
        },
        {
            year: '2024',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/NITGoa_Engineering_28feb2024.pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: '/pdf/NIRF/NITGoa_Overall_28feb2024.pdf' }
            ]
        },
        {
            year: '2023',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/NITGoa-Engg_13jan2023.pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: '/pdf/NIRF/NITGoa-Overall_13jan2023.pdf' }
            ]
        },
        {
            year: '2022',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/NIRF-Engg_2022.pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: '/pdf/NIRF/NIRF-Overall_2022.pdf' }
            ]
        },
        {
            year: '2021',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/NIRF_2021-NIT_Goa_Engineering.pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: '/pdf/NIRF/NIRF_2021-NIT_Goa_Overall.pdf' }
            ]
        },
        {
            year: '2020',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/National_Institute_of_Technology_Goa-2020-Engineering.pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: '/pdf/NIRF/National_Institute_of_Technology_Goa-2020-Overall.pdf' }
            ]
        },
        {
            year: '2019',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/NIRF-ENGG_Category_(LOCKED).pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: '/pdf/NIRF/NIRF-OVERALL_Category_(LOCKED).pdf' }
            ]
        },
        {
            year: '2018',
            forms: [
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/ENGINEERING-All_Report-MHRD_National_Institutional_Ranking_Framework_(NIRF)_8jan2018.pdf' },
                { name: 'Full Report-MoE, National Institutional Ranking Framework (NIRF) - OVERALL', url: '/pdf/NIRF/OVERALL_-_All_Report-MHRD_National_Institutional_Ranking_Framework_(NIRF)_8jan2018.pdf' }
            ]
        },
        {
            year: '2017',
            forms: [
                { name: 'Consultancy Project Details', url: '/pdf/NIRF/Consultancy_Project_Detail.xlsx' },
                { name: 'Enterpreneurship', url: '/pdf/NIRF/Enterpreneurship.xlsx' },
                { name: 'Program Details', url: '/pdf/NIRF/edp.xlsx' },
                { name: 'PG - Higher Studies', url: '/pdf/NIRF/PG_-_HigherStudies.xlsx' },
                { name: 'UG - Higher Studies', url: '/pdf/NIRF/UG_-_HigherStudies.xlsx' },
                { name: 'Sponsored Research Details', url: '/pdf/NIRF/Sponsored_Research_Detail.xlsx' },
                { name: 'Top University Details_5D', url: '/pdf/NIRF/TopUniversityDetails_5D.xlsx' },
                { name: 'Top University Details_3D', url: '/pdf/NIRF/Top_UniversityDetails_3D.xlsx' },
                { name: 'Placements', url: '/pdf/NIRF/Placement_20feb2017.xlsx' },
                { name: 'Full Report-MHRD, National Institutional Ranking Framework (NIRF) - ENGG', url: '/pdf/NIRF/Full_Report_MHRD_National_Institutional_Ranking_Framework_(NIRF)_-_ENGG_20feb2017.pdf' },
                { name: 'Full Report-MHRD, National Institutional Ranking Framework (NIRF)-OVERALL', url: '/pdf/NIRF/Full_Report_MHRD__National_Institutional_Ranking_Framework_(NIRF)_-_OVERALL_20feb2017.pdf' }
            ]
        }
    ];

    return (
        <div className="nirf-page">
            <div className="nirf-container">
                <div className="page-header">
                    <h1>NIRF Forms</h1>
                </div>

                <div className="nirf-content">
                    <div className="nirf-forms-section">
                        {nirfData.map((item) => (
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
                        <p>FOR ANY COMMENTS AND FEEDBACK PLEASE E-MAIL TO <a href="mailto:nirf@nitgoa.ac.in">nirf@nitgoa.ac.in</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NIRF;
