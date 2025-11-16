-- =================================================================
-- FAC001 Complete Data Population Script
-- Adds ALL missing publications and other data from legacy JSON
-- =================================================================

USE updated_nitgoa;

-- First, delete existing publications to avoid duplicates
DELETE FROM faculty_publications WHERE employee_code = 'FAC001';

-- Insert ALL journal papers (4 total)
INSERT INTO faculty_publications (
    employee_code, publication_type, title, publication_details, publication_year, publication_month,
    journal_name, volume, issue, pages, citation_count, is_featured, display_order
) VALUES 
('FAC001', 'Journal Paper', 'Visual Semantic-Based Representation Learning Using Deep CNNs for Scene Recognition', 
 'Shikha Gupta, Krishan Sharma, A. D. Dileep, Veena Thenkanidiyoor, ACM Transactions on Multimedia Computing, Communications, and Applications, 17(2), June 2021', 
 2021, 'June', 'ACM Transactions on Multimedia Computing, Communications, and Applications', '17', '2', NULL, 0, 1, 1),

('FAC001', 'Journal Paper', 'Recognition of varying size scene images using semantic analysis of deep activation maps',
 'Shikha Gupta, A. D. Dileep, Veena Thenkanidiyoor, Machine Vision and Applications, 32(2), pp. 1-19, March 2021',
 2021, 'March', 'Machine Vision and Applications', '32', '2', '1-19', 0, 1, 2),

('FAC001', 'Journal Paper', 'Data Analysis and Visualization in Python for Polar Meteorological Data',
 'V. Sakthivel Samy, Koyel Pramanick, Veena Thenkanidiyoor, Jeni Victor, International Journal of Electrical, Electronics and Computer Engineering (IJEECE), 2(1), 2021',
 2021, NULL, 'International Journal of Electrical, Electronics and Computer Engineering', '2', '1', NULL, 0, 0, 3),

('FAC001', 'Journal Paper', 'Segment-level probabilistic sequence kernel and segment-level pyramid match kernel based extreme learning machine for classification of varying length patterns of speech',
 'Shikha Gupta, A. Karanath, K. Mahrifa, A. D. Dileep, Veena Thenkanidiyoor, International Journal of Speech Technology, 22(1), pp. 231-249, March 2019',
 2019, 'March', 'International Journal of Speech Technology', '22', '1', '231-249', 0, 1, 4);

-- Insert ALL conference proceedings (22 total)
INSERT INTO faculty_publications (
    employee_code, publication_type, title, publication_details, publication_year, publication_month,
    journal_name, volume, issue, pages, citation_count, is_featured, display_order
) VALUES 
('FAC001', 'Conference Proceeding', 'Application of machine learning techniques to weather forecasting',
 'Samy, V.S, Veena Thenkanidiyoor, International Symposium Global Collaboration on Data beyond Disciplines, 23-25 September 2020',
 2020, 'September', NULL, NULL, NULL, NULL, 0, 0, 5),

('FAC001', 'Conference Proceeding', 'Kernel based Matching and a Novel Training approach for CNN-based QbE-STD',
 'Prajyot Naik, Manisha Naik Gaonkar, Veena Thenkanidiyoor, Dileep A.D., International Conference on Signal Processing and Communications 2020 (SPCOM 2020), Bengalore, India',
 2020, 'July', NULL, NULL, NULL, NULL, 0, 0, 6),

('FAC001', 'Conference Proceeding', 'Emotion recognition from varying length patterns of speech using CNN-based segment-level pyramid match kernel based SVMs',
 'Shikha Gupta, Kishalaya De, A.D. Dileep, Veena Thenkanidiyoor, Proceedings of National Conference on Communications 2019 (NCC 2019), Bangalore, India, 2019, pp. 1-6',
 2019, 'February', NULL, NULL, NULL, '1-6', 0, 0, 7),

('FAC001', 'Conference Proceeding', 'SVM-based Language Diarization for Code-Switched Bilingual Indian Speech using Bottleneck Features',
 'Spoorthy V, Veena Thenkanidiyoor and Dileep A.D., 6th Workshop on Spoken Language Technologies for Under-resourced Languages, 29-31 August, 2018, Gurugram, India',
 2018, 'August', NULL, NULL, NULL, NULL, 0, 0, 8),

