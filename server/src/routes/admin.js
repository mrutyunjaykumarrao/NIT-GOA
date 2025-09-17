const express = require('express');
const bcrypt = require('bcrypt');
const { executeQuery, withTransaction } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

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
        (SELECT COUNT(*) FROM departments WHERE is_active = 1) as active_departments,
        (SELECT COUNT(*) FROM user_accounts WHERE is_active = 1) as active_users,
        (SELECT COUNT(*) FROM employees WHERE is_active = 1) as active_employees,
        (SELECT COUNT(*) FROM user_accounts WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recent_logins
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
      WHERE date_recorded >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY date_recorded DESC
    `, [days]);

    // Get today's stats
    const todayStats = await executeQuery(`
      SELECT total_visitors, daily_visitors, desktop_visits, mobile_visits
      FROM site_analytics 
      WHERE date_recorded = CURDATE()
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
        total_visitors: allTimeStats[0]?.total_visitors || 0
      },
      today: {
        daily_visitors: todayStats[0]?.daily_visitors || 0
      },
      deviceBreakdown: {
        desktop: allTimeStats[0]?.total_desktop || 0,
        mobile: allTimeStats[0]?.total_mobile || 0
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
      VALUES (?, ?, ?, ?)
    `, [username, password_hash, access_level, is_active]);
    
    res.status(201).json({ 
      id: result.insertId, 
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
    
    let query = 'UPDATE user_accounts SET username = ?, access_level = ?, is_active = ?';
    let params = [username, access_level, is_active];
    
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      query += ', password_hash = ?';
      params.push(password_hash);
    }
    
    query += ', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?';
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
    await executeQuery('DELETE FROM user_accounts WHERE user_id = ?', [id]);
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
    const [existingUsers] = await executeQuery('SELECT user_id FROM user_accounts WHERE user_id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    await executeQuery(`
      UPDATE user_accounts 
      SET username = ?, email = ?, access_level = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
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
    const [existingUsers] = await executeQuery('SELECT username FROM user_accounts WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists (if provided)
    if (email) {
      const [existingEmails] = await executeQuery('SELECT email FROM user_accounts WHERE email = ?', [email]);
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
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [username, email || null, hashedPassword, access_level, is_active ? 1 : 0]);

    res.status(201).json({ 
      message: 'User created successfully',
      user_id: result.insertId
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
    const [existingUsers] = await executeQuery('SELECT user_id, username FROM user_accounts WHERE user_id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user status
    await executeQuery(`
      UPDATE user_accounts 
      SET is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
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
        e.phone_office,
        e.extension_no,
        e.date_of_joining,
        e.date_of_leaving,
        e.role,
        e.job_title as position,
        e.is_hod,
        e.employment_status,
        e.employment_type,
        e.image_url,
        e.is_active,
        e.is_public_visible,
        e.display_order,
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
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id AND e.role = 'Faculty'
      LEFT JOIN staff_profiles sp ON e.employee_id = sp.employee_id AND e.role IN ('Administrative', 'Technical')
      LEFT JOIN departments d_f ON fp.department_id = d_f.department_id
      LEFT JOIN departments d_s ON sp.department_id = d_s.department_id
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
      WHERE role = ? AND employee_code IS NOT NULL
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
      WHERE role = ?
    `, [role]);
    
    console.log(`🔍 [NEXT-DISPLAY-ORDER DEBUG] Raw result:`, result);
    
    // Extract the actual data array (MySQL2 returns [rows, metadata])
    const displayOrderData = Array.isArray(result[0]) ? result[0] : result;
    const nextDisplayOrder = displayOrderData[0]?.next_display_order || 1;
    
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
      phone_office,
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
          employee_code, full_name, honorific, email, phone_mobile, phone_office,
          extension_no, date_of_joining, role, job_title, is_hod, employment_status,
          employment_type, image_url, is_active, is_public_visible, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        employee_code || null, 
        full_name || null, 
        honorific || null, 
        email || null, 
        phone_mobile || null, 
        phone_office || null,
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

      const employee_id = employeeResult.insertId;

      // Insert into role-specific profile table
      if (role === 'Faculty') {
        // Faculty profiles require department_id
        if (department_id) {
          await executeQuery(`
            INSERT INTO faculty_profiles (employee_id, department_id)
            VALUES (?, ?)
          `, [employee_id, department_id], connection);
        }
      } else if (role === 'Administrative' || role === 'Technical') {
        // Staff profiles - department_id is optional
        await executeQuery(`
          INSERT INTO staff_profiles (employee_id, department_id)
          VALUES (?, ?)
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
        const setClause = Object.keys(employeeData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(employeeData);
        
        await executeQuery(`
          UPDATE employees SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?
        `, [...values, id], connection);
      }

      // Update department in profile tables if provided
      if (department_id !== undefined) {
        const employee = await executeQuery(
          'SELECT role FROM employees WHERE employee_id = ?', 
          [id], 
          connection
        );
        
        if (employee.length > 0) {
          const role = employee[0].role;
          
          if (role === 'Faculty') {
            await executeQuery(`
              INSERT INTO faculty_profiles (employee_id, department_id) 
              VALUES (?, ?) 
              ON DUPLICATE KEY UPDATE department_id = VALUES(department_id)
            `, [id, department_id], connection);
          } else if (role === 'Administrative' || role === 'Technical') {
            await executeQuery(`
              INSERT INTO staff_profiles (employee_id, department_id) 
              VALUES (?, ?) 
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
      await executeQuery('DELETE FROM faculty_profiles WHERE employee_id = ?', [id], connection);
      await executeQuery('DELETE FROM staff_profiles WHERE employee_id = ?', [id], connection);
      
      // Delete from employees table
      await executeQuery('DELETE FROM employees WHERE employee_id = ?', [id], connection);
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
        e.phone_office,
        e.extension_no,
        e.date_of_joining,
        e.role,
        e.job_title as position,
        e.is_hod,
        e.employment_status,
        e.employment_type,
        e.image_url,
        e.is_active,
        e.is_public_visible,
        e.display_order,
        e.created_at,
        e.updated_at,
        fp.department_id,
        fp.designation_id,
        fp.gender,
        fp.date_of_birth,
        fp.research_teaching_experience,
        fp.address,
        fp.office_location,
        fp.office_hours,
        fp.linkedin_url,
        fp.personal_website_url,
        fp.google_scholar_url,
        fp.orcid_id,
        fp.scopus_id,
        fp.research_gate_url,
        fp.other_social_links,
        fp.bio_summary,
        fp.research_interests,
        d.department_name,
        ua.username,
        ua.access_level as user_role,
        ua.is_active as user_active
      FROM employees e
      JOIN faculty_profiles fp ON e.employee_id = fp.employee_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
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
        e.phone_office,
        e.extension_no,
        e.date_of_joining,
        e.role,
        e.job_title as position,
        e.employment_status,
        e.employment_type,
        e.image_url,
        e.is_active,
        e.is_public_visible,
        e.display_order,
        e.created_at,
        e.updated_at,
        sp.department_id,
        sp.specialty,
        d.department_name,
        ua.username,
        ua.access_level as user_role,
        ua.is_active as user_active
      FROM employees e
      JOIN staff_profiles sp ON e.employee_id = sp.employee_id
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
        d.description,
        d.is_active,
        d.display_order,
        d.created_at,
        d.updated_at,
        (SELECT COUNT(*) FROM faculty_profiles fp WHERE fp.department_id = d.department_id) as faculty_count,
        (SELECT COUNT(*) FROM staff_profiles sp WHERE sp.department_id = d.department_id) as staff_count
      FROM departments d
      ORDER BY d.display_order, d.department_name
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
      VALUES (?, ?, ?, ?, ?)
    `, [department_name, department_code, description, is_active, display_order]);
    
    res.status(201).json({ 
      id: result.insertId, 
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
      SET department_name = ?, department_code = ?, description = ?, is_active = ?, 
          display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE department_id = ?
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
    const facultyCount = await executeQuery('SELECT COUNT(*) as count FROM faculty_profiles WHERE department_id = ?', [id]);
    const staffCount = await executeQuery('SELECT COUNT(*) as count FROM staff_profiles WHERE department_id = ?', [id]);
    
    if (facultyCount[0].count > 0 || staffCount[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete department with associated employees' });
    }
    
    await executeQuery('DELETE FROM departments WHERE department_id = ?', [id]);
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

// Get all user accounts with pagination, search, and status filters
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build WHERE clause and parameters for filtering
    let whereClause = '';
    const params = [];

    // Search filter
    if (search) {
      whereClause += ' WHERE (ua.username LIKE ? OR ua.email LIKE ? OR e.full_name LIKE ? OR e.email LIKE ? OR e.employee_code LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Status filter
    if (status !== 'all') {
      const statusCondition = whereClause ? ' AND ' : ' WHERE ';
      if (status === 'active') {
        whereClause += statusCondition + 'ua.is_active = 1 AND (ua.locked_until IS NULL OR ua.locked_until <= NOW())';
      } else if (status === 'inactive') {
        whereClause += statusCondition + 'ua.is_active = 0';
      } else if (status === 'locked') {
        whereClause += statusCondition + 'ua.locked_until > NOW()';
      }
    }

    // Get users with employee data
    const [userRows] = await executeQuery(`
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
        e.image_url as employee_image,
        CASE 
          WHEN ua.locked_until > NOW() THEN 'locked'
          WHEN ua.is_active = 0 THEN 'inactive'
          ELSE 'active'
        END as status
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.employee_code = e.employee_code
      ${whereClause}
      ORDER BY ua.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Get total count for pagination
    const [countRows] = await executeQuery(`
      SELECT COUNT(*) as count
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.employee_code = e.employee_code
      ${whereClause}
    `, params);

    const totalCount = countRows[0].count;

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
      WHERE ua.user_id = ?
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
      WHERE user_id = ?
    `, [userId]);

    // Log the admin action
    await executeQuery(`
      INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
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
    
    const users = await executeQuery('SELECT username FROM user_accounts WHERE user_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await executeQuery(`
      UPDATE user_accounts 
      SET 
        failed_login_attempts = 0,
        locked_until = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [userId]);

    // Log the admin action
    await executeQuery(`
      INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
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

    const users = await executeQuery('SELECT username, is_active FROM user_accounts WHERE user_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newStatus = !users[0].is_active;
    
    await executeQuery(`
      UPDATE user_accounts 
      SET 
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [newStatus, userId]);

    // Log the admin action
    await executeQuery(`
      INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
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
      'SELECT user_id FROM user_accounts WHERE email = ? AND user_id != ?',
      [email, userId]
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email address is already in use' });
    }

    const users = await executeQuery('SELECT username FROM user_accounts WHERE user_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await executeQuery(`
      UPDATE user_accounts 
      SET 
        email = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [email, userId]);

    // Log the admin action
    await executeQuery(`
      INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
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

    res.json({ 
      message: `Email updated for ${users[0].username}` 
    });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
