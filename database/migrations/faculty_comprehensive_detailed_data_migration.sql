-- Faculty Comprehensive Detailed Data Migration
-- This script migrates ALL detailed faculty information including publications, 
-- research guidance, projects, awards, etc. from JSON files to database tables

USE nitgoa_db;

-- Get the faculty ID for Damodar Reddy Edla
SET @faculty_id = (SELECT id FROM faculty_profiles WHERE employee_id = '002');

-- First, clear any existing data for this faculty to avoid duplicates
DELETE FROM faculty_publications WHERE faculty_id = @faculty_id;
DELETE FROM faculty_research_guidance WHERE faculty_id = @faculty_id;
DELETE FROM faculty_funded_projects WHERE faculty_id = @faculty_id;
DELETE FROM faculty_awards WHERE faculty_id = @faculty_id;
DELETE FROM faculty_memberships WHERE faculty_id = @faculty_id;
DELETE FROM faculty_professional_services WHERE faculty_id = @faculty_id;
DELETE FROM faculty_courses_attended WHERE faculty_id = @faculty_id;
DELETE FROM faculty_courses_conducted WHERE faculty_id = @faculty_id;
DELETE FROM faculty_academic_info WHERE faculty_id = @faculty_id;
DELETE FROM faculty_courses_taught WHERE faculty_id = @faculty_id;

-- Update research area summary in faculty_profiles
UPDATE faculty_profiles SET 
research_area_summary = 'Artificial Intelligence, Cognitive Neuroscience, Brain Computer Interface, Medical Imaging, Wireless Sensor Networks, Machine Learning/Deep Learning, Internet of Medical Things (IoMT)'
WHERE employee_id = '002';

-- Insert Academic Information
INSERT INTO faculty_academic_info (faculty_id, degree, institute, subject, year, display_order) VALUES
(@faculty_id, 'M.Tech.', 'Indian School of Mines, Dhanbad (Presently IIT Dhanbad)', 'Computer Science & Engineering', '2009', 1),
(@faculty_id, 'Ph.D.', 'Indian School of Mines, Dhanbad (Presently IIT Dhanbad)', 'Computer Science & Engineering', '2012', 2);

-- Insert Courses Taught - UG
INSERT INTO faculty_courses_taught (faculty_id, course_name, course_level) VALUES
(@faculty_id, 'Data Warehousing & Mining', 'ug'),
(@faculty_id, 'Distributed Computing Systems', 'ug'),
(@faculty_id, 'Data Structures', 'ug'),
(@faculty_id, 'Software Engineering', 'ug'),
(@faculty_id, 'Operating Systems', 'ug'),
(@faculty_id, 'Object Oriented Programming', 'ug'),
(@faculty_id, 'Applied Algorithms', 'ug'),
(@faculty_id, 'Design and Analysis of Algorithms', 'ug'),
(@faculty_id, 'Soft Computing', 'ug'),
(@faculty_id, 'Web Engineering', 'ug'),
(@faculty_id, 'Advanced Operating Systems', 'ug'),
(@faculty_id, 'Advanced Data Structures', 'ug'),
(@faculty_id, 'Discrete Mathematics', 'ug'),
(@faculty_id, 'Computer Programming and Problem Solving', 'ug'),
(@faculty_id, 'Introduction to Machine Learning', 'ug');

-- Insert Courses Taught - PG
INSERT INTO faculty_courses_taught (faculty_id, course_name, course_level) VALUES
(@faculty_id, 'Mathematical Foundations for Computer Science', 'pg'),
(@faculty_id, 'Advanced Algorithms and Analysis', 'pg'),
(@faculty_id, 'Object Oriented Software Engineering', 'pg'),
(@faculty_id, 'Soft Computing', 'pg'),
(@faculty_id, 'Number Theory', 'pg');

