const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { executeQuery } = require('../../config/database');

const router = express.Router();

// Import shared middleware from facultyCore
const { authenticateToken, checkEditPermission } = require('./facultyCore');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/faculty');
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

// Helper function to format dates for MySQL
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

// Helper function to format dates for output
const formatDateForOutput = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

// GET /api/faculty/:employeeCode/personal - Get personal information
router.get('/:employeeCode/personal', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    // Extended query to include all personal information fields
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
        e.date_of_joining,
        d.department_id,
        d.department_name,
        d.department_code,
        fp.gender,
        fp.date_of_birth,
        fp.bio_summary,
        fp.research_interests,
        fp.research_teaching_experience,
        fp.designation_id
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

    const personalInfo = {
      employee_code: faculty.employee_code,
      full_name: faculty.full_name,
      honorific: faculty.honorific,
      email: faculty.email,
      phone: faculty.phone,
      designation: faculty.designation,
      designation_id: faculty.designation_id,
      employment_status: faculty.employment_status,
      department: faculty.department_name,
      department_id: faculty.department_id,
      department_code: faculty.department_code,
      profile_image: faculty.profile_image,
      is_hod: faculty.is_hod,
      gender: faculty.gender,
      date_of_birth: formatDateForOutput(faculty.date_of_birth),
      date_of_joining: formatDateForOutput(faculty.date_of_joining),
      bio_summary: faculty.bio_summary,
      research_interests: faculty.research_interests,
      research_teaching_experience: faculty.research_teaching_experience
    };

    res.json(personalInfo);
  } catch (error) {
    console.error('Get personal information error:', error);
    res.status(500).json({ error: 'Failed to fetch personal information' });
  }
});

// PUT /api/faculty/:employeeCode/personal - Update personal information
router.put('/:employeeCode/personal', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const {
      full_name,
      honorific,
      gender,
      date_of_birth,
      designation_id,
      department_id,
      date_of_joining,
      research_teaching_experience,
      is_hod,
      employment_status,
      employment_type,
      bio_summary
    } = req.body;

    console.log('Updating personal info for:', employeeCode, req.body);

    // Update employees table
    const employeeUpdateQuery = `
      UPDATE employees 
      SET 
        full_name = COALESCE(?, full_name),
        honorific = COALESCE(?, honorific),
        date_of_joining = COALESCE(?, date_of_joining),
        is_hod = COALESCE(?, is_hod),
        employment_status = COALESCE(?, employment_status),
        updated_at = NOW()
      WHERE employee_code = ?
    `;

    await executeQuery(employeeUpdateQuery, [
      full_name, 
      honorific, 
      formatDate(date_of_joining), 
      is_hod, 
      employment_status, 
      employeeCode
    ]);

    // Update or insert faculty_profiles record
    const profileUpdateQuery = `
      UPDATE faculty_profiles 
      SET 
        gender = COALESCE(?, gender),
        date_of_birth = COALESCE(?, date_of_birth),
        designation_id = COALESCE(?, designation_id),
        department_id = COALESCE(?, department_id),
        research_teaching_experience = COALESCE(?, research_teaching_experience),
        bio_summary = COALESCE(?, bio_summary),
        updated_at = NOW()
      WHERE employee_code = ?
    `;

    const [updateResult] = await executeQuery(profileUpdateQuery, [
      gender,
      formatDate(date_of_birth),
      designation_id,
      department_id,
      research_teaching_experience,
      bio_summary,
      employeeCode
    ]);

    console.log('Faculty profile update result:', updateResult);

    res.json({ 
      success: true, 
      message: 'Personal information updated successfully',
      updated_fields: req.body
    });

  } catch (error) {
    console.error('Update personal information error:', error);
    res.status(500).json({ error: 'Failed to update personal information' });
  }
});

