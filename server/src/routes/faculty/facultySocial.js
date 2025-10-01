const express = require('express');
const mysql = require('mysql2/promise');
const { executeQuery } = require('../../config/database');

const router = express.Router();

// Import shared middleware from facultyCore
const { authenticateToken, checkEditPermission } = require('./facultyCore');

// GET /api/faculty/:employeeCode/social-links - Get social links
router.get('/:employeeCode/social-links', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const query = `
      SELECT 
        linkedin_url,
        personal_website_url,
        google_scholar_url,
        orcid_id,
        scopus_id,
        research_gate_url,
        other_social_links
      FROM faculty_profiles
      WHERE employee_code = ?
    `;

    const [result] = await executeQuery(query, [employeeCode]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }

    const faculty = result[0];

    // Parse other_social_links if it's JSON
    let otherSocialLinks = [];
    if (faculty.other_social_links) {
      try {
        otherSocialLinks = JSON.parse(faculty.other_social_links);
      } catch (parseError) {
        console.warn('Failed to parse other_social_links as JSON:', parseError);
        otherSocialLinks = [];
      }
    }

    const socialLinks = {
      linkedin_url: faculty.linkedin_url,
      personal_website_url: faculty.personal_website_url,
      google_scholar_url: faculty.google_scholar_url,
      orcid_id: faculty.orcid_id,
      scopus_id: faculty.scopus_id,
      research_gate_url: faculty.research_gate_url,
      other_social_links: otherSocialLinks
    };

    res.json(socialLinks);
  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

// PUT /api/faculty/:employeeCode/social-links - Update social links
router.put('/:employeeCode/social-links', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const {
      linkedin_url,
      personal_website_url,
      google_scholar_url,
      orcid_id,
      scopus_id,
      research_gate_url,
      other_social_links
    } = req.body;

    // Convert other_social_links to JSON string if it's an array
    let otherSocialLinksJson = null;
    if (Array.isArray(other_social_links)) {
      otherSocialLinksJson = JSON.stringify(other_social_links);
    } else if (typeof other_social_links === 'string') {
      otherSocialLinksJson = other_social_links;
    }

    const updateQuery = `
      UPDATE faculty_profiles 
      SET 
        linkedin_url = ?,
        personal_website_url = ?,
        google_scholar_url = ?,
        orcid_id = ?,
        scopus_id = ?,
        research_gate_url = ?,
        other_social_links = ?,
        updated_at = NOW()
      WHERE employee_code = ?
    `;

    const result = await executeQuery(updateQuery, [
      linkedin_url || null,
      personal_website_url || null,
      google_scholar_url || null,
      orcid_id || null,
      scopus_id || null,
      research_gate_url || null,
      otherSocialLinksJson,
      employeeCode
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }

    res.json({
      message: 'Social links updated successfully',
      employee_code: employeeCode
    });

  } catch (error) {
    console.error('Update social links error:', error);
    res.status(500).json({ error: 'Failed to update social links' });
  }
});

// GET /api/faculty/:employeeCode/professional-memberships - Get professional memberships (future implementation)
router.get('/:employeeCode/professional-memberships', async (req, res) => {
  try {
    const { employeeCode } = req.params;

    // This will be implemented when professional memberships are added
    // Expected structure: organization name, role/position, start_date, end_date, status
    
    res.status(501).json({ 
      message: 'Professional memberships not yet implemented',
      employee_code: employeeCode,
      planned_structure: {
        memberships: [
          {
            organization: "IEEE",
            role: "Member",
            start_date: "2020-01-01",
            end_date: null,
            status: "active",
            membership_id: "123456",
            website: "https://ieee.org"
          }
        ]
      }
    });

  } catch (error) {
    console.error('Get professional memberships error:', error);
    res.status(500).json({ error: 'Failed to fetch professional memberships' });
  }
});

// PUT /api/faculty/:employeeCode/professional-memberships - Update professional memberships (future implementation)
router.put('/:employeeCode/professional-memberships', authenticateToken, checkEditPermission, async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const { memberships } = req.body;

    // This will be implemented when professional memberships table is created
    /*
    CREATE TABLE faculty_professional_memberships (
      membership_id INT PRIMARY KEY AUTO_INCREMENT,
      employee_code VARCHAR(50) NOT NULL,
      organization_name VARCHAR(255) NOT NULL,
      role_title VARCHAR(100),
      start_date DATE,
      end_date DATE,
      status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
      membership_number VARCHAR(100),
      website_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_code) REFERENCES employees(employee_code)
    );
    */

    res.status(501).json({ 
      message: 'Professional memberships management not yet implemented',
      employee_code: employeeCode 
    });

  } catch (error) {
    console.error('Update professional memberships error:', error);
    res.status(500).json({ error: 'Failed to update professional memberships' });
  }
});


module.exports = router;