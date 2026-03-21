const express = require('express');
const { upload, moveImageToPublic } = require('../../middleware/fileUpload');
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
    const userRole = req.user.role;
    const isRemoveImage = req.body.remove_image === 'true' || req.body.remove_image === true;

    // Check if no image and not requesting removal
    if (!req.file && !isRemoveImage) {
      return res.status(400).json(formatErrorResponse('No image file provided', 400));
    }

    // Get old image URL
    const oldImageResult = await executeQuery('SELECT image_url FROM faculty_profiles WHERE employee_code = ?', [employeeCode]);
    if (oldImageResult.length === 0) {
      return res.status(404).json(formatErrorResponse('Faculty profile not found', 404));
    }
    const oldImage = oldImageResult[0].image_url;

    if (userRole === 'Admin') {
      let finalImageUrl = null;

      if (req.file) {
        // Use moveImageToPublic to move from temp dir to public directory
        finalImageUrl = await moveImageToPublic(req.file.path, employeeCode, 'Faculty');
      }

      // Update image URL in database (will be NULL if removed)
      await executeQuery(`
        UPDATE faculty_profiles 
        SET image_url = ?
        WHERE employee_code = ?
      `, [finalImageUrl, employeeCode]);

      return res.json(formatSuccessResponse(
        { imageUrl: finalImageUrl }, 
        isRemoveImage ? 'Profile image removed successfully' : 'Profile image updated successfully'
      ));

    } else {
      // User is non-admin Faculty -> Route to Pending Approvals!
      const requestedValue = req.file ? req.file.filename : null;
      const tempFilePath = req.file ? req.file.path : null;

      // Check if there is already a pending image approval to replace 
      const existingApproval = await executeQuery(`
        SELECT approval_id FROM pending_approvals 
        WHERE employee_code = ? AND approval_type = 'profile_image' AND status = 'pending'
      `, [employeeCode]);

      if (existingApproval.length > 0) {
        await executeQuery(`
          UPDATE pending_approvals 
          SET 
            current_value = ?,
            requested_value = ?,
            temp_file_path = ?,
            requested_at = CURRENT_TIMESTAMP
          WHERE approval_id = ?
        `, [
          oldImage,
          isRemoveImage ? 'REMOVE' : requestedValue,
          tempFilePath,
          existingApproval[0].approval_id
        ]);
      } else {
        await executeQuery(`
          INSERT INTO pending_approvals (
            employee_code, approval_type, current_value, requested_value, temp_file_path, requested_by
          ) VALUES (?, 'profile_image', ?, ?, ?, ?)
        `, [
          employeeCode,
          oldImage,
          isRemoveImage ? 'REMOVE' : requestedValue,
          tempFilePath,
          employeeCode
        ]);
      }

      return res.json(formatSuccessResponse(
        { pendingApproval: true }, 
        'Profile image change submitted to admin for approval'
      ));
    }

  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json(formatErrorResponse(error.message));
  }
});

module.exports = router;
