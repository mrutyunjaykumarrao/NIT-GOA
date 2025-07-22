-- Create Technical Staff and Administrative Staff Tables
-- Run this after the main faculty schema is set up

USE nitgoa_db;

-- Table for Technical Staff
CREATE TABLE IF NOT EXISTS `technical_staff` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table for Administrative Staff
CREATE TABLE IF NOT EXISTS `administrative_staff` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
