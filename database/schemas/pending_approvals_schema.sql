-- Add pending_approvals table for image change approval workflow
CREATE TABLE IF NOT EXISTS pending_approvals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    change_type ENUM('image_update') NOT NULL DEFAULT 'image_update',
    current_image_url VARCHAR(255),
    new_image_url VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    requested_by INT, -- user_id who requested the change
    processed_by INT, -- admin user_id who processed the approval
    request_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES user_accounts(user_id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES user_accounts(user_id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_employee_id (employee_id),
    INDEX idx_created_at (created_at)
);

-- Add some additional useful indexes for better performance (ignore if already exists)
CREATE INDEX idx_employees_role_active_new ON employees(role, is_active);
CREATE INDEX idx_staff_profiles_department_new ON staff_profiles(department_id);
CREATE INDEX idx_staff_profiles_designation_new ON staff_profiles(designation_id);
