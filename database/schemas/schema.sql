-- Faculty Management System Database Schema (Correct Version)
-- This schema matches the current working database structure

CREATE DATABASE IF NOT EXISTS nitgoa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE nitgoa_db;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','faculty') NOT NULL DEFAULT 'faculty',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `faculty_profiles`
--

CREATE TABLE `faculty_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `employee_id` varchar(20) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `office_location` varchar(100) DEFAULT NULL,
  `department` enum('CSE','ECE','EEE','MCE','CVE','HSS','APS') NOT NULL,
  `designation` varchar(100) NOT NULL,
  `qualification` text,
  `specialization` text,
  `research_areas` text,
  `experience_years` int DEFAULT '0',
  `date_of_joining` date DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `bio` text,
  `address` text,
  `profile_image` varchar(500) DEFAULT NULL,
  `is_hod` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '999',
  `linkedin_url` varchar(500) DEFAULT NULL,
  `google_scholar_url` varchar(500) DEFAULT NULL,
  `researchgate_url` varchar(500) DEFAULT NULL,
  `orcid_url` varchar(500) DEFAULT NULL,
  `personal_website` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  UNIQUE KEY `email` (`email`),
  KEY `user_id` (`user_id`),
  KEY `idx_faculty_department` (`department`),
  KEY `idx_faculty_status` (`is_active`),
  KEY `idx_faculty_hod` (`is_hod`),
  KEY `idx_faculty_display_order` (`display_order`),
  CONSTRAINT `faculty_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `faculty_publications`
--

CREATE TABLE `faculty_publications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `title` varchar(500) NOT NULL,
  `authors` text,
  `publication_type` enum('journal','conference','book','chapter','patent','other') NOT NULL,
  `journal_name` varchar(300) DEFAULT NULL,
  `conference_name` varchar(300) DEFAULT NULL,
  `volume` varchar(50) DEFAULT NULL,
  `issue` varchar(50) DEFAULT NULL,
  `pages` varchar(50) DEFAULT NULL,
  `publication_year` year DEFAULT NULL,
  `doi` varchar(200) DEFAULT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `publisher` varchar(200) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_publications_faculty` (`faculty_id`),
  KEY `idx_publications_year` (`publication_year`),
  KEY `idx_publications_type` (`publication_type`),
  KEY `idx_publications_featured` (`is_featured`),
  CONSTRAINT `faculty_publications_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `faculty_awards`
--

CREATE TABLE `faculty_awards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `award_title` varchar(300) NOT NULL,
  `awarded_by` varchar(300) DEFAULT NULL,
  `award_year` year DEFAULT NULL,
  `award_type` enum('national','international','institutional','research','teaching') DEFAULT 'institutional',
  `description` text,
  `is_featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_awards_faculty` (`faculty_id`),
  KEY `idx_awards_year` (`award_year`),
  KEY `idx_awards_featured` (`is_featured`),
  CONSTRAINT `faculty_awards_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `faculty_custom_sections`
--

CREATE TABLE `faculty_custom_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `section_title` varchar(200) NOT NULL,
  `section_type` enum('list','text','table') DEFAULT 'list',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_custom_sections_faculty` (`faculty_id`),
  KEY `idx_custom_sections_order` (`display_order`),
  CONSTRAINT `faculty_custom_sections_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `faculty_custom_section_items`
--

CREATE TABLE `faculty_custom_section_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `item_title` varchar(300) DEFAULT NULL,
  `item_content` text,
  `item_url` varchar(500) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_custom_items_section` (`section_id`),
  KEY `idx_custom_items_order` (`display_order`),
  CONSTRAINT `faculty_custom_section_items_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `faculty_custom_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Sample Data (Admin User)
-- Default password for all users: admin123
--

INSERT INTO `users` (`username`, `email`, `password_hash`, `role`, `is_active`) VALUES 
('admin', 'admin@nitgoa.ac.in', '$2b$10$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'admin', 1);

--
-- Sample Faculty Data (NIT Goa Faculty)
--

INSERT INTO `faculty_profiles` (
  `employee_id`, `first_name`, `last_name`, `full_name`, `email`, `phone`, 
  `department`, `designation`, `qualification`, `research_areas`, `experience_years`, 
  `date_of_joining`, `profile_image`, `is_hod`, `is_active`, `display_order`
) VALUES 
(
  'CSE001', 'Veena', 'Thenkanidiyoor', 'Dr. Veena Thenkanidiyoor', 
  'veena@nitgoa.ac.in', 'Extension No.: 6854 (Internal)', 'CSE', 
  'Associate Professor & HOD', 'Ph.D. in Computer Science',
  'Artificial Intelligence, Cognitive Neuroscience, Brain Computer Interface, Medical Imaging, Wireless Sensor Networks, Machine Learning/Deep Learning',
  10, '2015-07-01', 'client/src/assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png', 1, 1, 1
),
(
  'CSE002', 'Damodar Reddy', 'Edla', 'Dr. Damodar Reddy Edla', 
  'dr.damodar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'CSE', 
  'Associate Professor', 'Ph.D. in Computer Science',
  'Machine Learning, Data Mining, Big Data Analytics, IoT',
  8, '2017-01-10', 'client/src/assets/images/Faculty/CSE/Dr. Damodar Reddy Edla.png', 0, 1, 2
),
(
  'ECE001', 'Veerakumar', '', 'Dr. Veerakumar', 
  'veerakumar@nitgoa.ac.in', 'Extension No.: - (Internal)', 'ECE', 
  'Associate Professor & HOD', 'Ph.D. in Electronics and Communication Engineering',
  'Signal Processing, Communication Systems, VLSI Design',
  12, '2014-08-15', 'client/src/assets/images/Faculty/ECE/Dr. Veerakumar.png', 1, 1, 1
);

--
-- Sample User Accounts for Faculty
--

INSERT INTO `users` (`username`, `email`, `password_hash`, `role`, `is_active`) VALUES 
('veena.thenkanidiyoor', 'veena@nitgoa.ac.in', '$2b$10$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 1),
('damodar.edla', 'dr.damodar@nitgoa.ac.in', '$2b$10$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 1),
('veerakumar', 'veerakumar@nitgoa.ac.in', '$2b$10$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'faculty', 1);

--
-- Indexes for better performance
--

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_faculty_employee_id ON faculty_profiles(employee_id);
CREATE INDEX idx_faculty_email ON faculty_profiles(email);
