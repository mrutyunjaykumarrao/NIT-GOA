-- =============================================================================
-- NIT GOA DATABASE SCHEMA
-- =============================================================================
-- 
-- File: nitgoa_database_schema.sql
-- Description: Complete database schema for NIT Goa Faculty Management System
-- Version: 1.0
-- Created: January 2025
-- 
-- This file contains the complete schema structure for the NIT Goa Faculty 
-- Management System, including all tables, indexes, and constraints.
-- 
-- Database: nitgoa_db
-- Tables: 16 tables total
-- - Faculty Management: 13 tables for comprehensive faculty profiles
-- - Staff Management: 2 tables for technical and administrative staff  
-- - System Management: 1 table for user authentication
-- 
-- Usage: Run this file to create the complete database structure
-- mysql -u username -p database_name < nitgoa_database_schema.sql
-- 
-- =============================================================================

-- MySQL Configuration and Setup
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- =============================================================================
-- ADMINISTRATIVE STAFF TABLE
-- =============================================================================
-- Stores information about administrative staff members including directors, 
-- registrars, office staff, and other administrative personnel.

DROP TABLE IF EXISTS `administrative_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrative_staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `designation` varchar(200) NOT NULL,
  `department` varchar(200) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '999',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_administrative_staff_department` (`department`),
  KEY `idx_administrative_staff_active` (`is_active`),
  KEY `idx_administrative_staff_display_order` (`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY ACADEMIC INFO TABLE  
-- =============================================================================
-- Stores detailed academic background information for faculty members
-- including degrees, institutions, graduation years, and academic qualifications.

DROP TABLE IF EXISTS `faculty_academic_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_academic_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `degree` varchar(100) NOT NULL,
  `institute` varchar(500) NOT NULL,
  `year` varchar(10) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_academic_faculty` (`faculty_id`),
  KEY `idx_academic_order` (`display_order`),
  CONSTRAINT `faculty_academic_info_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY AWARDS TABLE
-- =============================================================================
-- Records all awards, honors, recognitions, and achievements received by faculty members
-- from various organizations, institutions, and professional bodies.

DROP TABLE IF EXISTS `faculty_awards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_awards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `award_title` varchar(500) NOT NULL,
  `awarded_by` varchar(300) DEFAULT NULL,
  `award_year` varchar(10) DEFAULT NULL,
  `award_month` varchar(20) DEFAULT NULL,
  `award_type` enum('national','international','institutional','research','teaching','best_paper') DEFAULT 'institutional',
  `description` text,
  `is_featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_awards_faculty` (`faculty_id`),
  KEY `idx_awards_year` (`award_year`),
  KEY `idx_awards_featured` (`is_featured`),
  CONSTRAINT `faculty_awards_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY COURSES ATTENDED TABLE
-- =============================================================================  
-- Tracks professional development courses, workshops, conferences, and training
-- programs attended by faculty members for continuous learning and skill enhancement.

DROP TABLE IF EXISTS `faculty_courses_attended`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_courses_attended` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `course_title` text NOT NULL,
  `organizer` varchar(300) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `month` varchar(20) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `course_type` enum('workshop','conference','training','fdp','seminar','other') DEFAULT 'workshop',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_courses_attended_faculty` (`faculty_id`),
  KEY `idx_courses_attended_year` (`year`),
  CONSTRAINT `faculty_courses_attended_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=326 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY COURSES CONDUCTED TABLE
-- =============================================================================
-- Records workshops, training programs, and specialized courses conducted or 
-- organized by faculty members for students, industry, or academic community.

DROP TABLE IF EXISTS `faculty_courses_conducted`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_courses_conducted` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `course_title` text NOT NULL,
  `organizer` varchar(300) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `month` varchar(20) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `course_type` enum('workshop','conference','training','fdp','seminar','other') DEFAULT 'workshop',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_courses_conducted_faculty` (`faculty_id`),
  KEY `idx_courses_conducted_year` (`year`),
  CONSTRAINT `faculty_courses_conducted_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY COURSES TAUGHT TABLE
-- =============================================================================
-- Lists undergraduate and postgraduate courses regularly taught by faculty members
-- as part of their academic responsibilities and curriculum delivery.

DROP TABLE IF EXISTS `faculty_courses_taught`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_courses_taught` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `course_name` varchar(300) NOT NULL,
  `course_level` enum('ug','pg','phd') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_courses_faculty` (`faculty_id`),
  KEY `idx_courses_level` (`course_level`),
  CONSTRAINT `faculty_courses_taught_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=338 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY CUSTOM SECTION ITEMS TABLE
-- =============================================================================
-- Stores individual items/entries within custom profile sections, allowing
-- faculty to add personalized content and information to their profiles.

DROP TABLE IF EXISTS `faculty_custom_section_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY CUSTOM SECTIONS TABLE
-- =============================================================================
-- Defines custom profile sections that faculty can create to showcase additional
-- information, achievements, or specialized content not covered by standard fields.

DROP TABLE IF EXISTS `faculty_custom_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY FUNDED PROJECTS TABLE
-- =============================================================================
-- Records research projects with funding from government agencies, industry
-- partners, and other organizations, including project details and funding information.

DROP TABLE IF EXISTS `faculty_funded_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_funded_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `project_title` varchar(500) NOT NULL,
  `funding_agency` varchar(300) DEFAULT NULL,
  `principal_investigator` varchar(200) DEFAULT NULL,
  `co_investigators` text,
  `amount` varchar(50) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('ongoing','completed','submitted') DEFAULT 'ongoing',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_faculty` (`faculty_id`),
  KEY `idx_projects_status` (`status`),
  CONSTRAINT `faculty_funded_projects_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY MEMBERSHIPS TABLE
-- =============================================================================
-- Tracks professional memberships in academic societies, professional organizations,
-- editorial boards, and other relevant professional associations.

DROP TABLE IF EXISTS `faculty_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_memberships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `organization_name` varchar(300) NOT NULL,
  `membership_type` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `start_year` varchar(10) DEFAULT NULL,
  `end_year` varchar(10) DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '1',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_memberships_faculty` (`faculty_id`),
  KEY `idx_memberships_current` (`is_current`),
  CONSTRAINT `faculty_memberships_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY PROFESSIONAL SERVICES TABLE  
-- =============================================================================
-- Documents administrative roles, committee memberships, editorial services,
-- and other professional service contributions made by faculty members.

DROP TABLE IF EXISTS `faculty_professional_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_professional_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `service_type` enum('editorial','reviewing','organizing','committee','other') NOT NULL,
  `organization` varchar(300) DEFAULT NULL,
  `position` varchar(200) DEFAULT NULL,
  `description` text,
  `start_year` varchar(10) DEFAULT NULL,
  `end_year` varchar(10) DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_faculty` (`faculty_id`),
  KEY `idx_services_type` (`service_type`),
  CONSTRAINT `faculty_professional_services_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY PROFILES TABLE - MAIN TABLE
-- =============================================================================
-- Central table storing core faculty information including personal details,
-- academic positions, contact information, and profile management data.
-- This is the primary table that other faculty tables reference via foreign keys.

DROP TABLE IF EXISTS `faculty_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `office_location` varchar(100) DEFAULT NULL,
  `department` enum('CSE','ECE','EEE','MCE','CVE','HSS','APS') NOT NULL,
  `designation` varchar(200) NOT NULL,
  `qualification` text,
  `specialization` text,
  `research_areas` text,
  `research_area_summary` text,
  `experience_years` int DEFAULT '0',
  `experience_description` text,
  `date_of_joining` date DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `bio` text,
  `address` text,
  `profile_image` varchar(500) DEFAULT NULL,
  `personal_website` varchar(500) DEFAULT NULL,
  `is_hod` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '999',
  `linkedin_url` varchar(500) DEFAULT NULL,
  `google_scholar_url` varchar(500) DEFAULT NULL,
  `researchgate_url` varchar(500) DEFAULT NULL,
  `orcid_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `user_id` (`user_id`),
  KEY `idx_faculty_department` (`department`),
  KEY `idx_faculty_status` (`is_active`),
  KEY `idx_faculty_hod` (`is_hod`),
  KEY `idx_faculty_display_order` (`display_order`),
  CONSTRAINT `faculty_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY PUBLICATIONS TABLE
-- =============================================================================
-- Comprehensive repository of faculty research publications including journal articles,
-- conference papers, books, book chapters, patents, and other scholarly works.

DROP TABLE IF EXISTS `faculty_publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_publications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `title` text,
  `authors` text,
  `publication_type` enum('journal','conference','proceedings','book','chapter','patent','other') NOT NULL,
  `journal_name` varchar(500) DEFAULT NULL,
  `conference_name` varchar(500) DEFAULT NULL,
  `volume` varchar(50) DEFAULT NULL,
  `issue` varchar(50) DEFAULT NULL,
  `pages` varchar(100) DEFAULT NULL,
  `publication_year` varchar(10) DEFAULT NULL,
  `publication_month` varchar(20) DEFAULT NULL,
  `doi` varchar(200) DEFAULT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `publisher` varchar(300) DEFAULT NULL,
  `full_citation` text,
  `impact_factor` varchar(20) DEFAULT NULL,
  `indexing_info` varchar(100) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_publications_faculty` (`faculty_id`),
  KEY `idx_publications_year` (`publication_year`),
  KEY `idx_publications_type` (`publication_type`),
  KEY `idx_publications_featured` (`is_featured`),
  CONSTRAINT `faculty_publications_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1713 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- FACULTY RESEARCH GUIDANCE TABLE
-- =============================================================================
-- Records student supervision activities including PhD, M.Tech, and other research
-- guidance provided by faculty members, tracking current and completed supervisions.

DROP TABLE IF EXISTS `faculty_research_guidance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_research_guidance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `student_name` varchar(200) NOT NULL,
  `research_topic` text,
  `guidance_type` enum('phd','mtech','btech','postdoc','other') DEFAULT 'phd',
  `status` enum('ongoing','completed','submitted') DEFAULT 'ongoing',
  `start_year` varchar(10) DEFAULT NULL,
  `completion_year` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guidance_faculty` (`faculty_id`),
  KEY `idx_guidance_status` (`status`),
  CONSTRAINT `faculty_research_guidance_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- TECHNICAL STAFF TABLE
-- =============================================================================
-- Stores information about technical staff members including lab technicians,
-- technical assistants, and other technical support personnel.

DROP TABLE IF EXISTS `technical_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `technical_staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `designation` varchar(200) NOT NULL,
  `department` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `speciality` varchar(300) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '999',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_technical_staff_department` (`department`),
  KEY `idx_technical_staff_active` (`is_active`),
  KEY `idx_technical_staff_display_order` (`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- =============================================================================
-- USERS TABLE  
-- =============================================================================
-- System authentication and user management table storing login credentials
-- and access control information for the faculty management system.

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'nitgoa_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-22 16:03:49
