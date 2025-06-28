import React from 'react';
import './Hostel.css';

const BTechHostel = () => {
    
    const handlePDFOpen = (url) => {
        // Force direct PDF opening in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    const hostelData = {
        title: "B.Tech Hostel Accommodation",
        subtitle: "Comfortable Living for Undergraduate Students",
        description: "NIT Goa provides dedicated hostel facilities for B.Tech students with all essential amenities for comfortable living and focused studies.",
        features: [
            "Separate hostels for boys and girls",
            "24/7 security and surveillance",
            "Wi-Fi connectivity throughout the campus",
            "Common room with recreational facilities",
            "Mess facility with nutritious meals",
            "Study rooms and library access",
            "Medical facilities on campus",
            "Laundry services",
            "Sports and recreational facilities",
            "Proximity to academic blocks"
        ],
        facilities: {
            title: "Room Facilities",
            items: [
                "Furnished rooms with bed, study table, chair, and wardrobe",
                "Ceiling fan and adequate lighting",
                "Individual or shared accommodation",
                "Attached or common washrooms",
                "Storage space for personal belongings"
            ]
        },
        rules: {
            title: "Hostel Rules & Regulations",
            items: [
                "Hostel admission is mandatory for all B.Tech students",
                "Ragging is strictly prohibited and punishable",
                "Hostel rules and regulations must be followed strictly",
                "Quiet hours must be observed during study time",
                "Visitors allowed only during specified visiting hours",
                "Students are responsible for their room cleanliness"
            ],
            rulesLink: "https://www.nitgoa.ac.in/static/Rules_of_NIT_Goa_Hostel_18July2022.pdf"
        },
        fees: {
            title: "Hostel Fee Information",
            description: "Hostel fees are separate from academic fees and include accommodation, mess charges, and other facilities. For detailed fee structure, please refer to the official fee document or contact the hostel office."
        },
        contact: {
            title: "B.Tech Hostel Office Contact",
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

                {/* Features Section */}
                <section className="programs-section">
                    <h2 className="section-title">Hostel Features & Amenities</h2>
                    <div className="program-section">
                        <div className="program-content">
                            <div className="program-features">
                                <h4>Available Facilities</h4>
                                <ul>
                                    {hostelData.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Room Facilities */}
                <section className="general-info-section">
                    <div className="general-info">
                        <h3>{hostelData.facilities.title}</h3>
                        <ul>
                            {hostelData.facilities.items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Rules Section */}
                <section className="general-info-section">
                    <div className="general-info">
                        <h3>{hostelData.rules.title}</h3>
                        <ul>
                            {hostelData.rules.items.map((rule, index) => (
                                <li key={index}>{rule}</li>
                            ))}
                        </ul>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button 
                                onClick={() => handlePDFOpen(hostelData.rules.rulesLink)}
                                className="hostel-details-btn"
                            >
                                Download Complete Hostel Rules (PDF)
                            </button>
                        </div>
                    </div>
                </section>

                {/* Fee Information */}
                <section className="general-info-section">
                    <div className="general-info">
                        <h3>{hostelData.fees.title}</h3>
                        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--gray-700)', lineHeight: '1.7' }}>
                            {hostelData.fees.description}
                        </p>
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

export default BTechHostel;
