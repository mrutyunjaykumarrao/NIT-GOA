-- Faculty Data Migration Script  
-- Converting all existing faculty data from backup to database (faculty_profiles table)
-- This is the accurate faculty data that was working properly in the previous version

USE nitgoa_db;

-- Clear existing data first
DELETE FROM faculty_profiles;

-- Reset auto-increment to ensure clean IDs
ALTER TABLE faculty_profiles AUTO_INCREMENT = 1;

-- Insert all faculty data with proper image paths for faculty_profiles table
INSERT INTO faculty_profiles (
    employee_id, first_name, last_name, full_name, email, phone, 
    department, designation, research_areas, profile_image, 
    is_hod, display_order, is_active
) VALUES 

-- CSE Department
('CSE001', 'Dr. Veena', 'Thenkanidiyoor', 'Dr. Veena Thenkanidiyoor', 'veena@nitgoa.ac.in', 'Extension No.: 6854 (Internal)', 'CSE', 'Associate Professor & HOD', 'Artificial Intelligence, Cognitive Neuroscience, Brain Computer Interface, Medical Imaging, Wireless Sensor Networks, Machine Learning/Deep Learning', 'client/src/assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png', TRUE, 1, TRUE),
('CSE002', 'Dr. Damodar Reddy', 'Edla', 'Dr. Damodar Reddy Edla', 'dr.damodar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Associate Professor', 'Machine Learning, Data Mining, Big Data Analytics, IoT', 'client/src/assets/images/Faculty/CSE/Dr. Damodar Reddy Edla.png', FALSE, 2, TRUE),
('CSE003', 'Dr. Purushothama', 'B.R', 'Dr. Purushothama B.R', 'purushothama@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Associate Professor', 'Information Security, Cryptography, Cyber Security, IoT Management, Security Analytics', 'client/src/assets/images/Faculty/CSE/Dr. Purushothama.jpg', FALSE, 3, TRUE),
('CSE004', 'Dr. Keshavamurthy', 'B.N.', 'Dr. Keshavamurthy B.N.', 'keshavamurthy@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Associate Professor', 'Data Mining, Privacy Preserving Data Mining, Information Security', 'client/src/assets/images/Faculty/CSE/Dr. Keshavamurthy B.N..png', FALSE, 4, TRUE),
('CSE005', 'Dr. S.', 'Mini', 'Dr. S. Mini', 's.mini@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Associate Professor', 'Wireless Sensor Networks, Supply Chain Management, Optimization Techniques', 'client/src/assets/images/Faculty/CSE/Dr. S. Mini.png', FALSE, 5, TRUE),
('CSE006', 'Dr. Venkatanareshbabu', 'Kuppili', 'Dr. Venkatanareshbabu Kuppili', 'venkatanareshbabu@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Associate Professor', 'Big Data Analytics, Machine Learning, IoT, Intelligent, Deep Learning, Soft Computing', 'client/src/assets/images/Faculty/CSE/Dr. Venkatanareshbabu Kuppili.jpg', FALSE, 6, TRUE),
('CSE007', 'Dr. Modi Chirag', 'Navinchandra', 'Dr. Modi Chirag Navinchandra', 'cmodhi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Associate Professor', 'Network Security, Information System and Privacy Management, Computational Intelligence', 'client/src/assets/images/Faculty/CSE/Dr. Modi Chirag Navinchandra.png', FALSE, 7, TRUE),
('CSE008', 'Ms. Suniliya', 'S.', 'Ms. Suniliya S.', 'suniliya@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Faculty (on Contract)', 'Computer Networks, Information System Analysis, Fluid Substance in WSN', 'client/src/assets/images/Faculty/CSE/srividya.jpeg', FALSE, 8, TRUE),
('CSE009', 'Dr. Meenakshi', 'Panda', 'Dr. Meenakshi Panda', 'meenakshi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Faculty (on Contract)', 'Data Analytics, Process Mining, Data Mining, Web Mining', 'client/src/assets/images/Faculty/CSE/meenakshipanda.jpeg', FALSE, 9, TRUE),
('CSE010', 'Ms.', 'Antara', 'Ms. Antara', 'antara@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Assistant Professor', 'Software Engineering, Programming Languages, Algorithms', 'client/src/assets/images/Faculty/CSE/Antara.jpg', FALSE, 10, TRUE),
('CSE011', 'Mr.', 'Kashinath', 'Mr. Kashinath', 'kashinath@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Assistant Professor', 'Database Systems, Information Systems, Data Analytics', 'client/src/assets/images/Faculty/CSE/kashinath.jpg', FALSE, 11, TRUE),
('CSE012', 'Ms.', 'Paravati', 'Ms. Paravati', 'paravati@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Assistant Professor', 'Computer Networks, Distributed Systems, IoT', 'client/src/assets/images/Faculty/CSE/paravati_cse.png', FALSE, 12, TRUE),
('CSE013', 'Mr.', 'Pasha', 'Mr. Pasha', 'pasha@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 'Assistant Professor', 'Machine Learning, Artificial Intelligence, Data Science', 'client/src/assets/images/Faculty/CSE/pasha.jpg', FALSE, 13, TRUE),

-- ECE Department  
('ECE001', 'Dr.', 'Veerakumar', 'Dr. Veerakumar', 'veerakumar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor & HOD', 'VLSI Design, Digital Electronics', 'client/src/assets/images/Faculty/ECE/drveerakumar.jpeg', TRUE, 1, TRUE),
('ECE002', 'Dr. Anirban', 'Chatterjee', 'Dr. Anirban Chatterjee', 'anirban@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Professor', 'Signal Processing, Image Processing, Pattern Recognition', 'client/src/assets/images/Faculty/ECE/Dr. Anirban Chatterjee.png', FALSE, 2, TRUE),
('ECE003', 'Dr. Devesh', 'Dwivedi', 'Dr. Devesh Dwivedi', 'devesh@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'VLSI Design, Digital Signal Processing', 'client/src/assets/images/Faculty/ECE/Dr. Devesh Dwivedi.png', FALSE, 3, TRUE),
('ECE004', 'Dr. Lalat Indu', 'Giri', 'Dr. Lalat Indu Giri', 'lalat@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'Wireless Communication, Digital Signal Processing', 'client/src/assets/images/Faculty/ECE/Dr. Lalat Indu Giri.png', FALSE, 4, TRUE),
('ECE005', 'Dr. Lokesh Kumar', 'Bramhane', 'Dr. Lokesh Kumar Bramhane', 'lokesh@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'Microwave Engineering, Antenna Design', 'client/src/assets/images/Faculty/ECE/Dr. Lokesh Kumar Bramhane.png', FALSE, 5, TRUE),
('ECE006', 'Dr. Mallikarjun', 'Erramshetty', 'Dr. Mallikarjun Erramshetty', 'mallikarjun@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'Digital Communications, Signal Processing', 'client/src/assets/images/Faculty/ECE/Dr. Mallikarjun Erramshetty.png', FALSE, 6, TRUE),
('ECE007', 'Dr. Nithin Kumar', 'Y.B.', 'Dr. Nithin Kumar Y.B.', 'nithin@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'VLSI Design, Embedded Systems', 'client/src/assets/images/Faculty/ECE/Dr. Nithin Kumar Y.B..png', FALSE, 7, TRUE),
('ECE008', 'Dr. Pragati', 'Patel', 'Dr. Pragati Patel', 'pragati@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'Digital Signal Processing, Image Processing', 'client/src/assets/images/Faculty/ECE/Dr. Pragati Patel.png', FALSE, 8, TRUE),
('ECE009', 'Dr. Prashanth', 'G.R.', 'Dr. Prashanth G.R.', 'prashanth@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'RF & Microwave Engineering, Antenna Design', 'client/src/assets/images/Faculty/ECE/Dr. Prashanth G.R.jpg', FALSE, 9, TRUE),
('ECE010', 'Dr. Shivnarayan', 'Patidar', 'Dr. Shivnarayan Patidar', 'shivnarayan@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'Digital Communications, Signal Processing', 'client/src/assets/images/Faculty/ECE/Dr. Shivnarayan Patidar.png', FALSE, 10, TRUE),
('ECE011', 'Dr. Trilochan', 'Panigrahi', 'Dr. Trilochan Panigrahi', 'trilochan@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'Power Electronics, Control Systems', 'client/src/assets/images/Faculty/ECE/Dr. Trilochan Panigrahi.jpg', FALSE, 11, TRUE),
('ECE012', 'Dr.', 'Vasantha', 'Dr. Vasantha', 'vasantha@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 'Associate Professor', 'Wireless Communications, Mobile Computing', 'client/src/assets/images/Faculty/ECE/Dr. Vasantha (1).jpg', FALSE, 12, TRUE),

-- EEE Department
('EEE001', 'Dr. Suresh', 'Mikkili', 'Dr. Suresh Mikkili', 'suresh@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor & HOD', 'Power Electronics, Renewable Energy Systems', 'client/src/assets/images/Faculty/EEE/Dr. Suresh Mikkili.png', TRUE, 1, TRUE),
('EEE002', 'Dr. Anudevi', 'Samuel', 'Dr. Anudevi Samuel', 'anudevi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor', 'Power Systems, Renewable Energy, Smart Grid', 'client/src/assets/images/Faculty/EEE/Dr. Anudevi Samuel.png', FALSE, 2, TRUE),
('EEE003', 'Dr. B. Venugopal', 'Reddy', 'Dr. B. Venugopal Reddy', 'venugopal@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor', 'Power Electronics, Electric Drives, Control Systems', 'client/src/assets/images/Faculty/EEE/Dr. B. Venugopal Reddy.png', FALSE, 3, TRUE),
('EEE004', 'Dr. C.', 'Vyjayanthi', 'Dr. C. Vyjayanthi', 'vyjayanthi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor', 'Power Systems, Power Quality, FACTS Devices', 'client/src/assets/images/Faculty/EEE/Dr. C.Vyjayanthi.png', FALSE, 4, TRUE),
('EEE005', 'Dr. Soumitra', 'Das', 'Dr. Soumitra Das', 'soumitra@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor', 'Power Electronics, Electric Machines, Motor Drives', 'client/src/assets/images/Faculty/EEE/Dr. Soumitra Das.png', FALSE, 5, TRUE),
('EEE006', 'Dr. Sreeraj', 'E S', 'Dr. Sreeraj E S', 'sreeraj@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor', 'Power Systems, Protection, Smart Grid', 'client/src/assets/images/Faculty/EEE/Dr. Sreeraj E S.png', FALSE, 6, TRUE),
('EEE007', 'Dr. Amol D.', 'Rahulkar', 'Dr. Amol D. Rahulkar', 'amol@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor', 'Power Systems, Smart Grid Technology', 'client/src/assets/images/Faculty/EEE/Dr. Amol D. Rahulkar.jpg', FALSE, 7, TRUE),
('EEE008', 'Dr. K. Raghavendra', 'Reddy', 'Dr. K. Raghavendra Reddy', 'raghavendra@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Associate Professor', 'Electric Machines, Power Electronics', 'client/src/assets/images/Faculty/EEE/Dr. K Raghavenrda Reddy.jpeg', FALSE, 8, TRUE),
('EEE009', 'Ankeshwarapu', 'Sunil', 'Ankeshwarapu Sunil', 'sunil@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Assistant Professor', 'Control Systems, Automation', 'client/src/assets/images/Faculty/EEE/Ankeshwarapu Sunil.jpg', FALSE, 9, TRUE),
('EEE010', 'Senthamizh Selvan', 'S', 'Senthamizh Selvan S', 'senthamizh@nitgoa.ac.in', 'Extension No.: - (Internal)', 'EEE', 'Assistant Professor', 'Power Systems, Electrical Machines', 'client/src/assets/images/Faculty/EEE/SENTHAMIZH SELVAN S.jpeg', FALSE, 10, TRUE),

-- MCE Department
('MCE001', 'Dr. Prasenjit', 'Dey', 'Dr. Prasenjit Dey', 'prasenjit@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Associate Professor & HOD', 'Robotics, Automation, Control Systems', 'client/src/assets/images/Faculty/MCE/Dr. Prasenjit Dey.png', TRUE, 1, TRUE),
('MCE002', 'Dr. Abhijit', 'Sarkar', 'Dr. Abhijit Sarkar', 'abhijit@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Associate Professor', 'Heat Transfer, Thermal Engineering, CFD', 'client/src/assets/images/Faculty/MCE/Dr. Abhijit Sarkar.png', FALSE, 2, TRUE),
('MCE003', 'Dr. B.', 'Santhi', 'Dr. B. Santhi', 'santhi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Associate Professor', 'Manufacturing Technology, Materials Science', 'client/src/assets/images/Faculty/MCE/Dr. B. Santhi.png', FALSE, 3, TRUE),
('MCE004', 'Dr. Darius Diogo', 'Barreto', 'Dr. Darius Diogo Barreto', 'darius@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Associate Professor', 'Fluid Mechanics, Turbo Machinery, Energy Systems', 'client/src/assets/images/Faculty/MCE/Dr. Darius Diogo Barreto.png', FALSE, 4, TRUE),
('MCE005', 'Dr. Gaurang', 'Ruhela', 'Dr. Gaurang Ruhela', 'gaurang@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Associate Professor', 'Machine Design, Vibrations, Finite Element Analysis', 'client/src/assets/images/Faculty/MCE/Dr. Gaurang Ruhela.png', FALSE, 5, TRUE),
('MCE006', 'Dr. Pravin Anandrao', 'Pawar', 'Dr. Pravin Anandrao Pawar', 'pravin@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Associate Professor', 'Manufacturing, Materials, Industrial Engineering', 'client/src/assets/images/Faculty/MCE/Dr. Pravin Anandrao Pawar.png', FALSE, 6, TRUE),
('MCE007', 'Chaitanya', 'Vundru', 'Chaitanya Vundru', 'chaitanya@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Assistant Professor', 'Thermal Engineering, Heat Transfer', 'client/src/assets/images/Faculty/MCE/Chaitanya Vundru.jpeg', FALSE, 7, TRUE),
('MCE008', 'Samar', 'Singhal', 'Samar Singhal', 'samar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Assistant Professor', 'Manufacturing Technology, CAD/CAM', 'client/src/assets/images/Faculty/MCE/Samar Singhal.png', FALSE, 8, TRUE),
('MCE009', 'Mr.', 'Animesh', 'Mr. Animesh', 'animesh@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Assistant Professor', 'Fluid Mechanics, Thermodynamics', 'client/src/assets/images/Faculty/MCE/Animesh_MCE.png', FALSE, 9, TRUE),
('MCE010', 'Mr.', 'Hiru', 'Mr. Hiru', 'hiru@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Assistant Professor', 'Machine Design, Mechanics', 'client/src/assets/images/Faculty/MCE/Hiru_MCE.png', FALSE, 10, TRUE),
('MCE011', 'Mr.', 'Thirupathi', 'Mr. Thirupathi', 'thirupathi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'MCE', 'Assistant Professor', 'Manufacturing, Production Engineering', 'client/src/assets/images/Faculty/MCE/Thirupathi_MCE.png', FALSE, 11, TRUE),

-- CVE Department
('CVE001', 'Dr. Harikumar', 'M', 'Dr. Harikumar M', 'harikumar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Associate Professor & HOD', 'Geotechnical Engineering, Foundation Engineering, Soil Mechanics', 'client/src/assets/images/Faculty/CVE/Dr. Harikumar M.png', TRUE, 1, TRUE),
('CVE002', 'Prof. O. R.', 'Jaiswal', 'Prof. O. R. Jaiswal', 'orjaiswal@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Professor', 'Structural Engineering, Earthquake Engineering, Concrete Technology', 'client/src/assets/images/Faculty/CVE/Prof. O. R. Jaiswal.png', FALSE, 2, TRUE),
('CVE003', 'Dr. Saurabh', 'Upadhyay', 'Dr. Saurabh Upadhyay', 'saurabh@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Associate Professor', 'Environmental Engineering, Water Resources, Hydrology', 'client/src/assets/images/Faculty/CVE/Dr. Saurabh Upadhyay.png', FALSE, 3, TRUE),
('CVE004', 'Ranendra Nath', 'Bhowmik', 'Ranendra Nath Bhowmik', 'ranendra@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Assistant Professor', 'Transportation Engineering, Traffic Engineering, Highway Design', 'client/src/assets/images/Faculty/CVE/Ranendra Nath Bhowmik.png', FALSE, 4, TRUE),
('CVE005', 'Bapi', 'Mondal', 'Bapi Mondal', 'bapi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Assistant Professor', 'Structural Engineering, Concrete Technology', 'client/src/assets/images/Faculty/CVE/Bapi Mondal.png', FALSE, 5, TRUE),
('CVE006', 'Mr.', 'Chandra', 'Mr. Chandra', 'chandra@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Assistant Professor', 'Geotechnical Engineering, Soil Mechanics', 'client/src/assets/images/Faculty/CVE/Chandra_CVE.png', FALSE, 6, TRUE),
('CVE007', 'Mr.', 'Mani', 'Mr. Mani', 'mani@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Assistant Professor', 'Environmental Engineering, Water Resources', 'client/src/assets/images/Faculty/CVE/Mani_CVE.png', FALSE, 7, TRUE),
('CVE008', 'Mr.', 'Saidulu', 'Mr. Saidulu', 'saidulu@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Assistant Professor', 'Structural Analysis, Design', 'client/src/assets/images/Faculty/CVE/Saidulu_CVE.png', FALSE, 8, TRUE),
('CVE009', 'Mr.', 'Suryateja', 'Mr. Suryateja', 'suryateja@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Assistant Professor', 'Construction Management, Project Planning', 'client/src/assets/images/Faculty/CVE/Suryateja_CVE.png', FALSE, 9, TRUE),
('CVE010', 'Mr.', 'VNM', 'Mr. VNM', 'vnm@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CVE', 'Assistant Professor', 'Hydraulics, Water Engineering', 'client/src/assets/images/Faculty/CVE/VNM_CVE.png', FALSE, 10, TRUE),

-- APS Department
('APS001', 'Dr. L.', 'Shangerganesh', 'Dr. L. Shangerganesh', 'shangerganesh@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor & HOD', 'Partial Differential Equations, Mathematical Modeling, Fluid Dynamics', 'client/src/assets/images/Faculty/APS/Dr. L. Shangerganesh.png', TRUE, 1, TRUE),
('APS002', 'Dr. Gundlapally Shiva Kumar', 'Reddy', 'Dr. Gundlapally Shiva Kumar Reddy', 'shivakumar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor', 'Mathematical Analysis, Differential Equations, Numerical Methods', 'client/src/assets/images/Faculty/APS/Dr. Gundlapally Shiva Kumar Reddy.png', FALSE, 2, TRUE),
('APS003', 'Dr. Lasitha', 'P', 'Dr. Lasitha P', 'lasitha@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor', 'Solid State Physics, Materials Science, Nanotechnology', 'client/src/assets/images/Faculty/APS/Dr. Lasitha P.png', FALSE, 3, TRUE),
('APS004', 'Dr. Ragoju', 'Ravi', 'Dr. Ragoju Ravi', 'ragoju@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor', 'Condensed Matter Physics, Computational Physics', 'client/src/assets/images/Faculty/APS/Dr. Ragoju Ravi.png', FALSE, 4, TRUE),
('APS005', 'Dr. Suman', 'Gandi', 'Dr. Suman Gandi', 'suman@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor', 'Organic Chemistry, Medicinal Chemistry, Drug Design', 'client/src/assets/images/Faculty/APS/Dr. Suman Gandi.png', FALSE, 5, TRUE),
('APS006', 'Dr. Ravi Prasad', 'K. J.', 'Dr. Ravi Prasad K. J.', 'raviprasad@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor', 'Theoretical Physics, Quantum Mechanics', 'client/src/assets/images/Faculty/APS/Dr. Ravi Prasad K. J..png', FALSE, 6, TRUE),
('APS007', 'Dr. Saidi Reddy', 'Parne', 'Dr. Saidi Reddy Parne', 'saidi@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor', 'Applied Mathematics, Numerical Analysis', 'client/src/assets/images/Faculty/APS/Dr. Saidi Reddy Parne.png', FALSE, 7, TRUE),
('APS008', 'Dr. Velavan', 'Kathirvelu', 'Dr. Velavan Kathirvelu', 'velavan@nitgoa.ac.in', 'Extension No.: - (Internal)', 'APS', 'Associate Professor', 'Physical Chemistry, Materials Chemistry', 'client/src/assets/images/Faculty/APS/Dr. Velavan Kathirvelu.png', FALSE, 8, TRUE),

-- HSS Department
('HSS001', 'Dr. Sarani Ghosal', 'Mondal', 'Dr. Sarani Ghosal Mondal', 'sarani@nitgoa.ac.in', 'Extension No.: - (Internal)', 'HSS', 'Associate Professor & HOD', 'Applied Linguistics, English Language Teaching, Literature', 'client/src/assets/images/Faculty/HSS/Dr. Sarani Ghosal Mondal.jpg', TRUE, 1, TRUE),
('HSS002', 'Dr. Sunil', 'Kumar', 'Dr. Sunil Kumar', 'sunilkumar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'HSS', 'Associate Professor', 'Economics, Development Economics, Industrial Economics', 'client/src/assets/images/Faculty/HSS/Dr. Sunil Kumar.png', FALSE, 2, TRUE),
('HSS003', 'Dr. Unais', 'KT', 'Dr. Unais KT', 'unais@nitgoa.ac.in', 'Extension No.: - (Internal)', 'HSS', 'Associate Professor', 'Philosophy, Ethics, Social Philosophy', 'client/src/assets/images/Faculty/HSS/Dr. Unais KT.png', FALSE, 3, TRUE),
('HSS004', 'Mr. Vishnupad', 'Barve', 'Mr. Vishnupad Barve', 'vishnupad@nitgoa.ac.in', 'Extension No.: - (Internal)', 'HSS', 'Assistant Professor', 'Management Studies, Organizational Behavior, Human Resources', 'client/src/assets/images/Faculty/HSS/Mr. Vishnupad Barve.jpg', FALSE, 4, TRUE);
