const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { login, changePassword, getProfile, forgotPassword } = require('../controllers/authController');

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.use(authenticateToken);
router.post('/change-password', changePassword);
router.get('/profile', getProfile);

module.exports = router;
