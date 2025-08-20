-- =================================================================
--  Enhanced Database Schema for College Profile Management System
--  Version: 2.0 (Updated for streamlined backend/frontend integration)
-- =================================================================

-- -----------------------------------------------------------------
-- Section 1: Core Authentication & Lookup Tables
-- These tables have no dependencies and should be created first.
-- -----------------------------------------------------------------

-- Manages user logins and permissions (Admin, Faculty).
CREATE TABLE user_accounts (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    access_level ENUM('Admin', 'Faculty') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Added for account management
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0, -- Added for security
    locked_until TIMESTAMP NULL, -- Added for account locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores the list of all college departments.
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL UNIQUE,
    department_code VARCHAR(10) UNIQUE, -- Added for easier reference
    description TEXT, -- Added for department details
    is_active BOOLEAN DEFAULT TRUE, -- Added for management
    display_order INT DEFAULT 0, -- Added for ordering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores all possible job titles/designations.
CREATE TABLE designations (
    designation_id INT PRIMARY KEY AUTO_INCREMENT,
    designation_title VARCHAR(255) NOT NULL UNIQUE,
    designation_level INT DEFAULT 0, -- Added for hierarchy (1=lowest, higher numbers = senior)
    is_active BOOLEAN DEFAULT TRUE, -- Added for management
    display_order INT DEFAULT 0, -- Added for ordering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Master list of all available courses.
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_level ENUM('Undergraduate', 'Postgraduate', 'Diploma', 'Certificate') NOT NULL, -- Added more options
    department_id INT, -- Added to link courses to departments
    credits INT, -- Added for academic planning
    semester VARCHAR(20), -- Added to specify which semester
    is_active BOOLEAN DEFAULT TRUE, -- Added for management
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Master list of all research interests for tagging.
CREATE TABLE research_areas (
    area_id INT PRIMARY KEY AUTO_INCREMENT,
    area_name VARCHAR(255) NOT NULL UNIQUE,
    parent_area_id INT, -- Added for hierarchical research areas
    description TEXT, -- Added for detailed description
    is_active BOOLEAN DEFAULT TRUE, -- Added for management
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_area_id) REFERENCES research_areas(area_id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------
-- Section 2: Main Employee & Profile Tables
-- The core structure for managing all people in the system.
-- -----------------------------------------------------------------

-- Master table for every person; holds common information.
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    user_account_id INT UNIQUE, -- Links to the login account
    employee_code VARCHAR(50) UNIQUE, -- Added for HR management
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_mobile VARCHAR(20),
    phone_office VARCHAR(20), -- Separated office phone
    extension_no VARCHAR(20),
    date_of_joining DATE,
    date_of_leaving DATE, -- Added for inactive employees
    -- This 'discriminator' column determines the person's role.
    role ENUM('Faculty', 'Administrative', 'Technical') NOT NULL,
    employment_status VARCHAR(100), -- e.g., 'Permanent', 'Contract', 'Visiting'
    employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Visiting') DEFAULT 'Full-time', -- Added for clarity
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE, -- Added for management
    is_public_visible BOOLEAN DEFAULT TRUE, -- Added for privacy control
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_account_id) REFERENCES user_accounts(user_id) ON DELETE SET NULL,
    INDEX idx_role (role),
    INDEX idx_active (is_active),
    INDEX idx_public_visible (is_public_visible)
);

-- Profile table for Administrative and Technical staff.
CREATE TABLE staff_profiles (
    employee_id INT PRIMARY KEY, -- This is both a PK and FK
    department_id INT,
    designation_id INT,
    specialty VARCHAR(255), -- e.g., 'System Administrator', 'Accounts'
    qualifications TEXT, -- Added for staff qualifications
    responsibilities TEXT, -- Added for role description
    office_location VARCHAR(100), -- Added for contact info
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    FOREIGN KEY (designation_id) REFERENCES designations(designation_id) ON DELETE SET NULL
);

-- Profile table for faculty-specific information.
CREATE TABLE faculty_profiles (
    employee_id INT PRIMARY KEY, -- This is both a PK and FK
    department_id INT,
    designation_id INT,
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    research_teaching_experience TEXT,
    address TEXT,
    office_location VARCHAR(100), -- Added for contact info
    office_hours VARCHAR(255), -- Added for student consultation
    linkedin_url VARCHAR(255),
    personal_website_url VARCHAR(255),
    google_scholar_url VARCHAR(255),
    orcid_id VARCHAR(50), -- Added for research identification
    scopus_id VARCHAR(50), -- Added for research metrics
    research_gate_url VARCHAR(255), -- Added for academic networking
    -- Stores other social links as a flexible key-value object.
    other_social_links JSON,
    bio_summary TEXT, -- Added for brief biography
    research_interests TEXT, -- Added for general research description
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    FOREIGN KEY (designation_id) REFERENCES designations(designation_id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------
-- Section 3: Faculty Content Tables
-- These tables store the detailed, section-based content for faculty.
-- -----------------------------------------------------------------

-- Stores academic degrees (one-to-many with faculty).
CREATE TABLE faculty_education (
    education_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    degree VARCHAR(100) NOT NULL,
    institute VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    completion_year YEAR,
    grade_percentage DECIMAL(5,2), -- Added for academic performance
    thesis_title VARCHAR(500), -- Added for research degrees
    is_ongoing BOOLEAN DEFAULT FALSE, -- Added for current studies
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES faculty_profiles(employee_id) ON DELETE CASCADE
);

-- A single, flexible table for all publication types.
CREATE TABLE faculty_publications (
    publication_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    publication_type ENUM('Journal Paper', 'Conference Proceeding', 'Book Chapter', 'Book Authored', 'Patent', 'Technical Report') NOT NULL, -- Added more types
    title VARCHAR(500) NOT NULL, -- Separated title for better queries
    publication_details TEXT NOT NULL,
    publication_year YEAR,
    publication_month VARCHAR(20),
    journal_name VARCHAR(255), -- Added for impact factor tracking
    impact_factor DECIMAL(4,2), -- Added for journal ranking
    doi VARCHAR(100), -- Moved from JSON for better indexing
    isbn VARCHAR(20), -- Moved from JSON for better indexing
    volume VARCHAR(20), -- Moved from JSON for better indexing
    issue VARCHAR(20), -- Moved from JSON for better indexing
    pages VARCHAR(50), -- Moved from JSON for better indexing
    citation_count INT DEFAULT 0, -- Added for metrics
    -- For flexible custom columns
    additional_data JSON,
    is_featured BOOLEAN DEFAULT FALSE, -- Added for highlighting important publications
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES faculty_profiles(employee_id) ON DELETE CASCADE,
    INDEX idx_publication_type (publication_type),
    INDEX idx_publication_year (publication_year),
    INDEX idx_featured (is_featured)
);

-- A generic, powerful table for various structured sections.
CREATE TABLE faculty_generic_sections (
    entry_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    -- Defines which section this entry belongs to.
    section_type ENUM(
        'Research Guidance',
        'Funded Project',
        'Award and Honor',
        'Membership and Professional Society',
        'Professional Service',
        'Training Attended',
        'Training Conducted',
        'Conference Presentation',
        'Workshop Organized',
        'Editorial Board',
        'Reviewer Activity'
    ) NOT NULL, -- Added more section types
    title VARCHAR(255), -- Added title field for better organization
    -- Stores the main content as a flexible JSON object.
    entry_data JSON NOT NULL,
    start_date DATE, -- Added for timeline organization
    end_date DATE, -- Added for timeline organization
    is_ongoing BOOLEAN DEFAULT FALSE, -- Added for current activities
    is_featured BOOLEAN DEFAULT FALSE, -- Added for highlighting
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES faculty_profiles(employee_id) ON DELETE CASCADE,
    INDEX idx_section_type (section_type),
    INDEX idx_featured (is_featured)
);

-- Allows faculty to create their own section titles.
CREATE TABLE faculty_custom_sections (
    section_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    section_title VARCHAR(255) NOT NULL,
    section_description TEXT, -- Added for clarity
    is_active BOOLEAN DEFAULT TRUE, -- Added for management
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES faculty_profiles(employee_id) ON DELETE CASCADE
);

-- Stores the data rows for the custom sections created above.
CREATE TABLE faculty_custom_section_entries (
    entry_id INT PRIMARY KEY AUTO_INCREMENT,
    section_id INT,
    -- The user defines columns; data is stored as a key-value object.
    entry_data JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Added for management
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES faculty_custom_sections(section_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------
-- Section 4: Linking Tables (Many-to-Many Relationships)
-- -----------------------------------------------------------------

-- Links faculty to the courses they teach.
CREATE TABLE faculty_courses_taught (
    employee_id INT,
    course_id INT,
    academic_year VARCHAR(20), -- Added for tracking by year
    semester VARCHAR(20), -- Added for semester tracking
    is_current BOOLEAN DEFAULT FALSE, -- Added for current semester
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, course_id, academic_year, semester),
    FOREIGN KEY (employee_id) REFERENCES faculty_profiles(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Links faculty to their areas of research.
CREATE TABLE faculty_research_areas (
    employee_id INT,
    area_id INT,
    is_primary BOOLEAN DEFAULT FALSE, -- Added to mark primary research areas
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate', -- Added for skill level
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, area_id),
    FOREIGN KEY (employee_id) REFERENCES faculty_profiles(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES research_areas(area_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------
-- Section 5: Additional Tables for Enhanced Functionality
-- -----------------------------------------------------------------

-- System settings and configurations
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Whether this setting can be accessed publicly
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit log for tracking changes
CREATE TABLE audit_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by INT, -- user_id from user_accounts
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45), -- Support for IPv6
    user_agent TEXT,
    FOREIGN KEY (changed_by) REFERENCES user_accounts(user_id) ON DELETE SET NULL,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_changed_at (changed_at)
);

-- File attachments/documents
CREATE TABLE file_attachments (
    attachment_id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type VARCHAR(50) NOT NULL, -- 'employee', 'publication', etc.
    entity_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES user_accounts(user_id) ON DELETE SET NULL,
    INDEX idx_entity (entity_type, entity_id)
);

-- -----------------------------------------------------------------
-- Section 6: Initial Data and Indexes
-- -----------------------------------------------------------------

-- Create additional indexes for better performance
CREATE INDEX idx_employees_role_active ON employees(role, is_active);
CREATE INDEX idx_employees_public_visible ON employees(is_public_visible);
CREATE INDEX idx_publications_year_type ON faculty_publications(publication_year, publication_type);
CREATE INDEX idx_generic_sections_type_employee ON faculty_generic_sections(section_type, employee_id);

-- Insert some default data
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'NIT Goa', 'string', 'Name of the institution', true),
('site_description', 'National Institute of Technology Goa', 'string', 'Institution description', true),
('maintenance_mode', 'false', 'boolean', 'Whether the site is in maintenance mode', false),
('max_file_upload_size', '5242880', 'number', 'Maximum file upload size in bytes', false),
('default_pagination_limit', '20', 'number', 'Default number of records per page', false);

-- Insert default departments (you can modify these as needed)
INSERT INTO departments (department_name, department_code, description) VALUES
('Computer Science and Engineering', 'CSE', 'Department of Computer Science and Engineering'),
('Electronics and Communication Engineering', 'ECE', 'Department of Electronics and Communication Engineering'),
('Electrical and Electronics Engineering', 'EEE', 'Department of Electrical and Electronics Engineering'),
('Mechanical Engineering', 'MECH', 'Department of Mechanical Engineering'),
('Civil Engineering', 'CIVIL', 'Department of Civil Engineering'),
('Mathematics and Computing', 'MATH', 'Department of Mathematics and Computing'),
('Physics', 'PHY', 'Department of Physics'),
('Chemistry', 'CHEM', 'Department of Chemistry'),
('Humanities and Social Sciences', 'HSS', 'Department of Humanities and Social Sciences');

-- Insert default designations
INSERT INTO designations (designation_title, designation_level) VALUES
('Professor', 5),
('Associate Professor', 4),
('Assistant Professor', 3),
('Lecturer', 2),
('Teaching Assistant', 1),
('Director', 10),
('Dean', 8),
('Head of Department', 6),
('Registrar', 7),
('Administrative Officer', 3),
('Technical Officer', 3),
('Lab Assistant', 2),
('System Administrator', 4);

-- =================================================================
-- Section 8: Site Analytics & Tracking Tables
-- Tables for visitor tracking and content update monitoring
-- =================================================================

-- Visitor tracking and analytics for admin dashboard
CREATE TABLE site_analytics (
    analytics_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Basic Visitor Tracking
    total_visitors BIGINT DEFAULT 0,          -- All-time unique visitors
    total_page_views BIGINT DEFAULT 0,        -- All-time page views
    daily_visitors INT DEFAULT 0,             -- Today's unique visitors
    daily_page_views INT DEFAULT 0,           -- Today's page views
    
    -- Simple Device Tracking (for admin dashboard)
    desktop_visits INT DEFAULT 0,
    mobile_visits INT DEFAULT 0,
    
    -- Date tracking
    date_recorded DATE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_date (date_recorded),
    INDEX idx_date_recorded (date_recorded)
);

-- Content updates tracking for "last updated" display
CREATE TABLE content_updates (
    update_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- What was updated
    content_type ENUM('faculty', 'announcement', 'academics', 'administration', 'general') NOT NULL,
    update_description VARCHAR(500) NOT NULL,  -- Simple description like "Faculty profile updated", "New announcement added"
    
    -- When and who
    updated_by VARCHAR(100),                   -- Username or "System"
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- For display purposes
    is_major_update BOOLEAN DEFAULT FALSE,     -- Whether to show in "last updated" footer
    
    INDEX idx_major_updates (is_major_update, updated_at),
    INDEX idx_content_type (content_type),
    INDEX idx_updated_at (updated_at)
);

-- Initialize site analytics with current date
INSERT INTO site_analytics (
    date_recorded, 
    total_visitors, 
    daily_visitors, 
    desktop_visits, 
    mobile_visits
) VALUES (
    CURDATE(), 
    1248567,  -- Starting with current simulated count
    0, 
    0, 
    0
);

-- Initialize with a sample content update
INSERT INTO content_updates (
    content_type, 
    update_description, 
    updated_by, 
    is_major_update,
    updated_at
) VALUES (
    'general', 
    'Website analytics system initialized', 
    'System', 
    TRUE,
    NOW()
);
