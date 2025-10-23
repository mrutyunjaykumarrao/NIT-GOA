const express = require('express');
const {
  getFacultyDetails,
  formatSuccessResponse,
  formatErrorResponse,
  formatFacultyProfile
} = require('../utils/apiHelpers');

const router = express.Router();

/**
 * FACULTY DETAILS APIs
 * These endpoints handle faculty detail page functionality - both viewing and editing
 * Some endpoints require authentication for editing capabilities
 */

// ======================
// FACULTY DETAIL VIEW APIs (Public)
// ======================

// GET /api/faculty-details/:employeeCode - Get comprehensive faculty details for detail page
router.get('/:employeeCode', async (req, res) => {
  try {
    const { employeeCode } = req.params;
    
    const facultyData = await getFacultyDetails(employeeCode);
    
    if (!facultyData) {
      return res.status(404).json(formatErrorResponse('Faculty not found', 404));
    }
    
    // Format the data for the faculty detail page structure
    const formattedProfile = formatFacultyProfile(facultyData);
    
    res.json(formatSuccessResponse(formattedProfile));
  } catch (error) {
    console.error('Get faculty details error:', error);
    res.status(500).json(formatErrorResponse(error));
  }
});

// ======================
// FACULTY EDIT APIs (Authenticated)
// ======================

// Note: Faculty edit functionality should be implemented in a separate secure route
// with proper authentication middleware. For now, we'll keep the structure simple.

module.exports = router;