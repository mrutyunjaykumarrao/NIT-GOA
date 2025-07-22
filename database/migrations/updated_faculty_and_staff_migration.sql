-- Updated Faculty and Staff Migration Script
-- This script updates faculty data based on the Faculty.js file
-- and creates/populates technical and administrative staff tables

USE nitgoa_db;

-- First, let's backup current faculty data if needed
-- CREATE TABLE faculty_profiles_backup AS SELECT * FROM faculty_profiles;

-- Clear existing faculty data
DELETE FROM faculty_profiles;
ALTER TABLE faculty_profiles AUTO_INCREMENT = 1;

-- Insert updated faculty data with sequential IDs (001, 002, etc.)
INSERT INTO faculty_profiles (
    id, employee_id, first_name, last_name, full_name, email, phone, 
    department, designation, research_areas, profile_image, 
    is_hod, display_order, is_active
) VALUES 

-- CSE Department (IDs 1-12)
(1, '001', 'Dr. Veena', 'Thenkanidiyoor', 'Dr. Veena Thenkanidiyoor', 'veenat@nitgoa.ac.in', '0832-2404432', 'CSE', 'Associate Professor & HOD', 'Deep Learning, Kernel Methods, Pattern Recognition, Applied Machine Learning, Computer Vision, Speech Processing, Weather Data Analysis, Content based Information Retrieval', 'client/src/assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png', TRUE, 1, TRUE),
(2, '002', 'Dr. Damodar Reddy', 'Edla', 'Dr. Damodar Reddy Edla', 'dr.reddy@nitgoa.ac.in', '0832-2404433', 'CSE', 'Associate Professor', 'Artificial Intelligence; Cognitive Neuroscience; Brain Computer Interface; Medical Imaging; Wireless Sensor Networks; Machine Learning/Deep Learning; Internet of Medical Things (IoMT);', 'client/src/assets/images/Faculty/CSE/Dr. Damodar Reddy Edla.png', FALSE, 2, TRUE),
(3, '003', 'Dr. Keshavamurthy', 'B.N.', 'Dr. Keshavamurthy B.N.', 'bnkeshav.fcse@nitgoa.ac.in', '0832-2404403', 'CSE', 'Associate Professor', ' Data Mining, Privacy Preserving Data Mining, Stream Data Mining, Social Media Mining', 'client/src/assets/images/Faculty/CSE/Dr. Keshavamurthy B.N..png', FALSE, 3, TRUE),
(4, '004', 'Dr. S.', 'Mini', 'Dr. S. Mini', 'mini@nitgoa.ac.in', '0832-2404419', 'CSE', 'Associate Professor', 'Wireless Sensor Networks, Swarm Intelligence, Combinatorial Optimization, Internet of Things', 'client/src/assets/images/Faculty/CSE/Dr. S. Mini.png', FALSE, 4, TRUE),
(5, '005', 'Dr. Pravati', 'Swain', 'Dr. Pravati Swain', 'pravati@nitgoa.ac.in', '0832-2404420', 'CSE', 'Assistant Professor', 'Quantum Machine learning, AI/ML for communication network: Federated learning, Advanced Mobile Communication (B5G/6G), IoT-Edge- Cloud Continuum Systems. Game theory and Markov Model', 'client/src/assets/images/Faculty/CSE/paravati_cse.png', FALSE, 5, TRUE),
(6, '006', 'Dr. Venkatanareshbabu', 'Kuppili', 'Dr. Venkatanareshbabu Kuppili', 'venkatanaresh@nitgoa.ac.in', '0832-2404402', 'CSE', 'Assistant Professor', 'Big Data Analytics, Artificial Intelligence, Deep Learning, Soft Computing', 'client/src/assets/images/Faculty/CSE/Dr. Venkatanareshbabu Kuppili.jpg', FALSE, 6, TRUE),
(7, '007', 'Dr. Modi Chirag', 'Navinchandra', 'Dr. Modi Chirag Navinchandra', 'cnmodi@nitgoa.ac.in', '0832-2404431', 'CSE', 'Associate Professor', 'Blockchain, Cryptography and Network Security, Information Security and Privacy, Cloud Computing, Visual Computing', 'client/src/assets/images/Faculty/CSE/Dr. Modi Chirag Navinchandra.png', FALSE, 7, TRUE),
(8, '008', 'Mrs. Sreedivya', 'I.', 'Mrs. Sreedivya I.', 'sreedivya@nitgoa.ac.in', '0832-2404413', 'CSE', 'Faculty on Contract', 'Machine Learning, Data Mining', 'client/src/assets/images/Faculty/CSE/srividya.jpeg', FALSE, 8, TRUE),
(9, '009', 'Dr. Meenakshi', 'Panda', 'Dr. Meenakshi Panda', 'meenakshi.panda@nitgoa.ac.in', '0832-2404418', 'CSE', 'Faculty on Contract', 'Wireless Sensor Networks (WSNs), Internet of Things (IoT), Machine Learning, Data Analytics, Fault Tolerance in WSN', 'client/src/assets/images/Faculty/CSE/meenakshipanda.jpeg', FALSE, 9, TRUE),
(10, '010', 'Dr. Chandelkar', 'K K', 'Dr. Chandelkar K K', 'kashinath@nitgoa.ac.in', '0832-2404401', 'CSE', 'Faculty on Contract', 'Data Mining & Warehousing, cloud computing, Information retrieval, Cyber security, Digital Forensics, Content based Information Retrieval', 'client/src/assets/images/Faculty/CSE/kashinath.jpg', FALSE, 10, TRUE),
(11, '011', 'Ms. Antara', 'Dessai', 'Ms. Antara Dessai', 'antaradessai@nitgoa.ac.in', '0832-2404401', 'CSE', 'Faculty on Contract', 'Software Engineering, Programming Languages, Algorithms', 'client/src/assets/images/Faculty/CSE/Antara.jpg', FALSE, 11, TRUE),
(12, '012', 'Mr. MOHD. JAHANGEER', 'PASHA', 'Mr. MOHD. JAHANGEER PASHA', 'jahangeer@nitgoa.ac.in', '0832-2404401', 'CSE', 'Faculty on Contract', '', 'client/src/assets/images/Faculty/CSE/pasha.jpg', FALSE, 12, TRUE),

