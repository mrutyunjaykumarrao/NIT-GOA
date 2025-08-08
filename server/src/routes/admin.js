const express = require('express');
const { executeQuery, withTransaction } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// ======================
// USER ACCOUNTS MANAGEMENT
// ======================

// Get all user accounts
router.get('/users', async (req, res) => {
  try {
    const users = await executeQuery(`
      SELECT 
        ua.user_id as id,
        ua.username,
        ua.access_level as role,
        ua.is_active,
        ua.last_login,
        ua.created_at,
        ua.updated_at,
        e.full_name,
        e.email,
        e.phone_mobile as phone,
        d.department_name
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.username = e.employee_code
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
      ORDER BY ua.created_at DESC
    `);
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user account
router.post('/users', async (req, res) => {
  try {
    const { username, password, role, employee_id, is_active = true } = req.body;
    
    // Get employee code for the given employee_id
    const [employee] = await executeQuery(
      'SELECT employee_code FROM employees WHERE employee_id = ?',
      [employee_id]
    );
    
    if (employee.length === 0) {
      return res.status(400).json({ error: 'Employee not found' });
    }
    
    // Check if username exists
    const [existing] = await executeQuery(
      'SELECT user_id FROM user_accounts WHERE username = ?',
      [employee[0].employee_code]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await executeQuery(`
      INSERT INTO user_accounts (username, password_hash, access_level, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [employee[0].employee_code, hashedPassword, role, is_active ? 1 : 0]);
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user account
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;
    
    const [result] = await executeQuery(`
      UPDATE user_accounts 
      SET access_level = ?, is_active = ?, updated_at = NOW()
      WHERE user_id = ?
    `, [role, is_active ? 1 : 0, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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
    
    const [result] = await executeQuery(
      'DELETE FROM user_accounts WHERE user_id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// EMPLOYEES MANAGEMENT
// ======================

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await executeQuery(`
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.email,
        e.phone_mobile as phone,
        e.department_id,
        e.role,
        e.job_title as position,
        e.date_of_joining as joining_date,
        e.is_active,
        e.created_at,
        e.updated_at,
        d.department_name,
        ua.username,
        ua.access_level as user_role,
        ua.is_active as user_active
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      LEFT JOIN user_accounts ua ON ua.username = e.employee_code
      ORDER BY e.created_at DESC
    `);
    
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
      email,
      phone_mobile,
      department_id,
      role,
      job_title,
      date_of_joining,
      is_active = true
    } = req.body;
    
    const result = await executeQuery(`
      INSERT INTO employees 
      (employee_code, full_name, email, phone_mobile, department_id, role, job_title, date_of_joining, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [employee_code, full_name, email, phone_mobile, department_id, role, job_title, date_of_joining, is_active ? 1 : 0]);
    
    res.status(201).json({ 
      message: 'Employee created successfully',
      employeeId: result.insertId 
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update employee
router.put('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employee_code,
      full_name,
      email,
      phone_mobile,
      department_id,
      role,
      job_title,
      date_of_joining,
      is_active
    } = req.body;
    
    const result = await executeQuery(`
      UPDATE employees 
      SET employee_code = ?, full_name = ?, email = ?, phone_mobile = ?, 
          department_id = ?, role = ?, job_title = ?, date_of_joining = ?, is_active = ?, 
          updated_at = NOW()
      WHERE employee_id = ?
    `, [employee_code, full_name, email, phone_mobile, department_id, role, job_title, date_of_joining, is_active ? 1 : 0, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
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
    
    // Check if employee has associated user account
    const [employee] = await executeQuery(
      'SELECT employee_code FROM employees WHERE employee_id = ?',
      [id]
    );
    
    if (employee.length > 0) {
      const [userAccount] = await executeQuery(
        'SELECT user_id FROM user_accounts WHERE username = ?',
        [employee[0].employee_code]
      );
      
      if (userAccount.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete employee with associated user account. Delete user account first.' 
        });
      }
    }
    
    const [result] = await executeQuery(
      'DELETE FROM employees WHERE employee_id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// FACULTY MANAGEMENT
// ======================

// Get all faculty profiles
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await executeQuery(`
      SELECT 
        fp.profile_id as id,
        fp.faculty_id,
        fp.employee_id,
        fp.designation,
        fp.specialization,
        fp.qualification,
        fp.experience_years,
        fp.research_interests,
        fp.is_hod,
        fp.is_active,
        fp.created_at,
        fp.updated_at,
        e.full_name,
        e.email,
        e.phone_mobile as phone,
        e.employee_code,
        d.department_name,
        ua.username,
        ua.is_active as user_active
      FROM faculty_profiles fp
      JOIN employees e ON fp.employee_id = e.employee_id
      LEFT JOIN departments d ON e.department_id = d.department_id
      LEFT JOIN user_accounts ua ON ua.username = e.employee_code
      ORDER BY fp.created_at DESC
    `);
    
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create faculty profile
router.post('/faculty', async (req, res) => {
  try {
    const {
      faculty_id,
      employee_id,
      designation,
      specialization,
      qualification,
      experience_years,
      research_interests,
      is_hod = false,
      is_active = true
    } = req.body;
    
    const [result] = await executeQuery(`
      INSERT INTO faculty_profiles 
      (faculty_id, employee_id, designation, specialization, qualification, experience_years, research_interests, is_hod, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [faculty_id, employee_id, designation, specialization, qualification, experience_years, research_interests, is_hod ? 1 : 0, is_active ? 1 : 0]);
    
    res.status(201).json({ 
      message: 'Faculty profile created successfully',
      facultyId: result.insertId 
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update faculty profile
router.put('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      faculty_id,
      designation,
      specialization,
      qualification,
      experience_years,
      research_interests,
      is_hod,
      is_active
    } = req.body;
    
    const [result] = await executeQuery(`
      UPDATE faculty_profiles 
      SET faculty_id = ?, designation = ?, specialization = ?, qualification = ?, 
          experience_years = ?, research_interests = ?, is_hod = ?, is_active = ?, 
          updated_at = NOW()
      WHERE profile_id = ?
    `, [faculty_id, designation, specialization, qualification, experience_years, research_interests, is_hod ? 1 : 0, is_active ? 1 : 0, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }
    
    res.json({ message: 'Faculty profile updated successfully' });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete faculty profile
router.delete('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await executeQuery(
      'DELETE FROM faculty_profiles WHERE profile_id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }
    
    res.json({ message: 'Faculty profile deleted successfully' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// STAFF MANAGEMENT
// ======================

// Get all staff profiles
router.get('/staff', async (req, res) => {
  try {
    const staff = await executeQuery(`
      SELECT 
        sp.profile_id as id,
        sp.employee_id,
        sp.position,
        sp.department,
        sp.qualifications,
        sp.skills,
        sp.is_active,
        sp.created_at,
        sp.updated_at,
        e.full_name,
        e.email,
        e.phone_mobile as phone,
        e.employee_code,
        e.role as employee_role,
        d.department_name,
        ua.username,
        ua.is_active as user_active
      FROM staff_profiles sp
      JOIN employees e ON sp.employee_id = e.employee_id
      LEFT JOIN departments d ON e.department_id = d.department_id
      LEFT JOIN user_accounts ua ON ua.username = e.employee_code
      ORDER BY sp.created_at DESC
    `);
    
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create staff profile
router.post('/staff', async (req, res) => {
  try {
    const {
      employee_id,
      position,
      department,
      qualifications,
      skills,
      is_active = true
    } = req.body;
    
    const [result] = await executeQuery(`
      INSERT INTO staff_profiles 
      (employee_id, position, department, qualifications, skills, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [employee_id, position, department, qualifications, skills, is_active ? 1 : 0]);
    
    res.status(201).json({ 
      message: 'Staff profile created successfully',
      staffId: result.insertId 
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update staff profile
router.put('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      position,
      department,
      qualifications,
      skills,
      is_active
    } = req.body;
    
    const [result] = await executeQuery(`
      UPDATE staff_profiles 
      SET position = ?, department = ?, qualifications = ?, skills = ?, is_active = ?, updated_at = NOW()
      WHERE profile_id = ?
    `, [position, department, qualifications, skills, is_active ? 1 : 0, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff profile not found' });
    }
    
    res.json({ message: 'Staff profile updated successfully' });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete staff profile
router.delete('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await executeQuery(
      'DELETE FROM staff_profiles WHERE profile_id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff profile not found' });
    }
    
    res.json({ message: 'Staff profile deleted successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// DEPARTMENTS MANAGEMENT
// ======================

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await executeQuery(`
      SELECT 
        d.department_id as id,
        d.department_name,
        d.department_code,
        d.description,
        d.is_active,
        d.created_at,
        d.updated_at,
        COUNT(e.employee_id) as employee_count,
        COUNT(fp.profile_id) as faculty_count
      FROM departments d
      LEFT JOIN employees e ON d.department_id = e.department_id AND e.is_active = 1
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id AND fp.is_active = 1
      GROUP BY d.department_id
      ORDER BY d.department_name
    `);
    
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================
// SYSTEM ANALYTICS
// ======================

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    // Get counts for different entities
    const userCountResult = await executeQuery('SELECT COUNT(*) as count FROM user_accounts WHERE is_active = 1');
    const employeeCountResult = await executeQuery('SELECT COUNT(*) as count FROM employees WHERE is_active = 1');
    const facultyCountResult = await executeQuery('SELECT COUNT(*) as count FROM faculty_profiles WHERE is_active = 1');
    const staffCountResult = await executeQuery('SELECT COUNT(*) as count FROM staff_profiles WHERE is_active = 1');
    const departmentCountResult = await executeQuery('SELECT COUNT(*) as count FROM departments');
    
    // Get recent activities
    const recentUsers = await executeQuery(`
      SELECT 
        ua.username, 
        ua.created_at,
        e.full_name as name
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.username = e.employee_code
      ORDER BY ua.created_at DESC
      LIMIT 5
    `);
    
    const analytics = {
      totals: {
        users: userCountResult[0]?.count || 0,
        employees: employeeCountResult[0]?.count || 0,
        faculty: facultyCountResult[0]?.count || 0,
        staff: staffCountResult[0]?.count || 0,
        departments: departmentCountResult[0]?.count || 0
      },
      recent: {
        users: recentUsers
      }
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