// GET /api/faculty/:employeeCode/contact - Get contact information
router.get('/:employeeCode/contact', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const query = `
      SELECT 
        e.email,
        e.phone_mobile,
        e.phone_residence,
        e.extension_no,
        fp.address,
        fp.office_location,
        fp.office_hours
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
      WHERE e.employee_code = ? AND e.is_active = 1
    `;

    const [result] = await executeQuery(query, [employeeCode]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const faculty = result[0];

    const contactInfo = {
      email: faculty.email,
      phone_mobile: faculty.phone_mobile,
      phone_residence: faculty.phone_residence,
      extension_no: faculty.extension_no,
      address: faculty.address,
      office_location: faculty.office_location,
      office_hours: faculty.office_hours
    };

    res.json(contactInfo);
  } catch (error) {
    console.error('Get contact information error:', error);
    res.status(500).json({ error: 'Failed to fetch contact information' });
  }
});

// PUT /api/faculty/:employeeCode/contact - Update contact information
router.put('/:employeeCode/contact', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const {
      email,
      phone_mobile,
      phone_residence,
      extension_no,
      address,
      office_location,
      office_hours
    } = req.body;

    console.log('Updating contact info for:', employeeCode, req.body);

    // Update employees table
    const employeeUpdateQuery = `
      UPDATE employees 
      SET 
        email = COALESCE(?, email),
        phone_mobile = COALESCE(?, phone_mobile),
        phone_residence = COALESCE(?, phone_residence),
        extension_no = COALESCE(?, extension_no),
        updated_at = NOW()
      WHERE employee_code = ?
    `;

    await executeQuery(employeeUpdateQuery, [
      email, 
      phone_mobile, 
      phone_residence, 
      extension_no, 
      employeeCode
    ]);

    // Update faculty_profiles table
    const profileUpdateQuery = `
      UPDATE faculty_profiles 
      SET 
        address = COALESCE(?, address),
        office_location = COALESCE(?, office_location),
        office_hours = COALESCE(?, office_hours),
        updated_at = NOW()
      WHERE employee_code = ?
    `;

    await executeQuery(profileUpdateQuery, [
      address, 
      office_location, 
      office_hours, 
      employeeCode
    ]);

    res.json({
      success: true,
      message: 'Contact information updated successfully',
      updated_fields: req.body
    });

  } catch (error) {
    console.error('Update contact information error:', error);
    res.status(500).json({ error: 'Failed to update contact information' });
  }
});