-- ECE Department (IDs 13-24)
(13, '013', 'Dr. T.', 'Veerakumar', 'Dr. T. Veerakumar', 'tveerakumar@nitgoa.ac.in', '0832-2404520', 'ECE', 'Associate Professor & HOD', 'Image Compression, Image Denoising, Object detection and tracking,and Medical Image Analysis', 'client/src/assets/images/Faculty/ECE/drveerakumar.jpeg', TRUE, 1, TRUE),
(14, '014', 'Dr. Vasantha', 'M.H', 'Dr. Vasantha M.H', 'vasanthmh@nitgoa.ac.in', '0832-2404546', 'ECE', 'Associate Professor', 'Low voltage, Low power analog mixed signal circuits, Continuous-time filter Circuits, System on Chip, FPGA based algorithm Implementation', 'client/src/assets/images/Faculty/ECE/Dr. Vasantha (1).jpg', FALSE, 2, TRUE),
(15, '015', 'Dr. Anirban', 'Chatterjee', 'Dr. Anirban Chatterjee', 'snanirban@nitgoa.ac.in', '0832-2404519', 'ECE', 'Associate Professor', "Antennas Modeling, Antenna Array, Microstrip Antenna Design, Fractal Antennas, Antenna Measurements, Beam Steerable Antennas, Wearable Antennas, Microstrip Reflectarray, DRA's", 'client/src/assets/images/Faculty/ECE/Dr. Anirban Chatterjee.png', FALSE, 3, TRUE),
(16, '016', 'Dr. Nithin Kumar', 'Y.B.', 'Dr. Nithin Kumar Y.B.', 'nithin.shastri@nitgoa.ac.in', '0832-2404547', 'ECE', 'Associate Professor', 'Analog and Mixed Signal Design, Data Converter', 'client/src/assets/images/Faculty/ECE/Dr. Nithin Kumar Y.B..png', FALSE, 4, TRUE),
(17, '017', 'Dr. Trilochan', 'Panigrahi', 'Dr. Trilochan Panigrahi', 'tpanigrahi@nitgoa.ac.in', '0832-2404502', 'ECE', 'Associate Professor', 'Distributed Signal Processing, Array Signal Processing, IoT and Nano WSN', 'client/src/assets/images/Faculty/ECE/Dr. Trilochan Panigrahi.jpg', FALSE, 5, TRUE),
(18, '018', 'Dr. Shivnarayan', 'Patidar', 'Dr. Shivnarayan Patidar', 'shivnarayan.patidar@nitgoa.ac.in', '0832-2404532', 'ECE', 'Assistant Professor', 'Biomedical Signal Analysis and Processing, Machine Learning, Multi-resolution Analysis, Time-frequency Analysis, Wavelet Transforms, and Tensor Analysis', 'client/src/assets/images/Faculty/ECE/Dr. Shivnarayan Patidar.png', FALSE, 6, TRUE),
(19, '019', 'Dr. Prashanth', 'G.R', 'Dr. Prashanth G.R', 'grprashanth@nitgoa.ac.in', '0832-2404533', 'ECE', 'Associate Professor', 'Bio-photonics, Bio-Sensors', 'client/src/assets/images/Faculty/ECE/Dr. Prashanth G.R.jpg', FALSE, 7, TRUE),
(20, '020', 'Dr. Lalat Indu', 'Giri', 'Dr. Lalat Indu Giri', 'lig@nitgoa.ac.in', '0832-2404531', 'ECE', 'Assistant Professor', 'Infrared Thermography, One dimensional nanostructures, Clean energy sources and systems', 'client/src/assets/images/Faculty/ECE/Dr. Lalat Indu Giri.png', FALSE, 8, TRUE),
(21, '021', 'Dr. Pragati', 'Patel', 'Dr. Pragati Patel', 'pragati@nitgoa.ac.in', '0832-2404534', 'ECE', 'Assistant Professor', 'Dielectric Resonator Antennas, RF and Microwave Engineering, Wireless Power Transmission', 'client/src/assets/images/Faculty/ECE/Dr. Pragati Patel.png', FALSE, 9, TRUE),
(22, '022', 'Dr. Mallikarjun', 'Erramshetty', 'Dr. Mallikarjun Erramshetty', 'emallikarjuna@nitgoa.ac.in', '0832-2404521', 'ECE', 'Assistant Professor', 'Microwave Imaging, Terahertz Imaging, Inverse Problems', 'client/src/assets/images/Faculty/ECE/Dr. Mallikarjun Erramshetty.png', FALSE, 10, TRUE),
(23, '023', 'Dr. Lokesh Kumar', 'Bramhane', 'Dr. Lokesh Kumar Bramhane', 'lokesh.bramhane@nitgoa.ac.in', '0832-2404518', 'ECE', 'Assistant Professor', 'VLSI Circuit Design, Semiconductor Devices, Biosensors, Memristors, IC design, Antenna Design & Fabrication', 'client/src/assets/images/Faculty/ECE/Dr. Lokesh Kumar Bramhane.png', FALSE, 11, TRUE),
(24, '024', 'Dr. Devesh', 'Dwivedi', 'Dr. Devesh Dwivedi', 'devesh.dwivedi@nitgoa.ac.in', '- (Internal)', 'ECE', 'Visiting Faculty', 'Memory, Analog and Mixed Signal, High Speed Serial Links, Cores, Test Chip, Custom Layout', 'client/src/assets/images/Faculty/ECE/Dr. Devesh Dwivedi.png', FALSE, 12, TRUE),

