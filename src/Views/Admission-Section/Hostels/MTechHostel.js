import React from 'react';
import '../../Hostels-Section/Hostel.css';

const MTechHostel = () => {
    
    const handlePDFOpen = (url) => {
        // Force direct PDF opening in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    const hostelData = {
        title: "M.Tech Hostel Accommodation",
        subtitle: "Premium Living for Postgraduate Students",
        description: "NIT Goa provides premium hostel facilities for M.Tech students with enhanced amenities designed for research-focused academic life and graduate studies.",
        features: [
            "Separate hostels for boys and girls",
            "Single/double occupancy rooms available",
            "High-speed internet connectivity",
            "Research-friendly study environment",
            "Quality mess with varied cuisine",
            "Common areas for academic discussions",
            "Proximity to research labs",
            "Guest room facilities for visitors",
            "24/7 security and surveillance",
            "Library access and study rooms",
            "Recreational facilities",
            "Laundry services"
        ],
        facilities: {
            title: "Room Facilities",
            items: [
                "Well-furnished rooms with premium fittings",
                "Individual study table with ergonomic chair",
                "High-speed internet connection in each room",
                "Attached washrooms with modern amenities",
                "Adequate storage space and wardrobe",
                "Air conditioning in select rooms",
                "Individual or shared accommodation options",
                "Power backup for uninterrupted studies"
            ]
        },
        research: {
            title: "Research Support Facilities",
            items: [
                "Dedicated study areas with extended hours",
                "Discussion rooms for group research",
                "Access to digital libraries and databases",
                "Proximity to department research labs",
                "Quiet zones for concentrated study",
                "Conference room access for presentations",
                "Printing and scanning facilities",
                "Research collaboration spaces"
            ]
        },
        rules: {
            title: "Hostel Rules & Regulations",
            items: [
                "Hostel admission available for all M.Tech students",
                "Priority accommodation for out-station students",
                "Ragging is strictly prohibited and punishable",
                "Research hours and quiet time must be respected",
                "Visitors allowed during specified visiting hours",
                "Thesis writing rooms available on request",
                "Students must maintain room cleanliness",
                "Academic discussions encouraged in common areas"
            ],
            rulesLink: "https://www.nitgoa.ac.in/static/Rules_mtech_hostel_20june16.pdf"
        },
        fees: {
            title: "Hostel Fee Information",
            description: "M.Tech hostel fees include accommodation charges, mess facilities, and research support amenities. Fee structure varies based on room type (single/double occupancy). For detailed fee information and payment procedures, please contact the hostel office or refer to the official fee structure document."
        },
        contact: {
            title: "M.Tech Hostel Office Contact",
            address: "National Institute of Technology Goa",
            location: "Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703",
            phone: "+91-832-2404202",
            email: "hostel@nitgoa.ac.in",
            additionalEmail: "mtech.hostel@nitgoa.ac.in"
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

                {/* Research Support */}
                <section className="general-info-section">
                    <div className="general-info">
                        <h3>{hostelData.research.title}</h3>
                        <ul>
                            {hostelData.research.items.map((item, index) => (
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
                                Download M.Tech Hostel Rules (PDF)
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
                                <span className="contact-label">General Email:</span>
                                <span className="contact-value">{hostelData.contact.email}</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">M.Tech Email:</span>
                                <span className="contact-value">{hostelData.contact.additionalEmail}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MTechHostel;
