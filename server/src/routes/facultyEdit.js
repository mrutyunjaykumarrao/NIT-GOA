const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const router = express.Router();

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

// Update faculty profile (personal and contact information)
router.put('/:employeeCode/profile', authenticateToken, async (req, res) => {
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
        SELECT fp.employee_id FROM faculty_profiles fp
        JOIN employees e ON fp.employee_id = e.employee_id
        WHERE e.employee_code = ?
      `, [employeeCode]);

      if (existingProfile.length > 0) {
        // Get current profile data
        const [currentProfile] = await connection.execute(`
          SELECT fp.* FROM faculty_profiles fp
          JOIN employees e ON fp.employee_id = e.employee_id
          WHERE e.employee_code = ?
        `, [employeeCode]);

        const profile = currentProfile[0];

        // Update existing profile - only update fields that are provided
        await connection.execute(`
          UPDATE faculty_profiles fp
          JOIN employees e ON fp.employee_id = e.employee_id
          SET fp.gender = ?, fp.date_of_birth = ?, fp.research_teaching_experience = ?,
              fp.address = ?, fp.office_location = ?, fp.office_hours = ?,
              fp.linkedin_url = ?, fp.personal_website_url = ?, fp.google_scholar_url = ?,
              fp.orcid_id = ?, fp.scopus_id = ?, fp.research_gate_url = ?, fp.bio_summary = ?
          WHERE e.employee_code = ?
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
        // Get employee_id first
        const [employee] = await connection.execute(`
          SELECT employee_id FROM employees WHERE employee_code = ?
        `, [employeeCode]);

        if (employee.length > 0) {
          // Insert new profile
          await connection.execute(`
            INSERT INTO faculty_profiles (
              employee_id, gender, date_of_birth, research_teaching_experience,
              address, office_location, office_hours, linkedin_url, personal_website_url,
              google_scholar_url, orcid_id, scopus_id, research_gate_url, bio_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            employee[0].employee_id, gender || null, date_of_birth || null, experience || null,
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
router.put('/:employeeCode/education', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { education } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Get employee_id
      const [employee] = await connection.execute(`
        SELECT employee_id FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      const employeeId = employee[0].employee_id;

      // Delete existing education records
      await connection.execute(`
        DELETE FROM education WHERE employee_id = ?
      `, [employeeId]);

      // Insert new education records
      for (const edu of education) {
        if (edu.degree || edu.institute || edu.subject || edu.year) {
          await connection.execute(`
            INSERT INTO education (employee_id, degree, institute, subject, year, grade_percentage)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [employeeId, edu.degree || null, edu.institute || null, edu.subject || null, 
              edu.year || null, edu.grade_percentage || null]);
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
router.put('/:employeeCode/research-interests', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { research_interests } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Get employee_id
      const [employee] = await connection.execute(`
        SELECT employee_id FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      const employeeId = employee[0].employee_id;

      // Delete existing research interests
      await connection.execute(`
        DELETE FROM research_areas WHERE employee_id = ?
      `, [employeeId]);

      // Insert new research interests
      for (const interest of research_interests) {
        if (interest.trim()) {
          await connection.execute(`
            INSERT INTO research_areas (employee_id, research_area)
            VALUES (?, ?)
          `, [employeeId, interest.trim()]);
        }
      }

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
router.put('/:employeeCode/publications', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { publications } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Get employee_id
      const [employee] = await connection.execute(`
        SELECT employee_id FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      const employeeId = employee[0].employee_id;

      // Delete existing publications
      await connection.execute(`
        DELETE FROM publications WHERE employee_id = ?
      `, [employeeId]);

      // Insert new publications
      for (const pub of publications) {
        if (pub.title && pub.title.trim()) {
          await connection.execute(`
            INSERT INTO publications (
              employee_id, title, journal_name, publication_year, 
              publication_details, doi, publication_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [employeeId, pub.title.trim(), pub.journal_name || null, 
              pub.publication_year || null, pub.publication_details || null, 
              pub.doi || null, pub.publication_type || 'journal']);
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
router.put('/:employeeCode/bulk-update', authenticateToken, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const {
      profile,
      education,
      research_interests,
      publications
    } = req.body;

    const connection = await getDbConnection();
    
    try {
      await connection.beginTransaction();

      // Get employee_id
      const [employee] = await connection.execute(`
        SELECT employee_id FROM employees WHERE employee_code = ?
      `, [employeeCode]);

      if (employee.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      const employeeId = employee[0].employee_id;

      // Update profile if provided
      if (profile) {
        // Get current employee data to preserve existing values
        const [currentEmployee] = await connection.execute(`
          SELECT * FROM employees WHERE employee_code = ?
        `, [employeeCode]);

        if (currentEmployee.length > 0) {
          const current = currentEmployee[0];

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
            profile.profile_image || current.image_url,
            employeeCode
          ]);

        }

        // Update or insert faculty_profiles
        const [existingProfile] = await connection.execute(`
          SELECT employee_id FROM faculty_profiles WHERE employee_id = ?
        `, [employeeId]);

        if (existingProfile.length > 0) {
          // Get current profile data
          const [currentProfile] = await connection.execute(`
            SELECT * FROM faculty_profiles WHERE employee_id = ?
          `, [employeeId]);

          const profileData = currentProfile[0] || {};

          await connection.execute(`
            UPDATE faculty_profiles 
            SET gender = ?, date_of_birth = ?, research_teaching_experience = ?,
                address = ?, office_location = ?, office_hours = ?,
                linkedin_url = ?, personal_website_url = ?, google_scholar_url = ?,
                orcid_id = ?, scopus_id = ?, research_gate_url = ?, bio_summary = ?
            WHERE employee_id = ?
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
            employeeId
          ]);
        } else {
          await connection.execute(`
            INSERT INTO faculty_profiles (
              employee_id, gender, date_of_birth, research_teaching_experience,
              address, office_location, office_hours, linkedin_url, personal_website_url,
              google_scholar_url, orcid_id, scopus_id, research_gate_url, bio_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            employeeId,
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
        await connection.execute(`DELETE FROM faculty_education WHERE employee_id = ?`, [employeeId]);
        
        for (const edu of education) {
          if (edu.degree || edu.institute || edu.subject || edu.year) {
            await connection.execute(`
              INSERT INTO faculty_education (employee_id, degree, institute, subject, year, grade_percentage)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [employeeId, edu.degree || null, edu.institute || null, edu.subject || null, 
                edu.year || null, edu.grade_percentage || null]);
          }
        }
      }

      // Update research interests if provided
      if (research_interests && Array.isArray(research_interests)) {
        await connection.execute(`DELETE FROM faculty_research_areas WHERE employee_id = ?`, [employeeId]);
        
        for (const interest of research_interests) {
          if (interest && interest.trim()) {
            await connection.execute(`
              INSERT INTO faculty_research_areas (employee_id, research_area)
              VALUES (?, ?)
            `, [employeeId, interest.trim()]);
          }
        }
      }

      // Update publications if provided
      if (publications && Array.isArray(publications)) {
        await connection.execute(`DELETE FROM faculty_publications WHERE employee_id = ?`, [employeeId]);
        
        for (const pub of publications) {
          if (pub.title && pub.title.trim()) {
            await connection.execute(`
              INSERT INTO faculty_publications (
                employee_id, title, journal_name, publication_year, 
                publication_details, doi, publication_type
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [employeeId, pub.title.trim(), pub.journal_name || null, 
                pub.publication_year || null, pub.publication_details || null, 
                pub.doi || null, pub.publication_type || 'journal']);
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
