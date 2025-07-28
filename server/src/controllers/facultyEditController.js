const { pool } = require('../config/database');

// Update basic faculty profile information
const updateFacultyProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Prepare the SQL query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];

    // List of allowed fields for update
    const allowedFields = [
      'full_name', 'first_name', 'last_name', 'designation', 'department', 
      'qualification', 'specialization', 'bio', 'experience_years', 
      'experience_description', 'date_of_joining', 'date_of_birth', 'gender',
      'email', 'phone', 'mobile', 'office_location', 'address', 
      'personal_website', 'linkedin_url', 'google_scholar_url', 
      'researchgate_url', 'orcid_url', 'research_areas'
    ];

    // Build the update query dynamically
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key] || null);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields provided for update'
      });
    }

    // Add the faculty ID to the values array
    updateValues.push(id);

    // Construct and execute the update query
    const updateQuery = `
      UPDATE faculty_profiles 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE faculty_id = ?
    `;

    await pool.execute(updateQuery, updateValues);

    // Fetch the updated faculty data to return
    const [rows] = await pool.execute(
      'SELECT * FROM faculty_profiles WHERE faculty_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }

    res.json({
      success: true,
      message: 'Faculty profile updated successfully',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error updating faculty profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update faculty profile'
    });
  }
};

// Academic Information CRUD
const addAcademicInfo = async (req, res) => {
  const { facultyId } = req.params;
  const { degree, institute, year, subject, display_order = 0 } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [facultyId, degree, institute, year, subject, display_order]
    );

    res.json({
      success: true,
      message: 'Academic information added successfully',
      data: { id: result.insertId, faculty_id: facultyId, degree, institute, year, subject, display_order }
    });
  } catch (error) {
    console.error('Error adding academic info:', error);
    res.status(500).json({ success: false, error: 'Failed to add academic information' });
  }
};

const updateAcademicInfo = async (req, res) => {
  const { id } = req.params;
  const { degree, institute, year, subject, display_order } = req.body;

  try {
    await pool.execute(
      'UPDATE faculty_academic_info SET degree = ?, institute = ?, year = ?, subject = ?, display_order = ? WHERE id = ?',
      [degree, institute, year, subject, display_order, id]
    );

    res.json({
      success: true,
      message: 'Academic information updated successfully'
    });
  } catch (error) {
    console.error('Error updating academic info:', error);
    res.status(500).json({ success: false, error: 'Failed to update academic information' });
  }
};

const deleteAcademicInfo = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_academic_info WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Academic information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting academic info:', error);
    res.status(500).json({ success: false, error: 'Failed to delete academic information' });
  }
};

// Publications CRUD
const addPublication = async (req, res) => {
  const { facultyId } = req.params;
  const {
    title, authors, publication_type, journal_name, conference_name,
    volume, issue, pages, publication_year, publication_month,
    doi, isbn, publisher, full_citation, impact_factor, indexing_info
  } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO faculty_publications 
       (faculty_id, title, authors, publication_type, journal_name, conference_name,
        volume, issue, pages, publication_year, publication_month, doi, isbn, 
        publisher, full_citation, impact_factor, indexing_info) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [facultyId, title, authors, publication_type, journal_name, conference_name,
       volume, issue, pages, publication_year, publication_month, doi, isbn,
       publisher, full_citation, impact_factor, indexing_info]
    );

    res.json({
      success: true,
      message: 'Publication added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding publication:', error);
    res.status(500).json({ success: false, error: 'Failed to add publication' });
  }
};

const updatePublication = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'title', 'authors', 'publication_type', 'journal_name', 'conference_name',
      'volume', 'issue', 'pages', 'publication_year', 'publication_month',
      'doi', 'isbn', 'publisher', 'full_citation', 'impact_factor', 'indexing_info'
    ];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key] || null);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields provided for update' });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE faculty_publications SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Publication updated successfully'
    });
  } catch (error) {
    console.error('Error updating publication:', error);
    res.status(500).json({ success: false, error: 'Failed to update publication' });
  }
};