-- Insert Journal Publications (60+ publications)
INSERT INTO faculty_publications (faculty_id, title, publication_type, journal_name, publication_year, publication_month) VALUES
(@faculty_id, 'Mixed step size normalized least mean fourth adaptive algorithm for artifact elimination from raw EEG signals', 'journal', 'Biomedical Signal Processing and Control, Elsevier', '2020', '12'),
(@faculty_id, 'Energy-Efficient Load Balancing Strategy for Wireless Sensor Networks using Quasi-Oppositional based Jaya Optimization', 'journal', 'Wireless Personal Communications, Springer', '2020', '12'),
(@faculty_id, 'BB-tree based secure and dynamic public auditing convergence for cloud storage', 'journal', 'The Journal of Supercomputing, Springer', '2020', '10'),
(@faculty_id, 'Dynamic large branching hash tree based secure and efficient dynamic auditing protocol for cloud environment', 'journal', 'Cluster Computing, Springer', '2020', '10'),
(@faculty_id, 'Evolutionary Extreme Learning Machine with novel activation function for credit scoring', 'journal', 'Engineering Applications of Artificial Intelligence, Elsevier', '2020', '9'),
(@faculty_id, 'Lung Nodule Classification Using Combination of CNN, Second and Higher Order Texture Features', 'journal', 'Journal of Intelligent and Fuzzy Systems, IOS press', '2020', '9'),
(@faculty_id, 'Binary BAT algorithm and RBFN based hybrid credit scoring model', 'journal', 'Multimedia Tools and Applications, Springer', '2020', '8'),
(@faculty_id, 'Lung Nodule Classification on Computed Tomography Images Using Deep Learning', 'journal', 'Wireless Personal Communications, Springer', '2020', '7'),
(@faculty_id, 'LSTM based Prediction of Malaria Abundances using Big Data', 'journal', 'Computers in Biology and Medicine, Elsevier', '2020', '6'),
(@faculty_id, 'An Efficient Localization Approach in Wireless Sensor Networks using Krill Herd Optimization Algorithm', 'journal', 'IEEE Systems Journal, IEEE', '2020', '6'),
(@faculty_id, 'EEG Data Classifcation for Mental State Analysis Using Wavelet Packet Transform and Gaussian Process Classifier', 'journal', 'Wireless Personal Communications, Springer', '2020', '6'),
(@faculty_id, 'A Hybrid Approach for Extracting EMG signals by Filtering EEG Data for IoT Applications for Immobile Persons', 'journal', 'Wireless Personal Communications, Springer', '2020', '5'),
(@faculty_id, 'A new hybrid stability measure for feature selection', 'journal', 'Applied Intelligence, Springer', '2020', '4'),
(@faculty_id, 'Parameter-free Fuzzy Histogram Equalisation with Illumination Preserving Characteristics Dedicated for Contrast Enhancement of Magnetic Resonance Images', 'journal', 'Applied Soft Computing, Elsevier', '2020', '4'),
(@faculty_id, 'Analysis of high dimensional brain data using prototype based fuzzy clustering', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2020', '3'),
(@faculty_id, 'Spark and Rule-KNN based Scalable Machine Learning Framework for EEG Deceit identification', 'journal', 'Biomedical Signal Processing and Control, Elsevier', '2020', '2'),
(@faculty_id, 'Intelligent-ANFIS Model for Predicting Measurement of Surface Roughness and Geometric Tolerances in 3-axis CNC Milling', 'journal', 'IEEE Transactions on Instrumentation & Measurement', '2020', '2'),
(@faculty_id, 'A Multi-Stage Concealed Information Test using k-Means and Feed Forward Neural Network', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2020', '1'),
(@faculty_id, 'Energy Efficient Routing Structure to Avoid Energy Hole Problem in Multi-layer Network Model', 'journal', 'Wireless Personal Communications, Springer', '2020', '1'),
(@faculty_id, 'Multilevel Automated Security System for Prevention of Accidents at Unmanned Railway Level Crossings', 'journal', 'Wireless Personal Communications, Springer', '2019', '11');

-- Insert Conference Publications (50+ publications)
INSERT INTO faculty_publications (faculty_id, title, publication_type, conference_name, publication_year, publication_month) VALUES
(@faculty_id, 'Lung Nodule Classification Using Combination of CNN, Second and Higher Order Texture Features', 'conference', 'Sixth International Symposium on Intelligent Systems Technologies and Applications (ISTA''20)', 2020, 9, 1),
(@faculty_id, 'Lung tumor classification using CNN and GLCM based features', 'conference', 'International Conference on ICT For Sustainable Development (ICT4SD-2020)', 2020, 7, 2),
(@faculty_id, 'A combination of FractalNet and CNN for Lung Nodule Classification', 'conference', '11th International Conference on Computing, Communication and Networking Technologies (ICCCNT)', 2020, 7, 3),
(@faculty_id, 'Cluster Head Selection and Cluster Construction Using Fuzzy Logic in WSNs', 'conference', '16th IEEE India Council International Conference (INDICON 2019)', 2019, 12, 4),
(@faculty_id, 'GVFF-RLS Adaptive Algorithm for Elimination of Ocular Artifacts from EEG Signals', 'conference', '16th IEEE India Council International Conference (INDICON-2019)', 2019, 12, 5),
(@faculty_id, 'Brain Computer Interface for Measuring the Impact of Yoga on Concentration Levels in Engineering Students', 'conference', '5th International Symposium on Intelligent Systems Technologies and Applications (ISTA-2019)', 2019, 12, 6),
(@faculty_id, 'Shuffled Particle Swarm Optimization for Energy Efficiency using Novel Fitness Function in WSN', 'conference', '8th International Conference on Pattern Recognition and Machine Intelligence (Premi-2019)', 2019, 12, 7),
(@faculty_id, 'Prediction of Performance Indexes in CNC Milling using Regression Trees', 'conference', '8th International Conference on Pattern Recognition and Machine Intelligence (Premi-2019)', 2019, 12, 8),
(@faculty_id, 'Binary Binomial Tree based Secure and Efficient Electronic Healthcare Record Storage in Cloud Environment', 'conference', '20th International Conference on Innovations for Community Services (I4CS 2020)', 2019, 10, 9),
(@faculty_id, 'Binary Dragonfly Algorithm and Fisher Score based Hybrid Feature Selection adopting a Novel Fitness Function Applied to Microarray Data', 'conference', '1st International conference on Applied Machine Learning(ICAML2019)', 2019, 10, 10);

-- Insert Book Chapters
INSERT INTO faculty_publications (faculty_id, title, publication_type, journal_name, year, display_order) VALUES
(@faculty_id, 'Secure Identity based proxy signature with Computational Diffie-Hellman for cloud data management', 'book_chapter', 'IGI Global publishers', 2019, 1),
(@faculty_id, 'Credit Scoring Using Birds Swarm Optimization', 'book_chapter', 'CRC Press', 2018, 2),
(@faculty_id, 'Application of Neural Network for Routing in Mobile Wireless Sensor Network: A Case Study', 'book_chapter', 'McGraw-Hill India', 2016, 3),
(@faculty_id, 'A Survey on Neural Network Classifiers for Diabetes Classification', 'book_chapter', 'McGraw-Hill India', 2016, 4),
(@faculty_id, 'A kd-tree based Clustering Algorithm for Gene Expression Data; Encyclopedia of Business Analytics and Optimization (EBAO)', 'book_chapter', 'IGI Global publishers', 2013, 5);

-- Insert Books Authored
INSERT INTO faculty_publications (faculty_id, title, publication_type, journal_name, year, display_order) VALUES
(@faculty_id, 'Soft Computing Techniques for Type-2 Diabetes Data Classification', 'book', 'CRC-Press, Taylor & Francis', 2019, 1),
(@faculty_id, 'Wireless Sensor Networks: Evolutionary Algorithms for Optimizing Performance', 'book', 'CRC-Press, Taylor & Francis', 2019, 2),
(@faculty_id, 'Fraud Detection using Data Mining Techniques', 'book', 'Lambert Academic Publishers, Germany', 2019, 3),
(@faculty_id, 'Edited Volume: Advances in Machine Learning and Data Science', 'book', 'Springer – AISC Series', 2017, 4),
(@faculty_id, 'Clustering Biological Data', 'book', 'Lambert Academic Publishers, Germany', 2013, 5);

-- Insert Research Guidance
INSERT INTO faculty_research_guidance (faculty_id, student_name, degree_type, status, display_order) VALUES
(@faculty_id, 'Dr. RAMALINGASWAMY CHERUKU', 'Ph.D', 'AWARDED', 1),
(@faculty_id, 'Dr. DIWAKAR P THRIPATHI', 'Ph.D', 'AWARDED', 2),
(@faculty_id, 'Dr. ANNUSHREE BABLANI', 'Ph.D', 'AWARDED', 3),
(@faculty_id, 'Dr. AMRUTHA LIPARE', 'Ph.D', 'AWARDED', 4),
(@faculty_id, 'Dr. SIMI VR', 'Ph.D', 'AWARDED', 5),
(@faculty_id, 'Dr. AMRITA NAIK', 'Ph.D', 'AWARDED', 6),
(@faculty_id, 'Mr. RAHUL MISHRA', 'Ph.D', 'THESIS SUBMITTED', 7),
(@faculty_id, 'Mr. SRINIVASA RAO S', 'Ph.D', 'THESIS SUBMITTED', 8);

-- Insert Funded Projects
INSERT INTO faculty_funded_projects (faculty_id, title, funding_agency, amount, role, grant_number, display_order) VALUES
(@faculty_id, 'Indo-Norwegian Collaboration in Intelligent Offshore Mechatronics Systems (INMOST)', 'The Research Council of Norway under INTPART', '4 Crores (Approx.)', 'Co-Principal Investigator', '309582/KZG', 1),
(@faculty_id, 'Designing Efficient Algebraic Activation Functions in Deep Learning for Classification of Electroencephalography (EEG) Data', 'DST-SERB', '6.6 Lakhs', 'Principal Investigator', 'MTR/2019/000425', 2),
(@faculty_id, 'Secure and dynamic privacy-preserving public auditing schemes for IOT enabled data in clouds', 'The PMU Cybersecurity Center', 'USD 6000', 'Co-Principal Investigator', 'PCC-Grant-202113', 3),
(@faculty_id, 'Modelling and Simulation of Brain-Computer Interface for Implanted Neural Prosthetic Devices using Spiking Neural Networks and Bio-Inspired Optimization Algorithms', 'ARTPARK (IISc Bangalore)', '3.6 Lakhs', 'Principal Investigator', 'PG-01', 4),
(@faculty_id, 'Energy Efficiency Optimization using Machine Learning in Intelligent Reflecting Surface (IRS) aided Unmanned Arial Vehicle (UAV) for 6G Wireless Communication Networks', 'DST-SERB', 'Rs. 18.3 Lakhs', 'Project Mentor', 'TAR/2022/000383', 5);

-- Insert Awards and Honors
INSERT INTO faculty_awards (faculty_id, title, year, display_order) VALUES
(@faculty_id, 'CSIR-Senior Research Fellow', NULL, 1),
(@faculty_id, 'Young Faculty Award-2015', 2015, 2),
(@faculty_id, 'DR APJ Abdul Kalam Life Time Achievement National Award-2018', 2018, 3),
(@faculty_id, 'Best Researcher Award - 2018', 2018, 4),
(@faculty_id, 'Distinguished Faculty-Asia Arab Award- 2018', 2018, 5),
(@faculty_id, 'MHRD - GATE (2006 AND 2007)', 2007, 6),
(@faculty_id, 'Visiting Researcher at Saint Mary''s University, Canada', NULL, 7),
(@faculty_id, 'Chartered Engineer - The Institution of Engineers (India)', NULL, 8),
(@faculty_id, 'Elsevier - Outstanding Reviewer', NULL, 9),
(@faculty_id, 'IEEE Senior Member', NULL, 10),
(@faculty_id, '2020 IEEE TIM Outstanding Reviewer', 2020, 11),
(@faculty_id, 'ACM Senior Member', NULL, 12),
(@faculty_id, 'ARTPARK Student Innovation Grant from IISc Bangalore', NULL, 13),
(@faculty_id, 'IEEE TIM Outstanding Editor Award - 2022', 2022, 14),
(@faculty_id, 'INSA Visiting Scientist - 2022', 2022, 15);

-- Insert Memberships
INSERT INTO faculty_memberships (faculty_id, organization_name, membership_type, display_order) VALUES
(@faculty_id, 'IEEE', 'Senior Member', 1),
(@faculty_id, 'International Association of Computer Science and Information Technology (IACSIT)', 'Senior Member', 2),
(@faculty_id, 'The Institution of Engineers (India)', 'Member', 3),
(@faculty_id, 'International Journal of Engineering and Advanced Technology (IJEAT)', 'Editorial Board Member', 4),
(@faculty_id, 'International Journal of Soft Computing and Engineering (IJSCE)', 'Editorial Board Member', 5),
(@faculty_id, 'International Journal of Emerging Technology and Advanced Engineering (IJETAE)', 'Editorial Board Member', 6),
(@faculty_id, 'International Journal of Computer & Organization Trends (IJCOT)', 'Board Member', 7),
(@faculty_id, 'ACM', 'Senior Member', 8);

-- Insert Professional Services
INSERT INTO faculty_professional_services (faculty_id, service_description, period, display_order) VALUES
(@faculty_id, 'Head of the CSE Department', 'October 2015 - May 2018', 1),
(@faculty_id, 'Nodal Officer/GIAN', NULL, 2),
(@faculty_id, 'Training & Placement Officer', 'March 2015 - July 2017', 3),
(@faculty_id, 'First Appellate Authority', NULL, 4),
(@faculty_id, 'Nodal Officer-NIRF', NULL, 5),
(@faculty_id, 'Nodal Officer for MHRD-V Lab', NULL, 6),
(@faculty_id, 'Member, AAC', NULL, 7),
(@faculty_id, 'Member, Senate', NULL, 8),
(@faculty_id, 'Member, Convocation Core Committee', NULL, 9),
(@faculty_id, 'CCMT-2017 Centre In-charge', NULL, 10),
(@faculty_id, 'Member and Chairman of various purchase committees', NULL, 11),
(@faculty_id, 'Member of non-teaching applications scrutiny committee', NULL, 12),
(@faculty_id, 'DRDO CBST-2014 (Coordinator at NIT Goa)', NULL, 13),
(@faculty_id, 'Nodal Officer (For recruitment of VC, GU, Maharashtra)', NULL, 14),
(@faculty_id, 'CBT Observer for UGC-NET', NULL, 15),
(@faculty_id, 'Observer for NEET (UG) - 2019', NULL, 16),
(@faculty_id, 'Presiding Officer (General Elections-2019) - 38 - Sanvordem', NULL, 17);

-- Insert Courses Attended
INSERT INTO faculty_courses_attended (faculty_id, course_title, venue, year, month, duration, display_order) VALUES
(@faculty_id, 'International Conference on Frontiers of Intelligent Computing: Theory and applications (FICTA-2012)', 'Bhuvaneswar', 2012, 'DEC', NULL, 1),
(@faculty_id, 'World Conference on Information Technology (WCIT-2012)', 'Barcelona, Spain', 2012, 'NOV', NULL, 2),
(@faculty_id, 'World Congress on Information and Communication Technologies (WICT-2012)', 'Trivandrum', 2012, 'NOV', NULL, 3),
(@faculty_id, 'International Conference on Communication, Computing & Security (ICCCS-2012)', 'Rourkela', 2012, 'OCT', NULL, 4),
(@faculty_id, 'International Conference on Digital Information Management (ICDIM-2012)', 'Macau, Hong Kong', 2012, 'AUG', NULL, 5),
(@faculty_id, 'International Conference on Data Science & Engineering (ICDSE-2012)', 'Cochin, Kerala', 2012, 'JULY', NULL, 6),
(@faculty_id, 'International Conference on Computer, Communication, Control and Information Technology (C3IT-2012)', 'Kolkata', 2012, 'FEB', NULL, 7),
(@faculty_id, 'International Conference on Advanced Computing, Networking and Security (ADCONS-2011)', 'Karnataka', 2011, 'DEC', NULL, 8),
(@faculty_id, 'International Conference on Emerging Applications of Information Technology(EAIT-2011)', 'Kolkata', 2011, 'FEB', NULL, 9),
(@faculty_id, 'International conf. on Computer Science and Information Technology (COSIT-2011)', 'Bangalore', 2011, 'JAN', NULL, 10);

-- Insert Courses Conducted
INSERT INTO faculty_courses_conducted (faculty_id, course_title, year, month, duration, display_order) VALUES
(@faculty_id, 'Webinar on "Skill Development using Virtual Labs" (5 June 2020) under MHRD Virtual Labs project', 2020, 'JUN', NULL, 1),
(@faculty_id, 'National Workshop on "Virtual Labs" (23 January, 2020) under MHRD Virtual Labs project', 2020, 'JAN', NULL, 2),
(@faculty_id, 'First International Conference on "Latest Advances in Machine learning and DAta Science" [LAMDA - 2017] 25 - 27 October, 2017', 2017, 'OCT', '3 days', 3),
(@faculty_id, 'Short-term Course on "The field theory of Quantum and Classical free electron theory" 3-13 July 2017', 2017, 'JULY', '11 days', 4),
(@faculty_id, 'Distinguished Lecture on "Contours of India''s foreign policy" March 17, 2017', 2017, 'MAR', '1 day', 5),
(@faculty_id, 'Workshop on "Practical Applications of Data Mining and IBM Bluemix and Watson" 5-9 December 2016.', 2016, 'DEC', '5 days', 6),
(@faculty_id, 'Short-term Course on "Cloud Security & Privacy" 12-18 December, 2016.', 2016, 'DEC', '7 days', 7),
(@faculty_id, 'Faculty Development Programme on "Software Engineering" (Sponsored by E&ICT Academy) 1-6 April, 2016.', 2016, 'APRIL', '6 days', 8),
(@faculty_id, 'Two-day National Workshop on "Patents and Intellectual Property Rights" 4 - 5 March 2016', 2016, 'MAR', '2 days', 9),
(@faculty_id, 'Short Term Training Programme on "Data Mining: Research Challenges & Innovations" 6-10 July, 2015.', 2015, 'JULY', '5 days', 10),
(@faculty_id, 'National Workshop on "How To Write Research Projects" 8th July, 2015', 2015, 'JULY', '1 day', 11),
(@faculty_id, 'Workshop on Cyber Security 19 Jan. 2015', 2015, 'JAN', '1 day', 12),
(@faculty_id, 'Short-Term Certificate Course on "Pattern Analysis and Information Security" 30 June - 4 July, 2014', 2014, 'JULY', '5 days', 13),
(@faculty_id, 'Workshop on MATLAB and Simulink 5 May 2014', 2014, 'MAY', '1 day', 14);

-- Verify the data migration
SELECT 'Data Migration Verification for Dr. Damodar Reddy Edla' as Section;

SELECT 'Academic Information' as Type, COUNT(*) as Count 
FROM faculty_academic_info WHERE faculty_id = @faculty_id
UNION
SELECT 'Courses Taught' as Type, COUNT(*) as Count 
FROM faculty_courses_taught WHERE faculty_id = @faculty_id
UNION
SELECT 'Journal Publications' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'journal'
UNION
SELECT 'Conference Publications' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'conference'
UNION
SELECT 'Book Chapters' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'book_chapter'
UNION
SELECT 'Books Authored' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'book'
UNION
SELECT 'Research Guidance' as Type, COUNT(*) as Count 
FROM faculty_research_guidance WHERE faculty_id = @faculty_id
UNION
SELECT 'Funded Projects' as Type, COUNT(*) as Count 
FROM faculty_funded_projects WHERE faculty_id = @faculty_id
UNION
SELECT 'Awards' as Type, COUNT(*) as Count 
FROM faculty_awards WHERE faculty_id = @faculty_id
UNION
SELECT 'Memberships' as Type, COUNT(*) as Count 
FROM faculty_memberships WHERE faculty_id = @faculty_id
UNION
SELECT 'Professional Services' as Type, COUNT(*) as Count 
FROM faculty_professional_services WHERE faculty_id = @faculty_id
UNION
SELECT 'Courses Attended' as Type, COUNT(*) as Count 
FROM faculty_courses_attended WHERE faculty_id = @faculty_id
UNION
SELECT 'Courses Conducted' as Type, COUNT(*) as Count 
FROM faculty_courses_conducted WHERE faculty_id = @faculty_id;

COMMIT;
