import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="container">
                <div className="page-header">
                    <h1>About NIT Goa</h1>
                    <p className="page-subtitle">Excellence in Technical Education and Research</p>
                </div>

                <div className="about-content">
                    <section className="about-section">
                        <h2>Our Institute</h2>
                        <p>
                            National Institute of Technology Goa (NIT Goa) is an Institution of National Importance 
                            established by an Act of Parliament in 2010. Located in the picturesque state of Goa, 
                            NIT Goa has been committed to excellence in technical education, research, and innovation.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>Vision</h2>
                        <p>
                            To be a premier technological institution that produces world-class engineers, 
                            scientists, and leaders who contribute to the technological advancement and 
                            socio-economic development of the nation.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>Mission</h2>
                        <ul>
                            <li>To provide quality technical education and foster innovation</li>
                            <li>To conduct cutting-edge research in emerging areas of technology</li>
                            <li>To develop human resources with technical competence and ethical values</li>
                            <li>To serve the society through outreach programs and technology transfer</li>
                        </ul>
                    </section>

                    <section className="about-section">
                        <h2>Campus</h2>
                        <p>
                            The institute is located at Farmagudi, Ponda, in the heart of Goa. The campus 
                            is spread over a sprawling area with state-of-the-art infrastructure, modern 
                            laboratories, well-equipped libraries, and excellent residential facilities.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
