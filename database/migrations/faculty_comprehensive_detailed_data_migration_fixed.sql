-- Faculty Comprehensive Detailed Data Migration - Fixed Version
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

-- Insert Sample Journal Publications (20 key publications from JSON)
INSERT INTO faculty_publications (faculty_id, title, publication_type, journal_name, publication_year, publication_month) VALUES
(@faculty_id, 'Mixed step size normalized least mean fourth adaptive algorithm for artifact elimination from raw EEG signals', 'journal', 'Biomedical Signal Processing and Control, Elsevier', '2020', 'December'),
(@faculty_id, 'Energy-Efficient Load Balancing Strategy for Wireless Sensor Networks using Quasi-Oppositional based Jaya Optimization', 'journal', 'Wireless Personal Communications, Springer', '2020', 'December'),
(@faculty_id, 'BB-tree based secure and dynamic public auditing convergence for cloud storage', 'journal', 'The Journal of Supercomputing, Springer', '2020', 'October'),
(@faculty_id, 'Dynamic large branching hash tree based secure and efficient dynamic auditing protocol for cloud environment', 'journal', 'Cluster Computing, Springer', '2020', 'October'),
(@faculty_id, 'Evolutionary Extreme Learning Machine with novel activation function for credit scoring', 'journal', 'Engineering Applications of Artificial Intelligence, Elsevier', '2020', 'September'),
(@faculty_id, 'Lung Nodule Classification Using Combination of CNN, Second and Higher Order Texture Features', 'journal', 'Journal of Intelligent and Fuzzy Systems, IOS press', '2020', 'September'),
(@faculty_id, 'Binary BAT algorithm and RBFN based hybrid credit scoring model', 'journal', 'Multimedia Tools and Applications, Springer', '2020', 'August'),
(@faculty_id, 'Lung Nodule Classification on Computed Tomography Images Using Deep Learning', 'journal', 'Wireless Personal Communications, Springer', '2020', 'July'),
(@faculty_id, 'LSTM based Prediction of Malaria Abundances using Big Data', 'journal', 'Computers in Biology and Medicine, Elsevier', '2020', 'June'),
(@faculty_id, 'An Efficient Localization Approach in Wireless Sensor Networks using Krill Herd Optimization Algorithm', 'journal', 'IEEE Systems Journal, IEEE', '2020', 'June'),
(@faculty_id, 'EEG Data Classifcation for Mental State Analysis Using Wavelet Packet Transform and Gaussian Process Classifier', 'journal', 'Wireless Personal Communications, Springer', '2020', 'June'),
(@faculty_id, 'A Hybrid Approach for Extracting EMG signals by Filtering EEG Data for IoT Applications for Immobile Persons', 'journal', 'Wireless Personal Communications, Springer', '2020', 'May'),
(@faculty_id, 'A new hybrid stability measure for feature selection', 'journal', 'Applied Intelligence, Springer', '2020', 'April'),
(@faculty_id, 'Parameter-free Fuzzy Histogram Equalisation with Illumination Preserving Characteristics Dedicated for Contrast Enhancement of Magnetic Resonance Images', 'journal', 'Applied Soft Computing, Elsevier', '2020', 'April'),
(@faculty_id, 'Analysis of high dimensional brain data using prototype based fuzzy clustering', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2020', 'March'),
(@faculty_id, 'Spark and Rule-KNN based Scalable Machine Learning Framework for EEG Deceit identification', 'journal', 'Biomedical Signal Processing and Control, Elsevier', '2020', 'February'),
(@faculty_id, 'Intelligent-ANFIS Model for Predicting Measurement of Surface Roughness and Geometric Tolerances in 3-axis CNC Milling', 'journal', 'IEEE Transactions on Instrumentation & Measurement', '2020', 'February'),
(@faculty_id, 'A Multi-Stage Concealed Information Test using k-Means and Feed Forward Neural Network', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2020', 'January'),
(@faculty_id, 'Energy Efficient Routing Structure to Avoid Energy Hole Problem in Multi-layer Network Model', 'journal', 'Wireless Personal Communications, Springer', '2020', 'January'),
(@faculty_id, 'Survey on Brain Computer Interface: An Emerging Computational Intelligence Paradigm', 'journal', 'ACM Computing Surveys, ACM', '2018', 'November');

-- Insert Conference Publications (10 key publications)
INSERT INTO faculty_publications (faculty_id, title, publication_type, conference_name, publication_year, publication_month) VALUES
(@faculty_id, 'Lung Nodule Classification Using Combination of CNN, Second and Higher Order Texture Features', 'conference', 'Sixth International Symposium on Intelligent Systems Technologies and Applications (ISTA''20)', '2020', 'September'),
(@faculty_id, 'Lung tumor classification using CNN and GLCM based features', 'conference', 'International Conference on ICT For Sustainable Development (ICT4SD-2020)', '2020', 'July'),
(@faculty_id, 'A combination of FractalNet and CNN for Lung Nodule Classification', 'conference', '11th International Conference on Computing, Communication and Networking Technologies (ICCCNT)', '2020', 'July'),
(@faculty_id, 'Cluster Head Selection and Cluster Construction Using Fuzzy Logic in WSNs', 'conference', '16th IEEE India Council International Conference (INDICON 2019)', '2019', 'December'),
(@faculty_id, 'GVFF-RLS Adaptive Algorithm for Elimination of Ocular Artifacts from EEG Signals', 'conference', '16th IEEE India Council International Conference (INDICON-2019)', '2019', 'December'),
(@faculty_id, 'Brain Computer Interface for Measuring the Impact of Yoga on Concentration Levels in Engineering Students', 'conference', '5th International Symposium on Intelligent Systems Technologies and Applications (ISTA-2019)', '2019', 'December'),
(@faculty_id, 'Shuffled Particle Swarm Optimization for Energy Efficiency using Novel Fitness Function in WSN', 'conference', '8th International Conference on Pattern Recognition and Machine Intelligence (Premi-2019)', '2019', 'December'),
(@faculty_id, 'Prediction of Performance Indexes in CNC Milling using Regression Trees', 'conference', '8th International Conference on Pattern Recognition and Machine Intelligence (Premi-2019)', '2019', 'December'),
(@faculty_id, 'Binary Binomial Tree based Secure and Efficient Electronic Healthcare Record Storage in Cloud Environment', 'conference', '20th International Conference on Innovations for Community Services (I4CS 2020)', '2019', 'October'),
(@faculty_id, 'Binary Dragonfly Algorithm and Fisher Score based Hybrid Feature Selection adopting a Novel Fitness Function Applied to Microarray Data', 'conference', '1st International conference on Applied Machine Learning(ICAML2019)', '2019', 'October');

-- Insert Book Chapters
INSERT INTO faculty_publications (faculty_id, title, publication_type, publisher, publication_year) VALUES
(@faculty_id, 'Secure Identity based proxy signature with Computational Diffie-Hellman for cloud data management', 'chapter', 'IGI Global publishers', '2019'),
(@faculty_id, 'Credit Scoring Using Birds Swarm Optimization', 'chapter', 'CRC Press', '2018'),
(@faculty_id, 'Application of Neural Network for Routing in Mobile Wireless Sensor Network: A Case Study', 'chapter', 'McGraw-Hill India', '2016'),
(@faculty_id, 'A Survey on Neural Network Classifiers for Diabetes Classification', 'chapter', 'McGraw-Hill India', '2016'),
(@faculty_id, 'A kd-tree based Clustering Algorithm for Gene Expression Data; Encyclopedia of Business Analytics and Optimization (EBAO)', 'chapter', 'IGI Global publishers', '2013');

-- Insert Books Authored
INSERT INTO faculty_publications (faculty_id, title, publication_type, publisher, publication_year) VALUES
(@faculty_id, 'Soft Computing Techniques for Type-2 Diabetes Data Classification', 'book', 'CRC-Press, Taylor & Francis', '2019'),
(@faculty_id, 'Wireless Sensor Networks: Evolutionary Algorithms for Optimizing Performance', 'book', 'CRC-Press, Taylor & Francis', '2019'),
(@faculty_id, 'Fraud Detection using Data Mining Techniques', 'book', 'Lambert Academic Publishers, Germany', '2019'),
(@faculty_id, 'Edited Volume: Advances in Machine Learning and Data Science', 'book', 'Springer – AISC Series', '2017'),
(@faculty_id, 'Clustering Biological Data', 'book', 'Lambert Academic Publishers, Germany', '2013');

-- Insert Research Guidance
INSERT INTO faculty_research_guidance (faculty_id, student_name, guidance_type, status) VALUES
(@faculty_id, 'Dr. RAMALINGASWAMY CHERUKU', 'phd', 'completed'),
(@faculty_id, 'Dr. DIWAKAR P THRIPATHI', 'phd', 'completed'),
(@faculty_id, 'Dr. ANNUSHREE BABLANI', 'phd', 'completed'),
(@faculty_id, 'Dr. AMRUTHA LIPARE', 'phd', 'completed'),
(@faculty_id, 'Dr. SIMI VR', 'phd', 'completed'),
(@faculty_id, 'Dr. AMRITA NAIK', 'phd', 'completed'),
(@faculty_id, 'Mr. RAHUL MISHRA', 'phd', 'submitted'),
(@faculty_id, 'Mr. SRINIVASA RAO S', 'phd', 'submitted');

-- Insert Funded Projects
INSERT INTO faculty_funded_projects (faculty_id, project_title, funding_agency, amount, principal_investigator, description) VALUES
(@faculty_id, 'Indo-Norwegian Collaboration in Intelligent Offshore Mechatronics Systems (INMOST)', 'The Research Council of Norway under INTPART', '4 Crores (Approx.)', 'Co-Principal Investigator', 'Grant No: 309582/KZG'),
(@faculty_id, 'Designing Efficient Algebraic Activation Functions in Deep Learning for Classification of Electroencephalography (EEG) Data', 'DST-SERB', '6.6 Lakhs', 'Principal Investigator', 'Grant No: MTR/2019/000425'),
(@faculty_id, 'Secure and dynamic privacy-preserving public auditing schemes for IOT enabled data in clouds', 'The PMU Cybersecurity Center', 'USD 6000', 'Co-Principal Investigator', 'Grant No: PCC-Grant-202113'),
(@faculty_id, 'Modelling and Simulation of Brain-Computer Interface for Implanted Neural Prosthetic Devices using Spiking Neural Networks and Bio-Inspired Optimization Algorithms', 'ARTPARK (IISc Bangalore)', '3.6 Lakhs', 'Principal Investigator', 'Grant No: PG-01'),
(@faculty_id, 'Energy Efficiency Optimization using Machine Learning in Intelligent Reflecting Surface (IRS) aided Unmanned Arial Vehicle (UAV) for 6G Wireless Communication Networks', 'DST-SERB', 'Rs. 18.3 Lakhs', 'Project Mentor', 'Grant No: TAR/2022/000383');

-- Insert Awards and Honors
INSERT INTO faculty_awards (faculty_id, award_title, award_year, award_type) VALUES
(@faculty_id, 'CSIR-Senior Research Fellow', NULL, 'research'),
(@faculty_id, 'Young Faculty Award-2015', '2015', 'teaching'),
(@faculty_id, 'DR APJ Abdul Kalam Life Time Achievement National Award-2018', '2018', 'national'),
(@faculty_id, 'Best Researcher Award - 2018', '2018', 'research'),
(@faculty_id, 'Distinguished Faculty-Asia Arab Award- 2018', '2018', 'international'),
(@faculty_id, 'MHRD - GATE (2006 AND 2007)', '2007', 'national'),
(@faculty_id, 'Visiting Researcher at Saint Mary''s University, Canada', NULL, 'international'),
(@faculty_id, 'Chartered Engineer - The Institution of Engineers (India)', NULL, 'institutional'),
(@faculty_id, 'Elsevier - Outstanding Reviewer', NULL, 'research'),
(@faculty_id, 'IEEE Senior Member', NULL, 'institutional'),
(@faculty_id, '2020 IEEE TIM Outstanding Reviewer', '2020', 'research'),
(@faculty_id, 'ACM Senior Member', NULL, 'institutional'),
(@faculty_id, 'ARTPARK Student Innovation Grant from IISc Bangalore', NULL, 'research'),
(@faculty_id, 'IEEE TIM Outstanding Editor Award - 2022', '2022', 'research'),
(@faculty_id, 'INSA Visiting Scientist - 2022', '2022', 'research');

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
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'chapter'
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
FROM faculty_awards WHERE faculty_id = @faculty_id;

COMMIT;
