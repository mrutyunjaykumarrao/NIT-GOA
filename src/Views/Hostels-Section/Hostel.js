import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hostel.css';

const Hostel = () => {
    const navigate = useNavigate();
    
    const handlePDFOpen = (url) => {
        // Force direct PDF opening in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    const hostelData = {
        title: "Hostel Accommodation",
        subtitle: "Secure and Comfortable Living at NIT Goa",
        description: "NIT Goa provides separate hostel accommodation for boys and girls with modern amenities and a conducive environment for academic excellence.",
        programs: [
            {
                title: "B.Tech Hostel",
                subtitle: "Accommodation for Undergraduate Students",
                description: "Dedicated hostel facilities for B.Tech students with all essential amenities for comfortable living and focused studies.",
                features: [
                    "Separate hostels for boys and girls",
                    "24/7 security and surveillance",
                    "Wi-Fi connectivity throughout the campus",
                    "Common room with recreational facilities",
                    "Mess facility with nutritious meals",
                    "Study rooms and library access",
                    "Medical facilities on campus",
                    "Laundry services"
                ],
                capacity: "Accommodation for all B.Tech students",
                link: "/admissions/hostel/btech",
                rulesLink: "https://www.nitgoa.ac.in/static/Rules_of_NIT_Goa_Hostel_18July2022.pdf"
            },
            {
                title: "M.Tech Hostel",
                subtitle: "Accommodation for Postgraduate Students",
                description: "Premium hostel facilities for M.Tech students with enhanced amenities for research-focused academic life.",
                features: [
                    "Separate hostels for boys and girls",
                    "Single/double occupancy rooms available",
                    "High-speed internet connectivity",
                    "Research-friendly study environment",
                    "Quality mess with varied cuisine",
                    "Common areas for academic discussions",
                    "Proximity to research labs",
                    "Guest room facilities for visitors"
                ],
                capacity: "Accommodation available for all M.Tech students",
                link: "/admissions/hostel/mtech",
                rulesLink: "https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf"
            }
        ],
        generalInfo: {
            title: "General Hostel Information",
            points: [
                "All hostel rooms are furnished with bed, study table, chair, and wardrobe",
                "Hostel admission is mandatory for all students",
                "Hostel fees are separate from academic fees",
                "Ragging is strictly prohibited and punishable",
                "Hostel rules and regulations must be followed strictly",
                "Parents/guardians can visit during specified visiting hours"
            ]
        },
        contact: {
            title: "Hostel Office Contact",
            address: "National Institute of Technology Goa",
            location: "Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703",
            phone: "+91-832-2404202",
            email: "hostel@nitgoa.ac.in"
        }
    };

    return (
        <div className="hostel-page">
            <div className="hostel-container">
                {/* Header Section */}
                <div className="hostel-hero">
                    <div className="hero-content">
                        <h1>{hostelData.title}</h1>
                        <p className="hero-subtitle">{hostelData.subtitle}</p>
                        <p className="hero-description">{hostelData.description}</p>
                    </div>
                </div>

                {/* Programs Section */}
                <section className="programs-section">
                    <h2 className="section-title">Hostel Programs</h2>
                    <div className="programs-list">
                        {hostelData.programs.map((program, index) => (
                            <div key={index} className="program-section">
                                <div className="program-header">
                                    <h3 className="program-title">{program.title}</h3>
                                    <p className="program-subtitle">{program.subtitle}</p>
                                </div>
                                
                                <div className="program-content">
                                    <div className="program-description">
                                        <p>{program.description}</p>
                                    </div>
                                    
                                    <div className="program-features">
                                        <h4>Facilities & Features</h4>
                                        <ul>
                                            {program.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="program-capacity">
                                        <p><strong>Capacity:</strong> {program.capacity}</p>
                                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
                                            <button 
                                                className="hostel-details-btn"
                                                onClick={() => navigate(program.link)}
                                            >
                                                View Detailed Information
                                            </button>
                                            <button 
                                                onClick={() => handlePDFOpen(program.rulesLink)}
                                                className="hostel-details-btn"
                                            >
                                                Download Hostel Rules (PDF)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* General Information */}
                <section className="general-info-section">
                    <div className="general-info">
                        <h3>{hostelData.generalInfo.title}</h3>
                        <ul>
                            {hostelData.generalInfo.points.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="contact-section">
                    <h2 className="section-title">Contact Information</h2>
                    <div className="contact-card">
                        <h3>{hostelData.contact.title}</h3>
                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="contact-label">Institute:</span>
                                <span className="contact-value">{hostelData.contact.address}</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Address:</span>
                                <span className="contact-value">{hostelData.contact.location}</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Phone:</span>
                                <span className="contact-value">{hostelData.contact.phone}</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Email:</span>
                                <span className="contact-value">{hostelData.contact.email}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Hostel;
