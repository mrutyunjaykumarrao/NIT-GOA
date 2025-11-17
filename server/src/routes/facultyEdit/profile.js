const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  executeQuery,
  authenticateToken,
  checkEditPermission,
  formatDateForMySQL,
  formatDateForOutput,
  validateRequired,
  validateEmail,
  validatePhone,
  formatSuccessResponse,
  formatErrorResponse
} = require('./_middleware');

const router = express.Router();

/**
 * FACULTY PROFILE EDIT API
 * Handles personal and contact information editing
 * Includes profile image upload
 */

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads/faculty');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use employee code as filename with original extension
    const employeeCode = req.params.employeeCode;
    const ext = path.extname(file.originalname);
    cb(null, `${employeeCode}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

// GET /api/faculty-edit/:employeeCode/profile - Preload profile data for editing
router.get('/:employeeCode/profile', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const profile = await executeQuery(`
      SELECT 
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.phone_mobile,
        e.extension_no as phone,
        e.date_of_joining,
        e.gender,
        fp.date_of_birth,
        fp.address,
        fp.office_location,
        fp.office_hours,
        fp.image_url,
        fp.bio_summary,
        fp.research_teaching_experience,
        fp.designation_id,
        fp.department_id,
        fd.designation_title,
        d.department_name,
        d.department_code
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
      LEFT JOIN faculty_designations fd ON fp.designation_id = fd.designation_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.employee_code = ?
    `, [employeeCode]);

    if (profile.length === 0) {
      return res.status(404).json(formatErrorResponse('Faculty not found', 404));
    }

    const profileData = profile[0];
    
    // Format dates for frontend
    if (profileData.date_of_birth) {
      profileData.date_of_birth = formatDateForOutput(profileData.date_of_birth);
    }
    if (profileData.date_of_joining) {
      profileData.date_of_joining = formatDateForOutput(profileData.date_of_joining);
    }

    res.json(formatSuccessResponse(profileData));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// PUT /api/faculty-edit/:employeeCode/profile - Update profile information
router.put('/:employeeCode/profile', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const {
      full_name,
      honorific,
      email,
      phone_mobile,
      extension_no,
      date_of_joining,
      gender,
      date_of_birth,
      address,
      office_location,
      office_hours,
      bio_summary,
      research_teaching_experience,
      designation_id,
      department_id
    } = req.body;

    // Validate required fields
    validateRequired(full_name, 'Full name');
    validateRequired(email, 'Email');
    validateEmail(email);

    if (phone_mobile) validatePhone(phone_mobile);

    // Format dates
    const formattedDOB = formatDateForMySQL(date_of_birth);
    const formattedDOJ = formatDateForMySQL(date_of_joining);

    // Update employees table
    await executeQuery(`
      UPDATE employees 
      SET 
        full_name = ?,
        honorific = ?,
        email = ?,
        phone_mobile = ?,
        extension_no = ?,
        date_of_joining = ?,
        gender = ?
      WHERE employee_code = ?
    `, [
      full_name,
      honorific || null,
      email,
      phone_mobile || null,
      extension_no || null,
      formattedDOJ,
      gender || null,
      employeeCode
    ]);

    // Update faculty_profiles table
    await executeQuery(`
      UPDATE faculty_profiles 
      SET 
        date_of_birth = ?,
        address = ?,
        office_location = ?,
        office_hours = ?,
        bio_summary = ?,
        research_teaching_experience = ?,
        designation_id = ?,
        department_id = ?
      WHERE employee_code = ?
    `, [
      formattedDOB,
      address || null,
      office_location || null,
      office_hours || null,
      bio_summary || null,
      research_teaching_experience || null,
      designation_id || null,
      department_id || null,
      employeeCode
    ]);

    res.json(formatSuccessResponse(null, 'Profile updated successfully'));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json(formatErrorResponse(error, 400));
  }
});

// PUT /api/faculty-edit/:employeeCode/profile/image - Update profile image
router.put('/:employeeCode/profile/image', authenticateToken, checkEditPermission, upload.single('image'), async (req, res) => {
  try {
    const { employeeCode } = req.params;

    if (!req.file) {
      return res.status(400).json(formatErrorResponse('No image file provided', 400));
    }

    // Get department code for image path
    const deptResult = await executeQuery(`
      SELECT d.department_code 
      FROM faculty_profiles fp
      JOIN departments d ON fp.department_id = d.department_id
      WHERE fp.employee_code = ?
    `, [employeeCode]);

    if (deptResult.length === 0) {
      return res.status(404).json(formatErrorResponse('Faculty profile not found', 404));
    }

    const departmentCode = deptResult[0].department_code;
    const filename = req.file.filename;
    const imageUrl = `/images/Faculty/${departmentCode}/${filename}`;

    // Update image URL in database
    await executeQuery(`
      UPDATE faculty_profiles 
      SET image_url = ?
      WHERE employee_code = ?
    `, [imageUrl, employeeCode]);

    res.json(formatSuccessResponse({ image_url: imageUrl }, 'Profile image updated successfully'));
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

module.exports = router;
