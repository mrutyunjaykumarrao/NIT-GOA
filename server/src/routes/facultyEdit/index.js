const express = require('express');
const router = express.Router();

/**
 * FACULTY EDIT ROUTES INDEX
 * Mounts all section-specific edit routes
 * All routes require authentication and proper permissions
 */

// Mount section-specific routes
router.use('/', require('./profile'));
router.use('/', require('./education'));
router.use('/', require('./researchAreas'));
router.use('/', require('./publications'));
router.use('/', require('./researchGuidance'));
router.use('/', require('./trainingAttended'));
router.use('/', require('./trainingConducted'));
router.use('/', require('./memberships'));
router.use('/', require('./coursesTaught'));
router.use('/', require('./customSections'));

module.exports = router;
