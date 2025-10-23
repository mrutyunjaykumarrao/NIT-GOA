const express = require('express');
const {
  getFacultyForCards,
  getFacultyCardsByDepartment,
  getTechnicalStaffForCards,
  getAdministrativeStaffForCards,
  getAllDepartments,
  getCourses,
  getResearchAreas,
  getVisitorCount,
  formatSuccessResponse,
  formatErrorResponse
} = require('../utils/apiHelpers');

const router = express.Router();

/**
 * PUBLIC DISPLAY APIs
 * These endpoints provide data for public-facing components like people section cards
 * No authentication required - only returns public/active data
 */

// ======================
// PEOPLE SECTION CARDS APIs
// ======================

// GET /api/public/people/faculty - Get all faculty for display cards
router.get('/people/faculty', async (req, res) => {
  try {
    const faculty = await getFacultyForCards();
    res.json(formatSuccessResponse(faculty));
  } catch (error) {
    console.error('Get faculty cards error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// GET /api/public/people/faculty/:departmentCode - Get faculty by department for display cards
router.get('/people/faculty/:departmentCode', async (req, res) => {
  try {
    const { departmentCode } = req.params;
    const faculty = await getFacultyCardsByDepartment(departmentCode);
    
    if (faculty.length === 0) {
      return res.status(404).json(formatErrorResponse('No faculty found for this department', 404));
    }
    
    res.json(formatSuccessResponse(faculty));
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// GET /api/public/people/technical-staff - Get all technical staff for display cards
router.get('/people/technical-staff', async (req, res) => {
  try {
    const staff = await getTechnicalStaffForCards();
    res.json(formatSuccessResponse(staff));
  } catch (error) {
    console.error('Get technical staff cards error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// GET /api/public/people/administrative-staff - Get all administrative staff for display cards
router.get('/people/administrative-staff', async (req, res) => {
  try {
    const staff = await getAdministrativeStaffForCards();
    res.json(formatSuccessResponse(staff));
  } catch (error) {
    console.error('Get administrative staff cards error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// ======================
// COMMON DATA APIs
// ======================

// GET /api/public/departments - Get all active departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await getAllDepartments();
    res.json(formatSuccessResponse(departments));
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// GET /api/public/courses - Get courses with optional filtering
router.get('/courses', async (req, res) => {
  try {
    const { search = '', department = '', level = '' } = req.query;
    
    const filters = {};
    if (search) filters.search = search;
    if (department) filters.department = department;
    if (level) filters.level = level;
    
    const courses = await getCourses(filters);
    res.json(formatSuccessResponse(courses));
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// GET /api/public/research-areas - Get all research areas
router.get('/research-areas', async (req, res) => {
  try {
    const researchAreas = await getResearchAreas();
    res.json(formatSuccessResponse(researchAreas));
  } catch (error) {
    console.error('Get research areas error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// ======================
// ANALYTICS APIs (Public)
// ======================

// GET /api/public/visitor-count - Get total visitor count for footer
router.get('/visitor-count', async (req, res) => {
  try {
    const visitorCount = await getVisitorCount();
    res.json(formatSuccessResponse({ total_visitors: visitorCount }));
  } catch (error) {
    console.error('Get visitor count error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

module.exports = router;