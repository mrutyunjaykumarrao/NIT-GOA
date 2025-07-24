import React, { useState, useEffect } from 'react';
import './Hostels.css';
import hostelData from './hostel.json';

// Gallery Slider Component
const GallerySlider = ({ event }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoSliding, setIsAutoSliding] = useState(true);

    // Auto slide functionality
    useEffect(() => {
        if (!isAutoSliding || event.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => 
                prev === event.images.length - 1 ? 0 : prev + 1
            );
        }, 3000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [isAutoSliding, event.images.length]);

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

    const handleManualNavigation = (action) => {
        setIsAutoSliding(false); // Stop auto-slide when user manually navigates
        action();
        setTimeout(() => setIsAutoSliding(true), 8000); // Resume auto-slide after 8 seconds
    };

    return (
        <div className="hostels-gallery-section">
            <h3 className="hostels-gallery-title">{event.name}</h3>
            <div className="hostels-gallery-slider">
                <div className="hostels-slider-container">
                    <button 
                        className="hostels-slider-btn hostels-slider-prev" 
                        onClick={() => handleManualNavigation(prevImage)}
                    >
                        ❮
                    </button>
                    <div className="hostels-slider-main">
                        <img 
                            src={event.images[currentImageIndex].link} 
                            alt={`${event.name} ${currentImageIndex + 1}`}
                            className="hostels-slider-image"
                        />
                        <div className="hostels-slider-overlay">
                            <div className="hostels-auto-slide-indicator">
                                
                            </div>
                        </div>
                    </div>
                    <button 
                        className="hostels-slider-btn hostels-slider-next" 
                        onClick={() => handleManualNavigation(nextImage)}
                    >
                        ❯
                    </button>
                </div>
                <div className="hostels-slider-dots">
                    {event.images.map((_, index) => (
                        <button
                            key={index}
                            className={`hostels-slider-dot ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => handleManualNavigation(() => goToImage(index))}
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
        // Smooth scroll to top when changing sections
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'About':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>About the Hostels</h2>
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
                                                    <div key={docIndex} className="hostels-event-card">
                                                        <div className="hostels-event-content">
                                                            <span className="hostels-event-title">{doc.title}</span>
                                                        </div>
                                                        <a 
                                                            href={doc.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="hostels-pretty-download-btn"
                                                        >
                                                            <svg
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="20"
                                                                    height="16"
                                                                    x="2"
                                                                    y="3"
                                                                    rx="2"
                                                                    ry="2"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    fill="none"
                                                                />
                                                                <rect
                                                                    width="10"
                                                                    height="2"
                                                                    x="7"
                                                                    y="8"
                                                                    fill="currentColor"
                                                                />
                                                                <rect
                                                                    width="10"
                                                                    height="2"
                                                                    x="7"
                                                                    y="12"
                                                                    fill="currentColor"
                                                                />
                                                                <rect
                                                                    width="10"
                                                                    height="2"
                                                                    x="7"
                                                                    y="16"
                                                                    fill="currentColor"
                                                                />
                                                            </svg>
                                                            Download PDF
                                                        </a>
                                                    </div>
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
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-event-card">
                                <div className="hostels-event-content">
                                    <span className="hostels-event-title">Hostel Fee Information</span>
                                </div>
                                <a 
                                    href={hostelData.fee_structure.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hostels-pretty-download-btn"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            width="20"
                                            height="16"
                                            x="2"
                                            y="3"
                                            rx="2"
                                            ry="2"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                        <rect
                                            width="10"
                                            height="2"
                                            x="7"
                                            y="8"
                                            fill="currentColor"
                                        />
                                        <rect
                                            width="10"
                                            height="2"
                                            x="7"
                                            y="12"
                                            fill="currentColor"
                                        />
                                        <rect
                                            width="10"
                                            height="2"
                                            x="7"
                                            y="16"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Download PDF
                                </a>
                            </div>
                        </div>
                    </div>
                );

            case 'Forms & Formats':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Forms & Formats</h2>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-forms-grid">
                                {hostelData.forms_and_formats.map((form, index) => (
                                    <div key={index} className="hostels-event-card">
                                        <div className="hostels-event-content">
                                            <span className="hostels-event-title">{form.title}</span>
                                        </div>
                                        <a 
                                            href={form.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hostels-pretty-download-btn"
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <rect
                                                    width="20"
                                                    height="16"
                                                    x="2"
                                                    y="3"
                                                    rx="2"
                                                    ry="2"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    fill="none"
                                                />
                                                <rect
                                                    width="10"
                                                    height="2"
                                                    x="7"
                                                    y="8"
                                                    fill="currentColor"
                                                />
                                                <rect
                                                    width="10"
                                                    height="2"
                                                    x="7"
                                                    y="12"
                                                    fill="currentColor"
                                                />
                                                <rect
                                                    width="10"
                                                    height="2"
                                                    x="7"
                                                    y="16"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            Download PDF
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'Guest Accommodation':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Guest Accommodation</h2>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-guest-container">
                                <div className="hostels-guest-intro">
                                    <h3>{hostelData.guest_accommodation?.title || 'Guest Accommodation'}</h3>
                                    <p>{hostelData.guest_accommodation?.description || 'Information about guest accommodation facilities.'}</p>
                                </div>

                                <div className="hostels-guest-details">
                                    {hostelData.guest_accommodation?.contact && (
                                        <div className="hostels-contacts-section">
                                            <h4>Contact Information</h4>
                                            <div className="hostels-contacts-grid">
                                                <div className="hostels-contact-card">
                                                    <h5 className="hostels-contact-name">{hostelData.guest_accommodation.contact.name}</h5>
                                                    <div className="hostels-contact-details">
                                                        <div className="hostels-contact-detail">
                                                            <strong>Email:</strong>
                                                            <a href={`mailto:${hostelData.guest_accommodation.contact.email}`}>
                                                                {hostelData.guest_accommodation.contact.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <p className="hostels-contact-text">{hostelData.guest_accommodation.contact.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {hostelData.guest_accommodation?.charges && (
                                        <div className="hostels-charges-section">
                                            <h4>Accommodation Charges</h4>
                                            <div className="hostels-charges-grid">
                                                {hostelData.guest_accommodation.charges.map((charge, index) => (
                                                    <div key={index} className="hostels-charge-card">
                                                        <h5 className="hostels-charge-type">{charge.category}</h5>
                                                        <p className="hostels-charge-amount">{charge.rate}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {hostelData.guest_accommodation?.form && (
                                        <div className="hostels-form-section">
                                            <h4>Booking Form</h4>
                                            <div className="hostels-download-card">
                                                <div className="hostels-download-content">
                                                    <p>{hostelData.guest_accommodation.form.text}</p>
                                                    <a 
                                                        href={hostelData.guest_accommodation.form.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="pretty-download-btn"
                                                    >
                                                        Fill Booking Form
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-gallery-grid">
                                {hostelData.gallery.map((event, index) => (
                                    <GallerySlider key={index} event={event} />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'Contact Us':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Contact Us</h2>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-contact-container">
                                <div className="hostels-contacts-section">
                                    <h4>Contact Information</h4>
                                    <div className="hostels-contacts-grid">
                                        {hostelData.contact_us?.contacts?.map((contact, index) => (
                                            <div key={index} className="hostels-contact-card">
                                                <h5 className="hostels-contact-name">{contact.name}</h5>
                                                <p className="hostels-contact-role">{contact.title}</p>
                                                <div className="hostels-contact-details">
                                                    {contact.email && (
                                                        <div className="hostels-contact-detail">
                                                            <strong>Email:</strong>
                                                            <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                                        </div>
                                                    )}
                                                    {contact.phone && (
                                                        <div className="hostels-contact-detail">
                                                            <strong>Phone:</strong>
                                                            <span>{contact.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {hostelData.contact_us?.address && (
                                    <div className="hostels-address-section">
                                        <h4>Address</h4>
                                        <div className="hostels-address">
                                            <p>{hostelData.contact_us.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>About the Hostels</h2>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-about-card">
                                <h3 className="hostels-about-title">{hostelData.about.title}</h3>
                                <p className="hostels-about-description">{hostelData.about.description}</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="hostels-page">
            <header className="hostels-page-header">
                <div className="hostels-header-content">
                    <h1>Hostels</h1>
                    <p className="hostels-page-subtitle">
                        Experience comfortable and convenient hostel accommodation at NIT Goa
                    </p>
                </div>
            </header>

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
