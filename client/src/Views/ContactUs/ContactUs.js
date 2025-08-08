import React from 'react';
import './ContactUs.css';
import useScrollToTop from '../../utils/useScrollToTop';
import contactUsData from './contactUs.json';

const ContactUs = () => {
    // Handle smooth scroll to top for quick link navigation
    useScrollToTop();
    
    return (
        <div className="contactus-page">
            <div className="contactus-container">
                <div className="contactus-page-header">
                    <h1>{contactUsData.page_header.title}</h1>
                    <p className="contactus-page-subtitle">{contactUsData.page_header.subtitle}</p>
                </div>

                <div className="contactus-content">
                    <section className="contactus-section contactus-main-section">
                        <h2>{contactUsData.institute_address.section_title}</h2>
                        <div className="contactus-main-card">
                            <div className="contactus-info">
                                <h3>{contactUsData.institute_address.name}</h3>
                                <p className="contactus-address">
                                    {contactUsData.institute_address.address.map((line, index) => (
                                        <span key={index}>
                                            {line}
                                            {index < contactUsData.institute_address.address.length - 1 && <br/>}
                                        </span>
                                    ))}
                                </p>
                                <div className="contactus-details">
                                    {contactUsData.institute_address.contact_details.map((detail, index) => (
                                        <div key={index} className="contactus-item">
                                            <div className="contactus-item-text">
                                                <span className="contactus-item-label">{detail.label}</span>
                                                <span className="contactus-item-value">{detail.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="contactus-map-placeholder">
                                <div className="contactus-map-content">
                                    <h4>{contactUsData.institute_address.map.title}</h4>
                                    <div className="contactus-map-container">
                                        <iframe
                                            src={contactUsData.institute_address.map.embed_url}
                                            width="100%"
                                            height="300"
                                            style={{ border: 0, borderRadius: '12px' }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="NIT Goa Location Map"
                                        ></iframe>
                                    </div>
                                    <div className="contactus-coordinates">
                                        <strong>Coordinates:</strong><br/>
                                        Latitude: {contactUsData.institute_address.map.coordinates.latitude}<br/>
                                        Longitude: {contactUsData.institute_address.map.coordinates.longitude}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="contactus-section contactus-departments-section">
                        <h2>{contactUsData.departments.section_title}</h2>
                        <div className="contactus-departments-grid">
                            {contactUsData.departments.list.map((department, index) => (
                                <div key={index} className="contactus-department-card">
                                    <h3>{department.name}</h3>
                                    <p><strong>HOD:</strong> {department.hod}</p>
                                    <p><strong>Email:</strong> {department.email}</p>
                                    <p><strong>Phone:</strong> {department.phone}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="contactus-section contactus-administration-section">
                        <h2>{contactUsData.administration.section_title}</h2>
                        <div className="contactus-administration-grid">
                            {contactUsData.administration.list.map((admin, index) => (
                                <div key={index} className="contactus-admin-card">
                                    <h3>{admin.title}</h3>
                                    <p><strong>{admin.designation}:</strong> {admin.name}</p>
                                    <p><strong>Email:</strong> {admin.email}</p>
                                    <p><strong>Phone:</strong> {admin.phone}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="contactus-section contactus-services-section">
                        <h2>{contactUsData.services.section_title}</h2>
                        <div className="contactus-services-grid">
                            {contactUsData.services.list.map((service, index) => (
                                <div key={index} className="contactus-service-card">
                                    <h3>{service.title}</h3>
                                    <p><strong>Email:</strong> {service.email}</p>
                                    <p><strong>Phone:</strong> {service.phone}</p>
                                    <p>{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="contactus-section contactus-transport-section">
                        <h2>{contactUsData.transport.section_title}</h2>
                        <div className="contactus-transport-grid">
                            {contactUsData.transport.options.map((option, index) => (
                                <div key={index} className="contactus-transport-card">
                                    <div className="contactus-transport-icon">{option.icon}</div>
                                    <h3>{option.type}</h3>
                                    {option.details.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="contactus-transport-details">
                                            <p><strong>{detail.name}</strong></p>
                                            <p>{detail.distance}</p>
                                            {detail.description && <p>{detail.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>

                    

                    

                    <section className="contactus-section contactus-social-media-section">
                        <h2>{contactUsData.social_media.section_title}</h2>
                        <div className="contactus-social-media-links">
                            {contactUsData.social_media.platforms.map((platform, index) => (
                                <div key={index} className="contactus-social-platform">
                                    <div>
                                        <h4>
                                            <a href={platform.url} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                                                {platform.name}
                                            </a>
                                        </h4>
                                        <p>{platform.handle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;