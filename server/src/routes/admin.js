const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const emailService = require('../utils/emailService');
const { upload, moveImageToPublic } = require('../middleware/fileUpload');

const router = express.Router();

// Helper function for database queries
async function executeQuery(query, params = []) {
  const connection = await pool.connect();
  try {
    const result = await connection.query(query, params);
    return [result.rows];
  } finally {
    connection.release();
  }
}

// Helper function for transactions
async function withTransaction(callback) {
  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    const result = await callback(connection);
    await connection.query('COMMIT');
    return result;
  } catch (error) {
    await connection.query('ROLLBACK');
    throw error;
  } finally {
    connection.release();
  }
}

// GET /api/admin/temp-image/:filename - Serve temporary images for preview (Must be before auth middleware for <img> tags)
router.get('/temp-image/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    // Do not allow directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    // Handle 'REMOVE' specifically
    if (filename === 'REMOVE') {
      return res.status(404).json({ error: 'Image is marked for removal' });
    }
    
    // Support file paths if that's what was saved
    const resolvedFilename = require('path').basename(filename);
    const tempPath = require('path').join(__dirname, '../../uploads/temp', resolvedFilename);
    const fs = require('fs');
    if (!fs.existsSync(tempPath)) {
      return res.status(404).json({ error: 'Temporary image not found' });
    }
    res.sendFile(tempPath);
  } catch (error) {
    console.error('Error serving temp image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// ======================
// DATABASE MIGRATIONS
// ======================

// POST /api/admin/migrate - Run database migrations (admin only)
router.post('/migrate', async (req, res) => {
  try {
    // Create pending_approvals table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS pending_approvals (
          approval_id INT AUTO_INCREMENT PRIMARY KEY,
          employee_code VARCHAR(50) NOT NULL,
          approval_type ENUM('profile_image', 'personal_info', 'contact_info', 'other') NOT NULL,
          action_type ENUM('UPDATE','DELETE') DEFAULT 'UPDATE',
          current_value TEXT,
          requested_value TEXT,
          temp_file_path VARCHAR(500),
          requested_by VARCHAR(50) NOT NULL,
          requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          reviewed_by VARCHAR(50) NULL,
          reviewed_at TIMESTAMP NULL,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          admin_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          
          INDEX idx_employee_code (employee_code),
          INDEX idx_status (status),
          INDEX idx_approval_type (approval_type),
          INDEX idx_requested_at (requested_at)
      )
    `;

    await executeQuery(createTableQuery);

    res.json({
      success: true,
      message: 'pending_approvals table created successfully'
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      error: 'Migration failed', 
      details: error.message 
    });
  }
});

// ======================
// PENDING APPROVALS
// ======================

// GET /api/admin/pending-approvals - Get all pending approvals
router.get('/pending-approvals', async (req, res) => {
  try {
    const query = `
        SELECT 
            pa.approval_id,
            pa.employee_code,
            pa.approval_type,
            pa.action_type,
            pa.current_value AS current_image_url,
            pa.requested_value AS requested_image_url,
            pa.requested_by,
            pa.requested_at,
            pa.status,
            pa.admin_notes,
            e.full_name,
            e.role,
            d.department_code,
            d.department_name
        FROM pending_approvals pa
        JOIN employees e ON pa.employee_code = e.employee_code
        LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
        LEFT JOIN departments d ON fp.department_id = d.department_id
        WHERE pa.status = 'Pending'
        ORDER BY pa.requested_at DESC;
    `;

    const [result] = await executeQuery(query);

    res.json({
      success: true,
      approvals: result
    });

  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// PUT /api/admin/pending-approvals/:id/approve - Approve a pending request
router.put('/pending-approvals/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;
    const reviewedBy = req.user.employeeCode || 'ADMIN'; // In dev mode

    // Get the pending approval details
    const [pendingResult] = await executeQuery(
      'SELECT * FROM pending_approvals WHERE approval_id = $1 AND status = "pending"',
      [id]
    );

    if (pendingResult.length === 0) {
      return res.status(404).json({ error: 'Pending approval not found' });
    }

    const approval = pendingResult[0];

    if (approval.approval_type === 'profile_image') {
      const fs = require('fs').promises;
      const path = require('path');
      
      const { action_type, requested_value, temp_file_path, current_value, employee_code } = approval;
      const isDelete = action_type === 'DELETE' || requested_value === 'REMOVE';
      
      // Get employee details for proper directory structure
      const [employeeResult] = await executeQuery(`
        SELECT 
          e.employee_code, 
          e.full_name,
          e.role, 
          d.department_code
        FROM employees e
        LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
        LEFT JOIN departments d ON fp.department_id = d.department_id
        WHERE e.employee_code = $1
      `, [employee_code]);

      const employee = employeeResult[0];
      
      // Move old image to deleted directory if exists
      if (current_value) {
        const oldImagePath = path.join(__dirname, '../../../client/public', current_value);
        const deletedDir = path.join(__dirname, '../../uploads/deleted');
        await fs.mkdir(deletedDir, { recursive: true });
        
        try {
          const deletedPath = path.join(deletedDir, `approved_replace_${Date.now()}_${path.basename(current_value)}`);
          await fs.rename(oldImagePath, deletedPath);
          console.log('Old image moved to deleted:', deletedPath);
        } catch (error) {
          console.log('Old image not found or already moved:', oldImagePath);
        }
      }

      let newImageUrl = null;
      if (!isDelete && temp_file_path) {
        // Move new image from temp to final location
        try {
          newImageUrl = await moveImageToPublic(temp_file_path, employee.full_name, employee.role, employee.department_code);
          console.log('New image moved to:', newImageUrl);
        } catch (error) {
          console.error('Failed to move temp image:', error);
          return res.status(500).json({ error: 'Failed to move image file' });
        }
      }

      // Update faculty_profiles or staff_profiles table with the new public image URL
      const tableName = employee.role === 'Faculty' ? 'faculty_profiles' : 'staff_profiles';
      await executeQuery(`
        UPDATE ${tableName}
        SET image_url = $1
        WHERE employee_code = $1
      `, [newImageUrl, employee_code]);

      console.log('Database updated with new image URL:', newImageUrl);
    }

    // Update approval status
    await executeQuery(`
      UPDATE pending_approvals 
      SET status = 'approved', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, admin_notes = $2
      WHERE approval_id = $1
    `, [reviewedBy, admin_notes || null, id]);

    res.json({
      success: true,
      message: 'Request approved successfully'
    });

  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// PUT /api/admin/pending-approvals/:id/reject - Reject a pending request
router.put('/pending-approvals/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;
    const reviewedBy = req.user.employeeCode || 'ADMIN';

    // Get the pending approval details
    const [pendingResult] = await executeQuery(
      'SELECT * FROM pending_approvals WHERE approval_id = $1 AND status = "pending"',
      [id]
    );

    if (pendingResult.length === 0) {
      return res.status(404).json({ error: 'Pending approval not found' });
    }

    const approval = pendingResult[0];

    // Move temp file to deleted directory
    if (approval.temp_file_path) {
      const deletedDir = path.join(__dirname, '../../uploads/deleted');
      await fs.mkdir(deletedDir, { recursive: true });
      
      try {
        const deletedPath = path.join(deletedDir, `rejected_${Date.now()}_${path.basename(approval.temp_file_path)}`);
        await fs.rename(approval.temp_file_path, deletedPath);
      } catch (error) {
        console.log('Temp file not found:', approval.temp_file_path);
      }
    }

    // Update approval status
    await executeQuery(`
      UPDATE pending_approvals 
      SET status = 'rejected', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, admin_notes = $2
      WHERE approval_id = $1
    `, [reviewedBy, admin_notes || null, id]);

    res.json({
      success: true,
      message: 'Request rejected successfully'
    });

  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

// ======================
// FACULTY MANAGEMENT
// ======================

// POST /api/admin/faculty - Create new faculty profile
router.post('/faculty', upload.single('profile_image'), async (req, res) => {
  try {
    const {
      full_name,
      honorific,
      designation,
      department,
      email,
      gender,
      extension_no,
      mobile,
      display_order,
      create_user_account,
      username,
      password,
      access_level
    } = req.body;

    // Validation
    if (!full_name || !designation || !department || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: full_name, designation, department, email' 
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    await withTransaction(async (connection) => {
      // Generate employee code - check all possible sources to avoid conflicts
      const [codeResult] = await connection.query(`
        SELECT employee_code FROM (
          SELECT employee_code FROM employees WHERE role = 'Faculty'
          UNION
          SELECT employee_code FROM faculty_profiles
        ) AS all_codes
        WHERE employee_code LIKE 'FAC%'
        ORDER BY employee_code DESC LIMIT 1
      `);
      
      let newEmployeeCode;
      if (codeResult.length > 0) {
        const lastCode = codeResult[0].employee_code;
        const num = parseInt(lastCode.replace('FAC', '')) + 1;
        newEmployeeCode = `FAC${String(num).padStart(3, '0')}`;
      } else {
        newEmployeeCode = 'FAC001';
      }

// Get department_id and department_code from department name
        const [deptResult] = await connection.query(
          'SELECT department_id, department_code FROM departments WHERE department_name = $1 OR department_code = $2',
          [department, department]
        );

        if (deptResult.length === 0) {
          throw new Error(`Department not found: ${department}`);
        }

        const department_id = deptResult[0].department_id;
        const department_code = deptResult[0].department_code;

      // Insert into employees table
      const [employeeResult] = await connection.query(`
        INSERT INTO employees (
          employee_code, full_name, honorific, email, gender, phone_mobile, extension_no,
          role, is_active, is_public_visible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Faculty', TRUE, TRUE)
        RETURNING employee_id
      `, [
        newEmployeeCode,
        full_name,
        honorific || null,
        email,
        gender || null,
        mobile || null,
        extension_no || null
      ]);

      const employee_id = employeeResult[0].employee_id;

      // Get or create designation
      let designation_id;
      const [designationResult] = await connection.query(
        'SELECT designation_id FROM faculty_designations WHERE designation_title = $1',
        [designation]
      );

      if (designationResult.length > 0) {
        designation_id = designationResult[0].designation_id;
      } else {
        const [newDesignation] = await connection.query(
          'INSERT INTO faculty_designations (designation_title) VALUES ($1) RETURNING designation_id',
          [designation]
        );
        designation_id = newDesignation[0].designation_id;
      }

        // Handle Image Upload
        let image_url = null;
        if (req.file) {
          try {
            image_url = await moveImageToPublic(req.file.path, full_name, 'Faculty', department_code);
          } catch (imgError) {
            console.error("Failed to process image upload:", imgError);
          }
        }

        // Insert into faculty_profiles
        await connection.query(`
          INSERT INTO faculty_profiles (
            employee_code, department_id, designation_id, display_order, image_url
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
        newEmployeeCode,
        department_id,
        designation_id,
        display_order || 999,
        image_url
      ]);

      // Optionally create user account if requested
      if (create_user_account === 'true' || create_user_account === true) {
        const accountUsername = username || newEmployeeCode;
        const accountPassword = password || newEmployeeCode;
        const accountAccessLevel = access_level || 'Faculty';
        
        const hashedPassword = await bcrypt.hash(accountPassword, 10);
        await connection.query(`
          INSERT INTO user_accounts (
            username, password_hash, email, access_level, employee_code, is_active
          ) VALUES ($1, $2, $3, $4, $5, TRUE)
        `, [accountUsername, hashedPassword, email, accountAccessLevel, newEmployeeCode]);
      }
    });

    res.status(201).json({ 
      message: 'Faculty profile created successfully',
      success: true
    });

  } catch (error) {
    console.error('Create faculty error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email or employee code already exists' });
    } else {
      res.status(500).json({ 
        error: 'Failed to create faculty profile',
        details: error.message 
      });
    }
  }
});