-- EEE Department (IDs 25-34)
(25, '025', 'Dr. Suresh', 'Mikkili', 'Dr. Suresh Mikkili', 'mikkili.suresh@nitgoa.ac.in', '0832-2404645 | HoD Office : 252', 'EEE', 'Associate Professor & HOD', 'Smart Electric Grid, Electric vehicles, Grid connected/Stand-Alone PV Systems, Wireless Power Transfer, Renewable Energy Systems, Power Quality Issues and Applications of Soft Computing Techniques', 'client/src/assets/images/Faculty/EEE/Dr. Suresh Mikkili.png', TRUE, 1, TRUE),
(26, '026', 'Dr. Sreeraj', 'E S', 'Dr. Sreeraj E S', 'sreeraj@nitgoa.ac.in', '0832-2404617', 'EEE', 'Associate Professor', 'Power electronics, Renewable energy', 'client/src/assets/images/Faculty/EEE/Dr. Sreeraj E S.png', FALSE, 2, TRUE),
(27, '027', 'Dr. Amol D.', 'Rahulkar', 'Dr. Amol D. Rahulkar', 'amol.rahulkar@nitgoa.ac.in', '0832-2404630', 'EEE', 'Associate Professor', 'Digital Signal/Image Processing, Design of Wavelets, FPGA based Hardware Accelerators,Design of Neural Networks, Biometrics, Control Systems', 'client/src/assets/images/Faculty/EEE/Dr. Amol D. Rahulkar.jpg', FALSE, 3, TRUE),
(28, '028', 'Dr. C.', 'Vyjayanthi', 'Dr. C.Vyjayanthi', 'c.vyjayanthi@nitgoa.ac.in', '0832-2404632', 'EEE', 'Associate Professor', 'Restructured Power Systems; Planning, Operation and Control of Power Systems; Electric Arc Furnace Operations; Smart Electric Grids; FACTS; AC/DC Microgrids, Electric Vehicles.', 'client/src/assets/images/Faculty/EEE/Dr. C.Vyjayanthi.png', FALSE, 4, TRUE),
(29, '029', 'Dr. Soumitra', 'Das', 'Dr. Soumitra Das', 'sdas@nitgoa.ac.in', '0832-2404643', 'EEE', 'Associate Professor', 'Power Electronics, Multilevel Converter, Pulsewidth Modulation, Switched Reluctance Motor and Drives, Renewable Energy Sources', 'client/src/assets/images/Faculty/EEE/Dr. Soumitra Das.png', FALSE, 5, TRUE),
(30, '030', 'Dr. Anudevi', 'Samuel', 'Dr. Anudevi Samuel', 'ad.dksamuel@nitgoa.ac.in', '0832-2404618', 'EEE', 'Faculty on contract', 'Power System, Distributed Generation, Fuzzy controllers and Fuzzy Clustering', 'client/src/assets/images/Faculty/EEE/Dr. Anudevi Samuel.png', FALSE, 6, TRUE),
(31, '031', 'Dr. Senthamizh Selvan', 'S', 'Dr. Senthamizh Selvan S', 'senthamizh@nitgoa.ac.in', '0832-2404644', 'EEE', 'Faculty on contract', 'Maximum power point tracking of partial shaded solar photovoltaic array system. Fault analysis in solar PV system, its detection and location identification', 'client/src/assets/images/Faculty/EEE/SENTHAMIZH SELVAN S.jpeg', FALSE, 7, TRUE),
(32, '032', 'Dr. Ankeshwarapu', 'Sunil', 'Dr. Ankeshwarapu Sunil', 'ankeshwarapu.sunil@nitgoa.ac.in', '0832-2404635', 'EEE', 'Faculty on contract', 'Active Distribution Systems, AI applications to Power and Energy Systems, Soft Computing Techniques for Optimization Problems', 'client/src/assets/images/Faculty/EEE/Ankeshwarapu Sunil.jpg', FALSE, 8, TRUE),
(33, '033', 'Dr. K. Raghavendra', 'Reddy', 'Dr. K. Raghavendra Reddy', 'raghavendrareddy@nitgoa.ac.in', '0832-2404634', 'EEE', 'Faculty on contract', 'Power converters, Multilevel Inverters, Electric and Hybrid Vehicles, Renewable Energy Systems', 'client/src/assets/images/Faculty/EEE/Dr. K Raghavenrda Reddy.jpeg', FALSE, 9, TRUE),
(34, '034', 'Dr. Vijaya Bhaskar', 'Somu', 'Dr. Vijaya Bhaskar Somu', 'somu@nitgoa.ac.in', '0832-2404633', 'EEE', 'Faculty on contract', 'Lightning Electromagnetics, Pulsed power technology, High voltage engineering and High power electromagnetics', 'client/src/assets/images/Faculty/EEE/somu.jpeg', FALSE, 10, TRUE),

