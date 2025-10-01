-- Create pending_approvals table for admin approval workflow
-- This table tracks requests that require admin approval (like profile image changes)

CREATE TABLE IF NOT EXISTS pending_approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL,
    approval_type ENUM('profile_image', 'personal_info', 'contact_info', 'other') NOT NULL,
    current_value TEXT, -- Current value (e.g., current image path)
    requested_value TEXT, -- Requested new value (e.g., new image filename)
    temp_file_path VARCHAR(500), -- Full path to temp file if applicable
    requested_by VARCHAR(50) NOT NULL, -- Employee code of requester
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(50) NULL, -- Employee code of admin who reviewed
    reviewed_at TIMESTAMP NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT, -- Optional notes from admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (employee_code) REFERENCES employees(employee_code) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES employees(employee_code) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_employee_code (employee_code),
    INDEX idx_status (status),
    INDEX idx_approval_type (approval_type),
    INDEX idx_requested_at (requested_at)
);

-- Insert sample data for testing (optional)
-- INSERT INTO pending_approvals (employee_code, approval_type, current_value, requested_value, temp_file_path, requested_by, status)
-- VALUES ('FAC001', 'profile_image', 'images/Faculty/CSE/veena_thenkanidiyoor.jpg', 'FAC001_1727083200000.jpg', '/uploads/faculty/FAC001_1727083200000.jpg', 'FAC001', 'pending');