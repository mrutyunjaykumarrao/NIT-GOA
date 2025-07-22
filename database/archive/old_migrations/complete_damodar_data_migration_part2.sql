-- PART 2: Conference Publications and Remaining Data for Dr. Damodar Reddy Edla
-- This script adds ALL 53 conference proceedings and remaining publications

USE nitgoa_db;

-- Get the faculty ID for Damodar Reddy Edla
SET @faculty_id = (SELECT id FROM faculty_profiles WHERE employee_id = '002');

-- Insert ALL 53 Conference Publications (Proceedings)
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
(@faculty_id, 'Binary Dragonfly Algorithm and Fisher Score based Hybrid Feature Selection adopting a Novel Fitness Function Applied to Microarray Data', 'conference', '1st International conference on Applied Machine Learning(ICAML2019)', '2019', 'October'),
(@faculty_id, 'Dynamic Cluster Formation Mechanism in Wireless Sensor Networks using Fuzzy Logic', 'conference', '1st International conference on Applied Machine Learning(ICAML2019)', '2019', 'October'),
(@faculty_id, 'Prospect of Stein''s Unbiased Risk Estimate as Objective Function for Parameter Optimization in Image Denoising Algorithms', 'conference', '5th IEEE International Conference on Data Science and Engineering (ICDSE-2019)', '2019', 'September'),
(@faculty_id, 'Generalized Compensative Intuitionistic Fuzzy Information with Choquet Integrals', 'conference', '10th International Conference on Computing, Communication and Networking Technologies (ICCCNT-2019)', '2019', 'July'),
(@faculty_id, 'Dependency of Optimum Value of Regularization Parameter in Total Variation Filter on Noise Statistics - A MR Phantom Study', 'conference', '10th International Conference on Computing, Communication and Networking Technologies (ICCCNT-2019)', '2019', 'July'),
(@faculty_id, 'Two-stage Credit Scoring Model based on Evolutionary Feature Selection and Ensemble Neural Networks', 'conference', '1st International Conference on Machine Learning, Image Processing, Network Security and Data Sciences (MIND-2019)', '2019', 'March'),
(@faculty_id, 't-SNE Manifold Learning Based Visualization: A Human Activity Recognition Approach', 'conference', 'International Conference on Data Science and Management (ICDSM-2019)', '2019', 'February'),
(@faculty_id, 'GWO-GA based Load Balanced and Energy Efficient Clustering Approach for WSN', 'conference', 'Third International Conference on Smart Trends for Computing and Communications (Smartcom-2019)', '2019', 'January'),
(@faculty_id, 'Cryptocurrency : A Comprehensive Analysis', 'conference', 'Third International Conference on Smart Trends for Computing and Communications (Smartcom-2019)', '2019', 'January'),
(@faculty_id, 'Design and Development of Efficient Soft Computing Algorithms for Identification of Type-2 Diabetes Mellitus', 'conference', '4th International Symposium on Intelligent Systems Technologies and Applications (ISTA-2017)', '2018', 'October'),
(@faculty_id, 'Novel Fitness Function for SCE Algorithm based Energy Efficiency in WSN', 'conference', '9th International Conference on Computing, Communication and Networking Technologies (ICCCNT)', '2018', 'September'),
(@faculty_id, 'Deceit Identification Test on EEG Data using Deep Belief Network', 'conference', '9th International Conference on Computing, Communication and Networking Technologies (ICCCNT)', '2018', 'September'),
(@faculty_id, 'Performance Evaluation of Nonlinear Spatial Filters on MR Images', 'conference', '9th International Conference on Computing, Communication and Networking Technologies (ICCCNT)', '2018', 'September'),
(@faculty_id, 'Novel Fitness Function for 3D Image reconstruction using Bat Algorithm based Autoencoder', 'conference', '23rd International ACM Conference on 3D Web Technology', '2018', 'June'),
(@faculty_id, 'Subject based Deceit Identification using Empirical Mode Decomposition', 'conference', 'International Conference on Computational Intelligence and Data Science (ICCIDS 2018)', '2018', 'April'),
(@faculty_id, 'Credit Scoring Model based on Weighted Voting and Cluster based Feature Selection', 'conference', 'International Conference on Computational Intelligence and Data Science (ICCIDS 2018)', '2018', 'April'),
(@faculty_id, 'P-FHM+: Parallel high utility itemset mining algorithm for big data processing', 'conference', 'International Conference on Computational Intelligence and Data Science (ICCIDS 2018)', '2018', 'April'),
(@faculty_id, 'Classification of Facial Expressions from EEG signals using Wavelet Packet Transform and SVM for Wheelchair Control Operations', 'conference', 'International Conference on Computational Intelligence and Data Science (ICCIDS 2018)', '2018', 'April'),
(@faculty_id, 'Classification of EEG data for human mental state analysis using Random Forest Classifier', 'conference', 'International Conference on Computational Intelligence and Data Science (ICCIDS 2018)', '2018', 'April'),
(@faculty_id, 'Classification of EEG Data using k-Nearest Neighbor approach for Concealed Information Test', 'conference', '8th International Conference On Advances In Computing & Communications', '2018', NULL),
(@faculty_id, 'Energy Efficient Design of Wireless Sensor Network: Clustering', 'conference', 'International Conference on Recent Trends in Engineering & Sciences', '2018', NULL),
(@faculty_id, 'Optimized Deep Learning based Liver Ultrasound Tissue Characterization and Risk Stratification', 'conference', '2018 AIUM Convention', '2018', NULL),
(@faculty_id, 'Risk Stratification of Fatty Liver Disease using Extreme Learning Machine based Ultrasound Tissue Characterization', 'conference', '2018 AIUM Convention', '2018', NULL),
(@faculty_id, 'Deep Learning based accurate lumen diameter measurement in curved vessels in carotid ultrasound', 'conference', '2018 AIUM Convention', '2018', NULL),
(@faculty_id, 'Survey on Clustering Approaches', 'conference', '2nd International Conference on Inventive Communication and Computational Technologies (ICICCT 2018)', '2018', 'April'),
(@faculty_id, 'Intelli-DRM: An Intelligent Computational Model for Forecasting Severity of Diabetes Mellitus', 'conference', '8th International Conference on Computing Communication and Networking Technologies (ICCCNT)', '2017', NULL),
(@faculty_id, 'PSO-RBFNN: A PSO-based Clustering Approach for RBFNN Design to Classify Disease Data', 'conference', '26th International Conference on Artificial Neural Networks (ICANN)', '2017', NULL),
(@faculty_id, 'Diabetes-Finder: A Bat Optimized Classification System for Type-2 Diabetes', 'conference', '6th International Conference on Advances in Computing & Communications (ICACC-2017)', '2017', NULL),
(@faculty_id, 'A Novel Green Stable Evolutionary Routing Algorithm for Energy Efficiency in WSNs', 'conference', '7th International Conference on Advances in Computing, Communications and Informatics (ICACCI)', '2017', NULL),
(@faculty_id, 'Hierarchical approach for outlier insensitive seed selection in Kmeans clustering using kd-tree', 'conference', 'World Conference on Information Technology (WCIT-2012)', '2017', NULL),
(@faculty_id, 'Load balancing in Wireless Sensor Networks by Optimal Placement of Base Stations using kd-Tree', 'conference', '2016 Annual International Conference on Innovative Technologies and Advanced Computing (ICIAC-16)', '2016', NULL),
(@faculty_id, 'SB-PSO: Score Based Particle Swarm Optimization Scheduling Algorithm for Cloud Computing', 'conference', 'International Conference on Swarm, Evolutionary, and Memetic Computing SEMCCO-2015', '2015', NULL),
(@faculty_id, 'HK-Means: A Heuristic Approach to Initialize and Estimate the Number of Clusters in K-Means', 'conference', 'International Conference on Computational and Experimental Science and Engineering (ICCESEN-2015)', '2015', NULL),
(@faculty_id, 'Improved K-means clustering algorithm using Voronoi diagram', 'conference', 'International Conference on Computational and Experimental Science and Engineering (ICCESEN-2015)', '2015', NULL),
(@faculty_id, 'A Prototype-based Modified DBSCAN for Gene Clustering', 'conference', 'International Conference on Communication, Computing & Security (ICCCS-2012)', '2012', 'October'),
(@faculty_id, 'A novel clustering algorithm using Voronoi diagram', 'conference', 'International Conference on Digital Information Management (ICDIM-2012)', '2012', 'August'),
(@faculty_id, 'An Improved MST-based Clustering for Biological Data', 'conference', 'International Conference on Data Science & Engineering (ICDSE-2012)', '2012', 'July'),
(@faculty_id, 'Initialization for K-means clustering using Voronoi diagram', 'conference', 'International Conference on Computer, Communication, Control and Information Technology (C3IT-2012)', '2012', 'February'),
(@faculty_id, 'A Grid Clustering Algorithm Using Cluster Boundaries', 'conference', 'World Congress on Information and Communication Technologies (WICT-2012)', '2012', NULL),
(@faculty_id, 'Hierarchical approach for outlier insensitive seed selection in K-means clustering using kd-tree', 'conference', 'World Conference on Information Technology (WCIT-2012)', '2012', NULL),
(@faculty_id, 'Minimum spanning tree based clustering using partitional approach', 'conference', 'International Conference on Frontiers of Intelligent Computing: Theory and applications (FICTA-2012)', '2012', NULL),
(@faculty_id, 'Clustering Biological Data Using Voronoi Diagram', 'conference', 'International Conference on Advanced Computing, Networking and Security (ADCONS-2011)', '2011', 'December'),
(@faculty_id, 'A Novel Clustering Algorithm for Biological Data', 'conference', 'International Conference on Emerging Applications of Information Technology(EAIT-2011)', '2011', 'February'),
(@faculty_id, 'MST-based Cluster Initialization for K-means', 'conference', 'International conf. on Computer Science and Information Technology (COSIT-2011)', '2011', 'January');

-- Verify the complete data migration
SELECT 'FINAL COMPLETE VERIFICATION FOR DR. DAMODAR REDDY EDLA' as Section;

SELECT 'Journal Publications' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'journal'
UNION ALL
SELECT 'Conference Publications' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'conference'
UNION ALL
SELECT 'Book Chapters' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'chapter'
UNION ALL
SELECT 'Books Authored' as Type, COUNT(*) as Count 
FROM faculty_publications WHERE faculty_id = @faculty_id AND publication_type = 'book'
UNION ALL
SELECT 'Research Guidance' as Type, COUNT(*) as Count 
FROM faculty_research_guidance WHERE faculty_id = @faculty_id
UNION ALL
SELECT 'Funded Projects' as Type, COUNT(*) as Count 
FROM faculty_funded_projects WHERE faculty_id = @faculty_id
UNION ALL
SELECT 'Awards & Honors' as Type, COUNT(*) as Count 
FROM faculty_awards WHERE faculty_id = @faculty_id
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

SELECT 'TOTAL PUBLICATIONS' as Summary, COUNT(*) as Total_Count
FROM faculty_publications WHERE faculty_id = @faculty_id;

COMMIT;
