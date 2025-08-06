const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

// Database connection function
async function getDbConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mrutyu@2026',
    database: 'updated_nitgoa'
  });
}

// Get comprehensive faculty details with all related data
router.get('/:slug/details', async (req, res) => {
  try {
    const { slug } = req.params;
    const connection = await getDbConnection();
    
    // The slug should be the employee_code
    const facultyId = slug;
    
    // Get basic faculty information
    const [facultyBasic] = await connection.execute(`
      SELECT 
        e.employee_id as faculty_id,
        e.employee_code,
        e.full_name,
        e.honorific,
        e.email,
        e.phone_mobile,
        e.extension_no as phone,
        e.job_title as designation,
        e.employment_status,
        e.image_url as profile_image,
        e.is_hod,
        e.display_order,
        e.date_of_joining,
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
        d.department_name,
        d.department_code,
        fp.bio_summary,
        fp.research_interests
      FROM employees e
      LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id
      LEFT JOIN departments d ON fp.department_id = d.department_id
      WHERE e.employee_code = ? AND e.is_active = 1 AND e.role = 'Faculty'
    `, [facultyId]);
    
    if (facultyBasic.length === 0) {
      await connection.end();
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    const faculty = facultyBasic[0];
    
    // Get faculty publications
    const [publications] = await connection.execute(`
      SELECT 
        fp.publication_id,
        fp.title,
        fp.publication_details,
        fp.journal_name,
        fp.publication_year,
        fp.publication_month,
        fp.publication_type,
        fp.doi,
        fp.impact_factor,
        fp.volume,
        fp.issue,
        fp.pages
      FROM faculty_publications fp
      WHERE fp.employee_id = ? 
      ORDER BY fp.publication_year DESC, fp.title ASC
    `, [faculty.faculty_id]);
    
    // Get faculty education/academic background
    const [education] = await connection.execute(`
      SELECT 
        fe.degree,
        fe.institute,
        fe.subject,
        fe.completion_year as year,
        fe.grade_percentage
      FROM faculty_education fe
      WHERE fe.employee_id = ?
      ORDER BY fe.completion_year DESC
    `, [faculty.faculty_id]);
    
    // Get research areas
    const [researchAreas] = await connection.execute(`
      SELECT 
        ra.area_name
      FROM faculty_research_areas fra
      JOIN research_areas ra ON fra.area_id = ra.area_id
      WHERE fra.employee_id = ?
    `, [faculty.faculty_id]);
    
    await connection.end();
    
    // Structure the response data
    const profileData = {
      profile: {
        faculty_id: faculty.faculty_id,
        name: faculty.honorific ? `${faculty.honorific} ${faculty.full_name}` : faculty.full_name,
        designation: faculty.designation,
        department: faculty.department_name,
        email: faculty.email,
        profile_image: faculty.profile_image,
        researchAreaSummary: faculty.research_interests ? 
          (Array.isArray(faculty.research_interests) ? faculty.research_interests : 
           JSON.parse(faculty.research_interests || '[]')) : []
      },
      personalInformation: {
        name: faculty.honorific ? `${faculty.honorific} ${faculty.full_name}` : faculty.full_name,
        gender: faculty.gender,
        birthDate: faculty.date_of_birth,
        designation: faculty.designation,
        department: faculty.department_name,
        dateOfJoining: faculty.date_of_joining,
        experience: faculty.research_teaching_experience
      },
      contactInformation: {
        email: faculty.email,
        phoneMobile: faculty.phone_mobile,
        address: faculty.address,
        officeLocation: faculty.office_location,
        officeHours: faculty.office_hours
      },
      // Only include sections that have data
      ...(education.length > 0 && {
        academicInformation: education
      }),
      ...(publications.length > 0 && {
        publications: {
          journal: publications.filter(p => p.publication_type === 'Journal Paper'),
          proceedings: publications.filter(p => p.publication_type === 'Conference Proceeding'),
          bookChapters: publications.filter(p => p.publication_type === 'Book Chapter'),
          booksAuthored: publications.filter(p => p.publication_type === 'Book Authored')
        }
      }),
      // Add bio/specialization if available
      ...(faculty.bio_summary && {
        biography: faculty.bio_summary
      }),
      // Research areas from the dedicated table
      ...(researchAreas.length > 0 && {
        researchAreas: researchAreas.map(ra => ra.area_name)
      }),
      // Social links
      socialLinks: {
        ...(faculty.linkedin_url && { linkedin: faculty.linkedin_url }),
        ...(faculty.personal_website_url && { website: faculty.personal_website_url }),
        ...(faculty.google_scholar_url && { googleScholar: faculty.google_scholar_url }),
        ...(faculty.orcid_id && { orcid: faculty.orcid_id }),
        ...(faculty.research_gate_url && { researchGate: faculty.research_gate_url })
      }
    };
    
    res.json(profileData);
  } catch (error) {
    console.error('Get comprehensive faculty details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