// DELETE /api/admin/faculty/:employeeCode - Delete faculty profile
router.delete('/faculty/:employeeCode', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    await withTransaction(async (connection) => {
      // Check if faculty exists
      const [faculty] = await connection.query(
        'SELECT employee_code FROM faculty_profiles WHERE employee_code = $1',
        [employeeCode]
      );

      if (faculty.length === 0) {
        throw new Error('Faculty not found');
      }

      // Delete user account first (has ON DELETE SET NULL, so we need to explicitly delete)
      await connection.query(
        'DELETE FROM user_accounts WHERE employee_code = $1',
        [employeeCode]
      );

      // Delete from employees table - this will CASCADE to all related tables
      // (faculty_profiles, faculty_education, faculty_publications, etc.)
      await connection.query(
        'DELETE FROM employees WHERE employee_code = $1',
        [employeeCode]
      );
    });

    res.json({ 
      message: 'Faculty profile deleted successfully',
      success: true
    });

  } catch (error) {
    console.error('Delete faculty error:', error);
    if (error.message === 'Faculty not found') {
      res.status(404).json({ error: 'Faculty not found' });
    } else {
      res.status(500).json({ 
        error: 'Failed to delete faculty profile',
        details: error.message 
      });
    }
  }
});

// ======================
// ANALYTICS
// ======================