-- MCE Department (IDs 35-45)
(35, '035', 'Dr. Prasenjit', 'Dey', 'Dr. Prasenjit Dey', 'prasenjit.dey@nitgoa.ac.in', '0832-2404834', 'MCE', 'Associate Professor & HOD', 'Experimental and Numerical Fluid Flow, CFD, Multi-Phase Flow, Micro and Nano Heat Transfer.', 'client/src/assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png', TRUE, 1, TRUE),
(36, '036', 'Dr. B.', 'Santhi', 'Dr. B. Santhi', 'santhi@nitgoa.ac.in', '0832-2404829', 'MCE', 'Associate Professor', 'Design for Assembly,Ergonomics, Virtual Reality, Reverse Engineering,Product Design for Elderly and Kids, Creative Engineering Design', 'client/src/assets/images/Faculty/MCE/Dr. B. Santhi.png', FALSE, 2, TRUE),
(37, '037', 'Dr. Abhijit', 'Sarkar', 'Dr. Abhijit Sarkar', 'sarkarabhijit@nitgoa.ac.in', '0832-2404835', 'MCE', 'Faculty on Contract', 'Manufacturing Technology, Welding', 'client/src/assets/images/Faculty/MCE/Dr. Abhijit Sarkar.png', FALSE, 3, TRUE),
(38, '038', 'Dr. Gaurang', 'Ruhela', 'Dr. Gaurang Ruhela', 'gaurang@nitgoa.ac.in', '0832-2404836', 'MCE', 'Faculty on Contract', 'Nonlinear Dynamics, Waves and Mechanical Vibrations, Vibrations Induced Particle Motion', 'client/src/assets/images/Faculty/MCE/Dr. Gaurang Ruhela.png', FALSE, 4, TRUE),
(39, '039', 'Dr. Darius Diogo', 'Barreto', 'Dr. Darius Diogo Barreto', 'darius.barreto@nitgoa.ac.in', '0832-2404820', 'MCE', 'Faculty on Contract', 'Computational Mechanics, Non linear Finite Element Methods, Magneto-electro-elastic effects in Cosserat rods', 'client/src/assets/images/Faculty/MCE/Dr. Darius Diogo Barreto.png', FALSE, 5, TRUE),
(40, '040', 'Dr. Pravin Anandrao', 'Pawar', 'Dr. Pravin Anandrao Pawar', 'pravinpawar@nitgoa.ac.in', '0832-2404836', 'MCE', 'Faculty on Contract', 'Traditional and Non-Traditional Machining Processes, Manufacturing Engineering, Materials Science', 'client/src/assets/images/Faculty/MCE/Dr. Pravin Anandrao Pawar.png', FALSE, 6, TRUE),
(41, '041', 'Prof. Animesh', 'Chatterjee', 'Prof. Animesh Chatterjee', 'achatterjee@mec.vnit.ac.in', '0832-2404802', 'MCE', 'Adjunct Faculty', 'Machine Dynamics, Fracture Mechanics, Power Plant Engineering', 'client/src/assets/images/Faculty/MCE/animesh.jpeg', FALSE, 7, TRUE),
(42, '042', 'Dr. Nadimetla', 'Thirupathi', 'Dr. Nadimetla Thirupathi', 'thirupathi@nitgoa.ac.in', '0832-2404821', 'MCE', 'Faculty on Contract', 'Electromagnetic Impulse Forming Process, Electromagnetic Powder Compaction and Electromagnetic Forming Process FEM Modelling, Electromagnetic Welding, Powder Metallurgy, Electro Hydro Forming Process, Vaporized Foil Actuator Forming, WAM (Wire Arc Additive Manufacturing Process), and Friction Stir Welding', 'client/src/assets/images/Faculty/MCE/thirupathi.jpg', FALSE, 8, TRUE),
(43, '043', 'Dr. Hiru Purushothaman', 'Hirudayanathan', 'Dr. Hiru Purushothaman Hirudayanathan', 'hirupurushothaman@nitgoa.ac.in', '0832-2404835', 'MCE', 'Faculty on Contract', 'Manufacturing, Minimum Quantity Lubrication, Automation, Mechatronics', 'client/src/assets/images/Faculty/MCE/hiru.jpg', FALSE, 9, TRUE),
(44, '044', 'Dr. Samar', 'Singhal', 'Dr. Samar Singhal', 'samarsinghal@nitgoa.ac.in', '0832-2404820', 'MCE', 'Faculty on Contract', 'Numerical Heat transfer, Experimental Heat transfer and its applications, Computational fluid dynamics', 'client/src/assets/images/Faculty/MCE/Samar Singhal.jpg', FALSE, 10, TRUE),
(45, '045', 'Dr. Chaitanya', 'Vundru', 'Dr. Chaitanya Vundru', 'chaitanya.vundru@nitgoa.ac.in', '0832-2404820', 'MCE', 'Faculty on Contract', 'Additive manufacturing, Cold spray process, Directed energy deposition, Computational mechanics, Sintering', 'client/src/assets/images/Faculty/MCE/Chaitanya Vundru.jpeg', FALSE, 11, TRUE),

