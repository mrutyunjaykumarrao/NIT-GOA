const { pool } = require('../config/database');

// Get all faculty (public)
const getAllFaculty = async (req, res) => {
  try {
    const { department } = req.query;
    
    let query = `
      SELECT id, faculty_id, first_name, last_name, full_name, email, phone, 
             department, designation, profile_image, is_hod, display_order, is_active
      FROM faculty_profiles_short 
      WHERE is_active = 1
    `;
    
    const params = [];
    
    if (department) {
      query += ' AND department LIKE ?';
      params.push(`%${department}%`);
    }
    
    query += ' ORDER BY department, display_order, full_name';
    
    const [faculty] = await pool.execute(query, params);
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single faculty by ID (public)
const getFacultyById = async (req, res) => {
  try {
    const [faculty] = await pool.execute(
      'SELECT * FROM faculty_profiles_short WHERE id = ? AND is_active = 1',
      [req.params.id]
    );
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.json(faculty[0]);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get detailed faculty information by faculty_id or slug (public)
const getDetailedFacultyById = async (req, res) => {
  try {
    const facultyIdentifier = req.params.id;
    let faculty;
    
    // Check if the identifier is numeric (faculty_id) or a slug
    if (/^\d+$/.test(facultyIdentifier)) {
      // It's a numeric faculty_id
      [faculty] = await pool.execute(
        'SELECT * FROM faculty_profiles WHERE faculty_id = ? AND is_active = 1',
        [facultyIdentifier]
      );
    } else {
      // It's a slug, need to generate and match against faculty names
      [faculty] = await pool.execute(
        `SELECT * FROM faculty_profiles 
         WHERE LOWER(REGEXP_REPLACE(REPLACE(REPLACE(full_name, 'Dr. ', ''), 'Dr.', ''), '[^A-Za-z0-9 ]', '')) = ? 
         AND is_active = 1`,
        [facultyIdentifier.toLowerCase().replace(/-/g, ' ')]
      );
      
      // If not found, try the simple replacement method as fallback
      if (faculty.length === 0) {
        [faculty] = await pool.execute(
          `SELECT * FROM faculty_profiles 
           WHERE LOWER(REPLACE(REPLACE(REPLACE(full_name, 'Dr. ', ''), 'Dr.', ''), ' ', '-')) = ? 
           AND is_active = 1`,
          [facultyIdentifier.toLowerCase()]
        );
      }
    }
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    const facultyProfile = faculty[0];
    const facultyId = facultyProfile.faculty_id;
    
    // Get related data in parallel using faculty_id
    const [
      [publications],
      [academicInfo],
      [awards],
      [fundedProjects],
      [researchGuidance],
      [memberships],
      [professionalServices],
      [coursesAttended],
      [coursesConducted],
      [coursesTaught]
    ] = await Promise.all([
      pool.execute('SELECT * FROM faculty_publications WHERE faculty_id = ? ORDER BY publication_year DESC', [facultyId]),
      pool.execute('SELECT * FROM faculty_academic_info WHERE faculty_id = ? ORDER BY year DESC', [facultyId]),
      pool.execute('SELECT * FROM faculty_awards WHERE faculty_id = ? ORDER BY award_year DESC', [facultyId]),
      pool.execute('SELECT * FROM faculty_funded_projects WHERE faculty_id = ?', [facultyId]),
      pool.execute('SELECT * FROM faculty_research_guidance WHERE faculty_id = ? ORDER BY completion_year DESC', [facultyId]),
      pool.execute('SELECT * FROM faculty_memberships WHERE faculty_id = ?', [facultyId]),
      pool.execute('SELECT * FROM faculty_professional_services WHERE faculty_id = ?', [facultyId]),
      pool.execute('SELECT * FROM faculty_courses_attended WHERE faculty_id = ? ORDER BY year DESC', [facultyId]),
      pool.execute('SELECT * FROM faculty_courses_conducted WHERE faculty_id = ? ORDER BY year DESC', [facultyId]),
      pool.execute('SELECT * FROM faculty_courses_taught WHERE faculty_id = ?', [facultyId])
    ]);
    
    // Generate slug from name
    const generateSlug = (name) => {
      return name.toLowerCase()
        .replace(/^dr\.?\s*/i, '') // Remove "Dr." prefix
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
    };
    
    // Structure the response to match the expected format from the frontend
    const detailedProfile = {
      profile: {
        id: facultyProfile.id,
        faculty_id: facultyProfile.faculty_id,
        employee_id: facultyProfile.employee_id,
        slug: generateSlug(facultyProfile.full_name),
        name: facultyProfile.full_name,
        first_name: facultyProfile.first_name,
        last_name: facultyProfile.last_name,
        email: facultyProfile.email,
        phone: facultyProfile.phone,
        department: facultyProfile.department,
        designation: facultyProfile.designation,
        profile_image: facultyProfile.profile_image,
        research_areas: facultyProfile.research_areas,
        researchAreaSummary: facultyProfile.research_areas ? 
          facultyProfile.research_areas.split(',').map(area => area.trim()) : []
      },
      personalInformation: {
        name: facultyProfile.full_name,
        gender: facultyProfile.gender,
        birthDate: facultyProfile.date_of_birth ? facultyProfile.date_of_birth.toISOString().split('T')[0] : null,
        dateOfJoining: facultyProfile.date_of_joining ? facultyProfile.date_of_joining.toISOString().split('T')[0] : null,
        experience: facultyProfile.experience_description || `${facultyProfile.experience_years || 0} years of experience`
      },
      contactInformation: {
        email: facultyProfile.email,
        phoneMobile: facultyProfile.mobile || facultyProfile.phone,
        address: facultyProfile.address
      },
      academicInformation: academicInfo.map(info => ({
        degree: info.degree,
        institute: info.institute,
        subject: info.subject,
        year: info.year
      })),
      publications: {
        journal: publications
          .filter(pub => pub.publication_type === 'journal')
          .map(pub => pub.title || pub.full_citation)
          .filter(title => title), // Remove empty/null titles
        proceedings: publications
          .filter(pub => pub.publication_type === 'conference' || pub.publication_type === 'proceedings')
          .map(pub => pub.title || pub.full_citation)
          .filter(title => title),
        bookChapters: publications
          .filter(pub => pub.publication_type === 'chapter' || pub.publication_type === 'book_chapter')
          .map(pub => pub.title || pub.full_citation)
          .filter(title => title),
        booksAuthored: publications
          .filter(pub => pub.publication_type === 'book')
          .map(pub => pub.title || pub.full_citation)
          .filter(title => title)
      },
      awardsAndHonors: awards.map(award => award.award_title || award.title),
      fundedProjects: fundedProjects.map(project => project.project_title || project.title),
      researchGuidance: researchGuidance.map(guidance => guidance.student_name || guidance.student_details),
      memberships: memberships.map(membership => membership.society_name || membership.organization),
      professionalServices: professionalServices.map(service => service.service_type || service.service_details),
      coursesAttended: coursesAttended.map(course => ({
        info: course.course_details || course.course_name
      })),
      coursesConducted: coursesConducted.map(course => ({
        info: course.course_details || course.course_name
      })),
      coursesTaught: {
        ug: coursesTaught.filter(course => course.level === 'UG' || course.level === 'Undergraduate').map(course => course.course_name),
        pg: coursesTaught.filter(course => course.level === 'PG' || course.level === 'Postgraduate').map(course => course.course_name)
      }
    };
    
    res.json(detailedProfile);
  } catch (error) {
    console.error('Get detailed faculty error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get faculty by department (public)
const getFacultyByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const [faculty] = await pool.execute(
      `SELECT id, employee_id, full_name, email, phone, department, designation, 
              research_areas, profile_image, is_hod, display_order
       FROM faculty_profiles 
       WHERE department = ? AND is_active = 1 
       ORDER BY display_order, full_name`,
      [department.toUpperCase()]
    );
    
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update faculty profile (faculty or admin)
const updateFacultyProfile = async (req, res) => {
  try {
    const facultyId = parseInt(req.params.id);
    
    // Check if user can edit this profile
    if (req.user.role !== 'admin') {
      // For faculty users, find their profile ID via user_id
      const [userFaculty] = await pool.execute(
        'SELECT id FROM faculty_profiles WHERE user_id = ?',
        [req.user.id]
      );
      
      if (userFaculty.length === 0 || userFaculty[0].id !== facultyId) {
        return res.status(403).json({ error: 'You can only edit your own profile' });
      }
    }

    const updateData = { ...req.body };
    
    // Remove empty fields and unwanted fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === null || 
          ['id', 'user_id', 'created_at', 'updated_at'].includes(key)) {
        delete updateData[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(facultyId);

    await pool.execute(
      `UPDATE faculty_profiles SET ${setClause} WHERE id = ?`,
      values
    );

    // Get updated faculty data
    const [faculty] = await pool.execute(
      'SELECT * FROM faculty_profiles WHERE id = ?',
      [facultyId]
    );

    res.json(faculty[0]);
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get faculty profile for current user
const getMyProfile = async (req, res) => {
  try {
    const [faculty] = await pool.execute(
      'SELECT * FROM faculty_profiles WHERE user_id = ?',
      [req.user.id]
    );
    
    if (faculty.length === 0) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }
    
    res.json(faculty[0]);
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  getDetailedFacultyById,
  getFacultyByDepartment,
  updateFacultyProfile,
  getMyProfile
};
