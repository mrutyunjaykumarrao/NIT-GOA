-- =================================================================
-- NIT Goa Database Schema - Supabase PostgreSQL
-- =================================================================

CREATE TABLE "audit_log" (
  "log_id" integer NOT NULL DEFAULT nextval('audit_log_log_id_seq'::regclass),
  "user_id" integer,
  "action" text,
  "table_name" text,
  "record_id" text,
  "old_values" jsonb,
  "new_values" jsonb,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamp without time zone,
  "changed_by" text,
  PRIMARY KEY ("log_id")
);

CREATE TABLE "content_updates" (
  "update_id" integer NOT NULL DEFAULT nextval('content_updates_update_id_seq'::regclass),
  "content_type" text,
  "content_id" text,
  "employee_code" text,
  "update_type" text,
  "update_description" text,
  "old_data" jsonb,
  "new_data" jsonb,
  "update_reason" text,
  "updated_by" text,
  "updated_at" timestamp without time zone,
  "is_major_update" integer,
  PRIMARY KEY ("update_id")
);

CREATE TABLE "course_requests" (
  "request_id" integer NOT NULL DEFAULT nextval('course_requests_request_id_seq'::regclass),
  "employee_code" text,
  "course_code" text,
  "course_name" text,
  "course_level" text,
  "credits" integer,
  "semester" text,
  "department_id" integer,
  "justification" text,
  "status" text,
  "reviewed_by" text,
  "review_comments" text,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("request_id")
);

CREATE TABLE "courses" (
  "course_id" integer NOT NULL DEFAULT nextval('courses_course_id_seq'::regclass),
  "course_code" text,
  "course_name" text,
  "course_level" text,
  "department_id" integer,
  "credits" integer,
  "semester" text,
  "is_active" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("course_id")
);

CREATE TABLE "departments" (
  "department_id" integer NOT NULL DEFAULT nextval('departments_department_id_seq'::regclass),
  "department_name" text,
  "department_code" text,
  "is_active" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("department_id")
);

CREATE TABLE "employees" (
  "employee_id" integer NOT NULL DEFAULT nextval('employees_employee_id_seq'::regclass),
  "employee_code" text,
  "honorific" text,
  "full_name" text,
  "gender" text,
  "role" text,
  "email" text,
  "extension_no" text,
  "phone_mobile" text,
  "phone_residence" text,
  "date_of_joining" text,
  "is_active" integer,
  "is_public_visible" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("employee_id")
);

CREATE TABLE "faculty_courses_taught" (
  "id" integer NOT NULL DEFAULT nextval('faculty_courses_taught_id_seq'::regclass),
  "employee_code" text,
  "course_id" integer,
  "custom_course_name" text,
  "custom_course_code" text,
  "custom_credits" integer,
  "custom_course_level" text,
  "custom_semester" text,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  "display_order" text,
  PRIMARY KEY ("id")
);

CREATE TABLE "faculty_custom_section_entries" (
  "entry_id" integer NOT NULL DEFAULT nextval('faculty_custom_section_entries_entry_id_seq'::regclass),
  "custom_section_id" integer,
  "field_id" integer,
  "row_number" integer,
  "field_value" text,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("entry_id")
);

CREATE TABLE "faculty_custom_section_fields" (
  "field_id" integer NOT NULL DEFAULT nextval('faculty_custom_section_fields_field_id_seq'::regclass),
  "custom_section_id" integer,
  "field_name" text,
  "field_type" text,
  "display_order" integer,
  PRIMARY KEY ("field_id")
);

CREATE TABLE "faculty_custom_sections" (
  "custom_section_id" integer NOT NULL DEFAULT nextval('faculty_custom_sections_custom_section_id_seq'::regclass),
  "employee_code" text,
  "section_title" text,
  "section_type" text,
  "display_order" integer,
  "is_visible" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("custom_section_id")
);

CREATE TABLE "faculty_designations" (
  "designation_id" integer NOT NULL DEFAULT nextval('faculty_designations_designation_id_seq'::regclass),
  "designation_title" text,
  "designation_level" integer,
  "is_active" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("designation_id")
);

CREATE TABLE "faculty_education" (
  "education_id" integer NOT NULL DEFAULT nextval('faculty_education_education_id_seq'::regclass),
  "employee_code" text,
  "degree" text,
  "institute" text,
  "discipline" text,
  "graduation_year" text,
  "display_order" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("education_id")
);

CREATE TABLE "faculty_professional_memberships" (
  "membership_id" integer NOT NULL DEFAULT nextval('faculty_professional_memberships_membership_id_seq'::regclass),
  "employee_code" text,
  "organization_name" text,
  "membership_type" text,
  "is_active" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("membership_id")
);

