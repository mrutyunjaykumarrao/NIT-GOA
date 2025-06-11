import React from 'react';
import './Facilities.css';

const Facilities = () => {
    return (
        <div className="facilities-page">
            <div className="facilities-container">
                <div className="page-header">
                    <h1>Facilities</h1>
                    <p className="page-subtitle">World-class Infrastructure for Academic Excellence</p>
                </div>

                <section className="facilities-overview">
                    <div className="overview-content">
                        <h2>Campus Infrastructure</h2>
                        <p>
                            NIT Goa is equipped with state-of-the-art facilities spread across a sprawling 150-acre campus. 
                            Our infrastructure supports academic excellence, research innovation, and holistic student development. 
                            From modern laboratories to comfortable residential facilities, every aspect is designed to provide 
                            an enriching educational experience.
                        </p>
                    </div>
                </section>

                <section className="academic-facilities">
                    <h2>Academic Facilities</h2>
                    <div className="facilities-grid">
                        <div className="facility-card featured">
                            <div className="facility-icon">🏫</div>
                            <h3>Academic Buildings</h3>
                            <div className="facility-details">
                                <p>Modern academic complexes with state-of-the-art classrooms and lecture halls</p>
                                <ul>
                                    <li>Smart Classrooms with Audio-Visual Systems</li>
                                    <li>Wi-Fi Enabled Campus</li>
                                    <li>Air-Conditioned Lecture Halls</li>
                                    <li>Interactive Projectors and Smart Boards</li>
                                    <li>Video Conferencing Facilities</li>
                                </ul>
                            </div>
                        </div>

                        <div className="facility-card">
                            <div className="facility-icon">🔬</div>
                            <h3>Laboratories</h3>
                            <div className="facility-details">
                                <p>Well-equipped laboratories for all engineering disciplines</p>
                                <ul>
                                    <li>Computer Science & Programming Labs</li>
                                    <li>Electronics & Communication Labs</li>
                                    <li>Electrical Engineering Labs</li>
                                    <li>Mechanical Engineering Workshops</li>
                                    <li>Civil Engineering Testing Labs</li>
                                    <li>Physics & Chemistry Labs</li>
                                </ul>
                            </div>
                        </div>

                        <div className="facility-card">
                            <div className="facility-icon">📚</div>
                            <h3>Central Library</h3>
                            <div className="facility-details">
                                <p>Comprehensive collection of books, journals, and digital resources</p>
                                <ul>
                                    <li>Over 50,000 Books and Journals</li>
                                    <li>Digital Library with e-Resources</li>
                                    <li>IEEE, ACM, Springer Digital Collections</li>
                                    <li>Reading Rooms and Study Areas</li>
                                    <li>24/7 Access for Research Scholars</li>
                                </ul>
                            </div>
                        </div>

                        <div className="facility-card">
                            <div className="facility-icon">💻</div>
                            <h3>Computing Facilities</h3>
                            <div className="facility-details">
                                <p>High-performance computing resources for research and learning</p>
                                <ul>
                                    <li>High-Performance Computing Cluster</li>
                                    <li>Advanced Programming Labs</li>
                                    <li>Software Development Centers</li>
                                    <li>Network Infrastructure</li>
                                    <li>24/7 Internet Connectivity</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="research-facilities">
                    <h2>Research Facilities</h2>
                    <div className="research-grid">
                        <div className="research-card">
                            <h3>Advanced Instrumentation Lab</h3>
                            <p>State-of-the-art equipment for materials characterization and analysis</p>
                            <div className="equipment-list">
                                <span>SEM</span>
                                <span>XRD</span>
                                <span>FTIR</span>
                                <span>UV-Vis Spectroscopy</span>
                                <span>Thermal Analysis</span>
                            </div>
                        </div>

                        <div className="research-card">
                            <h3>Innovation & Incubation Center</h3>
                            <p>Supporting startup development and technology transfer</p>
                            <div className="equipment-list">
                                <span>Prototyping Lab</span>
                                <span>3D Printing</span>
                                <span>Electronics Workshop</span>
                                <span>Design Studio</span>
                                <span>Testing Facilities</span>
                            </div>
                        </div>

                        <div className="research-card">
                            <h3>Environmental Lab</h3>
                            <p>Facilities for environmental monitoring and research</p>
                            <div className="equipment-list">
                                <span>Water Quality Testing</span>
                                <span>Air Quality Monitoring</span>
                                <span>Soil Analysis</span>
                                <span>Waste Management</span>
                                <span>Renewable Energy Systems</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="residential-facilities">
                    <h2>Residential Facilities</h2>
                    <div className="residential-grid">
                        <div className="hostel-card boys">
                            <div className="hostel-header">
                                <h3>Boys Hostels</h3>
                                <div className="capacity">4 Blocks</div>
                            </div>
                            <div className="hostel-features">
                                <ul>
                                    <li>Single & Double Occupancy Rooms</li>
                                    <li>Attached Bathrooms</li>
                                    <li>Wi-Fi Connectivity</li>
                                    <li>Common Rooms & TV Lounges</li>
                                    <li>Study Rooms</li>
                                    <li>Mess Facilities</li>
                                    <li>Laundry Services</li>
                                    <li>24/7 Security</li>
                                </ul>
                            </div>
                        </div>

                        <div className="hostel-card girls">
                            <div className="hostel-header">
                                <h3>Girls Hostels</h3>
                                <div className="capacity">2 Blocks</div>
                            </div>
                            <div className="hostel-features">
                                <ul>
                                    <li>Secure Accommodation</li>
                                    <li>Single & Double Occupancy</li>
                                    <li>Modern Amenities</li>
                                    <li>Recreation Facilities</li>
                                    <li>Study Areas</li>
                                    <li>Separate Mess</li>
                                    <li>Medical Facilities</li>
                                    <li>24/7 Wardens</li>
                                </ul>
                            </div>
                        </div>

                        <div className="hostel-card guest">
                            <div className="hostel-header">
                                <h3>Guest House</h3>
                                <div className="capacity">20 Rooms</div>
                            </div>
                            <div className="hostel-features">
                                <ul>
                                    <li>AC & Non-AC Rooms</li>
                                    <li>Family Accommodation</li>
                                    <li>Conference Facilities</li>
                                    <li>Dining Hall</li>
                                    <li>Parking Facilities</li>
                                    <li>24/7 Reception</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="sports-facilities">
                    <h2>Sports & Recreation</h2>
                    <div className="sports-grid">
                        <div className="sports-category">
                            <h3>Outdoor Sports</h3>
                            <div className="sports-items">
                                <div className="sport-item">
                                    <span className="sport-icon">🏏</span>
                                    <span>Cricket Ground</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">⚽</span>
                                    <span>Football Field</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🏀</span>
                                    <span>Basketball Court</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🎾</span>
                                    <span>Tennis Court</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🏐</span>
                                    <span>Volleyball Court</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🏃</span>
                                    <span>Track & Field</span>
                                </div>
                            </div>
                        </div>

                        <div className="sports-category">
                            <h3>Indoor Sports</h3>
                            <div className="sports-items">
                                <div className="sport-item">
                                    <span className="sport-icon">🏓</span>
                                    <span>Table Tennis</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🏸</span>
                                    <span>Badminton</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🎱</span>
                                    <span>Billiards</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">♟️</span>
                                    <span>Chess</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🏋️</span>
                                    <span>Gymnasium</span>
                                </div>
                                <div className="sport-item">
                                    <span className="sport-icon">🏊</span>
                                    <span>Swimming Pool</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="support-facilities">
                    <h2>Support Services</h2>
                    <div className="support-grid">
                        <div className="support-card">
                            <div className="support-icon">🏥</div>
                            <h3>Medical Center</h3>
                            <p>24/7 medical assistance with qualified doctors and nurses</p>
                            <ul>
                                <li>Emergency Medical Services</li>
                                <li>Regular Health Check-ups</li>
                                <li>Pharmacy</li>
                                <li>Ambulance Service</li>
                            </ul>
                        </div>

                        <div className="support-card">
                            <div className="support-icon">🍽️</div>
                            <h3>Dining Facilities</h3>
                            <p>Multiple dining options with variety of cuisines</p>
                            <ul>
                                <li>Student Mess (Veg & Non-Veg)</li>
                                <li>Faculty Dining Hall</li>
                                <li>Food Court</li>
                                <li>Cafeteria</li>
                            </ul>
                        </div>

                        <div className="support-card">
                            <div className="support-icon">🏪</div>
                            <h3>Campus Store</h3>
                            <p>Essential supplies and academic materials</p>
                            <ul>
                                <li>Stationery Items</li>
                                <li>Books & Supplies</li>
                                <li>Electronics</li>
                                <li>Daily Necessities</li>
                            </ul>
                        </div>

                        <div className="support-card">
                            <div className="support-icon">🚌</div>
                            <h3>Transportation</h3>
                            <p>Campus shuttle and local transportation services</p>
                            <ul>
                                <li>Campus Shuttle Service</li>
                                <li>Bus Connectivity</li>
                                <li>Parking Facilities</li>
                                <li>Two-Wheeler Parking</li>
                            </ul>
                        </div>

                        <div className="support-card">
                            <div className="support-icon">🏦</div>
                            <h3>Banking Services</h3>
                            <p>On-campus banking and financial services</p>
                            <ul>
                                <li>ATM Facilities</li>
                                <li>Bank Branch</li>
                                <li>Online Banking</li>
                                <li>Financial Transactions</li>
                            </ul>
                        </div>

                        <div className="support-card">
                            <div className="support-icon">🔒</div>
                            <h3>Security</h3>
                            <p>24/7 campus security and safety measures</p>
                            <ul>
                                <li>CCTV Surveillance</li>
                                <li>Security Personnel</li>
                                <li>Access Control</li>
                                <li>Emergency Response</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="sustainability">
                    <h2>Sustainability Initiatives</h2>
                    <div className="sustainability-content">
                        <div className="sustainability-grid">
                            <div className="sustainability-item">
                                <div className="sustainability-icon">🌱</div>
                                <h3>Green Campus</h3>
                                <p>Eco-friendly practices and sustainable development</p>
                            </div>
                            <div className="sustainability-item">
                                <div className="sustainability-icon">💧</div>
                                <h3>Water Conservation</h3>
                                <p>Rainwater harvesting and water recycling systems</p>
                            </div>
                            <div className="sustainability-item">
                                <div className="sustainability-icon">♻️</div>
                                <h3>Waste Management</h3>
                                <p>Segregation, recycling, and composting programs</p>
                            </div>
                            <div className="sustainability-item">
                                <div className="sustainability-icon">☀️</div>
                                <h3>Solar Energy</h3>
                                <p>Solar panels and renewable energy initiatives</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Facilities;
