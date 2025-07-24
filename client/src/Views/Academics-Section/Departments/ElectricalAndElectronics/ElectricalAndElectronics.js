import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElectricalAndElectronics.css';

const ElectricalAndElectronics = () => {
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
        <div className="electrical-electronics-page">
            <div className="electrical-electronics-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Electrical & Electronics Engineering</h1>
                    <p className="page-subtitle">Department of Electrical and Electronics Engineering</p>
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
                                <h2>Welcome To Electrical Department</h2>
                                
                                <div className="content-text">
                                    <p>
                                        The department of Electrical and Electronics Engineering was established during the inception of the institute in 2010. It offers undergraduate (B. Tech.), postgraduate (M. Tech in Power Electronics and Power Systems), and research programmes in the various fields of Electrical and Electronics Engineering. The faculty members are committed to provide the finest possible education for both graduate and undergraduate students.
                                    </p>
                                    
                                    <p>
                                        The major areas of faculty expertise include Power Systems, Power Electronics, Power Electronic Drives, HVDC Transmission, FACTS Controllers, Electrical Machines, Control Systems, Smart Grid, Signal Processing, Energy Management, Fuzzy Logic, Neural Networks, and Application of Signal Processing in Power Systems and Power Electronics. The Faculty members are actively engaged in various research areas ranging from practical implementation to theoretical investigations. Their research is being published in leading international journals and conferences.
                                    </p>
                                    
                                    <p>
                                        The lab facilities and the infrastructure are regularly upgraded and are well supported by the institute and the industry. Department has MoU with Power Research and Development Consultancy, Bangalore to carry out the collaborative projects.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Research Section */}
                        {activeSection === 'research' && (
                            <section className="content-section">
                                <h2>Research</h2>
                                <div className="research-content">
                                    <p className="research-intro">The department is actively engaged in cutting-edge research in power systems, power electronics, smart grid technology, and renewable energy systems.</p>
                                    
                                    {/* Research Dropdown Sections */}
                                    <div className="research-sections">
                                        {/* Journals Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'journals' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('journals')}
                                            >
                                                <h3 className="research-section-title">Journals</h3>
                                                <div className={`research-arrow ${openResearchSection === 'journals' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'journals' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <ul className="research-publication-list">
                                                            <li>Ratnakar Babu B., Suresh Mikkili, Praveen Kumar B., "Application of Radial Basis Neural Network in MPPT Technique for stand-alone PV system under partial shading conditions", IETE Journal of Research - Taylor & Francis - Accepted - (SCI-E Journal) SEPT 2021.</li>
                                                            <li>Chavan Vinaya Chandrakant and Suresh Mikkili, "Repositioning of Series-Parallel, Total-Cross-Tide, Bridge-Link and Honey-Comb PV array configurations for maximum power extraction", IETE Journal of Research - Taylor & Francis - Accepted - (SCI-E Journal) SEPT 2021.</li>
                                                            <li>Kanjune Akshay B, Suresh Mikkili and Praveen Kumar B, "A Review on Static Reconfiguration Techniques of Solar PV to Mitigate Mismatch Loss and Minimize Partial shading effect", IETE Journal of Research - Taylor & Francis - Accepted - (SCI-E Journal) SEPT 2021.</li>
                                                            <li>Venkata R Reddy and ES Sreeraj, "A Hybrid Islanding Detection Method for One Cycle Controlled PV Inverter System," IEEE Journal of Emerging and Selected Topics in Industrial Electronics, Early Access JULY 2021.</li>
                                                            <li>Aditi Atul Desai and Suresh Mikkili, "Novel Hybrid PV configurations to enhance the output power and efficiency by minimizing number of peaks and mismatching loss", IETE Journal of Research - Taylor & Francis - Accepted - (SCI-E Journal) JUN 2021.</li>
                                                            <li>Chavan Vinaya Chandrakant and Suresh Mikkili, "Effect of PV array positioning on mismatch and wiring losses in Static Array Reconfiguration", IETE Journal of Research - Taylor & Francis - Accepted - (SCI-E Journal) JUN 2021.</li>
                                                            <li>Aswini K. Samantaray, Pranose J Edavoor and Amol D. Rahulkar, "A New Approach to the Design and Implementation of a Family of Multiplier Free Orthogonal Wavelet Filter Banks", Accepted for Publication in IEEE Transactions on Circuits and Systems for Video Technology. JUN 2021.</li>
                                                            <li>Madhu G M, C. Vyjayanthi, Chirag N Modi, "Investigation on Effect of Irradiance Change in Maximum Power Extraction from PV Array Interconnection Schemes during Partial Shading Conditions", IEEE Access, June 2021, IMPRINT 2C.1 Grant No: IMP/2019/000251. JUN 2021.</li>
                                                            <li>Aswini K Samantaray, Amol D. Rahulkar, Pranose J Edavoor, "A Novel Design of Dyadic db3 Orthogonal Wavelet Filter Bank for Feature Extraction", Circuits, Systems, and Signal Processing, Springer, 2021 [Published Online] APRIL 2021</li>
                                                            <li>Ajit Muzumdar, Chirag N Modi, Madhu G M and C. Vyjayanthi, "Designing a Robust and Accurate Model for Consumer Centric Short Term Load Forecasting in Microgrid Environment", IEEE Systems Journal, April 2021. APRIL 2021.</li>
                                                            <li>Ajit Muzumdar, Chirag N Modi, Madhu G M and C. Vyjayanthi, "A Trustworthy and Incentivized Smart Grid Energy Trading Framework using Distributed Ledger and Smart Contracts", Journal of Network and Computer Applications, March 2021. MAR 2021.</li>
                                                            <li>Madhu G M, C. Vyjayanthi, Chirag N Modi, "Adaptive Step-Size based Drift-Free P&O Algorithm with Power Optimizer and Load Protection for Maximum Power Extraction from PV Panels in Standalone Applications", IET Renewable Power Generation, January 2021, Under Grant No. 24/29/2016-SWES (R&D), MNRE, India. JAN 2021.</li>
                                                            <li>VR Reddy, ES Sreeraj, "Grid Voltage Sensor-less Protection scheme for One Cycle-Controlled Single-Phase Photovoltaic Inverter Systems," Accepted for publication in CSEE Journal of Power and Energy Systems 2021.</li>
                                                            <li>Samuel, Anudevi and Shet, Vinayak N. "Adaptive relay settings for distribution network with distributed generation (DG) using Sugeno fuzzy inference" International Journal of Emerging Electric Power Systems, vol. 22, no. 1, 2021, pp. 43-59. JAN 2021.</li>
                                                            <li>Shravan R, Vyjayanthi C, "Coordinated power control without AC voltage sensing and active power filtering using interlinking converter with reduced interlinking power flow in a droop controlled islanded hybrid AC-DC microgrid", International Transactions on Electrical Energy Systems, WILEY, December 2020. DEC 2020.</li>
                                                            <li>Pranose J. Edavoor, Sithara Raveendran and Amol Rahulkar, "Novel 4:2 Approximate Compressor Designs for Multimedia and Neural Network Applications", Journals of Circuits, Systems and Computers, NOV 2020.</li>
                                                            <li>Praveen Kumar B and Suresh Mikkili, "Performance Investigation of Various PV Array Configurations for Grid-Connected/Standalone PV Systems", IEEE CSEE Journal of Power and Energy Systems-Accepted -(SCI-E Journal)–Sept.2020</li>
                                                            <li>Aditi Atul Desai and Suresh Mikkili, "Modelling and Analysis of PV configurations (Alternate TCT-BL, Total Cross Tied, Series, Series Parallel, Bridge Linked and Honey Comb) to extract Maximum Power under Partial Shading Conditions", IEEE CSEE Journal of Power and Energy Systems - Accepted - (SCI-E Journal) JUN 2020</li>
                                                            <li>Suneel Raju Pendem and Suresh Mikkili, "Assessment of Cross-coupling Effects in PV String-Integrated-Converters with P&O MPPT Algorithm under various Partial Shading Patterns", IEEE CSEE Journal of Power and Energy Systems - Accepted - (SCI-E Journal) JUN 2020</li>
                                                            <li>Praveen Kumar B and Suresh Mikkili, "Performance Analysis of PV Array Configurations (SP, BL, HC and TT) to Enhance Maximum Power under Non-Uniform Shading conditions", Accepted - Engineering Reports - Wiley MAY 2020</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Proceedings Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'proceedings' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('proceedings')}
                                            >
                                                <h3 className="research-section-title">Proceedings</h3>
                                                <div className={`research-arrow ${openResearchSection === 'proceedings' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'proceedings' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <ul className="research-publication-list">
                                                            <li>Madhu G M, C. Vyjayanthi and C N Modi, "Change in Power based P&O Algorithm for Maximum Power Extraction in Solar Energy Conversion System," 2021 International Conference on Power Systems (ICPS), Kharagpur, India, 16-18 December, 2021. DEC 2021</li>
                                                            <li>Nivedita N Naik and C.Vyjayanthi, "Research on Electric Vehicle Charging System: Key Technologies, Communication Techniques, Control Strategies and Standards", IEEE International Conference on Electrical Power and Energy Systems (ICEPES-2021), 10-11 December 2021, MNIT Jaipur. DEC 2021</li>
                                                            <li>Mayank Arora and C Vyjayanthi, "Optimized Solar PV grid connection for EV charging application", IEEE Bombay Section Signature Conference IBSSC-2021, themed - Frontiers of Technologies: Fuelling Prosperity of the Planet and People, 18-20 November 2021, IIIT Gwalior. NOV 2021</li>
                                                            <li>Nivedita N Naik and C.Vyjayanthi, "Optimization of Vehicle-to-Grid (V2G) Services for Development of Smart Electric Grid: A Review", International Conference on Smart Generation Computing, Communication and Networking - A Hybrid Conference (SMARTGENCON 2021), 29-30 October 2021. OCT 2021</li>
                                                            <li>V C Chavan, Suresh Mikkili, and Praveen Kumar B, 'Novel Shade Dispersion Method to Extract Maximum Power under partial shading condition', in proceedings of 47th Annual Conference of the IEEE Industrial Electronics Society IEEE IECON 2021, 13th to 16th October 2021, Toronto, Canada OCT 2021</li>
                                                            <li>Mayank Arora and C. Vyjayanthi, "K Factor-based MPPT Technique for Reducing Steady-State power oscillations", The IEEE International Conference on Intelligent Technologies (CONIT 2021)" Hubballi, Karnataka, India, 25-27, June 2021. JUN 2021</li>
                                                            <li>Mayank Arora and C.Vyjayanthi, "Modified Hysteresis Current Control Implementation for Three Phase Grid Connected Inverter", 2nd Electric Power And Renewable Energy Conference (EPREC-2021), 28th - 30th May 2021, NIT Jamshedpur, Springer. MAY 2021</li>
                                                            <li>Aditya Jyoti and C.Vyjayanthi, "Solar PV assisted Electric Vehicle Charging: A Comprehensive Study", 2nd Electric Power And Renewable Energy Conference (EPREC-2021), 28th - 30th May 2021, NIT Jamshedpur, Springer. MAY 2021</li>
                                                            <li>R B Bollipo, Suresh Mikkili and P K Bonthagorla, 'Fuzzy Logic Controller-based Cuckoo Search MPPT Technique for Uniform and Non-uniform Irradiation Conditions', in proceedings of 16th IEEE India Council International Conference (INDICON 2019), December 13-15, 2019, Rajkot, India. DEC 2019</li>
                                                            <li>Suneel Raju Pendem and Suresh Mikkili, 'Distributed-MPPT Technique: SP Configuration of PV String-Integrated-Converters to Harvest Maximum Power from Solar PV Array under Non-uniform Irradiation Conditions,' in proceedings of 16th IEEE India Council International Conference (INDICON 2019), December 13-15, 2019, Rajkot, India. DEC 2019</li>
                                                            <li>Vinay Kumar Kolakaluri and Suresh Mikkili, 'Smart Battery Charging with PV Fed Three Port Converter for Reducing AH Battery Capacity in Standalone Applications,' in proceedings of 16th IEEE India Council International Conference (INDICON 2019), December 13-15, 2019, Rajkot, India. DEC 2019</li>
                                                            <li>Anudevi Samuel., V.N.Shet, "Fuzzy Adaptive Relay Settings for Distribution Network with DG" - Proceedings of the National Power Electronics Conference (NPEC)-2019, December 13-15, NIT Tiruchirappalli, India, IEEE Digital Xplore. DEC 2019</li>
                                                            <li>Shreyas Joshi and Madhu G M, "Smart Battery Charger using Arduino for Lead Acid Batteries," IEEE International Conference on Electrical, Computer and Communication Technologies (ICECCT) 2019, February 20-22, Coimbatore, India. FEB 2019</li>
                                                            <li>M. Manjunath and V. R. Barry, "M2 algorithm-based solar PV array reconfiguration for enhanced power extraction under partial shade conditions," 2018 International Conference on Power Energy, Environment and Intelligent Control (PEEIC), Greater Noida, India, 2018, pp. 759-765. 2018</li>
                                                            <li>Suneel Raju Pendem and Suresh Mikkili, "Performance Analysis and Modelling of PV Array Configurations to Mitigate Mismatch Losses," 2018 8th IEEE India International Conference on Power Electronics (IICPE), Jaipur, India, 2018, pp. 1-6. 2018</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Books/Book Chapters Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'books' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('books')}
                                            >
                                                <h3 className="research-section-title">Book\Book Chapter</h3>
                                                <div className={`research-arrow ${openResearchSection === 'books' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'books' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <h4 className="research-subsection-title">Book Chapters:</h4>
                                                        <ul className="research-publication-list">
                                                            <li>Aswini K. Samantaray, Amol D. Rahulkar, "Wavelet Transform for Cardiac Image Retrieval". Book chapter in: Image Processing Methods for Automatic Diagnosis of Cardiac Diseases (chapter-8), Elsevier, December 2020 DEC 2020</li>
                                                            <li>Amita Shinde, Amol Rahulkar, C Y Patil (2020) Directional Multiscale Feature Extraction for Biomedical Image Indexing and Retrieval Using Contourlet Transform. Book chapter in: A. Abraham, A. Cherukuri, P. Melin, N. Gandhi (eds), "Intelligent Systems Design and Applications", Advances in Intelligent Systems and Computing, vol 940. Springer, Cham, 2019.</li>
                                                        </ul>
                                                        
                                                        <h4 className="research-subsection-title">Books Authored:</h4>
                                                        <ul className="research-publication-list">
                                                            <li>Jayanand Gawande, Amol Rahulkar and Raghunath Holambe, "Design of Wavelets and Filter Banks:New Methods and Application to Chromosome Image Compression", LAP-Lambert Academic Publisher, ISBN-978-613-8-38779-4, March 22, 2018. MAR 2018</li>
                                                            <li>Amol D. Rahulkar, "Advanced Control System: Analysis and Design" [Available online] http://idr.nitgoa.ac.in:8080/jspui/handle/123456789/26, 2017. SEPT 2017</li>
                                                            <li>Suresh Mikkilli and Anup kumar Panda, "Power Quality Issues : Current Harmonics", CRC Press, Taylor & Francis Group, August, 2015, ISBN 9781498729628.</li>
                                                            <li>Amol D. Rahulkar and Raghunath S. Holambe,"Iris Image Recognition: New Wavelet Filter-banks Based Iris Feature Extraction Schemes", Springer, Series- SpringerBriefs in Electrical and Computer Engineering, New York, ISBN 978-3-319-06767-4. 2014.</li>
                                                            <li>Mainak Sengupta, Soumitra Das and Aparajita Sengupta, "Elements of Design, Fabrication and Analysis for a light SR Motor," VDM Verlag Dr. Mullar. 2010. ISBN: 978-3-639-28685-4 2010</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Research Projects Section */}
                                        <div className="research-dropdown-section">
                                            <div 
                                                className={`research-section-header ${openResearchSection === 'projects' ? 'active' : ''}`}
                                                onClick={() => toggleResearchSection('projects')}
                                            >
                                                <h3 className="research-section-title">Research Projects</h3>
                                                <div className={`research-arrow ${openResearchSection === 'projects' ? 'rotated' : ''}`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className={`research-section-content ${openResearchSection === 'projects' ? 'expanded' : ''}`}>
                                                <div className="research-items research-scrollable">
                                                    <div className="research-card">
                                                        <div className="research-project">
                                                            <h4 className="research-faculty-name">Dr. B. Venugopal. Reddy</h4>
                                                            <div className="project-details">
                                                                <p><strong>Title:</strong> "Design and Development of a Dynamic Photovoltaic Array fed Single-Stage PV Pumping System using an Open-End Winding Induction Motor"</p>
                                                                <p><strong>Funding Agency:</strong> Science and Engineering Research Board, Department of Science and Technology, India</p>
                                                                <p><strong>Duration:</strong> 2019-2022</p>
                                                                <p><strong>Sanction Fund:</strong> 21.6 Lakh</p>
                                                                <p><strong>Role:</strong> PI</p>
                                                                <p><strong>Status:</strong> Ongoing</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="research-project">
                                                            <h4 className="research-faculty-name">Dr. Suresh Mikkili</h4>
                                                            <div className="project-details">
                                                                <p><strong>Title:</strong> "Design and Dev. of an Efficient Grid-Integrated Distributed Maximum Power Point Tracking to Photovoltaic system for Enhancing Power Quality under Partial Shading Conditions"</p>
                                                                <p><strong>Funding Agency:</strong> Science and Engineering Research Board, Department of Science and Technology, India</p>
                                                                <p><strong>Duration:</strong> 2017-2020</p>
                                                                <p><strong>Sanction Fund:</strong> 40.6 Lakh</p>
                                                                <p><strong>Role:</strong> PI</p>
                                                                <p><strong>Status:</strong> Ongoing</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="research-project">
                                                            <h4 className="research-faculty-name">Dr. Sreeraj E S</h4>
                                                            <div className="project-details">
                                                                <p><strong>Title:</strong> "Design & Implementation of an Inverter for a Grid Connected Photovoltaic System which is a part of Virtual Power Plant"</p>
                                                                <p><strong>Funding Agency:</strong> Science and Engineering Research Board, Department of Science and Technology, India</p>
                                                                <p><strong>Duration:</strong> 2016-2019</p>
                                                                <p><strong>Sanction Fund:</strong> 33.7 Lakh</p>
                                                                <p><strong>Role:</strong> PI</p>
                                                                <p><strong>Status:</strong> Ongoing</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="research-project">
                                                            <h4 className="research-faculty-name">Dr. Amol D. Rahulkar</h4>
                                                            <div className="project-details">
                                                                <p><strong>Project 1 - Title:</strong> "Design and Development of Fingerprint and Face Recognition System for Infants and Toddlers"</p>
                                                                <p><strong>Funding Agency:</strong> Science and Engineering Research Board, Department of Science and Technology, India</p>
                                                                <p><strong>Duration:</strong> 2017-2020</p>
                                                                <p><strong>Sanction Fund:</strong> 16.5 Lakh</p>
                                                                <p><strong>Role:</strong> PI</p>
                                                                <p><strong>Status:</strong> Ongoing</p>
                                                                
                                                                <p style={{marginTop: '1rem'}}><strong>Project 2 - Title:</strong> "Design and Development of Robust Distributed Nonlinear Channel Equalization and Identification"</p>
                                                                <p><strong>Funding Agency:</strong> Science and Engineering Research Board, Department of Science and Technology, India</p>
                                                                <p><strong>Duration:</strong> 2016-2019</p>
                                                                <p><strong>Sanction Fund:</strong> 25.6 Lakh</p>
                                                                <p><strong>Role:</strong> Co–PI</p>
                                                                <p><strong>Status:</strong> Ongoing</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="research-project">
                                                            <h4 className="research-faculty-name">Dr. C. Vyjayanthi</h4>
                                                            <div className="project-details">
                                                                <p><strong>Project 1 - Title:</strong> "Developing Smart Controller for Optimum Utilization of Energy and Trustworthy Management in a Micro Grid Environment"</p>
                                                                <p><strong>Funding Agency:</strong> Science and Engineering Research Board, Department of Science and Technology, India</p>
                                                                <p><strong>Duration:</strong> 2020-2023</p>
                                                                <p><strong>Sanction Fund:</strong> 1 Cr</p>
                                                                <p><strong>Role:</strong> Co–PI</p>
                                                                <p><strong>Status:</strong> Ongoing</p>
                                                                
                                                                <p style={{marginTop: '1rem'}}><strong>Project 2 - Title:</strong> "Development of coordination control schemes for hybrid AC/DC micro grids for a stable and reliable system operation"</p>
                                                                <p><strong>Funding Agency:</strong> Science and Engineering Research Board, Department of Science and Technology, India</p>
                                                                <p><strong>Duration:</strong> 2017-2020</p>
                                                                <p><strong>Sanction Fund:</strong> 42.0 Lakh</p>
                                                                <p><strong>Role:</strong> PI</p>
                                                                <p><strong>Status:</strong> Ongoing</p>
                                                            </div>
                                                        </div>
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
                                    <p>Download the Undergraduate Academic Handbook for detailed information about the B.Tech EEE curriculum and academic policies.</p>
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
                                    <p>Download the Postgraduate Academic Handbook for detailed information about the M.Tech Power Electronics and Power Systems programs.</p>
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

export default ElectricalAndElectronics;
