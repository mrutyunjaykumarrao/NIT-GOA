-- NIT Goa Database Schema
-- Clean and organized structure
-- Created: July 15, 2025

USE nitgoa_db;

-- ================================================
-- CORE TABLES
-- ================================================

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'faculty', 'staff', 'student') NOT NULL DEFAULT 'faculty',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    established_year YEAR,
    head_of_department INT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    office_location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ================================================
-- FACULTY TABLES
-- ================================================

-- Faculty basic information table
CREATE TABLE faculty (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department_id INT NOT NULL,
    
    -- Name fields
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(20), -- Dr., Prof., Mr., Ms., etc.
    
    -- Position and hierarchy
    designation VARCHAR(255) NOT NULL,
    is_hod BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    joining_date DATE,
    
    -- Basic profile
    profile_image_url VARCHAR(500),
    bio TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_department (department_id),
    INDEX idx_display_order (display_order)
);

-- Faculty detailed information table
CREATE TABLE faculty_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    
    -- Personal Information
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    nationality VARCHAR(100),
    address TEXT,
    
    -- Contact Information
    phone VARCHAR(20),
    mobile VARCHAR(20),
    office_phone VARCHAR(20),
    office_location VARCHAR(255),
    office_hours VARCHAR(255),
    
    -- Academic Information
    qualification TEXT, -- Highest qualification
    specialization VARCHAR(500),
    research_interests TEXT,
    experience_years INT,
    
    -- Additional Information
    courses_taught TEXT,
    administrative_roles TEXT,
    awards_honors TEXT,
    professional_memberships TEXT,
    
    -- External Links
    personal_website VARCHAR(500),
    google_scholar_url VARCHAR(500),
    research_gate_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    orcid_id VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
);

-- ================================================
-- PUBLICATIONS TABLE
-- ================================================

CREATE TABLE publications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    
    -- Publication Details
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    publication_type ENUM('Journal', 'Conference', 'Book', 'Book Chapter', 'Patent', 'Other') NOT NULL,
    journal_conference_name VARCHAR(500),
    volume VARCHAR(50),
    issue VARCHAR(50),
    pages VARCHAR(50),
    publication_year YEAR NOT NULL,
    publisher VARCHAR(255),
    
    -- Indexing and Impact
    doi VARCHAR(255),
    issn_isbn VARCHAR(50),
    impact_factor DECIMAL(5,3),
    citations_count INT DEFAULT 0,
    
    -- URLs and Links
    publication_url VARCHAR(500),
    pdf_url VARCHAR(500),
    
    -- Status
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    INDEX idx_faculty_year (faculty_id, publication_year),
    INDEX idx_type (publication_type)
);

-- ================================================
-- CUSTOM SECTIONS TABLE
-- ================================================

-- Custom sections that faculty can create (like projects, achievements, etc.)
CREATE TABLE custom_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    
    -- Section Details
    section_name VARCHAR(255) NOT NULL,
    section_description TEXT,
    section_type VARCHAR(100), -- 'projects', 'achievements', 'certifications', etc.
    
    -- Display Settings
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    INDEX idx_faculty_order (faculty_id, display_order)
);

-- Items within custom sections
CREATE TABLE custom_section_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_id INT NOT NULL,
    
    -- Item Details
    title VARCHAR(500) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    organization VARCHAR(255),
    location VARCHAR(255),
    
    -- Additional Fields
    url VARCHAR(500),
    document_url VARCHAR(500),
    tags VARCHAR(500), -- Comma-separated tags
    
    -- Display Settings
    display_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (section_id) REFERENCES custom_sections(id) ON DELETE CASCADE,
    INDEX idx_section_order (section_id, display_order)
);

-- ================================================
-- WEBSITE CONTENT TABLES
-- ================================================

