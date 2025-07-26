import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="aboutpage-page">
            <div className="aboutpage-container">
                {/* Hero Section */}
                <div className="aboutpage-hero">
                    <div className="aboutpage-hero-content">
                        <h1>About NIT Goa</h1>
                        <p className="aboutpage-hero-subtitle">National Institute of Technology Goa - Institute of National Importance</p>
                        <div className="aboutpage-info">
                            <span className="aboutpage-label">Established 2010</span>
                            <span className="aboutpage-desc">Autonomous institute under Ministry of Education, Government of India</span>
                        </div>
                    </div>
                </div>

                {/* Institute Overview Section */}
                <section className="aboutpage-institute-section">
                    <h2 className="aboutpage-section-title">Institute Overview</h2>
                    <div className="aboutpage-institute-content">
                        <div className="aboutpage-institute-header">
                            <h3 className="aboutpage-content-title">About Our Institute</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-location">Location: Cuncolim, South Goa</span>
                                <span className="aboutpage-type">Type: Institute of National Importance</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-content-body">
                            <div className="aboutpage-content-description">
                                <h4>Overview</h4>
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
                                    Dabolim Airport in Vasco caters to domestic and international airlines that stop en route 
                                    to other Indian destinations. It is at a distance of around 38 km (45 minutes by car) from 
                                    the Institute. Manohar International Airport in Mopa is 77 km (1 hour and 30 minutes by car) 
                                    from the Institute. The closest major railway station is 'Madgaon Railway Station', which is 
                                    around 15 km (25 minutes by car) from the Institute. Goa is well connected by roadways, 
                                    railways and airways with various parts of the country. The Institute is dedicated to its 
                                    academic excellence and aims to produce quality Engineers and Scientists.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission Section */}
                <section className="aboutpage-vision-mission-section">
                    <div className="aboutpage-vision-mission-grid">
                        <div className="aboutpage-vision-content">
                            <div className="aboutpage-vision-header">
                                <h3 className="aboutpage-content-title">Our Vision</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        National Institute of Technology Goa shall emerge as one of the nation's
                                        pre-eminent institutions. Through its excellence, it shall serve the Goan society,
                                        India and humanity at large with all the challenges and opportunities.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="aboutpage-mission-content">
                            <div className="aboutpage-mission-header">
                                <h3 className="aboutpage-content-title">Our Mission</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        NIT Goa strives for quality faculty, good students and excellent infrastructure.
                                        Strives for excellence, through dissemination, generation and application of
                                        knowledge by laying stress on interdisciplinary approach in all the branches of
                                        Science, Engineering, Technology, Humanities and Management with emphasis on human
                                        values and ethics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Academic Programs Section */}
                <section className="aboutpage-programs-section">
                    <h2 className="aboutpage-section-title">Academic Programs</h2>
                    <div className="aboutpage-program-section">
                        <div className="aboutpage-program-header">
                            <h3 className="aboutpage-program-title">Academic Excellence</h3>
                            <div className="aboutpage-program-meta">
                                <span className="aboutpage-specialization">5 UG + 3 PG + PhD Programs</span>
                                <span className="aboutpage-seats">Total Intake: 296 Students</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-program-content">
                            <div className="aboutpage-program-description">
                                <h4>Program Overview</h4>
                                <p>
                                    The Institute offers undergraduate programmes in Five Engineering Departments: (1) Computer Science and Engineering (CSE), 
                                    (2) Electronics and Communication Engineering (ECE), (3) Electrical and Electronics Engineering (EEE), 
                                    (4) Civil Engineering (CVE), and (5) Mechanical Engineering (MCE). The Institute offers M.Tech. Programmes in the Three disciplines: 
                                    (1) Computer Science and Engineering (CSE), (2) VLSI and (3) Power Electronics and Power Systems (PEPS). 
                                    The Institute also offers Ph.D. degree in various stream of Engineering, Applied Sciences, Technology and Humanities & Social Sciences.
                                </p>
                            </div>
                            
                            <div className="aboutpage-departments-grid">
                                <div className="aboutpage-department-card">
                                    <h4>Undergraduate Programs</h4>
                                    <ul>
                                        <li><Link to="/departments/cse" className="aboutpage-department-link">Computer Science and Engineering (CSE)</Link></li>
                                        <li><Link to="/departments/ece" className="aboutpage-department-link">Electronics and Communication Engineering (ECE)</Link></li>
                                        <li><Link to="/departments/eee" className="aboutpage-department-link">Electrical and Electronics Engineering (EEE)</Link></li>
                                        <li><Link to="/departments/cve" className="aboutpage-department-link">Civil Engineering (CVE)</Link></li>
                                        <li><Link to="/departments/mce" className="aboutpage-department-link">Mechanical Engineering (MCE)</Link></li>
                                    </ul>
                                </div>
                                <div className="aboutpage-department-card">
                                    <h4>Postgraduate Programs</h4>
                                    <ul>
                                        <li><Link to="/departments/cse" className="aboutpage-department-link">M.Tech. in Computer Science and Engineering</Link></li>
                                        <li><Link to="/departments/ece" className="aboutpage-department-link">M.Tech. in VLSI</Link></li>
                                        <li><Link to="/departments/eee" className="aboutpage-department-link">M.Tech. in Power Electronics and Power Systems (PEPS)</Link></li>
                                    </ul>
                                </div>
                                <div className="aboutpage-department-card">
                                    <h4>Doctoral Programs</h4>
                                    <ul>
                                        <li>Ph.D. in Engineering streams</li>
                                        <li>Ph.D. in Applied Sciences</li>
                                        <li>Ph.D. in Technology</li>
                                        <li>Ph.D. in Humanities & Social Sciences</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Admissions Section */}
                <section className="aboutpage-admissions-section">
                    <h2 className="aboutpage-section-title">Admissions</h2>
                    <div className="aboutpage-admission-section">
                        <div className="aboutpage-admission-header">
                            <h3 className="aboutpage-content-title">Admission Process</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-process">B.Tech: JEE Main | M.Tech: GATE</span>
                                <span className="aboutpage-seats">Total Seats: 296</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-admission-content">
                            <div className="aboutpage-admission-description">
                                <h4>Admission Overview</h4>
                                <p>
                                    The Institute admits students into the B.Tech. degree programme based on the ranks obtained in the Joint Entrance 
                                    Examination JEE (Main) and the scheme of Direct Admission to Students Abroad (DASA). The Institute admits M.Tech. 
                                    students through valid GATE score followed by CCMT (Centralized Counselling for M.Tech. Admissions), and few seats 
                                    are offered to the sponsored and DRDO candidates.
                                </p>
                            </div>
                            
                            <div className="aboutpage-admission-details-grid">
                                <div className="aboutpage-admission-detail-card">
                                    <h4>B.Tech Admissions</h4>
                                    <p>Students are admitted based on JEE (Main) ranks through JoSAA/CSAB and DASA scheme.</p>
                                    <ul>
                                        <li>CSE/EEE/ECE: 44 seats each (38 JoSAA/CSAB + 6 DASA)</li>
                                        <li>CVE/MCE: 42 seats each (37 JoSAA/CSAB + 5 DASA)</li>
                                        <li>Total: 216 students (188 JoSAA/CSAB + 28 DASA)</li>
                                    </ul>
                                    <div className="aboutpage-admission-link-wrapper">
                                        <a href="https://josaa.nic.in/" target="_blank" rel="noopener noreferrer" className="aboutpage-admission-link">
                                            Visit JoSAA Portal
                                        </a>
                                    </div>
                                </div>
                                <div className="aboutpage-admission-detail-card">
                                    <h4>M.Tech Admissions</h4>
                                    <p>Students are admitted through GATE score followed by CCMT.</p>
                                    <ul>
                                        <li>CSE/VLSI: 27 seats each (23 CCMT + 2 sponsored + 2 DRDO)</li>
                                        <li>PEPS: 26 seats (22 CCMT + 2 sponsored + 2 DRDO)</li>
                                        <li>Total: 80 students</li>
                                        <li>Full-time Self-Financed (Non-GATE) M.Tech. in vacant seats</li>
                                    </ul>
                                    <div className="aboutpage-admission-link-wrapper">
                                        <Link to="/admission/mtech" className="aboutpage-admission-link">
                                            M.Tech Admission Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Research & Innovation Section */}
                <section className="aboutpage-research-section">
                    <h2 className="aboutpage-section-title">Research & Innovation</h2>
                    <div className="aboutpage-research-section-content">
                        <div className="aboutpage-research-header">
                            <h3 className="aboutpage-content-title">Research Excellence</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-research-focus">Cutting-edge Research</span>
                                <span className="aboutpage-research-projects">Multiple R&D Projects</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-research-content">
                            <div className="aboutpage-research-description">
                                <h4>Research Overview</h4>
                                <p>
                                    All the faculty members of NIT Goa are dedicated to training the students with a world-class education. Faculty members 
                                    are actively involved in research works and have executed many funded R & D projects. They have been publishing research 
                                    articles and book chapters regularly. Many faculty members have been granted and many have filed patent/patents. Institute 
                                    has organised several GIAN, STTP, FDP, Workshops, National and International Conferences etc.
                                </p>
                            </div>
                            
                            <div className="aboutpage-research-link-wrapper">
                                <Link to="/research/projects" className="aboutpage-research-link">
                                    Explore R&D Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Placement & Industry Section */}
                <section className="aboutpage-placement-section">
                    <h2 className="aboutpage-section-title">Training & Placement</h2>
                    <div className="aboutpage-placement-section-content">
                        <div className="aboutpage-placement-header">
                            <h3 className="aboutpage-content-title">Career Opportunities</h3>
                            <div className="aboutpage-content-meta">
                                <span className="aboutpage-companies">100+ Companies</span>
                                <span className="aboutpage-sectors">Multiple Sectors</span>
                            </div>
                        </div>
                        
                        <div className="aboutpage-placement-content">
                            <div className="aboutpage-placement-description">
                                <h4>Placement Overview</h4>
                                <p>
                                    The Training and Placement Cell of NIT Goa aims to provide opportunities to students to shape their career. 
                                    Major companies keep visiting the Institute regularly. They are from varied sectors: Research and Development, 
                                    Engineering & Technology, IT/ Software Development, Analytics, Finance, Education, Consulting, Public Sector 
                                    Undertaking and others. Additionally, the institute has witnessed an increase in the number of internships 
                                    offered to pre-final year students by MNCs like Samsung, Dell, Intel, etc.
                                </p>
                            </div>
                            
                            <div className="aboutpage-company-highlights">
                                <h4>Notable Recruiters</h4>
                                <p>
                                    Navratna Public Sector Undertaking (PSU) like Bharat Electronics Limited, 
                                    Indian Space Research Organisation (ISRO), Multinational Corporations including Amazon, Samsung, Oracle, Dell, Intel, 
                                    Qualcomm, Global Foundries, IBM, Capgemini, Jio, AMD, Bosch, ZS Associates, Tata Power, L&T, HDFC, Jindal South West, 
                                    HCL Technologies, Adani Group, Infosys, TCS, Cognizant, Increff, Schneider Electric, Aequs, Publicis Sapient, 
                                    Accenture, ASEC Inc., Persistent Systems and many more.
                                </p>
                            </div>
                            
                            <div className="aboutpage-placement-link-wrapper">
                                <Link to="/placement" className="aboutpage-placement-link">
                                    Visit Training & Placement
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Outreach & Student Life Section */}
                <section className="aboutpage-outreach-section">
                    <div className="aboutpage-outreach-grid">
                        <div className="aboutpage-outreach-content">
                            <div className="aboutpage-outreach-header">
                                <h3 className="aboutpage-content-title">Outreach Activities</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        The Institute also organises outreach activities/initiatives like 'Rashtriya Aavishkar Abhiyan (RAA)', 
                                        'Unnat Bharat Abhiyan', 'Swachh Bharat Abhiyan', 'Ek Bharat Shreshtha Bharat', 'FiT India' programmes, 
                                        and many more community development initiatives.
                                    </p>
                                </div>
                                <div className="aboutpage-outreach-link-wrapper">
                                    <Link to="/outreach" className="aboutpage-outreach-link">
                                        Explore Outreach Activities
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="aboutpage-student-life-content">
                            <div className="aboutpage-student-life-header">
                                <h3 className="aboutpage-content-title">Student Life & Activities</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        The students of NIT Goa are actively involved in various co-curricular activities through students' clubs, 
                                        councils, and study circles like SPECTRA, TESLA, QUANTA, CESCO & META etc. The SPIE and IEEE student chapters 
                                        of the Institute organise various scientific and research-oriented events. The annual techno-cultural fest of 
                                        NIT Goa is SAAVYAS. For overall development of the students, the institute also provides sports facilities. 
                                        In 2018, NIT Goa organised All India Inter NIT Faculty and Staff Tournament.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Collaborations & Culture Section */}
                <section className="aboutpage-collaborations-section">
                    <div className="aboutpage-collaborations-grid">
                        <div className="aboutpage-mou-content">
                            <div className="aboutpage-mou-header">
                                <h3 className="aboutpage-content-title">Collaborations & MoUs</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        NIT Goa signed many MoUs and Agreements with other academic & research institutes, industries and organizations 
                                        to facilitate faculty and student exchange programs, knowledge sharing, carrying-out interdisciplinary research works, 
                                        joint research guidance, curriculum and course developments, joint workshop, conferences, seminars, and many more 
                                        student and faculty development programs.
                                    </p>
                                </div>
                                <div className="aboutpage-mou-link-wrapper">
                                    <Link to="/mous" className="aboutpage-mou-link">
                                        Details of MoUs
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="aboutpage-culture-content">
                            <div className="aboutpage-culture-header">
                                <h3 className="aboutpage-content-title">Cultural Diversity</h3>
                            </div>
                            <div className="aboutpage-content-body">
                                <div className="aboutpage-content-description">
                                    <p>
                                        The students also celebrate cultural festivals of different states of India to maintain unity in diversity 
                                        and it is a collective effort by the institute to inculcate integral education of mind and body.
                                    </p>
                                </div>
                                <div className="aboutpage-culture-link-wrapper">
                                    <Link to="/hostels" className="aboutpage-culture-link">
                                        Explore Hostels
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