-- CVE Department (IDs 46-54)
(46, '046', 'Dr. Harikumar', 'M', 'Dr. Harikumar M', 'harikumar@nitgoa.ac.in', '0832-2404846', 'CVE', 'Associate Professor & HOD', 'Experimental Soil Mechanics, Hybrid Geosynthetics for soil slopes, Sustainability in Geotechnical Engineering, Model Foundation studies, Unconventional Earth Reinforcement Techniques, Expert Systems in Geotechnical', 'client/src/assets/images/Faculty/CVE/Dr. Harikumar M.png', TRUE, 1, TRUE),
(47, '047', 'Prof. O. R.', 'Jaiswal', 'Prof. O. R. Jaiswal', 'orjaiswal@nitgoa.ac.in', '0832-2404847', 'CVE', 'Professor', '', 'client/src/assets/images/Faculty/CVE/Prof. O. R. Jaiswal.png', FALSE, 2, TRUE),
(48, '048', 'Dr. Saurabh', 'Upadhyay', 'Dr. Saurabh Upadhyay', 'supadhyay@nitgoa.ac.in', '0832-2404833', 'CVE', 'Faculty on Contract', 'Traffic Noise Modelling, Traffic Noise Barrier, Sustainable Transportation Systems, Public Transportation Systems(Bus Rapid Transit System)', 'client/src/assets/images/Faculty/CVE/Dr. Saurabh Upadhyay.jpg', FALSE, 3, TRUE),
(49, '049', 'Dr. Ranendra Nath', 'Bhowmik', 'Dr. Ranendra Nath Bhowmik', 'rbhowmik@nitgoa.ac.in', '0832-2404816', 'CVE', 'Faculty on Contract', 'Concrete Technology, Low-cost housing, Non-destructive testing of concrete, Durability study of concrete.', 'client/src/assets/images/Faculty/CVE/Ranendra Nath Bhowmik.jpg', FALSE, 4, TRUE),
(50, '050', 'Dr. Bapi', 'Mondal', 'Dr. Bapi Mondal', 'bapimondal@nitgoa.ac.in', '0832-2404848', 'CVE', 'Faculty on Contract', 'Material characterization, Structural Analysis, Design of RC and Steel structures, Reliability Analysis, Bamboo based structures', 'client/src/assets/images/Faculty/CVE/Bapi Mondal.jpg', FALSE, 5, TRUE),
(51, '051', 'Dr. Vinamra', 'Mishra', 'Dr. Vinamra Mishra', 'vinamramishra@nitgoa.ac.in', '0832-2404832', 'CVE', 'Faculty on Contract', 'Material Characterization: Aggregate, Bitumen, Soil Asphalt mix design: Marshall method and Superpave mix design specifications.', 'client/src/assets/images/Faculty/CVE/vnm.jpeg', FALSE, 6, TRUE),
(52, '052', 'Dr. Sathishraj', 'Mani', 'Dr. Sathishraj Mani', 'sathishraj@nitgoa.ac.in', '0832-2404832', 'CVE', 'Faculty on Contract', 'Geopolymer Concrete, Microstructure and Durability Studies in Concrete, Construction Management', 'client/src/assets/images/Faculty/CVE/mani.jpg', FALSE, 7, TRUE),
(53, '053', 'Dr. Duduku', 'Saidulu', 'Dr. Duduku Saidulu', 'dudukusaidulu@nitgoa.ac.in', '0832-2404832', 'CVE', 'Faculty on Contract', 'Emerging Contaminants Removal; Biofilm-based Treatment Techniques, Nutrient Recovery; 3D printing Applications in Water and Wastewater; Photocatalysis; PFAS Detection and Remediation.', 'client/src/assets/images/Faculty/CVE/saidulu.png', FALSE, 8, TRUE),
(54, '054', 'Mr. Guntakala Venkatanaga', 'Chandra', 'Mr. Guntakala Venkatanaga Chandra', 'gvnchandra@nitgoa.ac.in', '0832-2404832', 'CVE', 'Faculty on Contract', 'Contamination level, Risk Assessment, Ecological risk Assessment, Source Apportionment Groundwater Quality, Soil contamination, Anaerobic Treatment', 'client/src/assets/images/Faculty/CVE/chandra_cve.jpeg', FALSE, 9, TRUE),