CREATE TABLE "faculty_profiles" (
  "employee_code" text NOT NULL,
  "department_id" integer,
  "designation_id" integer,
  "date_of_birth" text,
  "is_hod" integer,
  "image_url" text,
  "research_teaching_experience" text,
  "address" text,
  "office_location" text,
  "office_hours" text,
  "linkedin_url" text,
  "personal_website_url" text,
  "google_scholar_url" text,
  "research_gate_url" text,
  "other_social_links" jsonb,
  "bio_summary" text,
  "research_interests" text,
  "display_order" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("employee_code")
);

CREATE TABLE "faculty_publications" (
  "publication_id" integer NOT NULL DEFAULT nextval('faculty_publications_publication_id_seq'::regclass),
  "employee_code" text,
  "publication_type" text,
  "title" text,
  "publication_year" text,
  "publication_month" text,
  "display_order" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("publication_id")
);

CREATE TABLE "faculty_research_guidance" (
  "guidance_id" integer NOT NULL DEFAULT nextval('faculty_research_guidance_guidance_id_seq'::regclass),
  "employee_code" text,
  "student_honorific" text,
  "student_name" text,
  "research_topic" text,
  "status" text,
  "display_order" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("guidance_id")
);

CREATE TABLE "faculty_training_attended" (
  "training_attended_id" integer NOT NULL DEFAULT nextval('faculty_training_attended_training_attended_id_seq'::regclass),
  "employee_code" text,
  "month" text,
  "year" text,
  "training_information" text,
  "display_order" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("training_attended_id")
);

CREATE TABLE "faculty_training_conducted" (
  "training_conducted_id" integer NOT NULL DEFAULT nextval('faculty_training_conducted_training_conducted_id_seq'::regclass),
  "employee_code" text,
  "month" text,
  "year" text,
  "training_information" text,
  "display_order" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("training_conducted_id")
);

CREATE TABLE "file_attachments" (
  "attachment_id" integer NOT NULL DEFAULT nextval('file_attachments_attachment_id_seq'::regclass),
  "entity_type" text,
  "entity_id" text,
  "file_name" text,
  "file_path" text,
  "file_size" integer,
  "file_type" text,
  "mime_type" text,
  "is_public" integer,
  "uploaded_by" text,
  "uploaded_at" timestamp without time zone,
  PRIMARY KEY ("attachment_id")
);

CREATE TABLE "pending_approvals" (
  "approval_id" integer NOT NULL DEFAULT nextval('pending_approvals_approval_id_seq'::regclass),
  "employee_code" text,
  "approval_type" text,
  "current_value" text,
  "requested_value" text,
  "temp_file_path" text,
  "requested_by" text,
  "requested_at" timestamp without time zone,
  "reviewed_by" text,
  "reviewed_at" timestamp without time zone,
  "status" text,
  "admin_notes" text,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  "action_type" text,
  PRIMARY KEY ("approval_id")
);

CREATE TABLE "research_areas" (
  "area_id" integer NOT NULL DEFAULT nextval('research_areas_area_id_seq'::regclass),
  "area_name" text,
  "is_active" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("area_id")
);

CREATE TABLE "research_areas_backup_20251003_180205" (
  "area_id" integer,
  "area_name" text,
  "parent_area_id" integer,
  "description" text,
  "is_active" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone
);

CREATE TABLE "research_areas_backup_20251003_180300" (
  "area_id" integer,
  "area_name" text,
  "is_active" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone
);

CREATE TABLE "site_analytics" (
  "analytics_id" integer NOT NULL DEFAULT nextval('site_analytics_analytics_id_seq'::regclass),
  "total_visitors" integer,
  "daily_visitors" integer,
  "desktop_visits" integer,
  "mobile_visits" integer,
  "date_recorded" text,
  "last_updated" timestamp without time zone,
  PRIMARY KEY ("analytics_id")
);

CREATE TABLE "staff_profiles" (
  "employee_code" text NOT NULL,
  "department_id" integer,
  "job_title" text,
  "responsibilities" text,
  "employment_status" text,
  "image_url" text,
  "display_order" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("employee_code")
);

CREATE TABLE "system_settings" (
  "setting_id" integer NOT NULL DEFAULT nextval('system_settings_setting_id_seq'::regclass),
  "setting_key" text,
  "setting_value" text,
  "setting_type" jsonb,
  "description" text,
  "is_public" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("setting_id")
);

CREATE TABLE "user_accounts" (
  "user_id" integer NOT NULL DEFAULT nextval('user_accounts_user_id_seq'::regclass),
  "username" text,
  "password_hash" text,
  "password_changed_at" timestamp without time zone,
  "employee_code" text,
  "email" text,
  "access_level" text,
  "is_active" integer,
  "last_login" timestamp without time zone,
  "failed_login_attempts" integer,
  "locked_until" timestamp without time zone,
  "lockout_timestamp" timestamp without time zone,
  "lockout_duration_minutes" integer,
  "reset_token" text,
  "reset_token_expires" timestamp without time zone,
  "reset_token_used" integer,
  "created_at" timestamp without time zone,
  "updated_at" timestamp without time zone,
  PRIMARY KEY ("user_id")
);

