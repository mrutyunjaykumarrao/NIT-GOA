const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  getAllFacultyAdmin,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAllUsers,
  createUser,
  resetUserPassword
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Faculty management routes
router.get('/faculty', getAllFacultyAdmin);
router.post('/faculty', createFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.post('/users/:id/reset-password', resetUserPassword);

module.exports = router;
