import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="page-header">
                    <h1>About NIT Goa</h1>
                    <p className="page-subtitle">Institute of National Importance</p>
                </div>

                <div className="about-content">
                    <section className="about-section featured-section">
                        <h2>About Our Institute</h2>
                        <p>
                            The National Institute of Technology Goa (NIT Goa) is a premier national-level
                            technical institute in India established in 2010 by an act of parliament (NIT
                            Act, 2007 and NIT (Amendment) Act, 2012). NIT Goa is an autonomous institute
                            functioning under the aegis of Ministry of Education (MoE), Government of India, and
                            has been declared an "Institute of National Importance".
                        </p>
                        <p>
                            The Campus is located at Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, 
                            South Goa District, Goa - 403703. Cuncolim is located 15 kilometers from Margao City. 
                            The Institute is dedicated to its academic excellence and aims to produce quality 
                            Engineers and Scientists.
                        </p>
                    </section>

                    <div className="vision-mission-grid">
                        <section className="about-section vision-section">
                            <h2>Our Vision</h2>
                            <p>
                                National Institute of Technology Goa shall emerge as one of the nation's
                                pre-eminent institutions. Through its excellence, it shall serve the Goan society,
                                India and humanity at large with all the challenges and opportunities.
                            </p>
                        </section>

                        <section className="about-section mission-section">
                            <h2>Our Mission</h2>
                            <p>
                                NIT Goa strives for quality faculty, good students and excellent infrastructure.
                                Strives for excellence, through dissemination, generation and application of
                                knowledge by laying stress on interdisciplinary approach in all the branches of
                                Science, Engineering, Technology, Humanities and Management with emphasis on human
                                values and ethics.
                            </p>
                        </section>
                    </div>

                    <section className="about-section programs-section">
                        <h2>Academic Programs</h2>
                        <div className="programs-grid">
                            <div className="program-card">
                                <h3>Undergraduate Programs</h3>
                                <ul>
                                    <li>Computer Science and Engineering (CSE)</li>
                                    <li>Electronics and Communication Engineering (ECE)</li>
                                    <li>Electrical and Electronics Engineering (EEE)</li>
                                    <li>Civil Engineering (CVE)</li>
                                    <li>Mechanical Engineering (MCE)</li>
                                </ul>
                            </div>
                            <div className="program-card">
                                <h3>Postgraduate Programs</h3>
                                <ul>
                                    <li>M.Tech. in Computer Science and Engineering</li>
                                    <li>M.Tech. in VLSI</li>
                                    <li>M.Tech. in Power Electronics and Power Systems (PEPS)</li>
                                </ul>
                            </div>
                            <div className="program-card">
                                <h3>Doctoral Programs</h3>
                                <ul>
                                    <li>Ph.D. in Engineering streams</li>
                                    <li>Ph.D. in Applied Sciences</li>
                                    <li>Ph.D. in Technology</li>
                                    <li>Ph.D. in Humanities & Social Sciences</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="about-section admission-section">
                        <h2>Admissions</h2>
                        <div className="admission-info">
                            <div className="admission-card">
                                <h3>B.Tech Admissions</h3>
                                <p>Students are admitted based on JEE (Main) ranks through JoSAA/CSAB and DASA scheme.</p>
                                <ul>
                                    <li>CSE/EEE/ECE: 44 seats each (38 JoSAA/CSAB + 6 DASA)</li>
                                    <li>CVE/MCE: 42 seats each (37 JoSAA/CSAB + 5 DASA)</li>
                                    <li>Total: 216 students (188 JoSAA/CSAB + 28 DASA)</li>
                                </ul>
                            </div>
                            <div className="admission-card">
                                <h3>M.Tech Admissions</h3>
                                <p>Students are admitted through GATE score followed by CCMT.</p>
                                <ul>
                                    <li>CSE/VLSI: 27 seats each (23 CCMT + 2 sponsored + 2 DRDO)</li>
                                    <li>PEPS: 26 seats (22 CCMT + 2 sponsored + 2 DRDO)</li>
                                    <li>Total: 80 students</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="about-section facilities-section">
                        <h2>Infrastructure & Facilities</h2>
                        <p>
                            The Institute is well-equipped with state-of-the-art laboratories, modern workshops, 
                            and an up-to-date Library with rich and comprehensive high-quality print and electronic 
                            resources. The campus provides excellent residential facilities and sports infrastructure 
                            for overall development of students.
                        </p>
                    </section>

                    <section className="about-section placement-section">
                        <h2>Training & Placement</h2>
                        <p>
                            The Training and Placement Cell aims to provide opportunities for students to shape their careers. 
                            Major companies from varied sectors regularly visit the institute including Research and Development, 
                            Engineering & Technology, IT/Software Development, Analytics, Finance, Education, Consulting, and 
                            Public Sector Undertakings.
                        </p>
                        <div className="company-highlights">
                            <p><strong>Notable Recruiters:</strong> Amazon, Samsung, Oracle, Dell, Intel, Qualcomm, 
                            IBM, Capgemini, Jio, AMD, Bosch, ISRO, BEL, HDFC, L&T, TCS, Infosys, HCL Technologies, 
                            Adani Group, Accenture, and many more.</p>
                        </div>
                    </section>

                    <section className="about-section research-section">
                        <h2>Research & Innovation</h2>
                        <p>
                            All faculty members are actively involved in research and have executed many funded R&D projects. 
                            They regularly publish research articles and book chapters. Many faculty members have been 
                            granted patents and several more have filed patent applications. The Institute organizes 
                            GIAN courses, STTPs, FDPs, workshops, and national/international conferences.
                        </p>
                    </section>

                    <section className="about-section outreach-section">
                        <h2>Outreach Activities</h2>
                        <p>
                            The Institute organizes various outreach activities including Rashtriya Aavishkar Abhiyan (RAA), 
                            Unnat Bharat Abhiyan, Swachh Bharat Abhiyan, Ek Bharat Shreshtha Bharat, FiT India programmes, 
                            and many more community development initiatives.
                        </p>
                    </section>

                    <section className="about-section student-life-section">
                        <h2>Student Life</h2>
                        <p>
                            Students are actively involved in co-curricular activities through various clubs, councils, 
                            and study circles like SPECTRA, TESLA, QUANTA, CESCO & META. The SPIE and IEEE student 
                            chapters organize scientific and research-oriented events. The annual techno-cultural fest 
                            SAAVYAS celebrates the spirit of innovation and creativity.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
