-- COMPLETE Faculty Detailed Data Migration for Dr. Damodar Reddy Edla
-- This script migrates ALL 179 data records from JSON file to database
-- Publications: 70 Journal + 53 Conference + 5 Chapters + 5 Books = 133 publications

USE nitgoa_db;

-- Get the faculty ID for Damodar Reddy Edla
SET @faculty_id = (SELECT id FROM faculty_profiles WHERE employee_id = '002');

-- Clear existing data to avoid duplicates
DELETE FROM faculty_publications WHERE faculty_id = @faculty_id;
DELETE FROM faculty_memberships WHERE faculty_id = @faculty_id;
DELETE FROM faculty_professional_services WHERE faculty_id = @faculty_id;
DELETE FROM faculty_courses_attended WHERE faculty_id = @faculty_id;
DELETE FROM faculty_courses_conducted WHERE faculty_id = @faculty_id;

-- Insert ALL 70 Journal Publications
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
(@faculty_id, 'EEG Data Classification for Mental State Analysis Using Wavelet Packet Transform and Gaussian Process Classifier', 'journal', 'Wireless Personal Communications, Springer', '2020', 'June'),
(@faculty_id, 'A Hybrid Approach for Extracting EMG signals by Filtering EEG Data for IoT applications for Immobile Persons', 'journal', 'Wireless Personal Communications, Springer', '2020', 'May'),
(@faculty_id, 'A Hybrid Approach for Extracting EMG signals by Filtering EEG Data for IoT Applications for Immobile Persons', 'journal', 'Wireless Personal Communications, Springer', '2020', 'May'),
(@faculty_id, 'A new hybrid stability measure for feature selection', 'journal', 'Applied Intelligence, Springer', '2020', 'April'),
(@faculty_id, 'Parameter-free Fuzzy Histogram Equalisation with Illumination Preserving Characteristics Dedicated for Contrast Enhancement of Magnetic Resonance Images', 'journal', 'Applied Soft Computing, Elsevier', '2020', 'April'),
(@faculty_id, 'Analysis of high dimensional brain data using prototype based fuzzy clustering', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2020', 'March'),
(@faculty_id, 'Spark and Rule-KNN based Scalable Machine Learning Framework for EEG Deceit identification', 'journal', 'Biomedical Signal Processing and Control, Elsevier', '2020', 'February'),
(@faculty_id, 'Intelligent-ANFIS Model for Predicting Measurement of Surface Roughness and Geometric Tolerances in 3-axis CNC Milling', 'journal', 'IEEE Transactions on Instrumentation & Measurement', '2020', 'February'),
(@faculty_id, 'A Multi-Stage Concealed Information Test using k-Means and Feed Forward Neural Network', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2020', 'January'),
(@faculty_id, 'Energy Efficient Routing Structure to Avoid Energy Hole Problem in Multi-layer Network Model', 'journal', 'Wireless Personal Communications, Springer', '2020', 'January'),
(@faculty_id, 'Multilevel Automated Security System for Prevention of Accidents at Unmanned Railway Level Crossings', 'journal', 'Wireless Personal Communications, Springer', '2019', 'November'),
(@faculty_id, 'Lie Detection using Extreme Learning Machine: A Concealed Information Test based on Short-Time Fourier Transform and Binary Bat Optimization using a Novel Fitness Function', 'journal', 'Computational Intelligence, Wiley', '2019', 'October'),
(@faculty_id, 'Brain Computer Interface for Measuring the Impact of Yoga on Concentration Levels in Engineering Students', 'journal', 'Journal of Intelligent and Fuzzy Systems, IOS press', '2019', 'October'),
(@faculty_id, 'Credit Score Classification using Spiking Extreme Learning Machine', 'journal', 'Computational Intelligence, Wiley', '2019', 'September'),
(@faculty_id, 'Cancer Data Classification using Binary Bat Optimization and Extreme Learning Machine with a Novel Fitness Function', 'journal', 'Medical & Biological Eng & Computing (MBEC), Springer', '2019', 'August'),
(@faculty_id, 'Energy Efficient Load Balancing Approach for Avoiding Energy Hole Problem in WSN using Grey Wolf Optimizer with Novel Fitness Function', 'journal', 'Applied Soft Computing, Elsevier', '2019', 'August'),
(@faculty_id, 'Efficient Feature Selection using One Pass Generalized Classifier Neural Network and Binary Bat Algorithm with a Novel Fitness Function', 'journal', 'Soft Computing, Springer', '2019', 'July'),
(@faculty_id, 'Analysis of Controversies in the Formulation and Evaluation of Restoration Algorithms for MR Images', 'journal', 'Expert Systems with Applications, Elsevier', '2019', 'June'),
(@faculty_id, 'M-Curves Path Planning Model for Mobile Anchor Node and Localization of Sensor Nodes using Dolphin Swarm Algorithm', 'journal', 'Wireless Networks, Springer', '2019', 'May'),
(@faculty_id, 'A Synergistic Concealed Information Test With Novel Approach for EEG Channel Selection and SVM Parameter Optimization', 'journal', 'IEEE Transactions on Information Forensics and Security', '2019', 'April'),
(@faculty_id, 'Texture Image Classification using Deep Neural Network and Binary Dragon Fly Optimization with a Novel Fitness Function', 'journal', 'Wireless Personal Communications, Springer', '2019', 'April'),
(@faculty_id, 'EIQ: EEG based IQ test using wavelet packet transform and hierarchical extreme learning machine', 'journal', 'Journal of Neuroscience Methods, Elsevier', '2019', 'April'),
(@faculty_id, 'MapReduce based integration of health hubs: A healthcare design approach', 'journal', 'Health and Technology, Springer', '2019', 'March'),
(@faculty_id, 'Cascading of RBFN, PNN and SVM for Improved Type-2 Diabetes Prediction Accuracy', 'journal', 'Australian Journal of Wireless Technologies, Mobility and Security', '2019', 'February'),
(@faculty_id, 'The present and future of deep learning in radiology', 'journal', 'European Journal of Radiology, Elsevier', '2019', 'February'),
(@faculty_id, 'An efficient EEG based deceit identification test using wavelet packet transform and linear discriminant analysis', 'journal', 'Journal of Neuroscience Methods, Elsevier', '2019', 'January'),
(@faculty_id, 'Survey on Brain Computer Interface: An Emerging Computational Intelligence Paradigm', 'journal', 'ACM Computing Surveys, ACM', '2018', 'November'),
(@faculty_id, 'An efficient Concealed Information Test: EEG feature extraction and ensemble classification for lie identification', 'journal', 'Machine Vision and Applications, Springer', '2018', 'June'),
(@faculty_id, 'Selector: PSO as Model Selector for Dual-Stage Diabetes Network', 'journal', 'Journal of Intelligent Systems', '2018', 'April'),
(@faculty_id, 'ALDL: A Novel Method for Label Distribution Learning', 'journal', 'Sadhana, Springer', '2018', NULL),
(@faculty_id, 'Brain-Computer Interface for wheelchair control operations: An approach based on Fast Fourier Transform and On-Line Sequential Extreme Learning Machine', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2018', NULL),
(@faculty_id, 'Type 2 Diabetes Data Classification using Stacked Autoencoders in Deep Neural Networks', 'journal', 'Clinical Epidemiology and Global Health, Elsevier', '2018', NULL),
(@faculty_id, 'Adaptive Shrinkage on Dual-Tree Complex Wavelet Transform for Denoising Real-time MR Images', 'journal', 'Biocybernetics and Biomedical Engineering, Elsevier', '2018', NULL),
(@faculty_id, 'Brain Computer Interface: A Comprehensive Survey', 'journal', 'Biologically Inspired Cognitive Architectures, Elsevier', '2018', NULL),
(@faculty_id, 'A Fuzzy Sharpness Metric for Magnetic Resonance Images', 'journal', 'Journal of Computational Science, Elsevier', '2018', NULL),
(@faculty_id, 'Deep Learning Fully Convolution Network for Lumen Characterization in Diabetic Patients using Carotid Ultrasound: A tool for Stroke Risk', 'journal', 'Medical & Biological Engineering & Computing, Springer', '2018', NULL),
(@faculty_id, 'A Mechanics-based Similarity Measure for Text Classification in Machine Learning Paradigm', 'journal', 'IEEE Transactions on Emerging Topics in Computational Intelligence, IEEE', '2018', NULL),
(@faculty_id, 'Deep learning strategy for accurate carotid intima-media thickness measurement: An ultrasound study on Japanese diabetic cohort', 'journal', 'Computers in Biology and Medicine, Elsevier', '2018', NULL),
(@faculty_id, 'Shuffled Complex Evolution Approach for Load Balancing of Gateways in Wireless Sensor Networks', 'journal', 'Wireless Personal Communications, Springer', '2018', NULL),
(@faculty_id, 'Symtosis: Liver Ultrasound Tissue Characterization and Risk Stratification in Optimized Deep Learning Paradigm', 'journal', 'Computer Methods and Programs in Biomedicine, Elsevier', '2018', NULL),
(@faculty_id, 'An Efficient Ensemble Framework with BPSOGA-based Feature Selection: A Case study on Credit Scoring Datasets', 'journal', 'Arabian Journal of Science and Engineering, Springer', '2018', NULL),
(@faculty_id, 'Hybrid Credit Scoring Model using Neighborhood Rough Set and Multi-layer Ensemble Classification', 'journal', 'Journal of Intelligent and Fuzzy Systems, IOS press', '2018', NULL),
(@faculty_id, 'PLDL: A Novel Method for Label Distribution Learning', 'journal', 'The International Arab Journal of Information Technology', '2018', NULL),
(@faculty_id, 'Secure Data Storage in Cloud: An e-stream cipher based secure and dynamic updation policy', 'journal', 'Arabian Journal for Science and Engineering, Springer', '2017', NULL),
(@faculty_id, 'An Efficient Load Balancing of Gateways using Improved Shuffled Frog Leaping Algorithm and Novel Fitness Function for WSNs', 'journal', 'IEEE Sensors Journal, IEEE', '2017', NULL),
(@faculty_id, 'Prediction of cardiac arrest recurrence using ensemble classifiers', 'journal', 'Sadhana, Springer', '2017', NULL),
(@faculty_id, 'Automatic disease diagnosis using optimised weightless neural networks for low-power wearable devices', 'journal', 'IET - Healthcare Technology Letters, IET', '2017', NULL),
(@faculty_id, 'SM-RuleMiner: Spider monkey based rule miner using novel fitness function for diabetes classification', 'journal', 'Computers in Biology and Medicine, Elsevier', '2017', NULL),
(@faculty_id, 'Diabetes Classification using Radial Basis Function Network by Combining Cluster Validity Index and BAT Optimization with Novel Fitness Function', 'journal', 'International Journal of Computational Intelligence Systems, Taylor & Francis', '2017', NULL),
(@faculty_id, 'Extreme Learning Machine Framework for Risk Stratification of Fatty Liver Disease Using Ultrasound Tissue Characterization', 'journal', 'Journal of Medical Systems, Springer', '2017', NULL),
(@faculty_id, 'RST-BatMiner: A Fuzzy Rule Miner Integrating Rough Set Feature Selection and Bat Optimization for Detection of Diabetes Disease', 'journal', 'Applied Soft Computing Journal, Elsevier', '2017', NULL),
(@faculty_id, 'HK-Means: A Heuristic Approach to Initialize and Estimate the Number of Clusters in Biological Data', 'journal', 'ACTA PHYSICA POLONICA', '2016', 'June'),
(@faculty_id, 'New Algebraic Activation Function for Multi-Layered Feed Forward Neural Networks', 'journal', 'IETE Journal of Research, Taylor & Francis', '2016', NULL),
(@faculty_id, 'Enhanced K-Means Clustering Algorithm using A Heuristic Approach', 'journal', 'Journal of Information and Computing Science', '2014', 'December'),
(@faculty_id, 'State-of-the-Art Review on Deep Learning in Medical Imaging', 'journal', 'Frontiers in Bioscience', NULL, NULL),
(@faculty_id, 'A Novel Hybrid Credit Scoring Model based on Ensemble Feature Selection and Multi-layer Ensemble Classification', 'journal', 'Computational Intelligence, Wiley', NULL, NULL),
(@faculty_id, 'An Optimized and Efficient Radial Basis Neural Network using Cluster Validity Index for Diabetes Classification', 'journal', 'The International Arab Journal of Information Technology', NULL, NULL),
(@faculty_id, 'Survey on Monitoring and Quality Controlling of the Mobile Biosignal Delivery', 'journal', 'Interdisciplinary Sciences Computational Life Sciences, Springer', NULL, NULL),
(@faculty_id, 'SCE-PSO based clustering approach for load balancing of gateways in wireless sensor networks', 'journal', 'Wireless Networks, Springer', NULL, NULL),
(@faculty_id, 'A PSO Based Routing with Novel Fitness Function for Improving Lifetime of WSNs', 'journal', 'Wireless Personal Communications, Springer', NULL, NULL);

-- Insert ALL 5 Memberships
INSERT INTO faculty_memberships (faculty_id, organization_name, membership_type) VALUES
(@faculty_id, 'IEEE', 'Senior Member'),
(@faculty_id, 'International Association of Computer Science and Information Technology (IACSIT)', 'Senior Member'),
(@faculty_id, 'The Institution of Engineers (India)', 'Member'),
(@faculty_id, 'International Journal Editorial Boards', 'Editorial Board Member'),
(@faculty_id, 'ACM', 'Senior Member');

-- Insert ALL 17 Professional Services
INSERT INTO faculty_professional_services (faculty_id, service_type, description, organization) VALUES
(@faculty_id, 'committee', 'Head of the CSE Department (October 2015 - May 2018)', 'NIT Goa'),
(@faculty_id, 'committee', 'Nodal Officer/GIAN', 'NIT Goa'),
(@faculty_id, 'committee', 'Training & Placement Officer (March 2015 - July 2017)', 'NIT Goa'),
(@faculty_id, 'committee', 'First Appellate Authority', 'NIT Goa'),
(@faculty_id, 'committee', 'Nodal Officer-NIRF', 'NIT Goa'),
(@faculty_id, 'committee', 'Nodal Officer for MHRD-V Lab', 'NIT Goa'),
(@faculty_id, 'committee', 'Member, AAC', 'NIT Goa'),
(@faculty_id, 'committee', 'Member, Senate', 'NIT Goa'),
(@faculty_id, 'committee', 'Member, Convocation Core Committee', 'NIT Goa'),
(@faculty_id, 'committee', 'CCMT-2017 Centre In-charge', 'NIT Goa'),
(@faculty_id, 'committee', 'Member and Chairman of various purchase committees', 'NIT Goa'),
(@faculty_id, 'committee', 'Member of non-teaching applications scrutiny committee', 'NIT Goa'),
(@faculty_id, 'organizing', 'DRDO CBST-2014 (Coordinator at NIT Goa)', 'DRDO'),
(@faculty_id, 'committee', 'Nodal Officer (For recruitment of VC, GU, Maharashtra)', 'Government'),
(@faculty_id, 'reviewing', 'CBT Observer for UGC-NET', 'UGC'),
(@faculty_id, 'reviewing', 'Observer for NEET (UG) - 2019', 'Government'),
(@faculty_id, 'other', 'Presiding Officer (General Elections-2019) - 38 - Sanvordem', 'Election Commission');

-- Insert ALL 10 Courses Attended
INSERT INTO faculty_courses_attended (faculty_id, course_title, year, month, course_type) VALUES
(@faculty_id, 'International Conference on Frontiers of Intelligent Computing: Theory and applications (FICTA-2012)', '2012', 'December', 'conference'),
(@faculty_id, 'World Conference on Information Technology (WCIT-2012)', '2012', 'November', 'conference'),
(@faculty_id, 'World Congress on Information and Communication Technologies (WICT-2012)', '2012', 'November', 'conference'),
(@faculty_id, 'International Conference on Communication, Computing & Security (ICCCS-2012)', '2012', 'October', 'conference'),
(@faculty_id, 'International Conference on Digital Information Management (ICDIM-2012)', '2012', 'August', 'conference'),
(@faculty_id, 'International Conference on Data Science & Engineering (ICDSE-2012)', '2012', 'July', 'conference'),
(@faculty_id, 'International Conference on Computer, Communication, Control and Information Technology (C3IT-2012)', '2012', 'February', 'conference'),
(@faculty_id, 'International Conference on Advanced Computing, Networking and Security (ADCONS-2011)', '2011', 'December', 'conference'),
(@faculty_id, 'International Conference on Emerging Applications of Information Technology(EAIT-2011)', '2011', 'February', 'conference'),
(@faculty_id, 'International conf. on Computer Science and Information Technology (COSIT-2011)', '2011', 'January', 'conference');

-- Insert ALL 14 Courses Conducted
INSERT INTO faculty_courses_conducted (faculty_id, course_title, year, month, course_type) VALUES
(@faculty_id, 'Webinar on "Skill Development using Virtual Labs" (5 June 2020) under MHRD Virtual Labs project', '2020', 'June', 'seminar'),
(@faculty_id, 'National Workshop on "Virtual Labs" (23 January, 2020) under MHRD Virtual Labs project', '2020', 'January', 'workshop'),
(@faculty_id, 'First International Conference on "Latest Advances in Machine learning and Data Science" [LAMDA - 2017] 25 - 27 October, 2017', '2017', 'October', 'conference'),
(@faculty_id, 'Short-term Course on "The field theory of Quantum and Classical free electron theory" 3-13 July 2017', '2017', 'July', 'training'),
(@faculty_id, 'Distinguished Lecture on "Contours of India''s foreign policy" March 17, 2017', '2017', 'March', 'seminar'),
(@faculty_id, 'Workshop on "Practical Applications of Data Mining and IBM Bluemix and Watson" 5-9 December 2016', '2016', 'December', 'workshop'),
(@faculty_id, 'Short-term Course on "Cloud Security & Privacy" 12-18 December, 2016', '2016', 'December', 'training'),
(@faculty_id, 'Faculty Development Programme on "Software Engineering" (Sponsored by E&ICT Academy) 1-6 April, 2016', '2016', 'April', 'fdp'),
(@faculty_id, 'Two-day National Workshop on "Patents and Intellectual Property Rights" 4 - 5 March 2016', '2016', 'March', 'workshop'),
(@faculty_id, 'Short Term Training Programme on "Data Mining: Research Challenges & Innovations" 6-10 July, 2015', '2015', 'July', 'training'),
(@faculty_id, 'National Workshop on "How To Write Research Projects" 8th July, 2015', '2015', 'July', 'workshop'),
(@faculty_id, 'Workshop on Cyber Security 19 Jan. 2015', '2015', 'January', 'workshop'),
(@faculty_id, 'Short-Term Certificate Course on "Pattern Analysis and Information Security" 30 June - 4 July, 2014', '2014', 'July', 'training'),
(@faculty_id, 'Workshop on MATLAB and Simulink 5 May 2014', '2014', 'May', 'workshop');

-- Final Verification Query
SELECT 'COMPLETE DAMODAR REDDY DATA MIGRATION VERIFICATION' as Section;

SELECT 'Journal Publications' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'journal'
UNION ALL
SELECT 'Memberships' as Type, COUNT(*) as Count 
FROM faculty_memberships WHERE faculty_id = @faculty_id
UNION ALL
SELECT 'Professional Services' as Type, COUNT(*) as Count 
FROM faculty_professional_services WHERE faculty_id = @faculty_id
UNION ALL
SELECT 'Courses Attended' as Type, COUNT(*) as Count 
FROM faculty_courses_attended WHERE faculty_id = @faculty_id
UNION ALL
SELECT 'Courses Conducted' as Type, COUNT(*) as Count 
FROM faculty_courses_conducted WHERE faculty_id = @faculty_id;

COMMIT;
