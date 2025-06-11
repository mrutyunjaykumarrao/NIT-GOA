import React from 'react';
import './Campus.css';

const Campus = () => {
    return (
        <div className="campus-page">
            <div className="campus-container">
                <div className="page-header">
                    <h1>Campus Life</h1>
                    <p className="page-subtitle">Discover student activities, facilities, and vibrant campus culture at NIT Goa</p>
                </div>

                <section className="campus-facilities">
                    <h2>Campus Facilities</h2>
                    <div className="facilities-grid">
                        <div className="facility-card">
                            <h3>Academic Buildings</h3>
                            <p>Modern classrooms equipped with latest technology and audio-visual aids</p>
                            <ul>
                                <li>Smart Classrooms</li>
                                <li>Computer Labs</li>
                                <li>Engineering Workshops</li>
                                <li>Seminar Halls</li>
                            </ul>
                        </div>
                        <div className="facility-card">
                            <h3>Hostel Accommodation</h3>
                            <p>Comfortable residential facilities for students with modern amenities</p>
                            <ul>
                                <li>Boys Hostels (4 blocks)</li>
                                <li>Girls Hostels (2 blocks)</li>
                                <li>Wi-Fi enabled rooms</li>
                                <li>Common recreation areas</li>
                            </ul>
                        </div>
                        <div className="facility-card">
                            <h3>Library & Information Center</h3>
                            <p>Comprehensive collection of books, journals, and digital resources</p>
                            <ul>
                                <li>Central Library</li>
                                <li>Digital Library</li>
                                <li>Reading Rooms</li>
                                <li>Online Databases</li>
                            </ul>
                        </div>
                        <div className="facility-card">
                            <h3>Sports Complex</h3>
                            <p>Extensive sports facilities for physical fitness and recreational activities</p>
                            <ul>
                                <li>Outdoor Sports Complex</li>
                                <li>Indoor Games Hall</li>
                                <li>Swimming Pool</li>
                                <li>Gymnasium</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="student-activities">
                    <h2>Student Activities</h2>
                    <div className="activities-grid">
                        <div className="activity-card">
                            <h3>Technical Clubs</h3>
                            <p>Engage in cutting-edge technology and innovation</p>
                            <ul>
                                <li>Robotics Club</li>
                                <li>Programming Club</li>
                                <li>Electronics Club</li>
                                <li>Automobile Club</li>
                            </ul>
                        </div>
                        <div className="activity-card">
                            <h3>Cultural Activities</h3>
                            <p>Express creativity through various cultural events</p>
                            <ul>
                                <li>Music & Dance</li>
                                <li>Drama & Theatre</li>
                                <li>Literary Society</li>
                                <li>Photography Club</li>
                            </ul>
                        </div>
                        <div className="activity-card">
                            <h3>Sports Teams</h3>
                            <p>Competitive sports and inter-college tournaments</p>
                            <ul>
                                <li>Cricket Team</li>
                                <li>Football Team</li>
                                <li>Basketball Team</li>
                                <li>Athletic Team</li>
                            </ul>
                        </div>
                        <div className="activity-card">
                            <h3>Student Committees</h3>
                            <p>Leadership opportunities and student governance</p>
                            <ul>
                                <li>Student Council</li>
                                <li>Technical Festival Committee</li>
                                <li>Cultural Festival Committee</li>
                                <li>Placement Committee</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="annual-events">
                    <h2>Annual Events</h2>
                    <div className="events-timeline">
                        <div className="event-card">
                            <h3>TechnoNIT</h3>
                            <p>Annual technical festival showcasing innovation and technology</p>
                            <div className="event-highlights">
                                <span>Coding Competitions</span>
                                <span>Robotics Challenges</span>
                                <span>Technical Workshops</span>
                                <span>Industry Lectures</span>
                            </div>
                        </div>
                        <div className="event-card">
                            <h3>Abhivyakti</h3>
                            <p>Cultural festival celebrating arts, literature, and creativity</p>
                            <div className="event-highlights">
                                <span>Music Concerts</span>
                                <span>Dance Performances</span>
                                <span>Drama Competitions</span>
                                <span>Art Exhibitions</span>
                            </div>
                        </div>
                        <div className="event-card">
                            <h3>Sports Meet</h3>
                            <p>Inter-departmental sports competition and fitness events</p>
                            <div className="event-highlights">
                                <span>Track & Field</span>
                                <span>Team Sports</span>
                                <span>Individual Events</span>
                                <span>Marathon</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="campus-services">
                    <h2>Campus Services</h2>
                    <div className="services-grid">
                        <div className="service-card">
                            <h3>Dining</h3>
                            <p>Multiple dining options with variety of cuisines</p>
                        </div>
                        <div className="service-card">
                            <h3>Medical Center</h3>
                            <p>24/7 medical assistance and healthcare services</p>
                        </div>
                        <div className="service-card">
                            <h3>Banking</h3>
                            <p>On-campus ATM and banking facilities</p>
                        </div>
                        <div className="service-card">
                            <h3>Transport</h3>
                            <p>Campus shuttle and local transportation services</p>
                        </div>
                        <div className="service-card">
                            <h3>Stationery</h3>
                            <p>Campus store for academic supplies and essentials</p>
                        </div>
                        <div className="service-card">
                            <h3>Security</h3>
                            <p>24/7 campus security and safety measures</p>
                        </div>
                    </div>
                </section>

                <section className="campus-tour">
                    <h2>Virtual Campus Tour</h2>
                    <div className="tour-info">
                        <p>Experience our beautiful campus through our virtual tour. Explore academic buildings, hostels, sports facilities, and green spaces that make NIT Goa a perfect place for learning and growth.</p>
                        <div className="tour-highlights">
                            <div className="highlight">
                                <h4>150+ Acres</h4>
                                <p>Sprawling green campus</p>
                            </div>
                            <div className="highlight">
                                <h4>Modern Infrastructure</h4>
                                <p>State-of-the-art facilities</p>
                            </div>
                            <div className="highlight">
                                <h4>Eco-Friendly</h4>
                                <p>Sustainable campus design</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Campus;
