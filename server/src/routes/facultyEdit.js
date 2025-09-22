const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

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

// Database connection function
async function getDbConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mrutyu@2026',
    database: 'updated_nitgoa'
  });
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware to check if user can edit the faculty profile
const checkEditPermission = async (req, res, next) => {
  try {
    const { employeeCode } = req.params;
    const user = req.user;

    // Admin can edit any profile
    if (user.role === 'Admin') {
      return next();
    }

    // Faculty can only edit their own profile
    if (user.role === 'Faculty') {
      const connection = await getDbConnection();
      try {
        // Get the employee_code for the logged-in user
        const [userEmployee] = await connection.execute(`
          SELECT e.employee_code 
          FROM employees e 
          JOIN user_accounts ua ON ua.employee_code = e.employee_code 
          WHERE ua.user_id = ?
        `, [user.userId]);

        if (userEmployee.length === 0) {
          return res.status(403).json({ error: 'Faculty member not found' });
        }

        // Check if trying to edit their own profile
        if (userEmployee[0].employee_code !== employeeCode) {
          return res.status(403).json({ error: 'You can only edit your own profile' });
        }

        return next();
      } finally {
        await connection.end();
      }
    }

    // Unknown role
    return res.status(403).json({ error: 'Insufficient permissions' });
  } catch (error) {
    console.error('Permission check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update faculty profile (personal and contact information)
router.put('/:employeeCode/profile', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const {
      full_name,
      honorific,
      gender,
      date_of_birth,
      designation,
      department,
      date_of_joining,
      experience,
      email,
      phone_mobile,
      extension_no,
      address,
      office_location,
      office_hours,
      linkedin_url,
      personal_website_url,
      google_scholar_url,
      orcid_id,
      scopus_id,
      research_gate_url,
      bio_summary,
      profile_image
    } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Get current employee data to preserve existing values
      const [currentEmployee] = await connection.execute(`
        SELECT * FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (currentEmployee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty member not found' });
      }

      const current = currentEmployee[0];

      // Update employees table - only update fields that are provided
      await connection.execute(`
        UPDATE employees 
        SET full_name = ?, honorific = ?, email = ?, phone_mobile = ?, 
            extension_no = ?, job_title = ?, date_of_joining = ?, image_url = ?
        WHERE employee_code = ?
      `, [
        full_name || current.full_name,
        honorific || current.honorific,
        email || current.email,
        phone_mobile || current.phone_mobile,
        extension_no || current.extension_no,
        designation || current.job_title,
        date_of_joining || current.date_of_joining,
        profile_image || current.image_url,
        employeeCode
      ]);

      // Update or insert faculty_profiles table
      const [existingProfile] = await connection.execute(`
        SELECT fp.employee_code FROM faculty_profiles fp
        WHERE fp.employee_code = ?
      `, [employeeCode]);

      if (existingProfile.length > 0) {
        // Get current profile data
        const [currentProfile] = await connection.execute(`
          SELECT fp.* FROM faculty_profiles fp
          WHERE fp.employee_code = ?
        `, [employeeCode]);

        const profile = currentProfile[0];

        // Update existing profile - only update fields that are provided
        await connection.execute(`
          UPDATE faculty_profiles 
          SET gender = ?, date_of_birth = ?, research_teaching_experience = ?,
              address = ?, office_location = ?, office_hours = ?,
              linkedin_url = ?, personal_website_url = ?, google_scholar_url = ?,
              orcid_id = ?, scopus_id = ?, research_gate_url = ?, bio_summary = ?
          WHERE employee_code = ?
        `, [
          gender || profile.gender,
          date_of_birth || profile.date_of_birth,
          experience || profile.research_teaching_experience,
          address || profile.address,
          office_location || profile.office_location,
          office_hours || profile.office_hours,
          linkedin_url || profile.linkedin_url,
          personal_website_url || profile.personal_website_url,
          google_scholar_url || profile.google_scholar_url,
          orcid_id || profile.orcid_id,
          scopus_id || profile.scopus_id,
          research_gate_url || profile.research_gate_url,
          bio_summary || profile.bio_summary,
          employeeCode
        ]);
      } else {
        // Verify employee exists
        const [employee] = await connection.execute(`
          SELECT employee_code FROM employees WHERE employee_code = ?
        `, [employeeCode]);

        if (employee.length > 0) {
          // Insert new profile
          await connection.execute(`
            INSERT INTO faculty_profiles (
              employee_code, gender, date_of_birth, research_teaching_experience,
              address, office_location, office_hours, linkedin_url, personal_website_url,
              google_scholar_url, orcid_id, scopus_id, research_gate_url, bio_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            employeeCode, gender || null, date_of_birth || null, experience || null,
            address || null, office_location || null, office_hours || null, linkedin_url || null,
            personal_website_url || null, google_scholar_url || null, orcid_id || null,
            scopus_id || null, research_gate_url || null, bio_summary || null
          ]);
        }
      }

      await connection.commit();
      res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error updating faculty profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// Update education information
router.put('/:employeeCode/education', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { education } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Verify employee exists
      const [employee] = await connection.execute(`
        SELECT employee_code FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      // Delete existing education records
      await connection.execute(`
        DELETE FROM faculty_education WHERE employee_code = ?
      `, [employeeCode]);

      // Insert new education records
      for (const edu of education) {
        if (edu.degree || edu.institute || edu.discipline || edu.graduation_year) {
          await connection.execute(`
            INSERT INTO faculty_education (employee_code, degree, institute, discipline, graduation_year, display_order)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [employeeCode, edu.degree || null, edu.institute || null, edu.discipline || null, 
              edu.graduation_year || null, edu.display_order || null]);
        }
      }

      await connection.commit();
      res.json({ success: true, message: 'Education updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ success: false, error: 'Failed to update education' });
  }
});

