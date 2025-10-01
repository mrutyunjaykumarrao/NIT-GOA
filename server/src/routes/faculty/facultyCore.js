const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../../config/database');

const router = express.Router();

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  // Development mode bypass - remove in production
  if (process.env.NODE_ENV === 'development' || !process.env.JWT_SECRET) {
    console.log('Development mode: Bypassing authentication for', req.method, req.path);
    req.user = { userId: 1, role: 'Faculty', employeeCode: 'FAC001' }; // Mock faculty user for dev
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }             

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check edit permissions
const checkEditPermission = async (req, res, next) => {
  try {
    const { employeeCode } = req.params;
    
    // Development mode bypass
    if (process.env.NODE_ENV === 'development' || !process.env.JWT_SECRET) {
      console.log('Development mode: Bypassing permission check for', employeeCode);
      req.userEmployeeCode = employeeCode;
      return next();
    }

    const userId = req.user.userId;

    // Get user's employee_code from user_accounts
    const userQuery = `
      SELECT e.employee_code
      FROM employees e
      JOIN user_accounts ua ON ua.employee_code = e.employee_code
      WHERE ua.user_id = ?
    `;
    const [userResult] = await executeQuery(userQuery, [userId]);

    if (userResult.length === 0) {
      return res.status(403).json({ error: 'User not found or not associated with an employee' });
    }

    const userEmployeeCode = userResult[0].employee_code;

    // Check if user is editing their own profile or has admin privileges
    if (userEmployeeCode !== employeeCode && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied: You can only edit your own profile' });
    }

    req.userEmployeeCode = userEmployeeCode;
    next();
  } catch (error) {
    console.error('Permission check error:', error);
    res.status(500).json({ error: 'Permission check failed' });
  }
};

// GET /api/faculty/:employeeCode/permissions - Check edit permissions
router.get('/:employeeCode/permissions', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const userId = req.user.userId;

    // Get user's employee_code and role
    const userQuery = `
      SELECT e.employee_code, ua.access_level
      FROM employees e
      JOIN user_accounts ua ON ua.employee_code = e.employee_code
      WHERE ua.user_id = ?
    `;
    const [userResult] = await executeQuery(userQuery, [userId]);

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userEmployeeCode = userResult[0].employee_code;
    const accessLevel = userResult[0].access_level;

    const permissions = {
      canEdit: userEmployeeCode === employeeCode || accessLevel === 'admin',
      canEditOthers: accessLevel === 'admin',
      isOwnProfile: userEmployeeCode === employeeCode,
      accessLevel: accessLevel
    };

    res.json(permissions);
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: 'Failed to check permissions' });
  }
});

// GET /api/faculty/:employeeCode/profile-summary - Get basic faculty info
router.get('/:employeeCode/profile-summary', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    // Using the same table structure as the working faculty API
    const query = `
      SELECT 
        e.employee_id as id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.extension_no as phone,
        e.job_title as designation,
        e.employment_status,
        e.image_url as profile_image,
        e.is_hod,
        e.display_order,
        d.department_name,
        d.department_code,
        fp.bio_summary,
        fp.research_interests
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.employee_code = ? AND e.is_active = 1 AND e.role = 'Faculty'
    `;

    const [result] = await executeQuery(query, [employeeCode]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const faculty = result[0];

    const summary = {
      employee_code: faculty.employee_code,
      name: faculty.honorific ? `${faculty.honorific} ${faculty.full_name}` : faculty.full_name,
      full_name: faculty.full_name,
      honorific: faculty.honorific,
      email: faculty.email,
      position: faculty.designation,
      department: faculty.department_name,
      department_code: faculty.department_code,
      designation: faculty.designation,
      employment_status: faculty.employment_status,
      profile_image: faculty.profile_image,
      bio_summary: faculty.bio_summary,
      research_interests: faculty.research_interests,
      phone: faculty.phone,
      is_hod: faculty.is_hod,
      display_order: faculty.display_order
    };

    res.json(summary);
  } catch (error) {
    console.error('Get profile summary error:', error);
    res.status(500).json({ error: 'Failed to fetch profile summary', details: error.message });
  }
});

// PUT /api/faculty/:employeeCode/status - Update faculty status (admin only)
router.put('/:employeeCode/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { employeeCode } = req.params;
    const { is_active, is_public_visible } = req.body;

    const updateQuery = `
      UPDATE employees 
      SET is_active = ?, is_public_visible = ?, updated_at = NOW()
      WHERE employee_code = ?
    `;

    await executeQuery(updateQuery, [is_active, is_public_visible, employeeCode]);

    res.json({ 
      message: 'Faculty status updated successfully',
      employee_code: employeeCode,
      is_active,
      is_public_visible
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update faculty status' });
  }
});

// POST /api/faculty/:employeeCode/validate-edit-access - Validate edit access
router.post('/:employeeCode/validate-edit-access', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    // If we reach here, the user has edit permission
    res.json({ 
      message: 'Edit access validated',
      canEdit: true,
      userEmployeeCode: req.userEmployeeCode
    });
  } catch (error) {
    console.error('Validate edit access error:', error);
    res.status(500).json({ error: 'Failed to validate edit access' });
  }
});

module.exports = {
  router,
  authenticateToken,
  checkEditPermission
};