-- APS Department (IDs 55-63)
(55, '055', 'Dr. L.', 'Shangerganesh', 'Dr. L. Shangerganesh', 'shangerganesh@nitgoa.ac.in', '0832-2404728', 'APS', 'Associate Professor & HOD (APS & HSS)', 'Mathematical Biology, Finite Element Methods & Partial Differential Equations', 'client/src/assets/images/Faculty/APS/Dr. L. Shangerganesh.png', TRUE, 1, TRUE),
(56, '056', 'Dr. Saidi Reddy', 'Parne', 'Dr. Saidi Reddy Parne', 'psreddy@nitgoa.ac.in', '0832-2404729', 'APS', 'Associate Professor of Physics', '• Photonics • Fiber Bragg Grating Sensors • Fiber Optic Sensors • Superconducting Motor • Material Characterization • Nanoscale Matter Radar Absorption Materials', 'client/src/assets/images/Faculty/APS/Dr. Saidi Reddy Parne.png', FALSE, 2, TRUE),
(57, '057', 'Dr. Velavan', 'Kathirvelu', 'Dr. Velavan Kathirvelu', 'velavan@nitgoa.ac.in', '0832-2404726', 'APS', 'Associate Professor of Chemistry', '(i) Electron Paramagnetic Resonance (EPR) of Transition Metal Ions and Organic Free Radicals (ii) Application of EPR towards Biology (ii) Chemistry of Lanthanides and Actinides', 'client/src/assets/images/Faculty/APS/Dr. Velavan Kathirvelu.png', FALSE, 3, TRUE),
(58, '058', 'Dr. Ragoju', 'Ravi', 'Dr. Ragoju Ravi', 'ravi@nitgoa.ac.in', '0832-2404743', 'APS', 'Associate Professor of Mathematics', 'Applied Mathematics; Fluid Mechanics; Convective Instability problems; Heat and Mass Transfer', 'client/src/assets/images/Faculty/APS/Dr. Ragoju Ravi.png', FALSE, 4, TRUE),
(59, '059', 'Dr. Ravi Prasad', 'K. J.', 'Dr. Ravi Prasad K. J.', 'k.j.raviprasad@nitgoa.ac.in', '0832-2404727', 'APS', 'Associate Professor of Mathematics', 'Bio-medical Imaging, Inverse problems and Numerical Optimization', 'client/src/assets/images/Faculty/APS/Dr. Ravi Prasad K. J..png', FALSE, 5, TRUE),
(60, '060', 'Dr. Suman', 'Gandi', 'Dr. Suman Gandi', 'gandisuman@nitgoa.ac.in', '0832-2404730', 'APS', 'Faculty on contract', 'Sodium/Lithium-Ion batteries, glass and glass-ceramic materials for energy storage systems.', 'client/src/assets/images/Faculty/APS/Dr. Suman Gandi.png', FALSE, 6, TRUE),
(61, '061', 'Dr. Gundlapally Shiva Kumar', 'Reddy', 'Dr. Gundlapally Shiva Kumar Reddy', 'gshivakumarreddy913@nitgoa.ac.in', '0832-2404742', 'APS', 'Faculty on contract', 'Applied Mathematics, Fluid Dynamics, Hydrodynamic Stability, Linear and Non-linear instability analysis', 'client/src/assets/images/Faculty/APS/Dr. Gundlapally Shiva Kumar Reddy.png', FALSE, 7, TRUE),
(62, '062', 'Dr. Lasitha', 'P', 'Dr. Lasitha P', 'lasitha@nitgoa.ac.in', '0832-2404716', 'APS', 'Faculty on contract', 'Self-assembly, Sensing, and Luminescent materials', 'client/src/assets/images/Faculty/APS/Dr. Lasitha P.png', FALSE, 8, TRUE),

-- HSS Department (IDs 63-66)
(63, '063', 'Dr. Sarani Ghosal', 'Mondal', 'Dr. Sarani Ghosal Mondal', 'sarani@nitgoa.ac.in', '0832-2404741', 'HSS', 'Associate Professor of English', 'Culture Studies, Applied Linguistics and Comparative Mysticism', 'client/src/assets/images/Faculty/HSS/Dr. Sarani Ghosal Mondal.jpg', FALSE, 1, TRUE),
(64, '064', 'Dr. Sunil', 'Kumar', 'Dr. Sunil Kumar', 'sunilkumar@nitgoa.ac.in', '0832-2404715', 'HSS', 'Assistant Professor of Economics', 'R&D, Patents, and Productivity. IPR, Firms innovation, and growth. Innovation and Sustainable Development', 'client/src/assets/images/Faculty/HSS/Dr. Sunil Kumar.png', FALSE, 2, TRUE),
(65, '065', 'Dr. Unais', 'KT', 'Dr. Unais KT', 'unaiskt@nitgoa.ac.in', '0832-2404705', 'HSS', 'Faculty on contract', 'Postcolonial Literature, Gothic Writing, Indian Writing in English', 'client/src/assets/images/Faculty/HSS/Dr. Unais KT.png', FALSE, 3, TRUE),
(66, '066', 'Mr. Vishnupad', 'Barve', 'Mr. Vishnupad Barve', 'vishnupad.barve@nitgoa.ac.in', '0832-2404705', 'HSS', 'Guest Faculty', '', 'client/src/assets/images/Faculty/HSS/Mr. Vishnupad Barve.jpg', FALSE, 4, TRUE);

-- Now create tables for Technical Staff and Administrative Staff if they don't exist
-- (Using the existing create_staff_tables.sql structure)

-- Technical Staff table creation and data insertion
INSERT INTO technical_staff (
    name, designation, department, email, phone, speciality, profile_image, 
    is_active, display_order
) VALUES
-- CSE Department Technical Staff
('Mr. S SUDHARSAN', 'Senior Technical Assistant', 'Department of Computer Science and Engineering', 'sudharsan@nitgoa.ac.in', '0832-2404422', NULL, 'client/src/assets/images/Technical Staff/CSE/Sudharsan.png', TRUE, 1),
('Mr. Srinath', 'Senior Technician', 'Department of Computer Science and Engineering', 'revoorisrinath@nitgoa.ac.in', '0832-2404208', NULL, 'client/src/assets/images/Technical Staff/CSE/srinath_lib.jpeg', TRUE, 2),
('Mr. Kokate Santosh Parvatrao', 'Technician', 'Department of Computer Science and Engineering', 'ksantosh@nitgoa.ac.in', '0832-2404430', NULL, 'client/src/assets/images/Technical Staff/CSE/Santosh.png', TRUE, 3),

