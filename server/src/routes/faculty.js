const express = require('express');
const router = express.Router();
const { authenticateToken, requireFacultyOrAdmin } = require('../middleware/auth');
const { 
  getAllFaculty, 
  getFacultyById, 
  getDetailedFacultyById,
  getFacultyByDepartment, 
  updateFacultyProfile,
  getMyProfile 
} = require('../controllers/facultyController');

// Public routes
router.get('/', getAllFaculty);
router.get('/department/:department', getFacultyByDepartment);
router.get('/:id/details', getDetailedFacultyById);
router.get('/:id', getFacultyById);

// Protected routes
router.use(authenticateToken);
router.get('/me/profile', getMyProfile);
router.put('/:id', requireFacultyOrAdmin, updateFacultyProfile);

module.exports = router;
