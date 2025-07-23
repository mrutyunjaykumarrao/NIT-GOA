import React, { useState, useEffect } from 'react';
import './Hostels.css';
import hostelData from './hostel.json';

const Hostels = () => {
    const [activeSection, setActiveSection] = useState('Facilities');

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const renderContent = () => {
        switch (activeSection) {
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
                                                <strong>Location:</strong> {person.location}
                                            </div>
                                            <div className="hostels-faculty-detail">
                                                <strong>Email:</strong> 
                                                <a href={`mailto:${person.email}`}>{person.email}</a>
                                            </div>
                                            <div className="hostels-faculty-detail">
                                                <strong>Phone:</strong> {person.phone}
                                            </div>
                                            <div className="hostels-faculty-detail">
                                                <strong>Availability:</strong> {person.availability}
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
                            <div className="hostels-fee-card">
                                <h3>Hostel Fee Information</h3>
                                <p>For detailed fee structure and payment schedules, please refer to the official document.</p>
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
                );

            case 'Forms & Formats':
                return (
                    <div className="hostels-section">
                        <div className="hostels-section-header">
                            <h2>Forms & Formats</h2>
                            <p>Essential forms and documents for hostel admission and administration</p>
                        </div>
                        <div className="hostels-content-wrapper">
                            <div className="hostels-forms-grid">
                                {hostelData.forms_and_formats.map((form, index) => (
                                    <a 
                                        key={index} 
                                        href={form.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hostels-form-card"
                                    >
                                        <div className="hostels-form-icon">📋</div>
                                        <span className="hostels-form-title">{form.title}</span>
                                        <div className="hostels-download-icon">⬇️</div>
                                    </a>
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
                            <p>Accommodation facilities for visitors and guests</p>
                        </div>
                        <div className="hostels-content-wrapper">
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

                                <div className="hostels-booking-section">
                                    <h4>Booking Information</h4>
                                    <p>{hostelData.guest_accommodation.form.text}</p>
                                    <a 
                                        href={hostelData.guest_accommodation.form.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hostels-booking-btn"
                                    >
                                        Download Booking Form
                                    </a>
                                </div>

                                <div className="hostels-contact-section">
                                    <h4>Contact Information</h4>
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
                                <div key={index} className="hostels-gallery-section">
                                    <h3 className="hostels-gallery-title">{event.name}</h3>
                                    <div className="hostels-gallery-grid">
                                        {event.images.map((image, imgIndex) => (
                                            <div key={imgIndex} className="hostels-gallery-item">
                                                <img src={image.link} alt={`${event.name} ${imgIndex + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
        <div className="hostels-page" data-theme="dark">
            <div className="hostels-page-header">
                <div className="hostels-header-content">
                    <h1>Hostels</h1>
                    <p className="hostels-page-subtitle">{hostelData.about.description}</p>
                </div>
            </div>

            <div className="hostels-container">
                <div className="hostels-main-layout">
                    <nav className="hostels-sidebar">
                        <ul className="hostels-nav-list">
                            {hostelData.navbar_menu.map((item, index) => (
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