-- ECE Department Technical Staff
('Mr. Patitapaban Pradhan', 'Senior Technical Assistant', 'Department of Electronics and Communication Engineering', 'pradhanp@nitgoa.ac.in', '0832-2404503', NULL, 'client/src/assets/images/Technical Staff/ECE/pradhan.jpg', TRUE, 4),
('Mr. Shri Ram Kumawat', 'Technical Assistant', 'Department of Electronics and Communication Engineering', 'shriram@nitgoa.ac.in', '0832-2404545', NULL, 'client/src/assets/images/Technical Staff/ECE/Ram.png', TRUE, 5),
('Mr. Nikhil Uday Naik', 'Technician', 'Department of Electronics and Communication Engineering', 'nikhilnaik@nitgoa.ac.in', '0832-2404537', NULL, 'client/src/assets/images/Technical Staff/ECE/Nikhil.png', TRUE, 6),

-- EEE Department Technical Staff
('Mr. Pinaki Chatterjee', 'Technical Assistant', 'Department of Electrical and Electronics Engineering', 'pinaki@nitgoa.ac.in', '0832-2404616', NULL, 'client/src/assets/images/Technical Staff/EEE/Pinaki.png', TRUE, 7),
('Mr. Digambar R. D.', 'Senior Technician', 'Department of Electrical and Electronics Engineering', 'digambar@nitgoa.ac.in', '0832-2404219', NULL, 'client/src/assets/images/Technical Staff/EEE/Digambar1.png', TRUE, 8),
('Mr. Rohit Madhu Gawas', 'Senior Technician', 'Department of Electrical and Electronics Engineering', 'rohit@nitgoa.ac.in', '0832-2404636', NULL, 'client/src/assets/images/Technical Staff/EEE/Rohit.png', TRUE, 9),
('Mr. Arjun Singh', 'Technician', 'Department of Electrical and Electronics Engineering', 'arjunsingh@nitgoa.ac.in', '0832-2404629', NULL, 'client/src/assets/images/Technical Staff/EEE/arjun_singh1.jpg', TRUE, 10),
('Mr. Koushik', 'Technician', 'Department of Electrical and Electronics Engineering', 'koushik@nitgoa.ac.in', '0832-2404610', NULL, 'client/src/assets/images/Technical Staff/EEE/koushik_eee.jpeg', TRUE, 11),

-- MCE Department Technical Staff
('Mr. Vijeesh V.P', 'Senior Technical Assistant', 'Department of Mechanical Engineering', 'vijeesh@nitgoa.ac.in', '0832-2404812', NULL, 'client/src/assets/images/Technical Staff/MCE/vijeesh_mce.jpg', TRUE, 12),

-- CVE Department Technical Staff
('Mr. K Rajkumar', 'Multi-Tasking Staff', 'Department of Civil', 'rajkumar@nitgoa.ac.in', '0832-2404805', NULL, 'client/src/assets/images/Technical Staff/CVE/rajkumar_aps.jpeg', TRUE, 13),

-- APS & HSS Department Technical Staff
('Ms. Priyanka Parab', 'Technician', 'Department of Applied Sciences', 'priyankaparab@nitgoa.ac.in', '0832-2404722', NULL, 'client/src/assets/images/Technical Staff/APS & HSS/Priyanka.png', TRUE, 14),

-- CCC Department Technical Staff
('Mr. Venkat R Grandhi', 'Senior Technical Assistant', 'Campus Control Centre', 'sysadmin@nitgoa.ac.in', '0832-2404851', '(System Administrator)', 'client/src/assets/images/Technical Staff/CCC/Venkat.png', TRUE, 15),
('Mr. Rameez Rahman', 'Senior Technical Assistant', 'Campus Control Centre', 'netadmin@nitgoa.ac.in', '0832-2404852', '(Network Administrator)', 'client/src/assets/images/Technical Staff/CCC/Rameez.png', TRUE, 16),
('Mr. Nijin Mambrol', 'Technical Assistant', 'Campus Control Centre', 'misadmin@nitgoa.ac.in', '0832-2404853', '(MIS Administrator)', 'client/src/assets/images/Technical Staff/CCC/Nijin.png', TRUE, 17);

