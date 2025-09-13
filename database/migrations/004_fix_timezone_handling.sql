-- Migration 004: Fix timezone handling - convert IST to UTC
-- This migration ensures all timestamps are properly stored in UTC

-- First, let's add a backup table for safety
CREATE TABLE user_accounts_timezone_backup AS SELECT * FROM user_accounts;

-- Update existing timestamps that were stored as IST to proper UTC
-- Subtract 5.5 hours from timestamps that were incorrectly stored as IST

UPDATE user_accounts 
SET 
  last_login = CASE 
    WHEN last_login IS NOT NULL THEN DATE_SUB(last_login, INTERVAL 330 MINUTE)
    ELSE NULL 
  END,
  locked_until = CASE 
    WHEN locked_until IS NOT NULL THEN DATE_SUB(locked_until, INTERVAL 330 MINUTE)
    ELSE NULL 
  END,
  lockout_timestamp = CASE 
    WHEN lockout_timestamp IS NOT NULL THEN DATE_SUB(lockout_timestamp, INTERVAL 330 MINUTE)
    ELSE NULL 
  END,
  created_at = DATE_SUB(created_at, INTERVAL 330 MINUTE),
  updated_at = DATE_SUB(updated_at, INTERVAL 330 MINUTE)
WHERE user_id > 0; -- Apply to all records

-- Update other tables if they have similar issues
-- Add similar updates for other tables with timestamp fields

-- Verify the database timezone is set to UTC
-- This should be done at the database level:
-- SET GLOBAL time_zone = '+00:00';
-- SET SESSION time_zone = '+00:00';