-- Notices table
CREATE TABLE notices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    notice_type ENUM('General', 'Academic', 'Administrative', 'Urgent', 'Event') NOT NULL DEFAULT 'General',
    
    -- Validity
    publish_date DATE NOT NULL,
    expiry_date DATE,
    
    -- Attachments
    attachment_url VARCHAR(500),
    attachment_name VARCHAR(255),
    
    -- Status and Display
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0, -- Higher number = higher priority
    
    -- Metadata
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_publish_date (publish_date),
    INDEX idx_priority (priority)
);

-- Tenders table
CREATE TABLE tenders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tender_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    
    -- Tender Details
    tender_type ENUM('Goods', 'Services', 'Works', 'Consultancy') NOT NULL,
    estimated_value DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Important Dates
    publish_date DATE NOT NULL,
    last_date_submission DATETIME NOT NULL,
    opening_date DATETIME,
    
    -- Documents
    tender_document_url VARCHAR(500),
    corrigendum_url VARCHAR(500),
    
    -- Status
    status ENUM('Published', 'Closed', 'Awarded', 'Cancelled') DEFAULT 'Published',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_publish_date (publish_date),
    INDEX idx_submission_date (last_date_submission)
);

-- Events table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    
    -- Event Details
    event_type ENUM('Conference', 'Workshop', 'Seminar', 'Cultural', 'Sports', 'Academic', 'Other') NOT NULL,
    venue VARCHAR(255),
    organizer VARCHAR(255),
    
    -- Timing
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    
    -- Registration
    registration_required BOOLEAN DEFAULT FALSE,
    registration_url VARCHAR(500),
    registration_deadline DATE,
    
    -- Media
    image_url VARCHAR(500),
    brochure_url VARCHAR(500),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_start_date (start_date)
);

-- News and Announcements table
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT, -- Short summary for listings
    
    -- News Details
    news_type ENUM('Achievement', 'Research', 'Academic', 'Infrastructure', 'General') NOT NULL DEFAULT 'General',
    
    -- Media
    featured_image_url VARCHAR(500),
    gallery_images JSON, -- Array of image URLs
    
    -- SEO and Display
    slug VARCHAR(500) UNIQUE,
    meta_description TEXT,
    tags VARCHAR(500), -- Comma-separated tags
    
    -- Publishing
    publish_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_publish_date (publish_date),
    INDEX idx_slug (slug)
);

-- ================================================
-- FOREIGN KEY CONSTRAINTS
-- ================================================

-- Add foreign key constraint for department head
ALTER TABLE departments ADD CONSTRAINT fk_dept_head 
FOREIGN KEY (head_of_department) REFERENCES faculty(id) ON DELETE SET NULL;

-- ================================================
-- INITIAL DATA
-- ================================================

-- Insert departments
INSERT INTO departments (code, name, description, established_year, is_active, display_order) VALUES
('CSE', 'Computer Science & Engineering', 'Department of Computer Science and Engineering', 2010, TRUE, 1),
('ECE', 'Electronics & Communication Engineering', 'Department of Electronics and Communication Engineering', 2010, TRUE, 2),
('EEE', 'Electrical & Electronics Engineering', 'Department of Electrical and Electronics Engineering', 2012, TRUE, 3),
('MCE', 'Mechanical Engineering', 'Department of Mechanical Engineering', 2012, TRUE, 4),
('CVE', 'Civil Engineering', 'Department of Civil Engineering', 2014, TRUE, 5),
('APS', 'Applied Sciences', 'Department of Applied Sciences (Mathematics, Physics, Chemistry)', 2010, TRUE, 6),
('HSS', 'Humanities & Social Sciences', 'Department of Humanities and Social Sciences', 2010, TRUE, 7);

-- Create an admin user
INSERT INTO users (email, password_hash, role, status, email_verified) VALUES
('admin@nitgoa.ac.in', '$2b$12$rOzWz8GlOZ5QW5oF5YJ5w.pqY9rK3mN7X8vH6sL2eF4gT9iN1xQ2u', 'admin', 'active', TRUE);

SELECT 'Database schema created successfully!' as Status;
SELECT 'Departments inserted:' as Info, COUNT(*) as Count FROM departments;
