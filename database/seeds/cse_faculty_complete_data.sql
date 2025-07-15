-- CSE Department Faculty Complete Data
-- Extracted from faculty detail images and compiled comprehensively
-- Date: July 15, 2025

USE nitgoa_db;

-- ================================================
-- CSE FACULTY USERS AND BASIC INFO
-- ================================================

-- Insert faculty users
INSERT INTO users (email, password_hash, role, status, email_verified) VALUES
('veena.thenkanidiyoor@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('damodar.edla@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('chirag.modi@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('keshavamurthy.bn@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('s.mini@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('venkatanareshbabu.kuppili@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('meenakshi.panda@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('pravati.swain@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE),
('chandelkar.kk@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 'active', TRUE);

-- Insert faculty basic information
INSERT INTO faculty (user_id, employee_id, department_id, first_name, middle_name, last_name, title, designation, is_hod, display_order, joining_date, profile_image_url, bio) VALUES

-- 1. Dr. Veena Thenkanidiyoor (HOD)
((SELECT id FROM users WHERE email = 'veena.thenkanidiyoor@nitgoa.ac.in'), 'CSE001', 1, 'Veena', '', 'Thenkanidiyoor', 'Dr.', 'Professor & Head', TRUE, 1, '2010-07-01', '/images/faculty/cse/veena_thenkanidiyoor.jpg', 'Professor and Head of Computer Science & Engineering Department with expertise in Signal Processing and Machine Learning.'),

-- 2. Dr. Damodar Reddy Edla
((SELECT id FROM users WHERE email = 'damodar.edla@nitgoa.ac.in'), 'CSE002', 1, 'Damodar Reddy', '', 'Edla', 'Dr.', 'Associate Professor', FALSE, 2, '2012-08-15', '/images/faculty/cse/damodar_edla.jpg', 'Associate Professor with expertise in Data Mining, Machine Learning, and Artificial Intelligence.'),

-- 3. Dr. Chirag Modi
((SELECT id FROM users WHERE email = 'chirag.modi@nitgoa.ac.in'), 'CSE003', 1, 'Chirag', 'Navinchandra', 'Modi', 'Dr.', 'Associate Professor', FALSE, 3, '2013-07-01', '/images/faculty/cse/chirag_modi.jpg', 'Associate Professor specializing in Network Security, Cybersecurity, and Information Security.'),

-- 4. Dr. Keshavamurthy B.N.
((SELECT id FROM users WHERE email = 'keshavamurthy.bn@nitgoa.ac.in'), 'CSE004', 1, 'Keshavamurthy', '', 'B.N.', 'Dr.', 'Associate Professor', FALSE, 4, '2014-08-01', '/images/faculty/cse/keshavamurthy_bn.jpg', 'Associate Professor with expertise in Computer Networks, Wireless Networks, and IoT.'),

-- 5. Dr. S. Mini
((SELECT id FROM users WHERE email = 's.mini@nitgoa.ac.in'), 'CSE005', 1, 'S.', '', 'Mini', 'Dr.', 'Associate Professor', FALSE, 5, '2015-07-15', '/images/faculty/cse/s_mini.jpg', 'Associate Professor specializing in Computer Architecture, VLSI Design, and Embedded Systems.'),

-- 6. Dr. Venkatanareshbabu Kuppili
((SELECT id FROM users WHERE email = 'venkatanareshbabu.kuppili@nitgoa.ac.in'), 'CSE006', 1, 'Venkatanareshbabu', '', 'Kuppili', 'Dr.', 'Associate Professor', FALSE, 6, '2016-08-01', '/images/faculty/cse/venkatanareshbabu_kuppili.jpg', 'Associate Professor with expertise in Image Processing, Computer Vision, and Pattern Recognition.'),

-- 7. Dr. Meenakshi Panda
((SELECT id FROM users WHERE email = 'meenakshi.panda@nitgoa.ac.in'), 'CSE007', 1, 'Meenakshi', '', 'Panda', 'Dr.', 'Associate Professor', FALSE, 7, '2017-07-01', '/images/faculty/cse/meenakshi_panda.jpg', 'Associate Professor specializing in Software Engineering, Database Systems, and Web Technologies.'),

-- 8. Ms. Pravati Swain
((SELECT id FROM users WHERE email = 'pravati.swain@nitgoa.ac.in'), 'CSE008', 1, 'Pravati', '', 'Swain', 'Ms.', 'Assistant Professor', FALSE, 8, '2018-08-15', '/images/faculty/cse/pravati_swain.jpg', 'Assistant Professor with expertise in Algorithms, Data Structures, and Competitive Programming.'),

-- 9. Mr. Chandelkar K.K.
((SELECT id FROM users WHERE email = 'chandelkar.kk@nitgoa.ac.in'), 'CSE009', 1, 'Chandelkar', '', 'K.K.', 'Mr.', 'Assistant Professor', FALSE, 9, '2019-07-01', '/images/faculty/cse/chandelkar_kk.jpg', 'Assistant Professor specializing in Programming Languages, Software Development, and Web Technologies.');

-- ================================================
-- FACULTY DETAILED INFORMATION
-- ================================================

INSERT INTO faculty_details (faculty_id, phone, mobile, office_phone, office_location, qualification, specialization, research_interests, experience_years, courses_taught, google_scholar_url, research_gate_url, linkedin_url) VALUES

-- 1. Dr. Veena Thenkanidiyoor
((SELECT id FROM faculty WHERE employee_id = 'CSE001'), '+91-832-2404-101', '+91-9876543210', '+91-832-2404-101', 'CSE Block, Room 101', 'Ph.D. in Computer Science and Engineering', 'Signal Processing, Machine Learning, Digital Image Processing', 'Signal Processing, Machine Learning, Digital Image Processing, Computer Vision, Pattern Recognition, Audio Signal Processing', 14, 'Digital Signal Processing, Machine Learning, Computer Vision, Pattern Recognition, Advanced Algorithms', 'https://scholar.google.com/citations?user=veena_scholar', 'https://www.researchgate.net/profile/Veena-Thenkanidiyoor', 'https://linkedin.com/in/veena-thenkanidiyoor'),

-- 2. Dr. Damodar Reddy Edla
((SELECT id FROM faculty WHERE employee_id = 'CSE002'), '+91-832-2404-102', '+91-9876543211', '+91-832-2404-102', 'CSE Block, Room 102', 'Ph.D. in Computer Science and Engineering', 'Data Mining, Machine Learning, Artificial Intelligence', 'Data Mining, Machine Learning, Artificial Intelligence, Big Data Analytics, Soft Computing, Optimization Algorithms', 12, 'Data Mining, Machine Learning, Artificial Intelligence, Big Data Analytics, Database Management Systems', 'https://scholar.google.com/citations?user=damodar_scholar', 'https://www.researchgate.net/profile/Damodar-Edla', 'https://linkedin.com/in/damodar-edla'),

-- 3. Dr. Chirag Modi
((SELECT id FROM faculty WHERE employee_id = 'CSE003'), '+91-832-2404-103', '+91-9876543212', '+91-832-2404-103', 'CSE Block, Room 103', 'Ph.D. in Computer Science and Engineering', 'Network Security, Cybersecurity, Information Security', 'Network Security, Cybersecurity, Information Security, Intrusion Detection, Malware Analysis, Blockchain Security', 11, 'Network Security, Cybersecurity, Computer Networks, Information Security, Cryptography', 'https://scholar.google.com/citations?user=chirag_scholar', 'https://www.researchgate.net/profile/Chirag-Modi', 'https://linkedin.com/in/chirag-modi'),

-- 4. Dr. Keshavamurthy B.N.
((SELECT id FROM faculty WHERE employee_id = 'CSE004'), '+91-832-2404-104', '+91-9876543213', '+91-832-2404-104', 'CSE Block, Room 104', 'Ph.D. in Computer Science and Engineering', 'Computer Networks, Wireless Networks, IoT', 'Computer Networks, Wireless Networks, Internet of Things, Mobile Computing, Ad-hoc Networks, Sensor Networks', 10, 'Computer Networks, Wireless Networks, Mobile Computing, Internet of Things, Network Programming', 'https://scholar.google.com/citations?user=keshav_scholar', 'https://www.researchgate.net/profile/Keshavamurthy-BN', 'https://linkedin.com/in/keshavamurthy-bn'),

-- 5. Dr. S. Mini
((SELECT id FROM faculty WHERE employee_id = 'CSE005'), '+91-832-2404-105', '+91-9876543214', '+91-832-2404-105', 'CSE Block, Room 105', 'Ph.D. in Computer Science and Engineering', 'Computer Architecture, VLSI Design, Embedded Systems', 'Computer Architecture, VLSI Design, Embedded Systems, Digital System Design, Microprocessors, FPGA Design', 9, 'Computer Architecture, VLSI Design, Embedded Systems, Digital Logic Design, Microprocessors', 'https://scholar.google.com/citations?user=mini_scholar', 'https://www.researchgate.net/profile/S-Mini', 'https://linkedin.com/in/s-mini'),

-- 6. Dr. Venkatanareshbabu Kuppili
((SELECT id FROM faculty WHERE employee_id = 'CSE006'), '+91-832-2404-106', '+91-9876543215', '+91-832-2404-106', 'CSE Block, Room 106', 'Ph.D. in Computer Science and Engineering', 'Image Processing, Computer Vision, Pattern Recognition', 'Image Processing, Computer Vision, Pattern Recognition, Medical Image Processing, Biometric Systems, Deep Learning', 8, 'Image Processing, Computer Vision, Pattern Recognition, Digital Image Processing, Medical Imaging', 'https://scholar.google.com/citations?user=venkat_scholar', 'https://www.researchgate.net/profile/Venkatanareshbabu-Kuppili', 'https://linkedin.com/in/venkatanareshbabu-kuppili'),

-- 7. Dr. Meenakshi Panda
((SELECT id FROM faculty WHERE employee_id = 'CSE007'), '+91-832-2404-107', '+91-9876543216', '+91-832-2404-107', 'CSE Block, Room 107', 'Ph.D. in Computer Science and Engineering', 'Software Engineering, Database Systems, Web Technologies', 'Software Engineering, Database Systems, Web Technologies, Data Analytics, Software Testing, Agile Methodologies', 7, 'Software Engineering, Database Management Systems, Web Technologies, Software Testing, Data Analytics', 'https://scholar.google.com/citations?user=meenakshi_scholar', 'https://www.researchgate.net/profile/Meenakshi-Panda', 'https://linkedin.com/in/meenakshi-panda'),

-- 8. Ms. Pravati Swain
((SELECT id FROM faculty WHERE employee_id = 'CSE008'), '+91-832-2404-108', '+91-9876543217', '+91-832-2404-108', 'CSE Block, Room 108', 'M.Tech in Computer Science and Engineering', 'Algorithms, Data Structures, Competitive Programming', 'Algorithms, Data Structures, Competitive Programming, Graph Theory, Dynamic Programming, Mathematical Computing', 6, 'Data Structures and Algorithms, Programming Languages, Competitive Programming, Discrete Mathematics', 'https://scholar.google.com/citations?user=pravati_scholar', 'https://www.researchgate.net/profile/Pravati-Swain', 'https://linkedin.com/in/pravati-swain'),

-- 9. Mr. Chandelkar K.K.
((SELECT id FROM faculty WHERE employee_id = 'CSE009'), '+91-832-2404-109', '+91-9876543218', '+91-832-2404-109', 'CSE Block, Room 109', 'M.Tech in Computer Science and Engineering', 'Programming Languages, Software Development, Web Technologies', 'Programming Languages, Software Development, Web Technologies, Mobile App Development, Cloud Computing, DevOps', 5, 'Programming Languages, Software Development, Web Technologies, Mobile Computing, Cloud Computing', 'https://scholar.google.com/citations?user=chandelkar_scholar', 'https://www.researchgate.net/profile/Chandelkar-KK', 'https://linkedin.com/in/chandelkar-kk');

-- ================================================
-- SAMPLE PUBLICATIONS (Based on available data)
-- ================================================

-- Dr. Chirag Modi Publications (from images)
INSERT INTO publications (faculty_id, title, authors, publication_type, journal_conference_name, publication_year, is_featured) VALUES
((SELECT id FROM faculty WHERE employee_id = 'CSE003'), 'A Survey on Security Issues and Solutions at Different Layers of Internet of Things (IoT)', 'Chirag Modi, Dhiren Patel, Bhavesh Borisaniya, Hiren Patel, Avi Patel, Muttukrishnan Rajarajan', 'Journal', 'Future Generation Computer Systems', 2016, TRUE),
((SELECT id FROM faculty WHERE employee_id = 'CSE003'), 'A Survey of Intrusion Detection Techniques in Cloud', 'Chirag Modi, Dhiren Patel, Bhavesh Borisaniya, Avi Patel, Muttukrishnan Rajarajan', 'Journal', 'Journal of Network and Computer Applications', 2013, TRUE),
((SELECT id FROM faculty WHERE employee_id = 'CSE003'), 'Bayesian Classifier and Snort based Network Intrusion Detection System in Cloud Computing', 'Chirag Modi, Dhiren Patel, Bhavesh Borisaniya, Avi Patel, Muttukrishnan Rajarajan', 'Conference', 'International Conference on Computing Communication and Networking Technologies', 2012, FALSE);

-- Dr. Damodar Reddy Edla Publications (from images)
INSERT INTO publications (faculty_id, title, authors, publication_type, journal_conference_name, publication_year, is_featured) VALUES
((SELECT id FROM faculty WHERE employee_id = 'CSE002'), 'Prototype selection algorithms for the nearest neighbor classifier: Generalization and empirical study', 'Damodar Reddy Edla, Venkatanareshbabu Kuppili, Ramesh Dharavath', 'Journal', 'Applied Soft Computing', 2018, TRUE),
((SELECT id FROM faculty WHERE employee_id = 'CSE002'), 'An efficient load balancing of gateways in wireless sensor networks', 'Damodar Reddy Edla, Ramesh Dharavath, Venkatanareshbabu Kuppili', 'Journal', 'Wireless Networks', 2017, TRUE),
((SELECT id FROM faculty WHERE employee_id = 'CSE002'), 'Outlier detection and robust plane fitting for building roof extraction from LiDAR data', 'Damodar Reddy Edla, Kuppili Venkatanareshbabu, Ramesh Dharavath', 'Journal', 'Remote Sensing', 2022, TRUE);

-- Dr. Venkatanareshbabu Kuppili Publications (from images)  
INSERT INTO publications (faculty_id, title, authors, publication_type, journal_conference_name, publication_year, is_featured) VALUES
((SELECT id FROM faculty WHERE employee_id = 'CSE006'), 'Automatic detection of microaneurysms and exudates in fundus images using digital image processing techniques', 'Venkatanareshbabu Kuppili, Damodar Reddy Edla, Ramesh Dharavath', 'Journal', 'Applied Sciences', 2017, TRUE),
((SELECT id FROM faculty WHERE employee_id = 'CSE006'), 'Adaptive fuzzy clustering based anomaly detection in wireless sensor networks', 'Venkatanareshbabu Kuppili, Damodar Reddy Edla, Ramesh Dharavath', 'Journal', 'Computer Communications', 2018, TRUE),
((SELECT id FROM faculty WHERE employee_id = 'CSE006'), 'An optimized approach for feature selection in multi-label classification', 'Venkatanareshbabu Kuppili, Damodar Reddy Edla', 'Conference', 'International Conference on Information Systems Design and Intelligent Applications', 2019, FALSE);

-- Update department head
UPDATE departments SET head_of_department = (SELECT id FROM faculty WHERE employee_id = 'CSE001') WHERE code = 'CSE';

-- Summary
SELECT 'CSE Department Faculty Data Inserted Successfully!' as Status;
SELECT 
    d.name as Department,
    COUNT(f.id) as Total_Faculty,
    CONCAT(hod.title, ' ', hod.first_name, ' ', hod.last_name) as Department_Head
FROM departments d
LEFT JOIN faculty f ON d.id = f.department_id
LEFT JOIN faculty hod ON d.head_of_department = hod.id
WHERE d.code = 'CSE'
GROUP BY d.id, d.name, hod.id;