const deletePublication = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_publications WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Publication deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ success: false, error: 'Failed to delete publication' });
  }
};

// Awards CRUD
const addAward = async (req, res) => {
  const { facultyId } = req.params;
  const { award_title, awarded_by, award_year, award_month, award_type, description } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_awards (faculty_id, award_title, awarded_by, award_year, award_month, award_type, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [facultyId, award_title, awarded_by, award_year, award_month, award_type, description]
    );

    res.json({
      success: true,
      message: 'Award added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding award:', error);
    res.status(500).json({ success: false, error: 'Failed to add award' });
  }
};

const updateAward = async (req, res) => {
  const { id } = req.params;
  const { award_title, awarded_by, award_year, award_month, award_type, description } = req.body;

  try {
    await pool.execute(
      'UPDATE faculty_awards SET award_title = ?, awarded_by = ?, award_year = ?, award_month = ?, award_type = ?, description = ? WHERE id = ?',
      [award_title, awarded_by, award_year, award_month, award_type, description, id]
    );

    res.json({
      success: true,
      message: 'Award updated successfully'
    });
  } catch (error) {
    console.error('Error updating award:', error);
    res.status(500).json({ success: false, error: 'Failed to update award' });
  }
};

const deleteAward = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_awards WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Award deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({ success: false, error: 'Failed to delete award' });
  }
};

// Funded Projects CRUD
const addFundedProject = async (req, res) => {
  const { facultyId } = req.params;
  const {
    project_title, funding_agency, principal_investigator, co_investigators,
    amount, duration, start_date, end_date, status, description
  } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO faculty_funded_projects 
       (faculty_id, project_title, funding_agency, principal_investigator, co_investigators,
        amount, duration, start_date, end_date, status, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [facultyId, project_title, funding_agency, principal_investigator, co_investigators,
       amount, duration, start_date, end_date, status, description]
    );

    res.json({
      success: true,
      message: 'Funded project added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding funded project:', error);
    res.status(500).json({ success: false, error: 'Failed to add funded project' });
  }
};

const updateFundedProject = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'project_title', 'funding_agency', 'principal_investigator', 'co_investigators',
      'amount', 'duration', 'start_date', 'end_date', 'status', 'description'
    ];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key] || null);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields provided for update' });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE faculty_funded_projects SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Funded project updated successfully'
    });
  } catch (error) {
    console.error('Error updating funded project:', error);
    res.status(500).json({ success: false, error: 'Failed to update funded project' });
  }
};

const deleteFundedProject = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_funded_projects WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Funded project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting funded project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete funded project' });
  }
};

// Research Guidance CRUD
const addResearchGuidance = async (req, res) => {
  const { facultyId } = req.params;
  const { student_name, research_topic, guidance_type, status, start_year, completion_year } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_research_guidance (faculty_id, student_name, research_topic, guidance_type, status, start_year, completion_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [facultyId, student_name, research_topic, guidance_type, status, start_year, completion_year]
    );

    res.json({
      success: true,
      message: 'Research guidance added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding research guidance:', error);
    res.status(500).json({ success: false, error: 'Failed to add research guidance' });
  }
};

const updateResearchGuidance = async (req, res) => {
  const { id } = req.params;
  const { student_name, research_topic, guidance_type, status, start_year, completion_year } = req.body;

  try {
    await pool.execute(
      'UPDATE faculty_research_guidance SET student_name = ?, research_topic = ?, guidance_type = ?, status = ?, start_year = ?, completion_year = ? WHERE id = ?',
      [student_name, research_topic, guidance_type, status, start_year, completion_year, id]
    );

    res.json({
      success: true,
      message: 'Research guidance updated successfully'
    });
  } catch (error) {
    console.error('Error updating research guidance:', error);
    res.status(500).json({ success: false, error: 'Failed to update research guidance' });
  }
};

const deleteResearchGuidance = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_research_guidance WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Research guidance deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting research guidance:', error);
    res.status(500).json({ success: false, error: 'Failed to delete research guidance' });
  }
};