// PUT /api/faculty/:employeeCode/image - Update profile image
router.put('/:employeeCode/image', authenticateToken, checkEditPermission, upload.single('image'), async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const isAdmin = req.user?.role === 'Admin';

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Image upload request:', { employeeCode, isAdmin, file: req.file.filename });

    // Get employee details including role and department
    const [employeeData] = await executeQuery(`
      SELECT 
        e.employee_code, 
        e.full_name, 
        e.role, 
        e.image_url,
        d.department_code,
        d.department_name
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_code = fp.employee_code
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.employee_code = ?
    `, [employeeCode]);

    if (!employeeData[0]) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const employee = employeeData[0];
    const currentImageUrl = employee.image_url;
    
    // Determine role directory
    let roleDir;
    switch(employee.role) {
      case 'Faculty':
        roleDir = 'Faculty';
        break;
      case 'Technical':
        roleDir = 'Technical Staff';
        break;
      case 'Administrative':
        roleDir = 'Administrative Staff';
        break;
      default:
        roleDir = 'Faculty'; // Default fallback
    }

    // Get department code (for Faculty) or use role directory
    const departmentCode = employee.department_code || '';
    
    if (isAdmin) {
      // ADMIN FLOW: Direct update to public folder
      const fs = require('fs').promises;
      
      // Construct proper directory path
      let targetDir;
      if (employee.role === 'Faculty' && departmentCode) {
        targetDir = path.join(__dirname, '../../../../client/public/images', roleDir, departmentCode);
      } else {
        targetDir = path.join(__dirname, '../../../../client/public/images', roleDir);
      }
      
      // Ensure target directory exists
      try {
        await fs.access(targetDir);
      } catch {
        await fs.mkdir(targetDir, { recursive: true });
      }

      // Determine target filename - maintain consistency with existing images
      let targetFilename;
      if (currentImageUrl && currentImageUrl.includes('/')) {
        // Use existing filename to maintain consistency
        targetFilename = path.basename(currentImageUrl);
      } else {
        // New image - create filename based on naming convention
        // Convert full name to firstname_lastname format
        const nameSlug = employee.full_name
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '');
        targetFilename = `${nameSlug}${path.extname(req.file.originalname)}`;
      }

      const targetPath = path.join(targetDir, targetFilename);
      
      // Move old image to deleted directory if it exists
      if (currentImageUrl) {
        const oldImagePath = path.join(__dirname, '../../../../client/public', currentImageUrl);
        const deletedDir = path.join(__dirname, '../../uploads/deleted');
        
        try {
          await fs.access(deletedDir);
        } catch {
          await fs.mkdir(deletedDir, { recursive: true });
        }

        try {
          await fs.access(oldImagePath);
          const deletedPath = path.join(deletedDir, `deleted-${Date.now()}-${path.basename(currentImageUrl)}`);
          await fs.rename(oldImagePath, deletedPath);
          console.log('Moved old image to deleted:', deletedPath);
        } catch (error) {
          console.log('Old image not found or already moved:', oldImagePath);
        }
      }

      // Move new image to target directory
      await fs.rename(req.file.path, targetPath);
      
      // Construct proper image URL path
      let newImageUrl;
      if (employee.role === 'Faculty' && departmentCode) {
        newImageUrl = `images/${roleDir}/${departmentCode}/${targetFilename}`;
      } else {
        newImageUrl = `images/${roleDir}/${targetFilename}`;
      }
      
      // Update database with new path
      await executeQuery(`
        UPDATE employees 
        SET image_url = ?, updated_at = NOW()
        WHERE employee_code = ?
      `, [newImageUrl, employeeCode]);

      res.json({
        success: true,
        message: 'Profile image updated successfully',
        image_url: newImageUrl,
        employee_code: employeeCode,
        saved_to: targetPath
      });

    } else {
      // FACULTY FLOW: Save to temp for admin approval - DO NOT UPDATE DATABASE
      const fs = require('fs').promises;
      const tempDir = path.join(__dirname, '../../uploads/faculty');
      
      // Ensure temp directory exists
      try {
        await fs.access(tempDir);
      } catch {
        await fs.mkdir(tempDir, { recursive: true });
      }

      // Move to faculty temp directory with employee code and timestamp
      const tempFilename = `${employeeCode}_${Date.now()}${path.extname(req.file.originalname)}`;
      const tempPath = path.join(tempDir, tempFilename);
      await fs.rename(req.file.path, tempPath);

      // Create pending approval record in database
      const approvalQuery = `
        INSERT INTO pending_approvals (
          employee_code, 
          approval_type, 
          current_value, 
          current_image_url,
          requested_value, 
          new_image_url,
          temp_file_path,
          requested_by,
          status
        ) VALUES (?, 'profile_image', ?, ?, ?, ?, ?, ?, 'pending')
      `;

      await executeQuery(approvalQuery, [
        employeeCode,
        currentImageUrl || '', // current image path for new column
        currentImageUrl || '', // current image path for old column
        tempFilename, // new image filename for new column
        tempFilename, // new image filename for old column
        tempPath, // full temp path
        req.user?.userId || 1 // requested by user ID
      ]);

      res.json({
        success: true,
        message: 'Image uploaded successfully. Pending admin approval.',
        employee_code: employeeCode,
        temp_path: tempFilename,
        status: 'pending_approval',
        target_directory: employee.role === 'Faculty' ? `images/${roleDir}/${departmentCode}/` : `images/${roleDir}/`,
        note: 'Your current profile image will remain unchanged until admin approves this request.'
      });
    }

  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ error: 'Failed to update profile image' });
  }
});

// Future endpoints structure for additional sections:

// PUT /api/faculty/:employeeCode/bio-extended - Update detailed biography
// GET /api/faculty/:employeeCode/awards - Get awards and achievements
// PUT /api/faculty/:employeeCode/awards - Update awards and achievements
// GET /api/faculty/:employeeCode/certifications - Get professional certifications
// PUT /api/faculty/:employeeCode/certifications - Update professional certifications

// GET /api/faculty/temp-image/:filename - Serve temporary images for admin preview
router.get('/temp-image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const tempPath = path.join(__dirname, '../../uploads/faculty', filename);
    
    // Security check - ensure filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    // Check if file exists
    const fs = require('fs').promises;
    try {
      await fs.access(tempPath);
      res.sendFile(tempPath);
    } catch (error) {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Temp image serve error:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

module.exports = router;