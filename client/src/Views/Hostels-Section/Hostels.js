import React, { useState, useEffect } from 'react';
import './Hostels.css';
import hostelData from './hostel.json';

// Gallery Slider Component
const GallerySlider = ({ event }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === event.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? event.images.length - 1 : prev - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="hostels-gallery-section">
            <h3 className="hostels-gallery-title">{event.name}</h3>
            <div className="hostels-gallery-slider">
                <div className="hostels-slider-container">
                    <button className="hostels-slider-btn hostels-slider-prev" onClick={prevImage}>
                        ❮
                    </button>
                    <div className="hostels-slider-main">
                        <img 
                            src={event.images[currentImageIndex].link} 
                            alt={`${event.name} ${currentImageIndex + 1}`}
                            className="hostels-slider-image"
                        />
                        <div className="hostels-slider-overlay">
                            <span className="hostels-image-counter">
                                {currentImageIndex + 1} / {event.images.length}
                            </span>
                        </div>
                    </div>
                    <button className="hostels-slider-btn hostels-slider-next" onClick={nextImage}>
                        ❯
                    </button>
                </div>
                <div className="hostels-slider-dots">
                    {event.images.map((_, index) => (
                        <button
                            key={index}
                            className={`hostels-slider-dot ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Hostels = () => {
    const [activeSection, setActiveSection] = useState('About');

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'About':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>About the Hostels</h2>
                            <p>Comprehensive information about hostel facilities and living at NIT Goa</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-about-card">
                                <h3 className="hostels-about-title">{hostelData.about.title}</h3>
                                <p className="hostels-about-description">{hostelData.about.description}</p>
                            </div>
                        </div>
                    </div>
                );

            case 'Facilities':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Hostel Facilities</h2>
                            <p>Comprehensive facilities and amenities for comfortable student living</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            {hostelData.facilities.map((facility, index) => (
                                <div key={index} className="hostels-facility-card">
                                    {facility.title && (
                                        <>
                                            <h3 className="hostels-facility-title">{facility.title}</h3>
                                            <p className="hostels-facility-description">{facility.description}</p>
                                            {facility.image_url && (
                                                <div className="hostels-facility-image">
                                                    <img src={facility.image_url} alt={facility.title} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {facility.documents && (
                                        <div className="hostels-documents-section">
                                            <h4>Important Documents</h4>
                                            <div className="hostels-documents-grid">
                                                {facility.documents.map((doc, docIndex) => (
                                                    <a 
                                                        key={docIndex} 
                                                        href={doc.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="hostels-document-card"
                                                    >
                                                        <div className="hostels-document-icon">📄</div>
                                                        <span className="hostels-document-title">{doc.title}</span>
                                                        <div className="hostels-download-icon">⬇️</div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'People':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Hostel Wardens & Staff</h2>
                            <p>Meet our dedicated hostel administration team</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-faculty-grid">
                                {hostelData.people.faculty.map((person, index) => (
                                    <div key={index} className="hostels-faculty-card">
                                        <h3 className="hostels-faculty-name">{person.name}</h3>
                                        <p className="hostels-faculty-designation">{person.designation}</p>
                                        <div className="hostels-faculty-details">
                                            <div className="hostels-faculty-detail">
                                                <strong>Location:</strong>
                                                <span>{person.location}</span>
                                            </div>
                                            <div className="hostels-faculty-detail">
                                                <strong>Email:</strong>
                                                <a href={`mailto:${person.email}`}>{person.email}</a>
                                            </div>
                                            <div className="hostels-faculty-detail">
                                                <strong>Phone:</strong>
                                                <span>{person.phone}</span>
                                            </div>
                                            <div className="hostels-faculty-detail">
                                                <strong>Available:</strong>
                                                <span>{person.availability}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'Fee Structure':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Fee Structure</h2>
                            <p>Hostel accommodation fee details and payment information</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-fee-container">
                                <div className="hostels-fee-card">
                                    <div className="hostels-fee-icon">💰</div>
                                    <h3>Hostel Fee Information</h3>
                                    <p>Access comprehensive details about hostel fees, payment schedules, refund policies, and financial procedures for both boys' and girls' hostels.</p>
                                    <div className="hostels-fee-features">
                                        <div className="hostels-fee-feature">
                                            <span className="hostels-feature-icon">📊</span>
                                            <span>Detailed Fee Breakdown</span>
                                        </div>
                                        <div className="hostels-fee-feature">
                                            <span className="hostels-feature-icon">📅</span>
                                            <span>Payment Schedules</span>
                                        </div>
                                        <div className="hostels-fee-feature">
                                            <span className="hostels-feature-icon">💳</span>
                                            <span>Refund Policies</span>
                                        </div>
                                    </div>
                                    <a 
                                        href={hostelData.fee_structure.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hostels-fee-download-btn"
                                    >
                                        <span>📄</span>
                                        Download Fee Structure
                                        <span>⬇️</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Forms & Formats':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Forms & Formats</h2>
                            <p>Essential forms and documents for hostel admission and administration</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-forms-container">
                                <div className="hostels-forms-intro">
                                    <h3>📋 Download Required Forms</h3>
                                    <p>Click on any form below to download the PDF document directly</p>
                                </div>
                                <div className="hostels-forms-grid">
                                    {hostelData.forms_and_formats.map((form, index) => (
                                        <a 
                                            key={index} 
                                            href={form.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hostels-form-card"
                                        >
                                            <div className="hostels-form-header">
                                                <div className="hostels-form-icon">�</div>
                                                <div className="hostels-form-number">{String(index + 1).padStart(2, '0')}</div>
                                            </div>
                                            <div className="hostels-form-content">
                                                <h4 className="hostels-form-title">{form.title}</h4>
                                                <div className="hostels-form-action">
                                                    <span>Download PDF</span>
                                                    <div className="hostels-download-icon">⬇️</div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Guest Accommodation':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Guest Accommodation</h2>
                            <p>Accommodation facilities for visitors and guests</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-guest-container">
                                <div className="hostels-guest-info">
                                    <p className="hostels-guest-description">{hostelData.guest_accommodation.description}</p>
                                    
                                    <div className="hostels-charges-section">
                                        <h4>Accommodation Charges</h4>
                                        <div className="hostels-charges-grid">
                                            {hostelData.guest_accommodation.charges.map((charge, index) => (
                                                <div key={index} className="hostels-charge-card">
                                                    <h5>{charge.category}</h5>
                                                    <p className="hostels-charge-rate">{charge.rate}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="hostels-guest-actions">
                                    <div className="hostels-booking-section">
                                        <h4>📋 Booking Information</h4>
                                        <p>{hostelData.guest_accommodation.form.text}</p>
                                        <a 
                                            href={hostelData.guest_accommodation.form.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hostels-booking-btn"
                                        >
                                            <span>📄</span>
                                            Book Accommodation
                                            <span>🔗</span>
                                        </a>
                                    </div>

                                    <div className="hostels-contact-section">
                                        <h4>📞 Contact Information</h4>
                                        <p>{hostelData.guest_accommodation.contact.text}</p>
                                        <div className="hostels-contact-details">
                                            <p><strong>{hostelData.guest_accommodation.contact.name}</strong></p>
                                            <a href={`mailto:${hostelData.guest_accommodation.contact.email}`}>
                                                {hostelData.guest_accommodation.contact.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Gallery':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Gallery</h2>
                            <p>Glimpses of hostel life and celebrations</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            {hostelData.gallery.map((event, index) => (
                                <GallerySlider key={index} event={event} />
                            ))}
                        </div>
                    </div>
                );

            case 'Contact Us':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Contact Us</h2>
                            <p>Get in touch with hostel administration</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-contact-info">
                                <div className="hostels-contacts-grid">
                                    {hostelData.contact_us.contacts.map((contact, index) => (
                                        <div key={index} className="hostels-contact-card">
                                            <h4>{contact.name}</h4>
                                            <p className="hostels-contact-title">{contact.title}</p>
                                            {contact.phone && (
                                                <p className="hostels-contact-detail">
                                                    <strong>Phone:</strong> {contact.phone}
                                                </p>
                                            )}
                                            {contact.email && (
                                                <p className="hostels-contact-detail">
                                                    <strong>Email:</strong> 
                                                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="hostels-address-section">
                                    <h4>Address</h4>
                                    <p className="hostels-address">{hostelData.contact_us.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Section not found</div>;
        }
    };

    return (
        <div className="hostels-page">
            <div className="hostels-page-header">
                <div className="hostels-header-content">
                    <h1>Hostels</h1>
                    <p className="hostels-page-subtitle">Home Away From Home - Quality accommodation and vibrant community life at NIT Goa</p>
                </div>
            </div>

            <div className="hostels-container">
                <div className="hostels-main-layout">
                    <nav className="hostels-sidebar">
                        <ul className="hostels-nav-list">
                            {['About', ...hostelData.navbar_menu].map((item, index) => (
                                <li key={index} className="hostels-nav-item">
                                    <button
                                        className={`hostels-nav-link ${activeSection === item ? 'hostels-nav-active' : ''}`}
                                        onClick={() => handleSectionChange(item)}
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <main className="hostels-content">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Hostels;
