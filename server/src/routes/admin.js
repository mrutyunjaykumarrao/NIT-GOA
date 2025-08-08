const express = require('express');
const bcrypt = require('bcrypt');
const { executeQuery, withTransaction } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

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

// ======================
// USER ACCOUNTS MANAGEMENT
// ======================

// Get all user accounts with employee and department info
router.get('/users', async (req, res) => {
  try {
    console.log('🔍 [ADMIN DEBUG] GET /users - Starting request');
    const result = await executeQuery(`
      SELECT 
        ua.user_id as id,
        ua.username,
        ua.access_level as role,
        ua.is_active,
        ua.last_login,
        ua.created_at,
        ua.updated_at,
        e.employee_id,
        e.full_name,
        e.email,
        e.phone_mobile as phone,
        e.role as employee_role,
        e.job_title as position,
        CASE 
          WHEN e.role = 'Faculty' THEN d_f.department_name
          WHEN e.role IN ('Administrative', 'Technical') THEN d_s.department_name
          ELSE NULL
        END as department_name
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.username = e.employee_code
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id AND e.role = 'Faculty'
      LEFT JOIN staff_profiles sp ON e.employee_id = sp.employee_id AND e.role IN ('Administrative', 'Technical')
      LEFT JOIN departments d_f ON fp.department_id = d_f.department_id
      LEFT JOIN departments d_s ON sp.department_id = d_s.department_id
      ORDER BY ua.created_at DESC
    `);
    
    // Handle nested array result structure
    const users = Array.isArray(result[0]) ? result[0] : result;
    
    console.log('🔍 [ADMIN DEBUG] Users query result type:', typeof result);
    console.log('🔍 [ADMIN DEBUG] Users query result isArray:', Array.isArray(result));
    console.log('🔍 [ADMIN DEBUG] Users query result[0] isArray:', Array.isArray(result[0]));
    console.log('🔍 [ADMIN DEBUG] Users final array length:', users.length);
    console.log('🔍 [ADMIN DEBUG] Users sample:', users.slice(0, 2));
    
    res.json(users);
  } catch (error) {
    console.error('🚨 [ADMIN DEBUG] Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
        employee_code, full_name, honorific, email, phone_mobile, phone_office,
        extension_no, date_of_joining, role, job_title, is_hod, employment_status,
        employment_type, image_url, is_active, is_public_visible, display_order
      ], connection);

      const employee_id = employeeResult.insertId;

      // Insert into role-specific profile table if department is provided
      if (department_id) {
        if (role === 'Faculty') {
          await executeQuery(`
            INSERT INTO faculty_profiles (employee_id, department_id)
            VALUES (?, ?)
          `, [employee_id, department_id], connection);
        } else if (role === 'Administrative' || role === 'Technical') {
          await executeQuery(`
            INSERT INTO staff_profiles (employee_id, department_id)
            VALUES (?, ?)
          `, [employee_id, department_id], connection);
        }
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

module.exports = router;