('FAC001', 'Conference Proceeding', 'A Context-aware Convolutional Natural Language Generation model for Dialogue Systems',
 'Sourab Magrulkar, Suhani Shrivatsava, Veena Thenkanidiyoor, Dileep Aroor Dinesh, Proceedings of the SIGDIAL 2018, 12-14 July 2018, Melbourne, Australia',
 2018, 'July', NULL, NULL, NULL, NULL, 0, 0, 9),

('FAC001', 'Conference Proceeding', 'Modified Time Flexible Kernel for Video Activity Recognition using Support Vector Machines',
 'Ankit Sharma, Apurv Kumar, Sony Allappa, Veena Thenkanidiyoor, Dileep Aroor Dinesh, and Shikha Gupta, 7th International Conference on Pattern Recognition Applications and Methods (ICPRAM 2018), Funchal, Madeira –Portugal',
 2018, 'January', NULL, NULL, NULL, NULL, 0, 0, 10),

('FAC001', 'Conference Proceeding', 'Deep Spatial Pyramid Match Kernel for Scene Image Classification',
 'Shikha Gupta, Deepak Kumar Pradhan, Dileep Aroor Dinesh, and Veena Thenkanidiyoor, 7th International Conference on Pattern Recognition Applications and Methods (ICPRAM 2018), Funchal, Madeira –Portugal',
 2018, 'January', NULL, NULL, NULL, NULL, 0, 0, 11),

('FAC001', 'Conference Proceeding', 'Text Classification using Hierarchical Sparse Representation Classifiers',
 'Neeraj Sharma, Dileep Aroor Dinesh, and Veena Thenkanidiyoor, 16th International Conference on Machine Learning and Applications (ICMLA 2017), Cancun, Mexico',
 2017, 'December', NULL, NULL, NULL, NULL, 0, 0, 12),

('FAC001', 'Conference Proceeding', 'Sematic Multinomial Representations for Scene Images using CNN-based Pseudo-concepts and Concept Neural Networks',
 'Deepak Kumar Pradhan, Shikha Gupta, Veena Thenkanidiyoor, and Dileep Aroor Dinesh, The Sixth National Conference on Computer Vision, Pattern Recognition, Image Processing and Graphics (NCVPRIPG 2017)',
 2017, 'December', NULL, NULL, NULL, NULL, 0, 0, 13),

('FAC001', 'Conference Proceeding', 'The Semantic Multinomial Representation of Images Obtained Using Dynamic Kernel Based Pseudo-concept SVMs',
 'Shikha Gupta, A. D. Dileep, Veena Thenaknidiyoor, Proceedings of 23rd National Conference on Communications 2017 (NCC 2017), IIT Madras, Chennai',
 2017, 'March', NULL, NULL, NULL, NULL, 0, 0, 14),

('FAC001', 'Conference Proceeding', 'Segment-level Probabilistic Sequence Kernel based Support Vector Machines for Classification of Varying Length Patterns of Speech',
 'Shikha Gupta, Veena Thenaknidiyoor, A. D. Dileep, The 23rd International Conference on Neural Information Processing (ICONIP 2016), Kyoto, Japan',
 2016, 'October', NULL, NULL, NULL, NULL, 0, 0, 15),

('FAC001', 'Conference Proceeding', 'Text Classification using Combined Sparse Representation Classifiers and Support Vector Machines',
 'Neeraj Sharma, Anshu Sharma, Veena Thenkanidiyoor, Dileep Aroor Dinesh, 4th International Symposium on Computational and Business Intelligence (ISCBI 2016), Olten, Switzerland',
 2016, 'September', NULL, NULL, NULL, NULL, 0, 0, 16),

('FAC001', 'Conference Proceeding', 'Segment-Level Pyramid Match Kernels For The Classification of Varying Length Patterns of Speech Using SVMs',
 'Shikha Gupta, A.D.Dileep, Veena Thenkanidiyoor, 24th European Signal Processing Conference (EUSIPCO 2016), Hilton, Budapest, Hungary',
 2016, 'August', NULL, NULL, NULL, NULL, 0, 0, 17),

('FAC001', 'Conference Proceeding', 'Spatial Probabilistic Sequence Kernel for Scene Classification using Support Vector Machines',
 'Shikha Gupta, Veena Thenkanidiyoor, Dileep A. D., CVPR 2016 workshop on Women in Computer Vision 2016 (WiCV 2016), Las Vegas, NV, USA',
 2016, 'June', NULL, NULL, NULL, NULL, 0, 0, 18),

