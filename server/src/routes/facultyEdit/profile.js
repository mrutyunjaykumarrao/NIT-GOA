const express = require('express');
const { upload, uploadImageToSupabase, uploadToPending, archiveImageInSupabase } = require('../../middleware/fileUpload');
const path = require('path');
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
      WHERE e.employee_code = $1
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
        full_name = $1,
        honorific = $2,
        email = $3,
        phone_mobile = $4,
        extension_no = $5,
        date_of_joining = $6,
        gender = $7
      WHERE employee_code = $8
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
        date_of_birth = $1,
        address = $2,
        office_location = $3,
        office_hours = $4,
        bio_summary = $5,
        research_teaching_experience = $6,
        designation_id = $7,
        department_id = $8
      WHERE employee_code = $9
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

    // Get old image URL and employee info
    const employeeResult = await executeQuery(`
      SELECT 
        fp.image_url, 
        e.full_name, 
        e.role, 
        d.department_code
      FROM faculty_profiles fp
      JOIN employees e ON e.employee_code = fp.employee_code
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE fp.employee_code = $1
    `, [employeeCode]);
    
    if (employeeResult.length === 0) {
      return res.status(404).json(formatErrorResponse('Faculty profile not found', 404));
    }
    
    const { image_url: oldImage, full_name, role, department_code } = employeeResult[0];

    if (userRole === 'Admin') {
      let finalImageUrl = null;

      // Archive old image to deleted folder in Supabase
      if (oldImage && oldImage.startsWith('https://')) {
        await archiveImageInSupabase(oldImage);
      }

      if (req.file && !isRemoveImage) {
        // Upload new image directly to Supabase
        finalImageUrl = await uploadImageToSupabase(
          req.file.buffer, 
          full_name, 
          role || 'Faculty', 
          department_code,
          req.file.originalname
        );
      }

      // Update image URL in database (will be NULL if removed)
      await executeQuery(`
        UPDATE faculty_profiles 
        SET image_url = $1
        WHERE employee_code = $2
      `, [finalImageUrl, employeeCode]);

      return res.json(formatSuccessResponse(
        { imageUrl: finalImageUrl }, 
        isRemoveImage ? 'Profile image removed successfully' : 'Profile image updated successfully'
      ));

    } else {
      // User is non-admin Faculty -> Route to Pending Approvals!
      let pendingImageUrl = null;
      
      if (req.file && !isRemoveImage) {
        // Upload to Supabase pending folder immediately
        pendingImageUrl = await uploadToPending(req.file.buffer, req.file.originalname);
      }
      
      const actionType = isRemoveImage ? 'DELETE' : 'UPDATE';

      // Check if there is already a pending image approval to replace 
      const existingApproval = await executeQuery(`
        SELECT approval_id FROM pending_approvals 
        WHERE employee_code = $1 AND approval_type = 'profile_image' AND status = 'pending'
      `, [employeeCode]);

      if (existingApproval.length > 0) {
        await executeQuery(`
          UPDATE pending_approvals 
          SET 
            action_type = $1,
            current_value = $2,
            requested_value = $3,
            temp_file_path = $4,
            requested_at = CURRENT_TIMESTAMP
          WHERE approval_id = $5
        `, [
          actionType,
          oldImage,
          pendingImageUrl,
          pendingImageUrl,
          existingApproval[0].approval_id
        ]);
      } else {
        await executeQuery(`
          INSERT INTO pending_approvals (
            employee_code, approval_type, action_type, current_value, requested_value, temp_file_path, requested_by
          ) VALUES ($1, 'profile_image', $2, $3, $4, $5, $6)
        `, [
          employeeCode,
          actionType,
          oldImage,
          pendingImageUrl,
          pendingImageUrl,
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

// GET /api/faculty-edit/:employeeCode/pending-requests - Get user's own requests
router.get('/:employeeCode/pending-requests', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    
    const requests = await executeQuery(`
      SELECT * FROM pending_approvals 
      WHERE employee_code = $1 
      ORDER BY requested_at DESC
    `, [employeeCode]);
    
    res.json(formatSuccessResponse({ requests }, 'Requests fetched successfully'));
  } catch (error) {
    console.error('Fetch pending requests error:', error);
    res.status(500).json(formatErrorResponse('Failed to fetch pending requests', 500));
  }
});

module.exports = router;
