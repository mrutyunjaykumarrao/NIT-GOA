import React, { useState } from 'react';
import './Library.css';

const Library = () => {
    const [selectedService, setSelectedService] = useState('catalog');

    const libraryServices = [
        {
            id: 'catalog',
            title: 'Online Catalog',
            description: 'Search our comprehensive collection of books, journals, and digital resources',
            icon: '📚',
            features: ['Book Search', 'Journal Articles', 'Digital Collections', 'Research Databases']
        },
        {
            id: 'digital',
            title: 'Digital Library',
            description: 'Access e-books, online journals, and digital archives',
            icon: '💻',
            features: ['E-Books', 'E-Journals', 'Digital Archives', 'Online Databases']
        },
        {
            id: 'research',
            title: 'Research Support',
            description: 'Research assistance, citation help, and academic writing support',
            icon: '🔬',
            features: ['Research Guidance', 'Citation Tools', 'Thesis Support', 'Reference Services']
        },
        {
            id: 'spaces',
            title: 'Study Spaces',
            description: 'Reserve study rooms, group discussion areas, and quiet zones',
            icon: '🪑',
            features: ['Study Rooms', 'Group Areas', 'Silent Zones', 'Computer Labs']
        }
    ];

    const collections = [
        {
            category: 'Engineering & Technology',
            count: '15,000+',
            icon: '⚙️',
            description: 'Books and journals covering all engineering disciplines',
            subjects: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical']
        },
        {
            category: 'Science & Mathematics',
            count: '8,000+',
            icon: '🧮',
            description: 'Pure sciences, applied mathematics, and research materials',
            subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Statistics']
        },
        {
            category: 'Digital Resources',
            count: '50,000+',
            icon: '📱',
            description: 'E-books, online journals, and digital databases',
            subjects: ['IEEE Xplore', 'ACM Digital Library', 'Springer', 'ScienceDirect', 'JSTOR']
        },
        {
            category: 'Humanities & Management',
            count: '5,000+',
            icon: '📖',
            description: 'Literature, management, and social science resources',
            subjects: ['English Literature', 'Management', 'Economics', 'Psychology', 'History']
        }
    ];

    const facilities = [
        {
            name: 'Reading Hall',
            capacity: '200 seats',
            features: ['Silent Environment', 'Individual Tables', 'Reading Lamps', 'Air Conditioned'],
            hours: '24/7 Access'
        },
        {
            name: 'Digital Lab',
            capacity: '50 computers',
            features: ['High-Speed Internet', 'Research Software', 'Printing Facilities', 'Scanning Services'],
            hours: '6:00 AM - 11:00 PM'
        },
        {
            name: 'Group Study Rooms',
            capacity: '6-8 persons',
            features: ['Whiteboard', 'Projector', 'Conference Table', 'AC'],
            hours: 'Bookable Slots'
        },
        {
            name: 'Research Cubicles',
            capacity: '1-2 persons',
            features: ['Private Space', 'Power Outlets', 'Ergonomic Furniture', 'Quiet Zone'],
            hours: '24/7 for Research Scholars'
        }
    ];

    const quickLinks = [
        { title: 'Library Catalog', url: 'https://library.nitgoa.ac.in/catalog', icon: '🔍' },
        { title: 'Digital Resources', url: 'https://library.nitgoa.ac.in/digital', icon: '💾' },
        { title: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org', icon: '⚡' },
        { title: 'ACM Digital Library', url: 'https://dl.acm.org', icon: '🖥️' },
        { title: 'Springer Link', url: 'https://link.springer.com', icon: '📊' },
        { title: 'ScienceDirect', url: 'https://www.sciencedirect.com', icon: '🧪' }
    ];

    const libraryNews = [
        {
            date: '2024-12-15',
            title: 'New Digital Collection Added',
            content: 'Access to Nature Digital Collection now available for all users. Over 150 high-impact journals in science and technology.',
            type: 'announcement'
        },
        {
            date: '2024-12-10',
            title: 'Extended Library Hours',
            content: 'Library now open 24/7 for registered research scholars. Access cards can be obtained from the circulation desk.',
            type: 'update'
        },
        {
            date: '2024-12-05',
            title: 'Research Workshop Series',
            content: 'Monthly workshops on research methodology, citation management, and academic writing. Next session: December 20, 2024.',
            type: 'event'
        },
        {
            date: '2024-11-28',
            title: 'Book Exhibition',
            content: 'Annual book exhibition featuring latest titles in engineering and technology. Special discounts for students and faculty.',
            type: 'event'
        }
    ];

    const getNewsIcon = (type) => {
        switch (type) {
            case 'announcement': return '📢';
            case 'update': return '🔄';
            case 'event': return '📅';
            default: return '📰';
        }
    };

    return (
        <div className="library-page">
            <div className="library-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Central Library</h1>
                    <p className="page-subtitle">Gateway to Knowledge and Research Excellence</p>
                </div>

                {/* Library Overview */}
                <section className="library-overview">
                    <div className="overview-content">
                        <h2>About Our Library</h2>
                        <p>
                            The NIT Goa Central Library is a modern information hub designed to support academic excellence 
                            and research innovation. With a comprehensive collection of over 50,000 books, access to premium 
                            digital databases, and state-of-the-art facilities, we provide an ideal environment for learning 
                            and discovery.
                        </p>
                        <div className="library-stats">
                            <div className="stat-item">
                                <div className="stat-number">50,000+</div>
                                <div className="stat-label">Books & Journals</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">25+</div>
                                <div className="stat-label">Digital Databases</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">300</div>
                                <div className="stat-label">Seating Capacity</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">Access Available</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Library Services */}
                <section className="library-services">
                    <h2>Library Services</h2>
                    <div className="services-nav">
                        {libraryServices.map(service => (
                            <button
                                key={service.id}
                                className={`service-nav-btn ${selectedService === service.id ? 'active' : ''}`}
                                onClick={() => setSelectedService(service.id)}
                            >
                                {service.icon} {service.title}
                            </button>
                        ))}
                    </div>
                    <div className="service-content">
                        {libraryServices.map(service => (
                            selectedService === service.id && (
                                <div key={service.id} className="service-details">
                                    <div className="service-info">
                                        <div className="service-icon-large">{service.icon}</div>
                                        <div>
                                            <h3>{service.title}</h3>
                                            <p>{service.description}</p>
                                        </div>
                                    </div>
                                    <div className="service-features">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="feature-tag">{feature}</div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </section>

                {/* Collections */}
                <section className="library-collections">
                    <h2>Our Collections</h2>
                    <div className="collections-grid">
                        {collections.map((collection, index) => (
                            <div key={index} className="collection-card">
                                <div className="collection-header">
                                    <div className="collection-icon">{collection.icon}</div>
                                    <div className="collection-meta">
                                        <h3>{collection.category}</h3>
                                        <span className="collection-count">{collection.count}</span>
                                    </div>
                                </div>
                                <p className="collection-description">{collection.description}</p>
                                <div className="collection-subjects">
                                    {collection.subjects.map((subject, idx) => (
                                        <span key={idx} className="subject-tag">{subject}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Facilities */}
                <section className="library-facilities">
                    <h2>Facilities & Study Spaces</h2>
                    <div className="facilities-grid">
                        {facilities.map((facility, index) => (
                            <div key={index} className="facility-card">
                                <h3>{facility.name}</h3>
                                <div className="facility-capacity">{facility.capacity}</div>
                                <div className="facility-hours">{facility.hours}</div>
                                <ul className="facility-features">
                                    {facility.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Links */}
                <section className="quick-links-section">
                    <h2>Quick Access</h2>
                    <div className="quick-links-grid">
                        {quickLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quick-link-card"
                            >
                                <div className="quick-link-icon">{link.icon}</div>
                                <h3>{link.title}</h3>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Library News */}
                <section className="library-news">
                    <h2>Library News & Updates</h2>
                    <div className="news-list">
                        {libraryNews.map((news, index) => (
                            <div key={index} className="news-card">
                                <div className="news-header">
                                    <div className="news-icon">{getNewsIcon(news.type)}</div>
                                    <div className="news-meta">
                                        <h3>{news.title}</h3>
                                        <span className="news-date">{news.date}</span>
                                    </div>
                                </div>
                                <p className="news-content">{news.content}</p>
                                <span className={`news-type ${news.type}`}>{news.type}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Information */}
                <section className="library-contact">
                    <h2>Contact & Hours</h2>
                    <div className="contact-grid">
                        <div className="contact-card">
                            <h3>📞 Contact Information</h3>
                            <p><strong>Phone:</strong> +91-832-2404200 (Ext: 6205)</p>
                            <p><strong>Email:</strong> library@nitgoa.ac.in</p>
                            <p><strong>Location:</strong> Ground Floor, Academic Block</p>
                        </div>
                        <div className="contact-card">
                            <h3>🕐 Library Hours</h3>
                            <p><strong>Regular Hours:</strong> 8:00 AM - 9:00 PM</p>
                            <p><strong>Extended Access:</strong> 24/7 for Research Scholars</p>
                            <p><strong>Holidays:</strong> 10:00 AM - 5:00 PM</p>
                        </div>
                        <div className="contact-card">
                            <h3>📋 Library Rules</h3>
                            <p>• Valid ID card required for entry</p>
                            <p>• Maintain silence in reading areas</p>
                            <p>• No food or drinks allowed</p>
                            <p>• Return books on time to avoid fines</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Library;
