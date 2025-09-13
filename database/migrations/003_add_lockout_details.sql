-- Migration 003: Add lockout details for progressive cooldown
-- This migration adds columns to track lockout duration and timestamp for better cooldown management

ALTER TABLE user_accounts 
ADD COLUMN lockout_timestamp TIMESTAMP NULL COMMENT 'When the lockout started',
ADD COLUMN lockout_duration_minutes INT DEFAULT 0 COMMENT 'Duration of current lockout in minutes';

-- Add an index for better performance on lockout queries
CREATE INDEX idx_user_accounts_lockout ON user_accounts(locked_until, lockout_timestamp);
