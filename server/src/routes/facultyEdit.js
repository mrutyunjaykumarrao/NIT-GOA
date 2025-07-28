const express = require('express');
const router = express.Router();
const { authenticateToken, requireFacultyOrAdmin } = require('../middleware/auth');
const validateFacultyUpdate = require('../middleware/validateFacultyUpdate');
const {
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
} = require('../controllers/facultyEditController');

// All routes require authentication
router.use(authenticateToken);

// Basic faculty profile update
router.put('/faculty/:id/profile', requireFacultyOrAdmin, validateFacultyUpdate, updateFacultyProfile);

// Academic Information routes
router.post('/faculty/:facultyId/academic-info', requireFacultyOrAdmin, addAcademicInfo);
router.put('/academic-info/:id', requireFacultyOrAdmin, updateAcademicInfo);
router.delete('/academic-info/:id', requireFacultyOrAdmin, deleteAcademicInfo);

// Publications routes
router.post('/faculty/:facultyId/publications', requireFacultyOrAdmin, addPublication);
router.put('/publications/:id', requireFacultyOrAdmin, updatePublication);
router.delete('/publications/:id', requireFacultyOrAdmin, deletePublication);

// Awards routes
router.post('/faculty/:facultyId/awards', requireFacultyOrAdmin, addAward);
router.put('/awards/:id', requireFacultyOrAdmin, updateAward);
router.delete('/awards/:id', requireFacultyOrAdmin, deleteAward);

// Funded Projects routes
router.post('/faculty/:facultyId/funded-projects', requireFacultyOrAdmin, addFundedProject);
router.put('/funded-projects/:id', requireFacultyOrAdmin, updateFundedProject);
router.delete('/funded-projects/:id', requireFacultyOrAdmin, deleteFundedProject);

// Research Guidance routes
router.post('/faculty/:facultyId/research-guidance', requireFacultyOrAdmin, addResearchGuidance);
router.put('/research-guidance/:id', requireFacultyOrAdmin, updateResearchGuidance);
router.delete('/research-guidance/:id', requireFacultyOrAdmin, deleteResearchGuidance);

// Courses Taught routes
router.post('/faculty/:facultyId/courses-taught', requireFacultyOrAdmin, addCourseTaught);
router.put('/courses-taught/:id', requireFacultyOrAdmin, updateCourseTaught);
router.delete('/courses-taught/:id', requireFacultyOrAdmin, deleteCourseTaught);

// Memberships routes
router.post('/faculty/:facultyId/memberships', requireFacultyOrAdmin, addMembership);
router.put('/memberships/:id', requireFacultyOrAdmin, updateMembership);
router.delete('/memberships/:id', requireFacultyOrAdmin, deleteMembership);

// Professional Services routes
router.post('/faculty/:facultyId/professional-services', requireFacultyOrAdmin, addProfessionalService);
router.put('/professional-services/:id', requireFacultyOrAdmin, updateProfessionalService);
router.delete('/professional-services/:id', requireFacultyOrAdmin, deleteProfessionalService);

// Courses Attended routes
router.post('/faculty/:facultyId/courses-attended', requireFacultyOrAdmin, addCourseAttended);
router.put('/courses-attended/:id', requireFacultyOrAdmin, updateCourseAttended);
router.delete('/courses-attended/:id', requireFacultyOrAdmin, deleteCourseAttended);

// Courses Conducted routes
router.post('/faculty/:facultyId/courses-conducted', requireFacultyOrAdmin, addCourseConducted);
router.put('/courses-conducted/:id', requireFacultyOrAdmin, updateCourseConducted);
router.delete('/courses-conducted/:id', requireFacultyOrAdmin, deleteCourseConducted);

module.exports = router;