// Continue with other CRUD operations for courses, memberships, etc.
// Courses Taught CRUD
const addCourseTaught = async (req, res) => {
  const { facultyId } = req.params;
  const { course_name, course_level } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_courses_taught (faculty_id, course_name, course_level) VALUES (?, ?, ?)',
      [facultyId, course_name, course_level]
    );

    res.json({
      success: true,
      message: 'Course taught added successfully',
      data: { id: result.insertId, faculty_id: facultyId, course_name, course_level }
    });
  } catch (error) {
    console.error('Error adding course taught:', error);
    res.status(500).json({ success: false, error: 'Failed to add course taught' });
  }
};

const updateCourseTaught = async (req, res) => {
  const { id } = req.params;
  const { course_name, course_level } = req.body;

  try {
    await pool.execute(
      'UPDATE faculty_courses_taught SET course_name = ?, course_level = ? WHERE id = ?',
      [course_name, course_level, id]
    );

    res.json({
      success: true,
      message: 'Course taught updated successfully'
    });
  } catch (error) {
    console.error('Error updating course taught:', error);
    res.status(500).json({ success: false, error: 'Failed to update course taught' });
  }
};

const deleteCourseTaught = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_courses_taught WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Course taught deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course taught:', error);
    res.status(500).json({ success: false, error: 'Failed to delete course taught' });
  }
};

// Export all functions
module.exports = {
  updateFacultyProfile,
  
  // Academic Info
  addAcademicInfo,
  updateAcademicInfo,
  deleteAcademicInfo,
  
  // Publications
  addPublication,
  updatePublication,
  deletePublication,
  
  // Awards
  addAward,
  updateAward,
  deleteAward,
  
  // Funded Projects
  addFundedProject,
  updateFundedProject,
  deleteFundedProject,
  
  // Research Guidance
  addResearchGuidance,
  updateResearchGuidance,
  deleteResearchGuidance,
  
  // Courses Taught
  addCourseTaught,
  updateCourseTaught,
  deleteCourseTaught
};

// Memberships CRUD
const addMembership = async (req, res) => {
  const { facultyId } = req.params;
  const { organization_name, membership_type, position, start_year, end_year, is_current, description } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_memberships (faculty_id, organization_name, membership_type, position, start_year, end_year, is_current, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [facultyId, organization_name, membership_type, position, start_year, end_year, is_current, description]
    );

    res.json({
      success: true,
      message: 'Membership added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding membership:', error);
    res.status(500).json({ success: false, error: 'Failed to add membership' });
  }
};

const updateMembership = async (req, res) => {
  const { id } = req.params;
  const { organization_name, membership_type, position, start_year, end_year, is_current, description } = req.body;

  try {
    await pool.execute(
      'UPDATE faculty_memberships SET organization_name = ?, membership_type = ?, position = ?, start_year = ?, end_year = ?, is_current = ?, description = ? WHERE id = ?',
      [organization_name, membership_type, position, start_year, end_year, is_current, description, id]
    );

    res.json({
      success: true,
      message: 'Membership updated successfully'
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ success: false, error: 'Failed to update membership' });
  }
};

const deleteMembership = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_memberships WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Membership deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ success: false, error: 'Failed to delete membership' });
  }
};

// Professional Services CRUD
const addProfessionalService = async (req, res) => {
  const { facultyId } = req.params;
  const { service_type, service_details, organization, position, start_date, end_date, is_current } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_professional_services (faculty_id, service_type, service_details, organization, position, start_date, end_date, is_current) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [facultyId, service_type, service_details, organization, position, start_date, end_date, is_current]
    );

    res.json({
      success: true,
      message: 'Professional service added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding professional service:', error);
    res.status(500).json({ success: false, error: 'Failed to add professional service' });
  }
};