router.get('/analytics', async (req, res) => {
  try {
    console.log('🔍 [ADMIN DEBUG] GET /analytics - Starting request');
    const analytics = await executeQuery(`
      SELECT 
        (SELECT COUNT(*) FROM user_accounts) as total_users,
        (SELECT COUNT(*) FROM employees) as total_employees,
        (SELECT COUNT(*) FROM faculty_profiles) as total_faculty,
        (SELECT COUNT(*) FROM staff_profiles) as total_staff,
        (SELECT COUNT(*) FROM departments WHERE is_active = TRUE) as active_departments,
        (SELECT COUNT(*) FROM user_accounts WHERE is_active = TRUE) as active_users,
        (SELECT COUNT(*) FROM employees WHERE is_active = TRUE) as active_employees,
        (SELECT COUNT(*) FROM user_accounts WHERE last_login >= CURRENT_TIMESTAMP - INTERVAL '30 days') as recent_logins
    `);
    
    console.log('🔍 [ADMIN DEBUG] Analytics query result:', analytics[0]);
    
    res.json(analytics[0]);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Website Analytics endpoint
router.get('/website-analytics', async (req, res) => {
  try {
    console.log('🔍 [ADMIN DEBUG] GET /website-analytics - Starting request');
    
    // Get current period (default 30 days)
    const { period = '30' } = req.query;
    const days = parseInt(period) || 30;
    
    // Get aggregated analytics data
    const websiteStats = await executeQuery(`
      SELECT 
        SUM(total_visitors) as all_time_visitors,
        SUM(daily_visitors) as period_visitors,
        SUM(desktop_visits) as desktop_total,
        SUM(mobile_visits) as mobile_total,
        DATE(date_recorded) as analytics_date,
        daily_visitors as daily_count
      FROM site_analytics 
      WHERE date_recorded >= CURRENT_DATE - (INTERVAL '1 day' * $1)
      ORDER BY date_recorded DESC
    `, [days]);

    // Get today's stats
    const todayStats = await executeQuery(`
      SELECT total_visitors, daily_visitors, desktop_visits, mobile_visits
      FROM site_analytics 
      WHERE date_recorded = CURRENT_DATE
    `);

    // Get all-time stats
    const allTimeStats = await executeQuery(`
      SELECT 
        MAX(total_visitors) as total_visitors,
        SUM(desktop_visits) as total_desktop,
        SUM(mobile_visits) as total_mobile
      FROM site_analytics
    `);

    // Format data for charts
    const chartData = websiteStats.map(row => ({
      date: row.analytics_date,
      visitors: row.daily_count || 0
    }));

    const response = {
      allTime: {
        total_visitors: allTimeStats[0].total_visitors || 0
      },
      today: {
        daily_visitors: todayStats[0].daily_visitors || 0
      },
      deviceBreakdown: {
        desktop: allTimeStats[0].total_desktop || 0,
        mobile: allTimeStats[0].total_mobile || 0
      },
      chartData: {
        visitors: chartData
      }
    };

    console.log('🔍 [ADMIN DEBUG] Website analytics result:', response);
    res.json(response);
    
  } catch (error) {
    console.error('Website analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// USER ACCOUNTS MANAGEMENT
// ======================

// Create new user account
router.post('/users', async (req, res) => {
  try {
    const { username, password, access_level, employee_code, is_active = true } = req.body;
    
    if (!username || !password || !access_level) {
      return res.status(400).json({ error: 'Username, password, and access level are required' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    const result = await executeQuery(`
      INSERT INTO user_accounts (username, password_hash, access_level, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id
    `, [username, password_hash, access_level, is_active]);
    
    res.status(201).json({ 
      id: result[0][0].user_id, 
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update user account
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, access_level, is_active } = req.body;
    
    let paramIndex = 1;
    let query = `UPDATE user_accounts SET username = $${paramIndex++}, access_level = $${paramIndex++}, is_active = $${paramIndex++}`;
    let params = [username, access_level, is_active];
    
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      query += `, password_hash = $${paramIndex++}`;
      params.push(password_hash);
    }
    
    query += `, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${paramIndex}`;
    params.push(id);
    
    await executeQuery(query, params);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user account
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await executeQuery('DELETE FROM user_accounts WHERE user_id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user details
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, access_level, is_active } = req.body;

    // Check if user exists
    const [existingUsers] = await executeQuery('SELECT user_id FROM user_accounts WHERE user_id = $1', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    await executeQuery(`
      UPDATE user_accounts 
      SET username = $1, email = $2, access_level = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [username, email, access_level, is_active ? 1 : 0, id]);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, access_level, is_active = true } = req.body;

    // Validate required fields
    if (!username || !password || !access_level) {
      return res.status(400).json({ error: 'Username, password, and access level are required' });
    }

    // Check if username already exists
    const [existingUsers] = await executeQuery('SELECT username FROM user_accounts WHERE username = $1', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists (if provided)
    if (email) {
      const [existingEmails] = await executeQuery('SELECT email FROM user_accounts WHERE email = $1', [email]);
      if (existingEmails.length > 0) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await executeQuery(`
      INSERT INTO user_accounts (username, email, password_hash, access_level, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING user_id
    `, [username, email || null, hashedPassword, access_level, is_active ? 1 : 0]);

    res.status(201).json({ 
      message: 'User created successfully',
      user_id: result[0].user_id
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status (activate/deactivate)
router.put('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Check if user exists
    const [existingUsers] = await executeQuery('SELECT user_id, username FROM user_accounts WHERE user_id = $1', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user status
    await executeQuery(`
      UPDATE user_accounts 
      SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [is_active ? 1 : 0, id]);

    res.json({ message: `User ${is_active ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// EMPLOYEES MANAGEMENT
// ======================

router.get('/employees', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.phone_mobile as phone,
        e.phone_residence,
        e.extension_no,
        e.date_of_joining,
        NULL as date_of_leaving,
        e.role,
        CASE 
          WHEN e.role = 'Faculty' THEN fd.designation_title
          WHEN e.role IN ('Administrative', 'Technical') THEN sp.job_title
          ELSE NULL
        END as position,
        CASE 
          WHEN e.role = 'Faculty' THEN fp.is_hod
          ELSE 0
        END as is_hod,
        CASE 
          WHEN e.role = 'Faculty' THEN 'Active'
          WHEN e.role IN ('Administrative', 'Technical') THEN sp.employment_status
          ELSE NULL
        END as employment_status,
        'Full-time' as employment_type,
        CASE 
          WHEN e.role = 'Faculty' THEN fp.image_url
          WHEN e.role IN ('Administrative', 'Technical') THEN sp.image_url
          ELSE NULL
        END as image_url,
        e.is_active,
        e.is_public_visible,
        CASE 
          WHEN e.role = 'Faculty' THEN fp.display_order
          WHEN e.role IN ('Administrative', 'Technical') THEN sp.display_order
          ELSE 0
        END as display_order,
        e.created_at,
        e.updated_at,
        CASE 
          WHEN e.role = 'Faculty' THEN d_f.department_name
          WHEN e.role IN ('Administrative', 'Technical') THEN d_s.department_name
          ELSE NULL
        END as department_name,
        CASE 
          WHEN e.role = 'Faculty' THEN d_f.department_id
          WHEN e.role IN ('Administrative', 'Technical') THEN d_s.department_id
          ELSE NULL
        END as department_id,
        ua.username,
        ua.access_level as user_role,
        ua.is_active as user_active
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code AND e.role = 'Faculty'
      LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code AND e.role IN ('Administrative', 'Technical')
      LEFT JOIN departments d_f ON fp.department_id = d_f.department_id
      LEFT JOIN departments d_s ON sp.department_id = d_s.department_id
      LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
      LEFT JOIN user_accounts ua ON ua.username = e.employee_code
      ORDER BY e.created_at DESC
    `);
    
    // Handle nested array result structure
    const employees = Array.isArray(result[0]) ? result[0] : result;
    
    console.log('🔍 [ADMIN DEBUG] Employees final array length:', employees.length);
    console.log('🔍 [ADMIN DEBUG] Employees sample:', employees.slice(0, 1));
    
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get next employee code for a role
router.get('/employees/next-code/:role', async (req, res) => {
  try {
    const { role } = req.params;
    console.log(`🔍 [NEXT-CODE DEBUG] Fetching next code for role: ${role}`);
    
    // Get all employee codes for the role and filter in JavaScript
    const result = await executeQuery(`
      SELECT employee_code 
      FROM employees 
      WHERE role = $1 AND employee_code IS NOT NULL
      ORDER BY employee_code DESC
    `, [role]);
    
    console.log(`🔍 [NEXT-CODE DEBUG] Found ${result.length} employee codes for role ${role}:`);
    console.log(`🔍 [NEXT-CODE DEBUG] Raw query result:`, result);
    
    // Extract the actual data array (MySQL2 returns [rows, metadata])
    const employeeCodes = Array.isArray(result[0]) ? result[0] : result;
    console.log(`🔍 [NEXT-CODE DEBUG] Employee codes array:`, employeeCodes.slice(0, 10)); // Show first 10
    
    let nextCode;
    if (employeeCodes.length > 0) {
      // Filter codes that match the pattern and extract numbers
      const validCodes = employeeCodes
        .map(row => row.employee_code)
        .filter(code => code && /^[A-Z]+[0-9]+$/.test(code))
        .map(code => {
          const match = code.match(/^([A-Z]+)([0-9]+)$/);
          return match ? { prefix: match[1], number: parseInt(match[2]), full: code } : null;
        })
        .filter(item => item !== null);
      
      console.log(`🔍 [NEXT-CODE DEBUG] Valid codes after filtering:`, validCodes.slice(0, 5));
      
      if (validCodes.length > 0) {
        // Sort by number and get the highest
        validCodes.sort((a, b) => b.number - a.number);
        const lastCode = validCodes[0];
        console.log(`🔍 [NEXT-CODE DEBUG] Highest code found:`, lastCode);
        nextCode = `${lastCode.prefix}${String(lastCode.number + 1).padStart(3, '0')}`;
        console.log(`🔍 [NEXT-CODE DEBUG] Generated next code: ${nextCode}`);
      } else {
        // No valid codes found, use default
        console.log(`🔍 [NEXT-CODE DEBUG] No valid codes found, using default`);
        const prefixes = {
          'Faculty': 'FAC',
          'Administrative': 'ADMIN',
          'Technical': 'TECH'
        };
        nextCode = `${prefixes[role] || 'EMP'}001`;
      }
    } else {
      // No codes found at all, use default
      console.log(`🔍 [NEXT-CODE DEBUG] No employee codes found at all, using default`);
      const prefixes = {
        'Faculty': 'FAC',
        'Administrative': 'ADMIN',
        'Technical': 'TECH'
      };
      nextCode = `${prefixes[role] || 'EMP'}001`;
    }
    
    res.json({ next_code: nextCode });
  } catch (error) {
    console.error('Get next employee code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get next display order for a role
router.get('/employees/next-display-order/:role', async (req, res) => {
  try {
    const { role } = req.params;
    console.log(`🔍 [NEXT-DISPLAY-ORDER DEBUG] Fetching next display order for role: ${role}`);
    
    const result = await executeQuery(`
      SELECT COALESCE(MAX(display_order), 0) + 1 as next_display_order
      FROM employees 
      WHERE role = $1
    `, [role]);
    
    console.log(`🔍 [NEXT-DISPLAY-ORDER DEBUG] Raw result:`, result);
    
    // Extract the actual data array (MySQL2 returns [rows, metadata])
    const displayOrderData = Array.isArray(result[0]) ? result[0] : result;
    const nextDisplayOrder = displayOrderData[0].next_display_order || 1;
    
    console.log(`🔍 [NEXT-DISPLAY-ORDER DEBUG] Next display order: ${nextDisplayOrder}`);
    
    res.json({ next_display_order: nextDisplayOrder });
  } catch (error) {
    console.error('Get next display order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new employee
router.post('/employees', async (req, res) => {
  try {
    const {
      employee_code,
      full_name,
      honorific,
      email,
      phone_mobile,
      phone_residence,
      extension_no,
      date_of_joining,
      role,
      job_title,
      is_hod = false,
      employment_status,
      employment_type = 'Full-time',
      image_url,
      is_active = true,
      is_public_visible = true,
      display_order = 0,
      department_id
    } = req.body;

    if (!full_name || !email || !role) {
      return res.status(400).json({ error: 'Full name, email, and role are required' });
    }

    await withTransaction(async (connection) => {
      // Insert into employees table
      const employeeResult = await executeQuery(`
        INSERT INTO employees (
          employee_code, full_name, honorific, email, phone_mobile, phone_residence,
          extension_no, date_of_joining, role, job_title, is_hod, employment_status,
          employment_type, image_url, is_active, is_public_visible, display_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING employee_id
      `, [
        employee_code || null, 
        full_name || null, 
        honorific || null, 
        email || null, 
        phone_mobile || null, 
        phone_residence || null,
        extension_no || null, 
        date_of_joining || null, 
        role || null, 
        job_title || null, 
        is_hod || false, 
        employment_status || null,
        employment_type || 'Full-time', 
        image_url || null, 
        is_active !== undefined ? is_active : true, 
        is_public_visible !== undefined ? is_public_visible : true, 
        display_order || 0
      ], connection);

      const employee_id = employeeResult[0][0].employee_id;

      // Insert into role-specific profile table
      if (role === 'Faculty') {
        // Faculty profiles require department_id
        if (department_id) {
          await executeQuery(`
            INSERT INTO faculty_profiles (employee_id, department_id)
            VALUES ($1, $2)
          `, [employee_id, department_id], connection);
        }
      } else if (role === 'Administrative' || role === 'Technical') {
        // Staff profiles - department_id is optional
        await executeQuery(`
          INSERT INTO staff_profiles (employee_id, department_id)
          VALUES ($1, $2)
        `, [employee_id, department_id || null], connection);
        
        console.log(`✅ Created staff profile for employee_id: ${employee_id}, department_id: ${department_id || 'null'}`);
      }
    });

    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error('Create employee error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Employee code or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update employee
router.put('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { department_id, ...employeeData } = updateData;

    await withTransaction(async (connection) => {
      // Update employees table
      if (Object.keys(employeeData).length > 0) {
        let paramIndex = 1;
        const setClause = Object.keys(employeeData).map(key => `${key} = $${paramIndex++}`).join(', ');
        const values = Object.values(employeeData);
        
        await executeQuery(`
          UPDATE employees SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE employee_id = $${paramIndex}
        `, [...values, id], connection);
      }

      // Update department in profile tables if provided
      if (department_id !== undefined) {
        const employee = await executeQuery(
          'SELECT role FROM employees WHERE employee_id = $1', 
          [id], 
          connection
        );
        
        if (employee.length > 0) {
          const role = employee[0].role;
          
          if (role === 'Faculty') {
            await executeQuery(`
              INSERT INTO faculty_profiles (employee_id, department_id) 
              VALUES ($1, $2) 
              ON DUPLICATE KEY UPDATE department_id = VALUES(department_id)
            `, [id, department_id], connection);
          } else if (role === 'Administrative' || role === 'Technical') {
            await executeQuery(`
              INSERT INTO staff_profiles (employee_id, department_id) 
              VALUES ($1, $2) 
              ON DUPLICATE KEY UPDATE department_id = VALUES(department_id)
            `, [id, department_id], connection);
          }
        }
      }
    });

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await withTransaction(async (connection) => {
      // Delete from profile tables first (foreign key constraints)
      await executeQuery('DELETE FROM faculty_profiles WHERE employee_id = $1', [id], connection);
      await executeQuery('DELETE FROM staff_profiles WHERE employee_id = $1', [id], connection);
      
      // Delete from employees table
      await executeQuery('DELETE FROM employees WHERE employee_id = $1', [id], connection);
    });
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// FACULTY MANAGEMENT
// ======================

// Get all faculty with full details
router.get('/faculty', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.phone_mobile as phone,
        e.phone_residence,
        e.extension_no,
        e.date_of_joining,
        e.role,
        fd.designation_title as position,
        fp.is_hod,
        'Active' as employment_status,
        'Full-time' as employment_type,
        fp.image_url,
        e.is_active,
        e.is_public_visible,
        fp.display_order,
        e.created_at,
        e.updated_at,
        fp.department_id,
        fp.designation_id,
        e.gender,
        fp.date_of_birth,
        fp.research_teaching_experience,
        fp.address,
        fp.office_location,
        fp.office_hours,
        fp.linkedin_url,
        fp.personal_website_url,
        fp.google_scholar_url,
        fp.research_gate_url,
        fp.other_social_links,
        fp.bio_summary,
        fp.research_interests,
        d.department_name,
        ua.username,
        ua.access_level as user_role,
        ua.is_active as user_active
      FROM employees e
      JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
      LEFT JOIN departments d ON fp.department_id = d.department_id
      LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
      LEFT JOIN user_accounts ua ON ua.username = e.employee_code
      WHERE e.role = 'Faculty'
      ORDER BY e.created_at DESC
    `);
    
    // Handle nested array result structure
    const faculty = Array.isArray(result[0]) ? result[0] : result;
    
    console.log('🔍 [ADMIN DEBUG] Faculty final array length:', faculty.length);
    
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// STAFF MANAGEMENT
// ======================

// Get all staff with full details
router.get('/staff', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.phone_mobile as phone,
        e.phone_residence,
        e.extension_no,
        e.date_of_joining,
        e.role,
        sp.job_title as position,
        sp.employment_status,
        'Full-time' as employment_type,
        sp.image_url,
        e.is_active,
        e.is_public_visible,
        sp.display_order,
        e.created_at,
        e.updated_at,
        sp.department_id,
        sp.responsibilities as specialty,
        d.department_name,
        ua.username,
        ua.access_level as user_role,
        ua.is_active as user_active
      FROM employees e
      JOIN staff_profiles sp ON e.employee_code = sp.employee_code
      LEFT JOIN departments d ON sp.department_id = d.department_id
      LEFT JOIN user_accounts ua ON ua.username = e.employee_code
      WHERE e.role IN ('Administrative', 'Technical')
      ORDER BY e.created_at DESC
    `);
    
    // Handle nested array result structure
    const staff = Array.isArray(result[0]) ? result[0] : result;
    
    console.log('🔍 [ADMIN DEBUG] Staff final array length:', staff.length);
    
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// DEPARTMENTS MANAGEMENT
// ======================

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        d.department_id as id,
        d.department_name,
        d.department_code,
        '' as description,
        d.is_active,
        0 as display_order,
        d.created_at,
        d.updated_at,
        (SELECT COUNT(*) FROM faculty_profiles fp WHERE fp.department_id = d.department_id) as faculty_count,
        (SELECT COUNT(*) FROM staff_profiles sp WHERE sp.department_id = d.department_id) as staff_count
      FROM departments d
      ORDER BY d.department_name
    `);
    
    // Handle nested array result structure
    const departments = Array.isArray(result[0]) ? result[0] : result;
    
    console.log('🔍 [ADMIN DEBUG] Departments final array length:', departments.length);
    
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new department
router.post('/departments', async (req, res) => {
  try {
    const { department_name, department_code, description, is_active = true, display_order = 0 } = req.body;
    
    if (!department_name) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    const result = await executeQuery(`
      INSERT INTO departments (department_name, department_code, description, is_active, display_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING department_id
    `, [department_name, department_code, description, is_active, display_order]);
    
    res.status(201).json({ 
      id: result[0][0].department_id, 
      message: 'Department created successfully' 
    });
  } catch (error) {
    console.error('Create department error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Department name or code already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update department
router.put('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name, department_code, description, is_active, display_order } = req.body;
    
    await executeQuery(`
      UPDATE departments 
      SET department_name = $1, department_code = $2, description = $3, is_active = $4, 
          display_order = $1, updated_at = CURRENT_TIMESTAMP
      WHERE department_id = $1
    `, [department_name, department_code, description, is_active, display_order, id]);
    
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete department
router.delete('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if department has employees
    const facultyCount = await executeQuery('SELECT COUNT(*) as count FROM faculty_profiles WHERE department_id = $1', [id]);
    const staffCount = await executeQuery('SELECT COUNT(*) as count FROM staff_profiles WHERE department_id = $1', [id]);
    
    if (facultyCount[0].count > 0 || staffCount[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete department with associated employees' });
    }
    
    await executeQuery('DELETE FROM departments WHERE department_id = $1', [id]);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// USER ACCOUNT MANAGEMENT
// ======================

// Simple test route to verify database connectivity (removed for production)
// This will be available without authentication for debugging



// Test endpoint without auth for debugging
router.get('/users/test', async (req, res) => {
  try {
    console.log('🔍 [TEST] Testing users endpoint without auth...');
    
    const connection = await pool.getConnection();
    try {
      const [basicResults] = await connection.query(`
        SELECT 
          ua.user_id,
          ua.username,
          ua.email as user_email,
          ua.access_level,
          ua.is_active,
          ua.created_at,
          CASE 
            WHEN ua.is_active = 0 THEN 'inactive'
            ELSE 'active'
          END as status
        FROM user_accounts ua
        ORDER BY ua.created_at DESC
        LIMIT 5
      `, []);
      
      console.log('🔍 [TEST] Basic query successful, users:', basicResults.length);
      res.json({ success: true, count: basicResults.length, users: basicResults });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('🔍 [TEST] Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all user accounts with pagination, search, and status filters
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build WHERE clause and parameters for filtering
    let whereClause = '';
    const params = [];

    // Search filter - simplified for user_accounts only
    if (search && search.trim() !== '') {
      whereClause = ' WHERE (ua.username LIKE ? OR ua.email LIKE ?)';
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    // Status filter
    if (status && status !== 'all') {
      const statusCondition = whereClause ? ' AND ' : ' WHERE ';
      if (status === 'active') {
        whereClause += statusCondition + 'ua.is_active = 1 AND (ua.locked_until IS NULL OR ua.locked_until <= CURRENT_TIMESTAMP)';
      } else if (status === 'inactive') {
        whereClause += statusCondition + 'ua.is_active = 0';
      } else if (status === 'locked') {
        whereClause += statusCondition + 'ua.locked_until > CURRENT_TIMESTAMP';
      }
    }

    // Construct final query and parameters
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    const finalParams = [...params, limitNum, offsetNum];
    
    // Create a simplified query first to test
    const userQuery = `
      SELECT 
        ua.user_id,
        ua.username,
        ua.email as user_email,
        ua.access_level,
        ua.is_active,
        ua.last_login,
        ua.failed_login_attempts,
        ua.locked_until,
        ua.created_at,
        e.employee_id,
        e.employee_code,
        e.full_name,
        e.email as employee_email,
        e.role as employee_role,
        COALESCE(fp.image_url, sp.image_url) as employee_image,
        CASE 
          WHEN ua.locked_until > CURRENT_TIMESTAMP THEN 'locked'
          WHEN ua.is_active = 0 THEN 'inactive'
          ELSE 'active'
        END as status
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.employee_code = e.employee_code
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code AND e.role = 'Faculty'
      LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code AND e.role IN ('Administrative', 'Technical')
      ${whereClause}
      ORDER BY ua.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    console.log('🔍 [USERS DEBUG] Query placeholders count:', (userQuery.match(/\$1/g) || []).length);
    console.log('🔍 [USERS DEBUG] Parameters:', finalParams);
    
    // Simplified approach - try minimal query first
    const connection = await pool.getConnection();
    let userRows, totalCount;
    
    try {
      // Step 1: Get basic user data without complex joins
      const basicQuery = `
        SELECT 
          ua.user_id,
          ua.username,
          ua.email as user_email,
          ua.access_level,
          ua.is_active,
          ua.last_login,
          ua.failed_login_attempts,
          ua.locked_until,
          ua.created_at,
          CASE 
            WHEN ua.locked_until > CURRENT_TIMESTAMP THEN 'locked'
            WHEN ua.is_active = 0 THEN 'inactive'
            ELSE 'active'
          END as status
        FROM user_accounts ua
        ${whereClause}
        ORDER BY ua.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      // Build parameters for basicQuery (only include search params if whereClause exists)
      const basicParams = [];
      if (whereClause && whereClause.includes('?')) {
        basicParams.push(...params); // Add search parameters if there's a WHERE clause with placeholders
      }
      basicParams.push(limitNum, offsetNum); // Always add LIMIT and OFFSET
      
      console.log('🔍 [BASIC DEBUG] Query placeholders:', (basicQuery.match(/\$1/g) || []).length);
      console.log('🔍 [BASIC DEBUG] Parameters:', basicParams);
      
      // Try using query() instead of execute() to avoid parameter binding issues
      const basicQueryWithValues = basicQuery.replace('LIMIT ? OFFSET ?', `LIMIT ${limitNum} OFFSET ${offsetNum}`);
      const searchParams = whereClause && whereClause.includes('?') ? params : [];
      
      console.log('🔍 [BASIC DEBUG] Final query:', basicQueryWithValues);
      console.log('🔍 [BASIC DEBUG] Search parameters only:', searchParams);
      
      const [basicResults] = await connection.query(basicQueryWithValues, searchParams);
      
      // Step 2: Get employee data separately and merge
      const userIds = basicResults.map(u => u.user_id);
      let employeeData = {};
      
      if (userIds.length > 0) {
        const placeholders = userIds.map(() => '?').join(',');
        const employeeQuery = `
          SELECT 
            ua.user_id,
            e.employee_id,
            e.employee_code,
            e.full_name,
            e.email as employee_email,
            e.role as employee_role,
            CASE 
              WHEN e.role = 'Faculty' THEN fp.image_url
              WHEN e.role IN ('Administrative', 'Technical') THEN sp.image_url
              ELSE NULL
            END as employee_image
          FROM user_accounts ua
          LEFT JOIN employees e ON ua.employee_code = e.employee_code
          LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code AND e.role = 'Faculty'
          LEFT JOIN staff_profiles sp ON e.employee_code = sp.employee_code AND e.role IN ('Administrative', 'Technical')
          WHERE ua.user_id IN (${placeholders})
        `;
        
        const [empResults] = await connection.query(employeeQuery, userIds);
        
        // Create lookup map
        empResults.forEach(emp => {
          employeeData[emp.user_id] = emp;
        });
      }
      
      // Step 3: Merge data
      userRows = basicResults.map(user => ({
        ...user,
        employee_id: employeeData[user.user_id].employee_id || null,
        employee_code: employeeData[user.user_id].employee_code || null,
        full_name: employeeData[user.user_id].full_name || null,
        employee_email: employeeData[user.user_id].employee_email || null,
        employee_role: employeeData[user.user_id].employee_role || null,
        employee_image: employeeData[user.user_id].employee_image || null
      }));
      
      // Step 4: Get count
      const countQuery = `SELECT COUNT(*) as count FROM user_accounts ua ${whereClause}`;
      const [countResults] = await connection.query(countQuery, params);
      totalCount = countResults[0].count;
      
      
    } catch (simplifiedError) {
      console.error('Get users error:', simplifiedError);
      throw simplifiedError;
    } finally {
      connection.release();
    }

    res.json({
      users: userRows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlock user account
router.post('/users/:userId/unlock', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user details including email
    const users = await executeQuery(`
      SELECT 
        ua.username, 
        ua.email as user_email,
        e.email as employee_email,
        e.full_name,
        COALESCE(ua.email, e.email) as primary_email
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.employee_code = e.employee_code
      WHERE ua.user_id = $1
    `, [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Unlock the account
    await executeQuery(`
      UPDATE user_accounts 
      SET 
        locked_until = NULL,
        failed_login_attempts = 0,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [userId]);

    // Log the admin action
    try {
      await executeQuery(`
        INSERT INTO audit_log (table_name, record_id, action, new_values, user_id, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'user_accounts', 
        userId, 
        'UNLOCK', 
        JSON.stringify({ 
          action: 'account_unlocked_by_admin',
          unlocked_by: req.user.username 
        }), 
        req.user.userId,
        req.ip
      ]);
    } catch (auditError) {
      console.warn('Audit log failed:', auditError.message);
    }

    // Send email notification if user has email
    if (user.primary_email) {
      try {
        await emailService.sendAccountUnlockedEmail(
          user.primary_email,
          user.username,
          req.user.username
        );
        console.log(`✅ Account unlock notification sent to ${user.primary_email}`);
      } catch (emailError) {
        console.error('❌ Failed to send unlock notification email:', emailError.message);
        // Don't fail the unlock operation if email fails
      }
    }

    res.json({ 
      message: `Account for ${user.username} has been unlocked successfully` 
    });
  } catch (error) {
    console.error('Unlock user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset failed login attempts
router.post('/users/:userId/reset-attempts', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const users = await executeQuery('SELECT username FROM user_accounts WHERE user_id = $1', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await executeQuery(`
      UPDATE user_accounts 
      SET 
        failed_login_attempts = 0,
        locked_until = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [userId]);

    // Log the admin action
    try {
      await executeQuery(`
        INSERT INTO audit_log (table_name, record_id, action, new_values, user_id, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'user_accounts', 
        userId, 
        'UPDATE', 
        JSON.stringify({ 
          action: 'failed_attempts_reset_by_admin',
          reset_by: req.user.username 
        }), 
        req.user.userId,
        req.ip
      ]);
    } catch (auditError) {
      console.warn('Audit log failed:', auditError.message);
    }

    res.json({ 
      message: `Failed login attempts reset for ${users[0].username}` 
    });
  } catch (error) {
    console.error('Reset attempts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle user active status
router.post('/users/:userId/toggle-status', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Don't allow disabling self
    if (parseInt(userId) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot disable your own account' });
    }

    const users = await executeQuery('SELECT username, is_active FROM user_accounts WHERE user_id = $1', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newStatus = !users[0].is_active;
    
    await executeQuery(`
      UPDATE user_accounts 
      SET 
        is_active = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [newStatus, userId]);

    // Log the admin action
    try {
      await executeQuery(`
        INSERT INTO audit_log (table_name, record_id, action, new_values, user_id, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'user_accounts', 
        userId, 
        'UPDATE', 
        JSON.stringify({ 
          action: newStatus ? 'account_activated' : 'account_deactivated',
          changed_by: req.user.username 
        }), 
        req.user.userId,
        req.ip
      ]);
    } catch (auditError) {
      console.warn('Audit log failed:', auditError.message);
    }

    res.json({ 
      message: `Account ${newStatus ? 'activated' : 'deactivated'} for ${users[0].username}` 
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user email (for admin-only accounts)
router.put('/users/:userId/email', async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    // Check if email is already in use
    const existingEmail = await executeQuery(
      'SELECT user_id FROM user_accounts WHERE email = $1 AND user_id != ?',
      [email, userId]
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email address is already in use' });
    }

    const users = await executeQuery('SELECT username FROM user_accounts WHERE user_id = $1', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await executeQuery(`
      UPDATE user_accounts 
      SET 
        email = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [email, userId]);

    // Log the admin action
    try {
      await executeQuery(`
        INSERT INTO audit_log (table_name, record_id, action, new_values, user_id, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'user_accounts', 
        userId, 
        'UPDATE', 
        JSON.stringify({ 
          action: 'email_updated_by_admin',
          new_email: email,
          updated_by: req.user.username 
        }), 
        req.user.userId,
        req.ip
      ]);
    } catch (auditError) {
      console.warn('Audit log failed:', auditError.message);
    }

    res.json({ 
      message: `Email updated for ${users[0].username}` 
    });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