-- Administrative Staff data insertion
INSERT INTO administrative_staff (
    name, designation, department, email, phone, profile_image, 
    is_active, display_order
) VALUES
('Mr. Amit Kabiraj', 'Deputy Registrar', 'Administration', 'dy.reg@nitgoa.ac.in', '0832-2404209', 'client/src/assets/images/Administrative Staff/amit_kabiraj.jpg', TRUE, 1),
('Mr. Manmohan Sakhuja', 'Assistant Registrar', 'Accounts | Establishment | General Administration | Student Cell', 'ar_af@nitgoa.ac.in', '0832-2404210', 'client/src/assets/images/Administrative Staff/manmohan_asst_reg_2022.jpg', TRUE, 2),
('Mr. Digamber D. Mayekar', 'Accountant', NULL, 'digamber.mayekar@nitgoa.ac.in', '0832-2404221', 'client/src/assets/images/Administrative Staff/digambar.jpg', TRUE, 3),
('Mr. Amit Ajit Naik', 'Superintendent', NULL, 'amitnaik@nitgoa.ac.in', '0832-2404311', 'client/src/assets/images/Administrative Staff/amitnaik_JA.jpg', TRUE, 4),
('Mr. Anand Gachchinamath', 'Superintendent', NULL, 'anandg@nitgoa.ac.in', '0832-2404221', 'client/src/assets/images/Administrative Staff/anand.jpg', TRUE, 5),
('Dr. S. Kumaraguru', 'Student Activity and Sports Officer', '(On Contract)', 'sports_officer@nitgoa.ac.in', '0832-2404237', 'client/src/assets/images/Administrative Staff/kumaraguru.jpg', TRUE, 6),
('Ms. Shewale Rashmi Madhukar', 'Assistant Librarian', '(On Temporary Basis)', 'smadhukar@nitgoa.ac.in', '0832-2404208', 'client/src/assets/images/Administrative Staff/Rashmi asst lib.jpg', TRUE, 7),
('Mrs. Reshma R. Castelino', 'Technical Assistant', '(Medical Unit)', 'reshma.castelino@nitgoa.ac.in', '0832-2404267', 'client/src/assets/images/Administrative Staff/reshma.jpeg', TRUE, 8),
('Mrs. Lotliker Swara Sarvesh', 'Stenographer', NULL, 'stenographer@nitgoa.ac.in', '0832-2404200', 'client/src/assets/images/Administrative Staff/steno_photograph.jpg', TRUE, 9),
('Mrs. Sweta Jadhav', 'Senior Assistant', NULL, 'sweta.jadhav@nitgoa.ac.in', '0832-2404318', 'client/src/assets/images/Administrative Staff/swetaNEW.jpg', TRUE, 10),
('Mrs. Namrata Prajesh Sawant', 'Senior Assistant', NULL, 'namrata@nitgoa.ac.in', '0832-2404206', 'client/src/assets/images/Administrative Staff/Namrata_G.jpg', TRUE, 11),
('Mr. Karthikeyan M.', 'Junior Assistant', '(Relieved on Deputation)', 'karthikeyan@nitgoa.ac.in', '0832-2404221', 'client/src/assets/images/Administrative Staff/recent_karthi_photo.jpg', TRUE, 12),
('Mrs. Tallulah Rodrigues', 'Junior Assistant', NULL, 'tallulah@nitgoa.ac.in', '0832-2404322', 'client/src/assets/images/Administrative Staff/tal.jpeg', TRUE, 13),
('Mr. Sandeep Jaishwar', 'Junior Assistant', NULL, 'sandeep8025@nitgoa.ac.in', '0832-2404200', 'client/src/assets/images/Administrative Staff/sandeep_jai.jpg', TRUE, 14),
('Mrs. Supriya S Shet Tilve', 'Junior Assistant', 'Department of Electrical & Electronics Engineering', 'supriya.tilve@nitgoa.ac.in', '0832-2404605', 'client/src/assets/images/Administrative Staff/supriya.jpg', TRUE, 15),
('Mrs.Teju Vasim Shaikh', 'Junior Assistant', NULL, 'tejubi@nitgoa.ac.in', '0832-2404221', 'client/src/assets/images/Administrative Staff/tejubi.jpg', TRUE, 16),
('Mr. Pritam Nageshkar', 'Multi-Tasking Staff', NULL, 'pritamnageshkar@nitgoa.ac.in', '0832-2404221', 'client/src/assets/images/Administrative Staff/pritam_Nageshkar.jpg', TRUE, 17),
('Mrs. Dipti Devidas Gaude', 'Multi-Tasking Staff', NULL, 'dipti@nitgoa.ac.in', '0832-2404200', 'client/src/assets/images/Administrative Staff/Dipti.jpg', TRUE, 18),
('Mrs. Asmita Ashok Naik', 'Multi-Tasking Staff', NULL, 'asmitnaik03@nitgoa.ac.in', '0832-2404221', 'client/src/assets/images/Administrative Staff/asmita.jpeg', TRUE, 19),
('Mr. Vinay Acharya', 'Estate Engineer', '(On Contract Basis)', 'ee.civil@nitgoa.ac.in', '- (Internal)', 'client/src/assets/images/Administrative Staff/estate engg.jpeg', TRUE, 20),
('Mr. Kishor Paryekar', 'Junior Assistant-Purchase', '(On Contract Basis)', 'paryekarkishor@nitgoa.ac.in', '0832-2404206', 'client/src/assets/images/Administrative Staff/kishor.jpg', TRUE, 21),
('Mr. Atul Milind', 'Administrative Officer (T&P Cell)', '(On Contract)', 'aop@nitgoa.ac.in', '- (Internal)', 'client/src/assets/images/Administrative Staff/aop.png', TRUE, 22),
('Mr. Suneel Mudhole', 'Field Technician ', '(On Contract Basis)', 'suneelmudhole@nitgoa.ac.in', '- (Internal)', 'client/src/assets/images/Administrative Staff/Suneel_Mudhole.jpg', TRUE, 23),
('Mrs. Archana Darshan Misal', 'Student Counselor', '(On Contract Basis)', 'studentcounselor@nitgoa.ac.in', '- (Internal)', 'client/src/assets/images/Administrative Staff/archana.jpg', TRUE, 24);

-- Show summary of inserted data
SELECT 'Faculty Data Summary' as Section, COUNT(*) as Total_Records FROM faculty_profiles
UNION ALL
SELECT 'Technical Staff Summary' as Section, COUNT(*) as Total_Records FROM technical_staff
UNION ALL
SELECT 'Administrative Staff Summary' as Section, COUNT(*) as Total_Records FROM administrative_staff;

-- Show faculty count by department
SELECT department, COUNT(*) as faculty_count 
FROM faculty_profiles 
GROUP BY department 
ORDER BY department;

-- Show technical staff count by department
SELECT department, COUNT(*) as tech_staff_count 
FROM technical_staff 
GROUP BY department 
ORDER BY department;

COMMIT;
