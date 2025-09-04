-- =================================================================
-- Migration: Add Password Reset and Email Fields to User Accounts
-- Date: September 4, 2025
-- Description: Adds email field and password reset functionality to user_accounts table
-- =================================================================

-- Add new columns to user_accounts table
ALTER TABLE user_accounts 
ADD COLUMN email VARCHAR(255) NULL COMMENT 'Email for password reset, especially for admin users not in employees table',
ADD COLUMN reset_token VARCHAR(255) NULL COMMENT 'Temporary token for password reset',
ADD COLUMN reset_token_expires TIMESTAMP NULL COMMENT 'Expiry time for reset token',
ADD COLUMN reset_token_used BOOLEAN DEFAULT FALSE COMMENT 'Flag to prevent token reuse',
ADD COLUMN password_changed_at TIMESTAMP NULL COMMENT 'Last password change timestamp';

-- Add indexes for performance
ALTER TABLE user_accounts 
ADD INDEX idx_email (email),
ADD INDEX idx_reset_token (reset_token),
ADD INDEX idx_locked_until (locked_until);

-- Add unique constraint on email where not null
ALTER TABLE user_accounts 
ADD CONSTRAINT uk_user_accounts_email UNIQUE (email);

-- Update the table comment
ALTER TABLE user_accounts COMMENT = 'User authentication table with password reset and email functionality';
