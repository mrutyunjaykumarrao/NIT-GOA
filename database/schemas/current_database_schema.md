# NIT Goa Database Schema - Current State
*Generated: September 16, 2025*

This document describes the current structure of the `updated_nitgoa` database after the employee_id to employee_code migration.

## Core Tables

### employees
Primary employee information table.
```sql
- employee_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), UNIQUE) -- Main identifier for relationships
- full_name (varchar(255), NOT NULL)
- honorific (enum('Dr.','Mr.','Mrs.','Ms.','Prof.'))
- email (varchar(255), NOT NULL, UNIQUE)
- phone_mobile (varchar(20))
- phone_residence (varchar(50))
- extension_no (varchar(20))
- date_of_joining (date)
- date_of_leaving (date)
- role (enum('Faculty','Administrative','Technical'), NOT NULL)
- job_title (varchar(100))
- is_hod (tinyint(1), DEFAULT 0)
- employment_status (varchar(100))
- employment_type (enum('Full-time','Part-time','Contract','Visiting'), DEFAULT 'Full-time')
- image_url (varchar(255))
- is_active (tinyint(1), DEFAULT 1)
- is_public_visible (tinyint(1), DEFAULT 1)
- display_order (int, DEFAULT 0)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### departments
Department information.
```sql
- department_id (int, PRIMARY KEY, auto_increment)
- department_name (varchar(255), NOT NULL, UNIQUE)
- department_code (varchar(10), UNIQUE)
- description (text)
- is_active (tinyint(1), DEFAULT 1)
- display_order (int, DEFAULT 0)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### user_accounts
User authentication and access control.
```sql
- user_id (int, PRIMARY KEY, auto_increment)
- username (varchar(50), NOT NULL, UNIQUE)
- password_hash (varchar(255), NOT NULL)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- email (varchar(255))
- access_level (enum('Admin','Faculty','Staff'), NOT NULL)
- is_active (tinyint(1), DEFAULT 1)
- last_login (timestamp)
- failed_login_attempts (int, DEFAULT 0)
- locked_until (timestamp)
- password_reset_token (varchar(255))
- password_reset_expires (timestamp)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

## Faculty-Related Tables

### faculty_profiles
Extended faculty information and profiles.
```sql
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- department_id (int, FOREIGN KEY → departments.department_id)
- designation_id (int, FOREIGN KEY → faculty_designations.designation_id)
- gender (enum('Male','Female','Other'))
- date_of_birth (date)
- research_teaching_experience (text)
- address (text)
- office_location (varchar(100))
- office_hours (varchar(255))
- linkedin_url (varchar(255))
- personal_website_url (varchar(255))
- google_scholar_url (varchar(255))
- orcid_id (varchar(50))
- scopus_id (varchar(50))
- research_gate_url (varchar(255))
- other_social_links (json)
- bio_summary (text)
- research_interests (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### faculty_education
Faculty academic background and qualifications.
```sql
- education_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- degree (varchar(100), NOT NULL)
- institute (varchar(255), NOT NULL)
- graduation_year (smallint unsigned)
- discipline (varchar(255))
- display_order (int, DEFAULT 0)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### faculty_publications
Faculty research publications and papers.
```sql
- publication_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- publication_type (enum('Journal Paper','Conference Proceeding','Book Chapter','Book Authored','Patent','Technical Report'), NOT NULL)
- title (varchar(500), NOT NULL)
- publication_details (text, NOT NULL)
- publication_year (year)
- publication_month (varchar(20))
- journal_name (varchar(255))
- impact_factor (decimal(4,2))
- doi (varchar(100))
- isbn (varchar(20))
- volume (varchar(20))
- issue (varchar(20))
- pages (varchar(50))
- citation_count (int, DEFAULT 0)
- additional_data (json)
- is_featured (tinyint(1), DEFAULT 0)
- display_order (int, DEFAULT 0)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### faculty_designations
Faculty designation/position types.
```sql
- designation_id (int, PRIMARY KEY, auto_increment)
- designation_name (varchar(100), NOT NULL, UNIQUE)
- description (text)
- display_order (int, DEFAULT 0)
- is_active (tinyint(1), DEFAULT 1)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### faculty_courses_taught
Courses taught by faculty members.
```sql
- course_taught_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- course_id (int, FOREIGN KEY → courses.course_id)
- semester (varchar(20))
- academic_year (varchar(10))
- student_count (int)
- additional_info (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

## Research Tables

### research_guidance
Research supervision and guidance records.
```sql
- guidance_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- student_name (varchar(255), NOT NULL)
- degree_type (enum('PhD','M.Tech','M.Sc','B.Tech','Other'), NOT NULL)
- research_topic (varchar(500))
- start_date (date)
- completion_date (date)
- current_status (enum('Ongoing','Completed','Discontinued'), DEFAULT 'Ongoing')
- university (varchar(255))
- co_supervisors (text)
- additional_details (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### funded_research_projects
External funded research projects.
```sql
- project_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- project_title (varchar(500), NOT NULL)
- funding_agency (varchar(255), NOT NULL)
- project_type (enum('Major','Minor','Consultancy','Other'), NOT NULL)
- total_amount (decimal(15,2))
- duration_months (int)
- start_date (date)
- end_date (date)
- current_status (enum('Ongoing','Completed','Sanctioned','Submitted'), DEFAULT 'Ongoing')
- pi_type (enum('Principal Investigator','Co-Principal Investigator','Co-Investigator'), NOT NULL)
- collaborators (text)
- project_summary (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### training_attended
Professional development and training records.
```sql
- training_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- training_title (varchar(255), NOT NULL)
- organizing_institution (varchar(255), NOT NULL)
- training_type (enum('Workshop','Conference','Seminar','Course','Other'), NOT NULL)
- start_date (date, NOT NULL)
- end_date (date)
- location (varchar(255))
- duration_hours (int)
- certificate_received (tinyint(1), DEFAULT 0)
- relevance_score (int, DEFAULT 0)
- description (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### training_conducted
Training programs organized or conducted.
```sql
- conducted_id (int, PRIMARY KEY, auto_increment)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- training_title (varchar(255), NOT NULL)
- target_audience (varchar(255))
- training_type (enum('Workshop','Conference','Seminar','Course','Other'), NOT NULL)
- start_date (date, NOT NULL)
- end_date (date)
- venue (varchar(255))
- participants_count (int)
- role (enum('Organizer','Coordinator','Resource Person','Other'), NOT NULL)
- funding_source (varchar(255))
- description (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

## Academic Tables

### courses
Course catalog and information.
```sql
- course_id (int, PRIMARY KEY, auto_increment)
- course_code (varchar(20), NOT NULL, UNIQUE)
- course_name (varchar(255), NOT NULL)
- department_id (int, FOREIGN KEY → departments.department_id)
- credit_hours (int)
- course_type (enum('Core','Elective','Lab','Project'), DEFAULT 'Core')
- semester (int)
- academic_level (enum('UG','PG','PhD'), NOT NULL)
- is_active (tinyint(1), DEFAULT 1)
- description (text)
- prerequisites (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

## System Tables

### staff_profiles
Non-faculty staff profiles.
```sql
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- staff_category (varchar(100))
- qualifications (text)
- responsibilities (text)
- office_location (varchar(100))
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### content_updates
Content management and update tracking.
```sql
- update_id (int, PRIMARY KEY, auto_increment)
- content_type (varchar(100))
- content_id (varchar(100))
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- update_type (enum('CREATE','UPDATE','DELETE'))
- old_data (json)
- new_data (json)
- update_reason (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
```

### audit_log
System activity and change tracking.
```sql
- log_id (int, PRIMARY KEY, auto_increment)
- user_id (int, FOREIGN KEY → user_accounts.user_id)
- action (varchar(100), NOT NULL)
- table_name (varchar(100))
- record_id (varchar(100))
- old_values (json)
- new_values (json)
- ip_address (varchar(45))
- user_agent (text)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
```

### pending_approvals
Workflow and approval management.
```sql
- approval_id (int, PRIMARY KEY, auto_increment)
- content_type (varchar(100), NOT NULL)
- content_id (varchar(100), NOT NULL)
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- submitted_data (json, NOT NULL)
- current_data (json)
- approval_status (enum('Pending','Approved','Rejected'), DEFAULT 'Pending')
- approver_id (int, FOREIGN KEY → user_accounts.user_id)
- approval_notes (text)
- submitted_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- reviewed_at (timestamp)
```

## Analytics and Reporting

### site_analytics
Website usage and analytics tracking.
```sql
- analytics_id (int, PRIMARY KEY, auto_increment)
- page_url (varchar(500))
- visitor_ip (varchar(45))
- user_agent (text)
- referer_url (varchar(500))
- session_id (varchar(100))
- visit_duration (int)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
```

## Configuration Tables

### system_settings
Application configuration and settings.
```sql
- setting_id (int, PRIMARY KEY, auto_increment)
- setting_key (varchar(100), NOT NULL, UNIQUE)
- setting_value (text)
- setting_type (enum('string','number','boolean','json'), DEFAULT 'string')
- description (text)
- is_active (tinyint(1), DEFAULT 1)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### file_attachments
File upload and attachment management.
```sql
- attachment_id (int, PRIMARY KEY, auto_increment)
- file_name (varchar(255), NOT NULL)
- file_path (varchar(500), NOT NULL)
- file_size (int)
- file_type (varchar(100))
- mime_type (varchar(100))
- entity_type (varchar(100))
- entity_id (varchar(100))
- uploaded_by (varchar(50), FOREIGN KEY → employees.employee_code)
- is_active (tinyint(1), DEFAULT 1)
- created_at (timestamp, DEFAULT CURRENT_TIMESTAMP)
- updated_at (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

## Summary Tables (Views/Aggregated Data)

### active_research_guidance_summary
Aggregated summary of active research guidance.
```sql
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- total_phd_ongoing (int, DEFAULT 0)
- total_phd_completed (int, DEFAULT 0)
- total_mtech_ongoing (int, DEFAULT 0)
- total_mtech_completed (int, DEFAULT 0)
- total_other_ongoing (int, DEFAULT 0)
- total_other_completed (int, DEFAULT 0)
- last_updated (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### faculty_funding_summary
Aggregated funding summary for faculty.
```sql
- employee_code (varchar(50), FOREIGN KEY → employees.employee_code)
- total_projects (int, DEFAULT 0)
- total_amount (decimal(15,2), DEFAULT 0.00)
- ongoing_projects (int, DEFAULT 0)
- completed_projects (int, DEFAULT 0)
- major_projects (int, DEFAULT 0)
- minor_projects (int, DEFAULT 0)
- last_updated (timestamp, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

## Key Relationships

### Primary Foreign Key Relationships
- **employee_code**: Central linking field across all employee-related tables
- **user_accounts.employee_code** → **employees.employee_code**: Links user accounts to employees
- **faculty_profiles.employee_code** → **employees.employee_code**: Links faculty profiles to employees
- **faculty_profiles.department_id** → **departments.department_id**: Links faculty to departments
- All faculty-related tables use **employee_code** for relationships

### Migration Notes
- **employee_id** has been replaced with **employee_code** as the primary foreign key
- Only the **employees** table retains **employee_id** as its primary key
- All relationships now use **employee_code** for better semantic meaning
- **user_accounts** table links to employees via **employee_code** instead of **user_account_id**

## Usage Guidelines
1. Always use **employee_code** for JOIN operations with employee-related tables
2. **department_id** in **faculty_profiles** should be used for department relationships
3. Use **employee_code** as the primary identifier in API endpoints
4. Ensure CASCADE operations are properly configured for data integrity

*Last Updated: September 16, 2025*