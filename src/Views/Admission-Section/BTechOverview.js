import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BTechOverview.css';

const BTechOverview = () => {
    const navigate = useNavigate();

    const subsections = [
        {
            title: "JoSAA/CSAB",
            description: "Joint Seat Allocation Authority & Central Seat Allocation Board admission process",
            path: "/admissions/btech/josaa-csab",
            icon: "📋"
        },
        {
            title: "DASA", 
            description: "Direct Admission of Students Abroad for foreign nationals and NRI students",
            path: "/admissions/btech/dasa",
            icon: "🌍"
        },
        {
            title: "Facilities",
            description: "World-class infrastructure and learning environment for B.Tech students",
            path: "/admissions/btech/facilities", 
            icon: "🏛️"
        },
        {
            title: "Strengths of NIT Goa",
            description: "Excellence in technical education, research opportunities, and industry connections",
            path: "/admissions/btech/strengths",
            icon: "⭐"
        }
    ];

    return (
        <div className="btech-overview">
            <div className="page-header">
                <div className="header-content">
                    <h1>B.Tech Admissions</h1>
                    <p>Bachelor of Technology Programs at NIT Goa</p>
                </div>
            </div>

            <div className="content-container">
                <div className="content-section">
                    <h2>B.Tech Programs</h2>
                    <p>National Institute of Technology Goa offers undergraduate B.Tech programs in various engineering disciplines. Explore the sections below to learn more about admission processes, facilities, and what makes NIT Goa an excellent choice for your engineering education.</p>
                    
                    <div className="subsections-grid">
                        {subsections.map((section, index) => (
                            <div 
                                key={index}
                                className="subsection-card"
                                onClick={() => navigate(section.path)}
                            >
                                <div className="subsection-icon">{section.icon}</div>
                                <h3>{section.title}</h3>
                                <p>{section.description}</p>
                                <div className="card-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-section">
                    <h2>Quick Information</h2>
                    <div className="quick-info-grid">
                        <div className="info-item">
                            <h3>Duration</h3>
                            <p>4 Years (8 Semesters)</p>
                        </div>
                        <div className="info-item">
                            <h3>Departments</h3>
                            <p>6 Engineering Departments</p>
                        </div>
                        <div className="info-item">
                            <h3>Admission</h3>
                            <p>Through JEE Main</p>
                        </div>
                        <div className="info-item">
                            <h3>Degree</h3>
                            <p>Bachelor of Technology</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BTechOverview;
