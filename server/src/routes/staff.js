const express = require('express');
const router = express.Router();
const { 
  getAllAdministrativeStaff, 
  getAllTechnicalStaff, 
  getTechnicalStaffByDepartment 
} = require('../controllers/staffController');

// Public routes for staff data
router.get('/administrative', getAllAdministrativeStaff);
router.get('/technical', getAllTechnicalStaff);
router.get('/technical/department/:department', getTechnicalStaffByDepartment);

module.exports = router;
