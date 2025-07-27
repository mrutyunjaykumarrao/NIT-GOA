import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CivilEngineering.css';

const CivilEngineering = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');
    const [openResearchSection, setOpenResearchSection] = useState(null);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const toggleResearchSection = (section) => {
        setOpenResearchSection(openResearchSection === section ? null : section);
    };

    return (
        <div className="civil-engineering-page">
            <div className="civil-engineering-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Civil Engineering</h1>
                    <p className="page-subtitle">Department of Civil Engineering</p>
                </div>

                {/* Main Content Layout */}
                <div className="main-layout">
                    {/* Sidebar Navigation */}
                    <aside className="department-sidebar">
                        <nav className="department-nav">
                            <ul className="nav-list">
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'home' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('home')}
                                    >
                                        Home
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'faculty' ? 'nav-active' : ''}`}
                                        onClick={() => handleNavigation('/faculty')}
                                    >
                                        Faculty
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'research' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('research')}
                                    >
                                        Research
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'ug-handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('ug-handbook')}
                                    >
                                        UG Academic Handbook
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'pg-handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('pg-handbook')}
                                    >
                                        PG Academic Handbook
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeSection === 'handbook' ? 'nav-active' : ''}`}
                                        onClick={() => handleSectionChange('handbook')}
                                    >
                                        Handbook
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="department-content">
                        {/* Home Section */}
                        {activeSection === 'home' && (
                            <section className="content-section">
                                <h2>Welcome to the department of civil engineering</h2>
                                
                                <div className="content-text">
                                    <p>
                                        The Department of Civil Engineering was established in the year 2018. It offers Undergraduate (B.Tech.) program in the field of Civil Engineering. The Institution and the faculty members are committed to provide the finest possible education to the students.
                                    </p>
                                    
                                    <p>
                                        Though it is relatively a newly introduced stream, every care is taken to ensure that the quality of education is not compromised. The lab, library facilities and other infrastructure are regularly upgraded with the support from the institute and our Director Sir.
                                    </p>
                                    
                                    <p>
                                        To ensure that good exposure to Civil Engineering is provided, the students are taken to various academic institutions and industries. Guest Lectures from Eminent people are also arranged regularly.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Research Section */}
                        {activeSection === 'research' && (
                            <section className="content-section">
                                <h2>Research</h2>
                                <div className="research-content">
                                    <p className="research-intro">The Department of Civil Engineering is actively engaged in cutting-edge research spanning environmental engineering, geotechnical engineering, structural engineering, water resources, and sustainable construction practices. Our faculty members contribute significantly to the advancement of civil engineering knowledge through high-impact publications and innovative research methodologies.</p>
                                    
                                    {/* Research Dropdown Sections */}
                                    <div className="research-sections">
                                        {/* Journal Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'journal' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('journal')}
                                            >
                                                <h3 className="research-section-title">Journal</h3>
                                                <div className={`research-arrow ${openResearchSection === 'journal' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'journal' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <h4 className="research-subsection-title">Publication in Journals</h4>
                                                        <ul className="research-publication-list">
                                                            <li>Dipty Sarin Isaac, Vinish V Nair, Harikumar Mohanan, Background review and development of a coir-based hybrid geosynthetic, Arabian Journal of Geosciences,15:1308, doi.org/10.1007/s12517-022-10584-7 JULY 2022.</li>
                                                            <li>Venkatesh Reddy, C., Shekhar Rao, D., Kalamdhad, A.S., 2022. Combined treatment of high-strength fresh leachate from municipal solid waste landfill using coagulation- flocculation and fixed bed upflow anaerobic filter. Journal of Water Processing Engineering 46, 102554 JAN 2022.</li>
                                                            <li>Devi, A.B., Deka, D., Aneesh, T.D., Srinivas, R. and Nair, A.M., 2022. Predictive modelling of land use land cover dynamics for a tropical coastal urban city in Kerala, India. Arabian Journal of Geosciences, 15(5), pp.1-19. MAR 2022.</li>
                                                            <li>Tiwari, S., Adupa, V., Das, D.S., Reddy, A.K., and Bharat, T.V., Structural and Dynamic Insights into SARS-CoV-2 Spike Protein-Montmorillonite Interactions Langmuir. https://doi.org/10.1021/acs.langmuir.2c00837 JULY 2022.</li>
                                                            <li>Balvanshi, A. & Tiwari, H.L., Quantitative Estimation of the Impact of Climate Change on Crop Evapotranspiration and Yield in Central Region of India, Russian Meteorology and Hydrology, 46(10), 696-700. 2021.</li>
                                                            <li>Devi, A.B. and Nair, A.M., 2021. Effects of urbanisation in a shallow coastal aquifer: An integrated GIS-based case study in Cochin, India. Groundwater for Sustainable Development, 15, p.100656. OCT 2021.</li>
                                                            <li>D.S. Das and B. Venkata Tadikonda, Specific Surface Area of Plastic Clays from Equilibrium Sediment Volume under Salt Environment, Geotechnical Testing Journal (ASTM), 44(5), pp. 1488-1500. https://doi.org/10.1520/GTJ20200190. MAR 2021.</li>
                                                            <li>Ray, S., Mishra, A.K., Kalamdhad, A.S., Venkatesh Reddy, C., 2021. Impact of real and simulated municipal solid waste leachates on the hydraulic and swelling behaviour of bentonites for landfill application. Environmental Monitoring and Assessment (Springer) 193, 701 NOV 2021.</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Conference Proceedings Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'proceedings' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('proceedings')}
                                            >
                                                <h3 className="research-section-title">Conference Proceedings</h3>
                                                <div className={`research-arrow ${openResearchSection === 'proceedings' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'proceedings' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <h4 className="research-subsection-title">Conference Proceedings</h4>
                                                        <ul className="research-publication-list">
                                                            <li>M Harikumar, A D Singh, B Ferrao, D Saiteja, L D Deepak, A S Sandra, S Shivhare,2022, Predicting the compressive strength of concrete mixes using shallow artificial neural networks, International Symposium on Sustainable Urban Environment, UPES, Dehradun NOV 2022.</li>
                                                            <li>Dipty Sarin Isaac, Vinish V Nair, Harikumar Mohanan, 2022, Development of a Monitoring System for Laboratory Investigation of Slope Failure, Proceedings of the Second International Conference on Next Generation Intelligent Systems, Rajiv Gandhi Institute of Technology, Kottayam, Kerala. JULY 2022.</li>
                                                            <li>Devi, A.B., Deka, D., Aneesh, T.D., Srinivas, R. and Nair, A.M., 2021. Modeling the impact of future Land Use Land Cover changes on surface runoff in the Periyar River Basin, India DEC 2021.</li>
                                                            <li>Harikumar M, Fersana Mohamed, Ashique Muhammed, Irshad Ashraf, Shahansha M, Anand A G,2021, Clay Bricks Using Building Debris, Proceedings of the International conference on Sustainable Materials and Practices for Built Environment, Manipal University Jaipur, Nov. 25-26 NOV 2021.</li>
                                                            <li>Balvanshi, A. & Tiwari, H.L., Hydrological Simulation of a Basin using MIKE 11 NAM Model, International Conference on Ecosystem Restoration for Resilience and Sustainability: Living with nature (World Environment Day-Launch of UN decade for Ecosystem Restoration), during 5th – 7th Jun 2021, IIT Indore. JUN 2021.</li>
                                                            <li>Balvanshi, A., & Tiwari, H.L., Effect of Climate Change on Future Reference Evapotranspiration (ET0) in Vidisha district of Madhya Pradesh, International Conference on Hydraulics, Water Resources and Coastal Engineering during, 26th – 28th Mar 2021, NIT Rourkela, Orissa MAR 2021.</li>
                                                            <li>Balvanshi, A. & Tiwari, H.L., Runoff Simulation of a Basin using MIKE 11 NAM and AWBM Model, Sustainable Water Resources Development and Management (SWARDAM 2021), during 08th – 09th Mar 2021 organized by GEC Aurangabad 2021.</li>
                                                            <li>Balvanshi, A. & Tiwari, H.L., Hydrological Modelling of Barman Catchment using SWAT Model, International Conference on Water and Environment (ICWE 2021), during 22nd – 23rd Mar 2021, MANIT Bhopal. 2021.</li>
                                                            <li>V.L.Nithin, S.Das and H.B.Kaushik, Stochastic Conditional Simulation of Aftershock Accelerograms given the Parent Main Shock Motion, 17th World Conference on Earthquake Engineering, Sendai, Japan. 2020.</li>
                                                            <li>Devi, A.B., and Nair, A.M., Evaluation of the impact of Long-term Land Use Land Cover Change on Groundwater Recharge in the Periyar River Watershed, India DEC 2020.</li>
                                                            <li>Devi, A.B. and Nair, A.M., Long term time series analysis of groundwater level in an unconfined urban coastal aquifer. MAR 2020.</li>
                                                            <li>Devi, A.B., Sourav, K and Nair, A.M., A Study on Spatio-Temporal Variability in Groundwater Storage of India Using GRACE Data DEC 2019.</li>
                                                            <li>S. S. Katre, Devi, A.B. Ahmad, A. M. Nair, Impact of global warming on the severity and recurrence of hydrological droughts: A case study from Central Indian Marathwada region. DEC 2018.</li>
                                                            <li>Divyasree SL, Harikumar M, N Sankar, S Chandrakaran, Numerical Modelling of Sand Bed Reinforced with Multi-Directional Plastic Components, NCRAG, GCT Coimbatore APRIL 2018.</li>
                                                            <li>V.L.Nithin, S.Das and H.B.Kaushik, Seismic Scenario Specific Ground Motion Simulations Consistent with Ground Motion Prediction Equation, 16th World Conference on Earthquake Engineering, Santiago, Chile. 2017.</li>
                                                            <li>Kiran, K.S., Devi, A.B. and Nair, A.M., Impact of Land Use Changes in a Micro Watershed Using Remote Sensing and GSI 2017.</li>
                                                            <li>Noushad K, Chandrakaran S, Harikumar M, Settlement Behaviour of Square Footing on Geogrid Reinforced Sand Bed, National Conference on Technological Innovations in Sustainable Infrastructure, 2015, NIT Calicut MAR 2015.</li>
                                                            <li>Harikumar, M., Sankar, N. and Chandrakaran, S., Prediction of shear strength of cohesionless soils reinforced with 3d inclusions using ANN, International Conference on Soft Ground Engineering (ICSGE 2015), Singapore. 2015.</li>
                                                            <li>Harikumar, M., Sankar, N. and Chandrakaran, S., Behaviour of sand reinforced with multioriented reinforcements, International Conference on Sustainable Civil Infrastructure, 2014,ASCE India /IIT Hyderabad 2014.</li>
                                                            <li>V.L.Nithin and S.Das, Development of Non-Linear Design Spectrum & Design Motion Simulation for Damage- Based Seismic Design, 15th Symposium on Earthquake Engineering, Department of Earthquake Engineering, IIT Roorkee. DEC 2014.</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Book Chapters Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'chapters' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('chapters')}
                                            >
                                                <h3 className="research-section-title">Book Chapters</h3>
                                                <div className={`research-arrow ${openResearchSection === 'chapters' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'chapters' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <h4 className="research-subsection-title">Book Chapters</h4>
                                                        <p className="research-intro">
                                                            Faculty members are actively contributing to edited volumes and book chapters in various areas of civil engineering research. The department's expertise spans across multiple domains including:
                                                        </p>
                                                        <ul className="research-publication-list">
                                                            <li><strong>Environmental Engineering:</strong> Municipal solid waste management, leachate treatment, groundwater contamination studies</li>
                                                            <li><strong>Geotechnical Engineering:</strong> Soil reinforcement, foundation engineering, slope stability analysis</li>
                                                            <li><strong>Structural Engineering:</strong> Earthquake engineering, concrete technology, structural dynamics</li>
                                                            <li><strong>Water Resources Engineering:</strong> Hydrological modeling, climate change impact assessment, watershed management</li>
                                                            <li><strong>Construction Materials:</strong> Sustainable construction practices, building debris utilization, hybrid geosynthetics</li>
                                                            <li><strong>Remote Sensing & GIS:</strong> Land use change analysis, urban planning, coastal aquifer studies</li>
                                                        </ul>
                                                        <p className="research-intro">
                                                            The department continues to contribute to academic literature through collaborative research and knowledge sharing in these key areas of civil engineering practice and research.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Book Authors Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'books' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('books')}
                                            >
                                                <h3 className="research-section-title">Book Authors</h3>
                                                <div className={`research-arrow ${openResearchSection === 'books' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'books' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <h4 className="research-subsection-title">Book Publications</h4>
                                                        <ul className="research-publication-list">
                                                            <li>
                                                                <strong>Publication Category: International</strong><br/>
                                                                Harikumar M, Sankar N, Chandrakaran S, Multi-Directional Inclusions: A Novel Mechanism of Earth Reinforcement, Lambert Academic Publishing APRIL 2022
                                                            </li>
                                                            <li>
                                                                <strong>Publication Category: International</strong><br/>
                                                                Balvanshi, A. & Tiwari, H.L. (2021), Runoff Modeling using SCS Curve Number and AWBM Models, Lambert Academic Publishing, ISBN:978-6203574494. Mar 2021
                                                            </li>
                                                        </ul>
                                                        <p className="research-intro">
                                                            Our faculty members have authored comprehensive books that contribute to the academic literature in civil engineering. These publications cover innovative geotechnical engineering techniques and advanced hydrological modeling approaches, serving as valuable resources for researchers, practitioners, and students in the field.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Patents Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'patents' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('patents')}
                                            >
                                                <h3 className="research-section-title">Patents</h3>
                                                <div className={`research-arrow ${openResearchSection === 'patents' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'patents' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <h4 className="research-subsection-title">Patents</h4>
                                                        <ul className="research-publication-list">
                                                            <li>
                                                                <strong>Patent Title:</strong> "A novel earth reinforcement system with multidirectional elements"<br/>
                                                                <strong>Inventors:</strong> Chandrakaran Sreedharan, Mohanan Harikumar, Sankar Natesan<br/>
                                                                <strong>Patent No.:</strong> 202022101791 (German Patent, 2022)
                                                            </li>
                                                        </ul>
                                                        <p className="research-intro">
                                                            The department has successfully filed patents for innovative solutions in geotechnical engineering. This patent represents a groundbreaking advancement in earth reinforcement technology, introducing novel multidirectional elements that enhance the stability and performance of soil structures. The innovation demonstrates the department's commitment to developing practical solutions for real-world civil engineering challenges.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* UG Academic Handbook Section */}
                        {activeSection === 'ug-handbook' && (
                            <section className="content-section">
                                <h2>UG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Undergraduate Academic Handbook for detailed information about the curriculum and academic policies.</p>
                                    <div className="handbook-link">
                                        <a 
                                            href="https://www.nitgoa.ac.in/static/AcademicHandbook_%2030_9_2013-CSE.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="handbook-download-btn"
                                        >
                                            📖 Download UG Academic Handbook (PDF)
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* PG Academic Handbook Section */}
                        {activeSection === 'pg-handbook' && (
                            <section className="content-section">
                                <h2>PG Academic Handbook</h2>
                                <div className="content-text">
                                    <p>Download the Postgraduate Academic Handbook for detailed information about the curriculum and academic policies.</p>
                                    <div className="handbook-link">
                                        <a 
                                            href="https://www.nitgoa.ac.in/static/PG%20Academic%20Handbook%20M.%20Tech%20(CSE).pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="handbook-download-btn"
                                        >
                                            📚 Download PG Academic Handbook (PDF)
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}



                        {/* Handbook Section */}
                        {activeSection === 'handbook' && (
                            <section className="content-section">
                                <h2>Handbook</h2>
                                <div className="content-text">
                                    <p>General handbook and department-specific information for students and faculty.</p>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CivilEngineering;
