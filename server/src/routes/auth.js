const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user account with employee details
    const [users] = await executeQuery(`
      SELECT 
        ua.user_id as id,
        ua.username,
        ua.password_hash,
        ua.access_level as role,
        ua.is_active,
        ua.failed_login_attempts,
        ua.locked_until
      FROM user_accounts ua
      WHERE ua.username = ? AND ua.is_active = 1
    `, [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ 
        error: 'Account is temporarily locked due to too many failed attempts',
        lockedUntil: user.locked_until
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      // Increment failed login attempts
      await executeQuery(`
        UPDATE user_accounts 
        SET 
          failed_login_attempts = failed_login_attempts + 1,
          locked_until = CASE 
            WHEN failed_login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 30 MINUTE)
            ELSE NULL
          END
        WHERE user_id = ?
      `, [user.id]);

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset failed login attempts on successful login
    await executeQuery(`
      UPDATE user_accounts 
      SET 
        failed_login_attempts = 0,
        locked_until = NULL,
        last_login = NOW()
      WHERE user_id = ?
    `, [user.id]);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Log successful login (simplified for now)
    try {
      await executeQuery(`
        INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'user_accounts', 
        user.id, 
        'UPDATE', 
        JSON.stringify({ username, action: 'login' }), 
        user.id,
        req.ip || req.connection.remoteAddress
      ]);
    } catch (auditError) {
      console.error('Audit log failed:', auditError.message);
    }

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate JWT token
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    res.json({ 
      valid: true, 
      user: {
        userId: req.user.userId,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    const [users] = await executeQuery(`
      SELECT 
        ua.user_id as id,
        ua.username,
        ua.access_level as role,
        ua.is_active
      FROM user_accounts ua
      WHERE ua.user_id = ? AND ua.is_active = 1
    `, [decoded.userId]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get current password hash
    const [users] = await executeQuery(
      'SELECT password_hash FROM user_accounts WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await executeQuery(
      'UPDATE user_accounts SET password_hash = ?, password_changed_at = NOW() WHERE id = ?',
      [newPasswordHash, req.user.userId]
    );

    // Log password change
    await executeQuery(`
      INSERT INTO audit_log (user_id, action, entity_type, details)
      VALUES (?, 'password_change', 'authentication', ?)
    `, [req.user.userId, JSON.stringify({ ip: req.ip })]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint (for logging purposes)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log logout
    await executeQuery(`
      INSERT INTO audit_log (user_id, action, entity_type, details)
      VALUES (?, 'logout', 'authentication', ?)
    `, [req.user.userId, JSON.stringify({ ip: req.ip })]);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
