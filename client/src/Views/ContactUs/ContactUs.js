import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
    return (
        <div className="contactus-page">
            <div className="contactus-container">
                <div className="contactus-page-header">
                    <h1>Contact Us</h1>
                    <p className="contactus-page-subtitle">Get in Touch with NIT Goa</p>
                </div>

                <div className="contactus-content">
                    <section className="contactus-section contactus-main-section">
                        <h2>Institute Address</h2>
                        <div className="contactus-main-card">
                            <div className="contactus-info">
                                <h3>National Institute of Technology Goa</h3>
                                <p className="contactus-address">
                                    Kottamoll Plateau, Cuncolim Municipal Area,<br/>
                                    Salcete Taluka, South Goa District,<br/>
                                    Goa - 403703, India
                                </p>
                                <div className="contactus-details">
                                    <div className="contactus-item">
                                        <div className="contactus-item-text">
                                            <span className="contactus-item-label">Phone</span>
                                            <span className="contactus-item-value">+91-832-2404200</span>
                                        </div>
                                    </div>
                                    <div className="contactus-item">
                                        <div className="contactus-item-text">
                                            <span className="contactus-item-label">Email</span>
                                            <span className="contactus-item-value">registrar@nitgoa.ac.in</span>
                                        </div>
                                    </div>
                                    <div className="contactus-item">
                                        <div className="contactus-item-text">
                                            <span className="contactus-item-label">Website</span>
                                            <span className="contactus-item-value">www.nitgoa.ac.in</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contactus-map-placeholder">
                                <div className="contactus-map-content">
                                    <h4>Location Map</h4>
                                    <div className="contactus-map-container">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.5789!2d74.0121875!3d15.1691875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbe4dade7a19b97%3A0x9db46cb6ea1d0d3f!2sNational%20Institute%20of%20Technology%20Goa!5e0!3m2!1sen!2sin!4v1640995200000!5m2!1sen!2sin"
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
                                        Latitude: 15.1691875° N<br/>
                                        Longitude: 74.0121875° E
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="contactus-section contactus-departments-section">
                        <h2>Department Contacts</h2>
                        <div className="contactus-departments-grid">
                            <div className="contactus-department-card">
                                <h3>Computer Science & Engineering</h3>
                                <p><strong>HOD:</strong> Dr. Veena Thenkanidiyoor</p>
                                <p><strong>Email:</strong> veenat@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> 0832-2404432</p>
                            </div>
                            
                            <div className="contactus-department-card">
                                <h3>Electronics & Communication Engineering</h3>
                                <p><strong>HOD:</strong> Dr. T. Veerakumar</p>
                                <p><strong>Email:</strong> tveerakumar@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong>  0832-2404520</p>
                            </div>
                            
                            <div className="contactus-department-card">
                                <h3>Electrical & Electronics Engineering</h3>
                                <p><strong>HOD:</strong> Dr. Suresh Mikkili</p>
                                <p><strong>Email:</strong> mikkili.suresh@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> 0832-2404645</p>
                            </div>
                            
                            <div className="contactus-department-card">
                                <h3>Mechanical Engineering</h3>
                                <p><strong>HOD:</strong> Dr. Prasenjit Dey</p>
                                <p><strong>Email:</strong>  prasenjit.dey@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> 0832-2404834</p>
                            </div>
                            
                            <div className="contactus-department-card">
                                <h3>Civil Engineering</h3>
                                <p><strong>HOD:</strong> Dr. Harikumar M</p>
                                <p><strong>Email:</strong> harikumar@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> 0832-2404846</p>
                            </div>
                            
                            <div className="contactus-department-card">
                                <h3> Humanities & Social Sciences & Applied Sciences</h3>
                                <p><strong>HOD:</strong> Dr. L. Shangerganesh</p>
                                <p><strong>Email:</strong> shangerganesh@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong>0832-2404728</p>
                            </div>
                            
                            
                        </div>
                    </section>

                    <section className="contactus-section contactus-administration-section">
                        <h2>Administration</h2>
                        <div className="contactus-administration-grid">
                            <div className="contactus-admin-card">
                                <h3>Director's Office</h3>
                                <p><strong>Director:</strong> Prof. G. Santhosh Kumar</p>
                                <p><strong>Email:</strong> director@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404201</p>
                            </div>
                            
                            <div className="contactus-admin-card">
                                <h3>Registrar's Office</h3>
                                <p><strong>Registrar:</strong> [Name]</p>
                                <p><strong>Email:</strong> registrar@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404200</p>
                            </div>
                            
                            <div className="contactus-admin-card">
                                <h3>Dean (Academic Affairs)</h3>
                                <p><strong>Dean:</strong> Dr. [Name]</p>
                                <p><strong>Email:</strong> dean.acad@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404210</p>
                            </div>
                            
                            <div className="contactus-admin-card">
                                <h3>Dean (Student Affairs)</h3>
                                <p><strong>Dean:</strong> Dr. [Name]</p>
                                <p><strong>Email:</strong> dean.student@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404220</p>
                            </div>
                        </div>
                    </section>

                    <section className="contactus-section contactus-services-section">
                        <h2>Important Services</h2>
                        <div className="contactus-services-grid">
                            <div className="contactus-service-card">
                                <h3>Admissions Office</h3>
                                <p><strong>Email:</strong> admissions@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404300</p>
                                <p>For B.Tech, M.Tech, and Ph.D. admission queries</p>
                            </div>
                            
                            <div className="contactus-service-card">
                                <h3>Training & Placement Cell</h3>
                                <p><strong>Email:</strong> placement@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404310</p>
                                <p>For placement and internship opportunities</p>
                            </div>
                            
                            <div className="contactus-service-card">
                                <h3>Library</h3>
                                <p><strong>Email:</strong> library@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404320</p>
                                <p>For library services and digital resources</p>
                            </div>
                            
                            <div className="contactus-service-card">
                                <h3>IT Services</h3>
                                <p><strong>Email:</strong> itservices@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404330</p>
                                <p>For technical support and IT infrastructure</p>
                            </div>
                            
                            <div className="contactus-service-card">
                                <h3>Accounts Office</h3>
                                <p><strong>Email:</strong> accounts@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404340</p>
                                <p>For fee payments and financial matters</p>
                            </div>
                            
                            <div className="contactus-service-card">
                                <h3>Medical Centre</h3>
                                <p><strong>Email:</strong> medical@nitgoa.ac.in</p>
                                <p><strong>Phone:</strong> +91-832-2404350</p>
                                <p>For health services and medical emergencies</p>
                            </div>
                        </div>
                    </section>

                    <section className="contactus-section contactus-transport-section">
                        <h2>How to Reach NIT Goa</h2>
                        <div className="contactus-transport-grid">
                            <div className="contactus-transport-card">
                                <div className="contactus-transport-icon">✈️</div>
                                <h3>By Air</h3>
                                <div className="contactus-transport-details">
                                    <p><strong>Dabolim Airport (Vasco)</strong></p>
                                    <p>Distance: 38 km (45 minutes by car)</p>
                                    <p>Domestic and international flights</p>
                                </div>
                                <div className="contactus-transport-details">
                                    <p><strong>Manohar International Airport (Mopa)</strong></p>
                                    <p>Distance: 77 km (1 hour 30 minutes by car)</p>
                                    <p>New international airport</p>
                                </div>
                            </div>
                            
                            <div className="contactus-transport-card">
                                <div className="contactus-transport-icon">🚂</div>
                                <h3>By Train</h3>
                                <div className="contactus-transport-details">
                                    <p><strong>Madgaon Railway Station</strong></p>
                                    <p>Distance: 15 km (25 minutes by car)</p>
                                    <p>Major railway junction with good connectivity</p>
                                </div>
                                <div className="contactus-transport-details">
                                    <p><strong>Vasco da Gama Railway Station</strong></p>
                                    <p>Distance: 40 km (50 minutes by car)</p>
                                    <p>Alternative railway station</p>
                                </div>
                            </div>
                            
                            <div className="contactus-transport-card">
                                <div className="contactus-transport-icon">🚌</div>
                                <h3>By Road</h3>
                                <div className="contactus-transport-details">
                                    <p><strong>NH 66 (Goa Highway)</strong></p>
                                    <p>Well connected by state and private buses</p>
                                    <p>Regular services from major cities</p>
                                </div>
                                <div className="contactus-transport-details">
                                    <p><strong>From Margao:</strong> 15 km</p>
                                    <p><strong>From Panaji:</strong> 45 km</p>
                                    <p><strong>From Vasco:</strong> 40 km</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    

                    

                    <section className="contactus-section contactus-social-media-section">
                        <h2>Connect With Us</h2>
                        <div className="contactus-social-media-links">
                            <div className="contactus-social-platform">
                                <div>
                                    <h4>
                                        <a href="https://x.com/NITGoa_Official" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                                            Twitter/X
                                        </a>
                                    </h4>
                                    <p>@NITGoa_Official</p>
                                </div>
                            </div>
                            <div className="contactus-social-platform">
                                <div>
                                    <h4>
                                        <a href="https://www.linkedin.com/school/nitgoa/" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                                            LinkedIn
                                        </a>
                                    </h4>
                                    <p>National Institute of Technology Goa</p>
                                </div>
                            </div>
                            <div className="contactus-social-platform">
                                <div>
                                    <h4>
                                        <a href="https://www.youtube.com/c/NationalInstituteofTechnologyGoa" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                                            YouTube
                                        </a>
                                    </h4>
                                    <p>National Institute of Technology Goa</p>
                                </div>
                            </div>
                            <div className="contactus-social-platform">
                                <div>
                                    <h4>
                                        <a href="https://www.instagram.com/nitgoa/?hl=en" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                                            Instagram
                                        </a>
                                    </h4>
                                    <p>@nitgoa</p>
                                </div>
                            </div>
                            <div className="contactus-social-platform">
                                <div>
                                    <h4>
                                        <a href="https://www.facebook.com/nitgoa/" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                                            Facebook
                                        </a>
                                    </h4>
                                    <p>@nitgoa</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;