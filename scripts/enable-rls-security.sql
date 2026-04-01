-- ========================================
-- Enable Row-Level Security (RLS) on All Tables
-- ========================================
-- This script enables RLS as a defense-in-depth measure
-- Backend API uses SERVICE_ROLE_KEY which bypasses RLS
-- So this will NOT break any existing functionality
-- ========================================

-- Enable RLS on all tables
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Faculty tables
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_courses_taught ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_research_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_professional_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_training_attended ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_training_conducted ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_custom_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_custom_section_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_custom_section_entries ENABLE ROW LEVEL SECURITY;

-- Staff tables
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- Courses and research
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_requests ENABLE ROW LEVEL SECURITY;

-- System tables
ALTER TABLE pending_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Create Permissive Policies
-- ========================================
-- Allow SERVICE_ROLE (backend) to do everything
-- Block direct public/anon access (defense in depth)
-- ========================================

-- Policy for user_accounts
DROP POLICY IF EXISTS "Service role full access" ON user_accounts;
CREATE POLICY "Service role full access" ON user_accounts FOR ALL TO service_role USING (true);

-- Policy for employees
DROP POLICY IF EXISTS "Service role full access" ON employees;
CREATE POLICY "Service role full access" ON employees FOR ALL TO service_role USING (true);

-- Policy for departments
DROP POLICY IF EXISTS "Service role full access" ON departments;
CREATE POLICY "Service role full access" ON departments FOR ALL TO service_role USING (true);

-- Policies for faculty tables
DROP POLICY IF EXISTS "Service role full access" ON faculty_profiles;
CREATE POLICY "Service role full access" ON faculty_profiles FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_designations;
CREATE POLICY "Service role full access" ON faculty_designations FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_education;
CREATE POLICY "Service role full access" ON faculty_education FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_publications;
CREATE POLICY "Service role full access" ON faculty_publications FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_courses_taught;
CREATE POLICY "Service role full access" ON faculty_courses_taught FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_research_guidance;
CREATE POLICY "Service role full access" ON faculty_research_guidance FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_professional_memberships;
CREATE POLICY "Service role full access" ON faculty_professional_memberships FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_training_attended;
CREATE POLICY "Service role full access" ON faculty_training_attended FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_training_conducted;
CREATE POLICY "Service role full access" ON faculty_training_conducted FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_custom_sections;
CREATE POLICY "Service role full access" ON faculty_custom_sections FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_custom_section_fields;
CREATE POLICY "Service role full access" ON faculty_custom_section_fields FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON faculty_custom_section_entries;
CREATE POLICY "Service role full access" ON faculty_custom_section_entries FOR ALL TO service_role USING (true);

-- Policy for staff tables
DROP POLICY IF EXISTS "Service role full access" ON staff_profiles;
CREATE POLICY "Service role full access" ON staff_profiles FOR ALL TO service_role USING (true);

-- Policies for courses and research
DROP POLICY IF EXISTS "Service role full access" ON courses;
CREATE POLICY "Service role full access" ON courses FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON research_areas;
CREATE POLICY "Service role full access" ON research_areas FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON course_requests;
CREATE POLICY "Service role full access" ON course_requests FOR ALL TO service_role USING (true);

-- Policies for system tables
DROP POLICY IF EXISTS "Service role full access" ON pending_approvals;
CREATE POLICY "Service role full access" ON pending_approvals FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON content_updates;
CREATE POLICY "Service role full access" ON content_updates FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON audit_log;
CREATE POLICY "Service role full access" ON audit_log FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON system_settings;
CREATE POLICY "Service role full access" ON system_settings FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON site_analytics;
CREATE POLICY "Service role full access" ON site_analytics FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access" ON file_attachments;
CREATE POLICY "Service role full access" ON file_attachments FOR ALL TO service_role USING (true);

-- ========================================
-- Verification Query
-- ========================================
-- Run this to verify RLS is enabled on all tables
-- ========================================

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE '%backup%'
ORDER BY tablename;