// Update research interests
router.put('/:employeeCode/research-interests', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { research_interests } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Verify employee exists
      const [employee] = await connection.execute(`
        SELECT employee_code FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      // Convert research_interests array to text
      const researchInterestsText = Array.isArray(research_interests) 
        ? research_interests.filter(interest => interest.trim()).join(', ')
        : research_interests || '';

      // Update research interests in faculty_profiles
      await connection.execute(`
        UPDATE faculty_profiles 
        SET research_interests = ?
        WHERE employee_code = ?
      `, [researchInterestsText, employeeCode]);

      await connection.commit();
      res.json({ success: true, message: 'Research interests updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error updating research interests:', error);
    res.status(500).json({ success: false, error: 'Failed to update research interests' });
  }
});

// Update publications
router.put('/:employeeCode/publications', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { publications } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Verify employee exists
      const [employee] = await connection.execute(`
        SELECT employee_code FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      // Delete existing publications
      await connection.execute(`
        DELETE FROM faculty_publications WHERE employee_code = ?
      `, [employeeCode]);

      // Insert new publications
      for (const pub of publications) {
        if (pub.title && pub.title.trim()) {
          await connection.execute(`
            INSERT INTO faculty_publications (
              employee_code, title, journal_name, publication_year, 
              publication_details, doi, publication_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [employeeCode, pub.title.trim(), pub.journal_name || null, 
              pub.publication_year || null, pub.publication_details || null, 
              pub.doi || null, pub.publication_type || 'Journal Paper']);
        }
      }

      await connection.commit();
      res.json({ success: true, message: 'Publications updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error updating publications:', error);
    res.status(500).json({ success: false, error: 'Failed to update publications' });
  }
});

// Bulk update all faculty data
router.put('/:employeeCode/bulk-update', authenticateToken, checkEditPermission, upload.single('image'), async (req, res) => {
  try {
    const { employeeCode } = req.params;
    
    // Handle both JSON and FormData requests
    let requestData;
    if (req.body.data) {
      // FormData request - parse the JSON data
      requestData = JSON.parse(req.body.data);
    } else {
      // Regular JSON request
      requestData = req.body;
    }
    
    const {
      profile,
      education,
      research_interests,
      publications
    } = requestData;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Verify employee exists
      const [employee] = await connection.execute(`
        SELECT employee_code FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      // Update profile if provided
      if (profile) {
        // Get current employee data to preserve existing values
        const [currentEmployee] = await connection.execute(`
          SELECT * FROM employees WHERE employee_code = ?
        `, [employeeCode]);

        if (currentEmployee.length > 0) {
          const current = currentEmployee[0];
          
          // Handle image upload
          let imageUrl = profile.profile_image || current.image_url;
          if (req.file) {
            // New image uploaded - copy to public directory
            const ext = path.extname(req.file.originalname);
            const publicImagePath = path.join(__dirname, '../../client/public/images/Faculty');
            
            // Ensure Faculty directory exists in public/images
            if (!fs.existsSync(publicImagePath)) {
              fs.mkdirSync(publicImagePath, { recursive: true });
            }
            
            const finalImagePath = path.join(publicImagePath, `${employeeCode}${ext}`);
            
            // Copy file from uploads to public directory
            fs.copyFileSync(req.file.path, finalImagePath);
            
            // Generate the relative path for database
            imageUrl = `images/Faculty/${employeeCode}${ext}`;
            
            // Clean up the temporary uploaded file
            fs.unlinkSync(req.file.path);
          }

          // Update employees table - only update fields that are provided
          await connection.execute(`
            UPDATE employees 
            SET full_name = ?, honorific = ?, email = ?, phone_mobile = ?, 
                extension_no = ?, job_title = ?, date_of_joining = ?, image_url = ?
            WHERE employee_code = ?
          `, [
            profile.full_name || current.full_name,
            profile.honorific || current.honorific,
            profile.email || current.email,
            profile.phone_mobile || current.phone_mobile,
            profile.extension_no || current.extension_no,
            profile.designation || current.job_title,
            formatDate(profile.date_of_joining) || current.date_of_joining,
            imageUrl,
            employeeCode
          ]);

        }

        // Update or insert faculty_profiles
        const [existingProfile] = await connection.execute(`
          SELECT employee_code FROM faculty_profiles WHERE employee_code = ?
        `, [employeeCode]);

        if (existingProfile.length > 0) {
          // Get current profile data
          const [currentProfile] = await connection.execute(`
            SELECT * FROM faculty_profiles WHERE employee_code = ?
          `, [employeeCode]);

          const profileData = currentProfile[0] || {};

          await connection.execute(`
            UPDATE faculty_profiles 
            SET gender = ?, date_of_birth = ?, research_teaching_experience = ?,
                address = ?, office_location = ?, office_hours = ?,
                linkedin_url = ?, personal_website_url = ?, google_scholar_url = ?,
                orcid_id = ?, scopus_id = ?, research_gate_url = ?, bio_summary = ?
            WHERE employee_code = ?
          `, [
            profile.gender || profileData.gender || null,
            formatDate(profile.date_of_birth) || profileData.date_of_birth || null,
            profile.experience || profileData.research_teaching_experience || null,
            profile.address || profileData.address || null,
            profile.office_location || profileData.office_location || null,
            profile.office_hours || profileData.office_hours || null,
            profile.linkedin_url || profileData.linkedin_url || null,
            profile.personal_website_url || profileData.personal_website_url || null,
            profile.google_scholar_url || profileData.google_scholar_url || null,
            profile.orcid_id || profileData.orcid_id || null,
            profile.scopus_id || profileData.scopus_id || null,
            profile.research_gate_url || profileData.research_gate_url || null,
            profile.bio_summary || profileData.bio_summary || null,
            employeeCode
          ]);
        } else {
          await connection.execute(`
            INSERT INTO faculty_profiles (
              employee_code, gender, date_of_birth, research_teaching_experience,
              address, office_location, office_hours, linkedin_url, personal_website_url,
              google_scholar_url, orcid_id, scopus_id, research_gate_url, bio_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            employeeCode,
            profile.gender || null,
            formatDate(profile.date_of_birth) || null,
            profile.experience || null,
            profile.address || null,
            profile.office_location || null,
            profile.office_hours || null,
            profile.linkedin_url || null,
            profile.personal_website_url || null,
            profile.google_scholar_url || null,
            profile.orcid_id || null,
            profile.scopus_id || null,
            profile.research_gate_url || null,
            profile.bio_summary || null
          ]);
        }
      }

      // Update education if provided
      if (education && Array.isArray(education)) {
        await connection.execute(`DELETE FROM faculty_education WHERE employee_code = ?`, [employeeCode]);
        
        for (const edu of education) {
          if (edu.degree || edu.institute || edu.discipline || edu.graduation_year) {
            await connection.execute(`
              INSERT INTO faculty_education (employee_code, degree, institute, discipline, graduation_year, display_order)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [employeeCode, edu.degree || null, edu.institute || null, edu.discipline || null, 
                edu.graduation_year || null, edu.display_order || null]);
          }
        }
      }

      // Update research interests if provided
      if (research_interests && Array.isArray(research_interests)) {
        // Convert research_interests array to text and update faculty_profiles
        const researchInterestsText = research_interests
          .filter(interest => interest && interest.trim())
          .map(interest => interest.trim())
          .join(', ');

        await connection.execute(`
          UPDATE faculty_profiles 
          SET research_interests = ?
          WHERE employee_code = ?
        `, [researchInterestsText, employeeCode]);
      }

      // Update publications if provided
      if (publications && Array.isArray(publications)) {
        await connection.execute(`DELETE FROM faculty_publications WHERE employee_code = ?`, [employeeCode]);
        
        for (const pub of publications) {
          if (pub.title && pub.title.trim()) {
            await connection.execute(`
              INSERT INTO faculty_publications (
                employee_code, title, journal_name, publication_year, 
                publication_details, doi, publication_type
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [employeeCode, pub.title.trim(), pub.journal_name || null, 
                pub.publication_year || null, pub.publication_details || null, 
                pub.doi || null, pub.publication_type || 'Journal Paper']);
          }
        }
      }

      await connection.commit();
      res.json({ success: true, message: 'Faculty data updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error updating faculty data:', error);
    res.status(500).json({ success: false, error: 'Failed to update faculty data' });
  }
});

module.exports = router;
