-- =============================================================================
-- SCHEMA VALIDATION SCRIPT
-- =============================================================================
-- 
-- This script validates that the database schema matches expectations
-- Run this to verify the schema file is correct
-- 
-- Usage: mysql -u root -p nitgoa_db < validate_schema.sql
-- 
-- =============================================================================

-- Check all expected tables exist
SELECT 'Checking table count...' as validation_step;
SELECT COUNT(*) as table_count, 
       CASE WHEN COUNT(*) = 16 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.tables 
WHERE table_schema = 'nitgoa_db';

-- List all tables
SELECT 'All tables in database:' as validation_step;
SELECT table_name as tables
FROM information_schema.tables 
WHERE table_schema = 'nitgoa_db'
ORDER BY table_name;

-- Check faculty_profiles structure
SELECT 'Checking faculty_profiles table structure...' as validation_step;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'nitgoa_db' 
  AND table_name = 'faculty_profiles'
ORDER BY ordinal_position;

-- Check foreign key relationships
SELECT 'Checking foreign key relationships...' as validation_step;
SELECT 
    constraint_name,
    table_name,
    column_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'nitgoa_db'
  AND referenced_table_name IS NOT NULL
ORDER BY table_name, constraint_name;

-- Check indexes
SELECT 'Checking table indexes...' as validation_step;
SELECT 
    table_name,
    index_name,
    column_name,
    non_unique
FROM information_schema.statistics
WHERE table_schema = 'nitgoa_db'
ORDER BY table_name, index_name, seq_in_index;

SELECT 'Schema validation complete.' as validation_step;
