# NIT Goa Database Schema - Current State
*Generated: October 3, 2025*

This document describes the actual current structure of the `updated_nitgoa` database based on live database inspection.

## Database Status
- **Total Tables**: 21 
- **Total Employees**: 66
- **Total Faculty Profiles**: 66
- **Total Courses**: 591 (with department mapping)
- **Total Research Areas**: 241
- **Total Departments**: 8
- **Total User Accounts**: 8

## Core Tables

### employees
Primary employee information table.
```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    honorific ENUM('Dr.','Mr.','Mrs.','Ms.','Prof.'),
    full_name VARCHAR(255) NOT NULL,
    gender ENUM('Male','Female','Other'),
    role ENUM('Faculty','Administrative','Technical') NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    extension_no VARCHAR(20),
    phone_mobile VARCHAR(20),
    phone_residence VARCHAR(50),
    date_of_joining DATE,
    is_active TINYINT(1) DEFAULT 1,
    is_public_visible TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### departments
Department information.
```sql
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(255) UNIQUE NOT NULL,
    department_code VARCHAR(10) UNIQUE,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### user_accounts
User authentication and access control.
```sql
CREATE TABLE user_accounts (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    employee_code VARCHAR(50),
    email VARCHAR(255),
    access_level ENUM('Admin','Faculty','Staff') NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    last_login TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    lockout_timestamp TIMESTAMP,
    lockout_duration_minutes INT DEFAULT 0,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Faculty-Related Tables

### faculty_profiles
Extended faculty information and profiles.
```sql
CREATE TABLE faculty_profiles (
    employee_code VARCHAR(50) PRIMARY KEY,
    department_id INT,
    designation_id INT,
    date_of_birth DATE,
    is_hod TINYINT(1) DEFAULT 0,
    image_url VARCHAR(255),
    research_teaching_experience TEXT,
    address TEXT,
    office_location VARCHAR(100),
    office_hours VARCHAR(255),
    linkedin_url VARCHAR(255),
    personal_website_url VARCHAR(255),
    google_scholar_url VARCHAR(255),
    orcid_id VARCHAR(50),
    scopus_id VARCHAR(50),
    research_gate_url VARCHAR(255),
    other_social_links JSON,
    bio_summary TEXT,
    research_interests TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### faculty_designations
Faculty designation/position types.
```sql
CREATE TABLE faculty_designations (
    designation_id INT PRIMARY KEY AUTO_INCREMENT,
    designation_title VARCHAR(255) UNIQUE NOT NULL,
    designation_level INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### faculty_education
Faculty academic background and qualifications.
```sql
CREATE TABLE faculty_education (
    education_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    institute VARCHAR(255) NOT NULL,
    discipline VARCHAR(255),
    graduation_year YEAR,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### faculty_publications
Faculty research publications and papers.
```sql
CREATE TABLE faculty_publications (
    publication_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) NOT NULL,
    publication_type ENUM('Journal Paper','Conference Proceeding','Book Chapter','Book Authored','Patent','Technical Report') NOT NULL,
    title VARCHAR(500) NOT NULL,
    publication_details TEXT NOT NULL,
    publication_year YEAR,
    publication_month VARCHAR(20),
    journal_name VARCHAR(255),
    impact_factor DECIMAL(4,2),
    doi VARCHAR(100),
    isbn VARCHAR(20),
    volume VARCHAR(20),
    issue VARCHAR(20),
    pages VARCHAR(50),
    citation_count INT DEFAULT 0,
    additional_data JSON,
    is_featured TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### faculty_courses_taught
Courses taught by faculty members.
```sql
CREATE TABLE faculty_courses_taught (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) NOT NULL,
    course_id INT,
    custom_course_name VARCHAR(255),
    custom_course_code VARCHAR(20),
    custom_credits INT,
    custom_course_level ENUM('Undergraduate','Postgraduate','Diploma','Certificate'),
    custom_semester VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### faculty_professional_memberships
Professional memberships and affiliations.
```sql
CREATE TABLE faculty_professional_memberships (
    membership_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    membership_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### research_areas
Research areas and specializations.
```sql
CREATE TABLE research_areas (
    area_id INT PRIMARY KEY AUTO_INCREMENT,
    area_name VARCHAR(255) UNIQUE NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Academic Tables

### courses
Course catalog and information.
```sql
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_level ENUM('Undergraduate','Postgraduate','Diploma','Certificate') NOT NULL,
    department_id INT,
    credits INT,
    semester VARCHAR(20),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### course_requests
Course addition/modification requests.
```sql
CREATE TABLE course_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_level ENUM('Undergraduate','Postgraduate','Diploma','Certificate') NOT NULL,
    credits INT,
    semester VARCHAR(20),
    department_id INT,
    justification TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    reviewed_by VARCHAR(50),
    review_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Staff Tables

### staff_profiles
Non-faculty staff profiles.
```sql
CREATE TABLE staff_profiles (
    employee_code VARCHAR(50) PRIMARY KEY,
    department_id INT,
    job_title VARCHAR(100),
    responsibilities TEXT,
    employment_status VARCHAR(100),
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## System Tables

### content_updates
Content management and update tracking.
```sql
CREATE TABLE content_updates (
    update_id INT PRIMARY KEY AUTO_INCREMENT,
    content_type ENUM('faculty','announcement','academics','administration','general') NOT NULL,
    content_id VARCHAR(100),
    employee_code VARCHAR(50),
    update_type ENUM('CREATE','UPDATE','DELETE'),
    update_description VARCHAR(500) NOT NULL,
    old_data JSON,
    new_data JSON,
    update_reason TEXT,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_major_update TINYINT(1) DEFAULT 0
);
```

### audit_log
System activity and change tracking.
```sql
CREATE TABLE audit_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id VARCHAR(100),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### pending_approvals
Workflow and approval management.
```sql
CREATE TABLE pending_approvals (
    approval_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) NOT NULL,
    approval_type ENUM('profile_image','personal_info','contact_info','other') NOT NULL,
    current_value TEXT,
    requested_value TEXT,
    temp_file_path VARCHAR(500),
    requested_by VARCHAR(50) NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    reviewed_by VARCHAR(50),
    reviewed_at TIMESTAMP,
    admin_notes TEXT
);
```

## Analytics and File Management

### site_analytics
Website usage and analytics tracking.
```sql
CREATE TABLE site_analytics (
    analytics_id INT PRIMARY KEY AUTO_INCREMENT,
    total_visitors BIGINT DEFAULT 0,
    daily_visitors INT DEFAULT 0,
    desktop_visits INT DEFAULT 0,
    mobile_visits INT DEFAULT 0,
    date_recorded DATE UNIQUE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### file_attachments
File upload and attachment management.
```sql
CREATE TABLE file_attachments (
    attachment_id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    is_public TINYINT(1) DEFAULT 0,
    uploaded_by VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### system_settings
Application configuration and settings.
```sql
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string','number','boolean','json') DEFAULT 'string',
    description TEXT,
    is_public TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Backup Tables

### research_areas_backup_20251003_180205
Backup of research_areas table from October 3, 2025.
```sql
CREATE TABLE research_areas_backup_20251003_180205 (
    area_id INT NOT NULL DEFAULT 0,
    area_name VARCHAR(255) NOT NULL,
    parent_area_id INT,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### research_areas_backup_20251003_180300
Another backup of research_areas table from October 3, 2025.
```sql
CREATE TABLE research_areas_backup_20251003_180300 (
    area_id INT NOT NULL DEFAULT 0,
    area_name VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Key Relationships

### Primary Foreign Key Relationships
- **employee_code**: Central linking field across all employee-related tables
- **user_accounts.employee_code** → **employees.employee_code**: Links user accounts to employees
- **faculty_profiles.employee_code** → **employees.employee_code** (Primary Key): Links faculty profiles to employees
- **faculty_profiles.department_id** → **departments.department_id**: Links faculty to departments
- **faculty_profiles.designation_id** → **faculty_designations.designation_id**: Links faculty to designations
- **courses.department_id** → **departments.department_id**: Links courses to departments
- All faculty-related tables use **employee_code** for relationships

### Data Model Notes
- **employee_code** is the primary identifier used across the system
- **faculty_profiles** uses **employee_code** as its primary key (not a separate ID)
- **staff_profiles** uses **employee_code** as its primary key (not a separate ID)
- The **employees** table retains **employee_id** as its primary key for internal use
- **user_accounts** can be linked to employees via **employee_code**

## Migration Status
- Database has been successfully migrated to use **employee_code** as the primary relationship field
- All data has been populated: 66 employees, 591 courses, 241 research areas
- Department mapping is complete for all courses
- User accounts are properly linked to employee records

*Last Updated: October 3, 2025 - Based on actual database structure inspection*