const updateProfessionalService = async (req, res) => {
  const { id } = req.params;
  const { service_type, service_details, organization, position, start_date, end_date, is_current } = req.body;

  try {
    await pool.execute(
      'UPDATE faculty_professional_services SET service_type = ?, service_details = ?, organization = ?, position = ?, start_date = ?, end_date = ?, is_current = ? WHERE id = ?',
      [service_type, service_details, organization, position, start_date, end_date, is_current, id]
    );

    res.json({
      success: true,
      message: 'Professional service updated successfully'
    });
  } catch (error) {
    console.error('Error updating professional service:', error);
    res.status(500).json({ success: false, error: 'Failed to update professional service' });
  }
};

const deleteProfessionalService = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_professional_services WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Professional service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting professional service:', error);
    res.status(500).json({ success: false, error: 'Failed to delete professional service' });
  }
};

// Courses Attended CRUD
const addCourseAttended = async (req, res) => {
  const { facultyId } = req.params;
  const { course_title, organizer, location, start_date, end_date, month, year, duration, course_type, description } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_courses_attended (faculty_id, course_title, organizer, location, start_date, end_date, month, year, duration, course_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [facultyId, course_title, organizer, location, start_date, end_date, month, year, duration, course_type, description]
    );

    res.json({
      success: true,
      message: 'Course attended added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding course attended:', error);
    res.status(500).json({ success: false, error: 'Failed to add course attended' });
  }
};

const updateCourseAttended = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'course_title', 'organizer', 'location', 'start_date', 'end_date', 
      'month', 'year', 'duration', 'course_type', 'description'
    ];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key] || null);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields provided for update' });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE faculty_courses_attended SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Course attended updated successfully'
    });
  } catch (error) {
    console.error('Error updating course attended:', error);
    res.status(500).json({ success: false, error: 'Failed to update course attended' });
  }
};

const deleteCourseAttended = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_courses_attended WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Course attended deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course attended:', error);
    res.status(500).json({ success: false, error: 'Failed to delete course attended' });
  }
};

// Courses Conducted CRUD
const addCourseConducted = async (req, res) => {
  const { facultyId } = req.params;
  const { course_title, organizer, location, start_date, end_date, month, year, duration, course_type, description } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO faculty_courses_conducted (faculty_id, course_title, organizer, location, start_date, end_date, month, year, duration, course_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [facultyId, course_title, organizer, location, start_date, end_date, month, year, duration, course_type, description]
    );

    res.json({
      success: true,
      message: 'Course conducted added successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error adding course conducted:', error);
    res.status(500).json({ success: false, error: 'Failed to add course conducted' });
  }
};

const updateCourseConducted = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'course_title', 'organizer', 'location', 'start_date', 'end_date', 
      'month', 'year', 'duration', 'course_type', 'description'
    ];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key] || null);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields provided for update' });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE faculty_courses_conducted SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Course conducted updated successfully'
    });
  } catch (error) {
    console.error('Error updating course conducted:', error);
    res.status(500).json({ success: false, error: 'Failed to update course conducted' });
  }
};

const deleteCourseConducted = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM faculty_courses_conducted WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Course conducted deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course conducted:', error);
    res.status(500).json({ success: false, error: 'Failed to delete course conducted' });
  }
};

// Export all functions
module.exports = {
  updateFacultyProfile,
  
  // Academic Info
  addAcademicInfo,
  updateAcademicInfo,
  deleteAcademicInfo,
  
  // Publications
  addPublication,
  updatePublication,
  deletePublication,
  
  // Awards
  addAward,
  updateAward,
  deleteAward,
  
  // Funded Projects
  addFundedProject,
  updateFundedProject,
  deleteFundedProject,
  
  // Research Guidance
  addResearchGuidance,
  updateResearchGuidance,
  deleteResearchGuidance,
  
  // Courses Taught
  addCourseTaught,
  updateCourseTaught,
  deleteCourseTaught,
  
  // Memberships
  addMembership,
  updateMembership,
  deleteMembership,
  
  // Professional Services
  addProfessionalService,
  updateProfessionalService,
  deleteProfessionalService,
  
  // Courses Attended
  addCourseAttended,
  updateCourseAttended,
  deleteCourseAttended,
  
  // Courses Conducted
  addCourseConducted,
  updateCourseConducted,
  deleteCourseConducted
};