('FAC001', 'Conference Proceeding', 'Semantic Multinomial Representation for Scene Images using Dynamic Kernel based SVMs',
 'Shikha Gupta, Samriddhi Jain, Veena Thenkanidiyoor, A. D. Dileep, Scene Understanding Workshop (SUNw 2016), CVPR 2016, Las Vegas, NV, USA',
 2016, 'June', NULL, NULL, NULL, NULL, 0, 0, 19),

('FAC001', 'Conference Proceeding', 'Example-Specific Density based Matching Kernels for Scene Classification using Support Vector Machines',
 'Abhijeet Sachdev, Veena Thenkanidiyoor, Dileep A. D. and C. Chandra Sekhar, Proceedings of 14th IEEE International Conference on Machine Learning and Applications (ICMLA 2015), December 09-11, Miami, Florida, USA',
 2015, 'December', NULL, NULL, NULL, NULL, 0, 0, 20),

('FAC001', 'Conference Proceeding', 'A Family of Example-Specific Density based Matching Kernels for Classification of Varying Length Patterns of Speech using SVMs',
 'Abhijeet Sachdev, A. D. Dileep, and Veena Thenkanidiyoor, Proceedings of 2nd International Conference on Soft Computing and Machine Intelligence (ISCMI 2015), November 23-24, Hong Kong [WON THE BEST PAPER AWARD]',
 2015, 'November', NULL, NULL, NULL, NULL, 0, 1, 21),

('FAC001', 'Conference Proceeding', 'Example-Specific Density based Matching Kernel for Classification of Varying Length Patterns of Speech using SVMs',
 'Abhijeet Sachdev, A. D. Dileep, and Veena Thenkanidiyoor, Proceedings of 22nd International Conference on Neural Information Processing (ICONIP 2015), November 09-12, Istanbul, Turkey',
 2015, 'November', NULL, NULL, NULL, NULL, 0, 0, 22),

('FAC001', 'Conference Proceeding', 'Matching of images using Gaussian mixture model based intermediate matching kernel for retrieval of scene images',
 'T. Veena, and C. C. Sekhar, Proceedings of Centenary Conference 2011, Electrical Engineering, Indian Institute of Science, (Bangalore,India), December 2011 pp. 501-506',
 2011, 'December', NULL, NULL, NULL, '501-506', 0, 0, 23),

('FAC001', 'Conference Proceeding', 'Scene Categorization Using Large Margin Gaussian Mixture Models',
 'T. Veena, A. D. Dileep. and C. Chandra Sekhar, Proceedings of 2010 International Conference on Image Processing, Computer Vision, & Pattern Recognition (IPCV-2010), Las Vegas, Nevada, USA, July 2010, pp. 395-401',
 2010, 'July', NULL, NULL, NULL, '395-401', 0, 0, 24),

('FAC001', 'Conference Proceeding', 'Gaussian Mixture Model based Posterior Probability Support Vector Machines for Speech Emotion Recognition and Image Classification',
 'S. Chandrakala, T. Veena and C. Chandra Sekhar, Proceedings of Second International Conference on Intelligent Human Computer Interaction, Allahabad, India, January 2010, pp 85-99',
 2010, 'January', NULL, NULL, NULL, '85-99', 0, 0, 25),

('FAC001', 'Conference Proceeding', 'Concept Saliency Score Estimation for Content Based Image Retrieval',
 'Veena T. and C. Chandra Sekhar, International Conference on Cognitive and Neural Systems (ICCNS-2009), Boston, MA, USA, May 2009',
 2009, 'May', NULL, NULL, NULL, NULL, 0, 0, 26);

-- Display summary of what was added
SELECT 'Total Publications Added' as Action, COUNT(*) as Count FROM faculty_publications WHERE employee_code = 'FAC001'
UNION ALL
SELECT 'Journal Papers Added' as Action, COUNT(*) as Count FROM faculty_publications WHERE employee_code = 'FAC001' AND publication_type = 'Journal Paper'
UNION ALL 
SELECT 'Conference Proceedings Added' as Action, COUNT(*) as Count FROM faculty_publications WHERE employee_code = 'FAC001' AND publication_type = 'Conference Proceeding';

-- Show the publication distribution by year
SELECT publication_year, COUNT(*) as publication_count, publication_type 
FROM faculty_publications 
WHERE employee_code = 'FAC001' 
GROUP BY publication_year, publication_type 
ORDER BY publication_year DESC, publication_type;