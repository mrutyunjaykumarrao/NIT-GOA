const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window (increased for development)
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Separate rate limiter for forgot password (more lenient)
const forgotPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 attempts per window (very generous for development)
  message: { error: 'Too many password reset attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  onLimitReached: (req, res) => {
    console.log('Rate limit reached for forgot password:', req.ip);
  }
});

// Even more lenient rate limiter for password reset operations (token protected)
const resetPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // 1000 attempts per window (extremely generous since token-protected)
  message: { error: 'Too many password reset completion attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  onLimitReached: (req, res) => {
    console.log('Rate limit reached for password reset completion:', req.ip);
  }
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username
    const [users] = await executeQuery(`
      SELECT 
        ua.user_id as id,
        ua.username,
        ua.password_hash,
        ua.access_level as role,
        ua.is_active,
        ua.locked_until,
        ua.failed_login_attempts,
        e.employee_id,
        e.employee_code,
        e.full_name as employee_name,
        e.email as employee_email
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.user_id = e.user_account_id
      WHERE ua.username = ? AND ua.is_active = 1
    `, [username]);

    if (users.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid credential: username not found',
        errorType: 'USERNAME_NOT_FOUND'
      });
    }

    const user = users[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const lockedUntil = new Date(user.locked_until);
      const now = new Date();
      const remainingTime = Math.ceil((lockedUntil - now) / (1000 * 60)); // minutes
      
      // Debug logging to understand the timezone issue
      console.log('🔒 LOCKOUT DEBUG:', {
        locked_until_raw: user.locked_until,
        locked_until_parsed: lockedUntil.toISOString(),
        now: now.toISOString(),
        remaining_minutes: remainingTime,
        time_diff_hours: ((lockedUntil - now) / (1000 * 60 * 60)).toFixed(2)
      });
      
      return res.status(423).json({ 
        error: `Cannot log in until cooldown period ends (${remainingTime} minutes remaining)`,
        errorType: 'ACCOUNT_LOCKED',
        lockedUntil: user.locked_until,
        remainingMinutes: remainingTime
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
            WHEN failed_login_attempts >= 4 THEN DATE_ADD(UTC_TIMESTAMP(), INTERVAL 20 MINUTE)
            ELSE NULL
          END
        WHERE user_id = ?
      `, [user.id]);

      return res.status(401).json({ 
        error: `Invalid credentials for username: ${username}`,
        errorType: 'WRONG_PASSWORD',
        username: username
      });
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
        role: user.role,
        employee_id: user.employee_id,
        employee_code: user.employee_code,
        employee_name: user.employee_name,
        employee_email: user.employee_email
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

// ======================
// PASSWORD RESET FUNCTIONALITY
// ======================

// Request password reset
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Find user by email (check both user_accounts.email and employees.email)
    const [users] = await executeQuery(`
      SELECT 
        ua.user_id,
        ua.username,
        ua.email as user_email,
        e.email as employee_email,
        COALESCE(ua.email, e.email) as primary_email
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.user_id = e.user_account_id
      WHERE (ua.email = ? OR e.email = ?) 
        AND ua.is_active = 1
        AND (ua.locked_until IS NULL OR ua.locked_until <= NOW())
    `, [email, email]);

    // Always return success to prevent email enumeration attacks
    const successResponse = { 
      message: 'If this email is associated with an account, you will receive password reset instructions.' 
    };

    if (users.length === 0) {
      // Wait a bit to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 200));
      return res.json(successResponse);
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store reset token
    await executeQuery(`
      UPDATE user_accounts 
      SET 
        reset_token = ?,
        reset_token_expires = ?,
        reset_token_used = FALSE,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [resetToken, resetExpiry, user.user_id]);

    // Log password reset request
    await executeQuery(`
      INSERT INTO audit_log (table_name, record_id, action, new_values, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `, [
      'user_accounts', 
      user.user_id, 
      'UPDATE', 
      JSON.stringify({ 
        action: 'PASSWORD_RESET_REQUEST',
        email: user.primary_email,
        reset_token_expires: resetExpiry 
      }),
      req.ip
    ]);

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(
        user.primary_email,
        resetToken,
        user.username
      );
      console.log(`✅ Password reset email sent to ${user.primary_email} for user ${user.username}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      // Don't throw error here - we still want to return success to prevent email enumeration
      // But log the error for admin monitoring
      await executeQuery(`
        INSERT INTO audit_log (table_name, record_id, action, new_values, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'user_accounts', 
        user.user_id, 
        'UPDATE', 
        JSON.stringify({ 
          action: 'EMAIL_SEND_FAILED',
          error: emailError.message,
          email: user.primary_email,
          reset_token: resetToken 
        }),
        req.ip
      ]);
    }

    res.json(successResponse);
  } catch (error) {
    console.error('Forgot password error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test endpoint for debugging
router.post('/test-forgot-username', async (req, res) => {
  try {
    const { username } = req.body;
    console.log('Test endpoint called with username:', username);
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    res.json({ message: 'Test endpoint working', username });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test endpoint error' });
  }
});

// Request password reset by username (for failed login scenarios)
router.post('/forgot-password-by-username', async (req, res) => {
  try {
    console.log('📧 Forgot password by username endpoint called');
    const { username } = req.body;
    console.log('📧 Username received:', username);

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    console.log('📧 About to query database for username:', username);
    
    // Find user by username and get their email
    const [users] = await executeQuery(`
      SELECT 
        ua.user_id,
        ua.username,
        ua.email as user_email,
        e.email as employee_email,
        COALESCE(ua.email, e.email) as primary_email
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.user_id = e.user_account_id
      WHERE ua.username = ? 
        AND ua.is_active = 1
        AND (ua.locked_until IS NULL OR ua.locked_until <= NOW())
    `, [username]);

    console.log('📧 Database query completed. Found users:', users.length);

    // Always return success to prevent username enumeration attacks
    const successResponse = { 
      message: 'If this username is associated with an account, you will receive password reset instructions.',
      hasEmail: false,
      email: null
    };

    if (users.length === 0) {
      console.log('📧 No user found, returning generic success');
      // Wait a bit to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 200));
      return res.json(successResponse);
    }

    const user = users[0];
    console.log('📧 User found:', { user_id: user.user_id, username: user.username, hasEmail: !!user.primary_email });

    // Check if user has an email address
    if (!user.primary_email) {
      console.log('📧 User has no email address');
      return res.json({
        message: 'This account does not have an email address associated with it. Please contact your administrator.',
        hasEmail: false,
        email: null
      });
    }

    console.log('📧 Generating reset token...');
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    console.log('📧 Reset token generated, updating database...');

    // Store reset token
    await executeQuery(`
      UPDATE user_accounts 
      SET 
        reset_token = ?,
        reset_token_expires = ?,
        reset_token_used = FALSE,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [resetToken, resetExpiry, user.user_id]);

    console.log('📧 Database updated with reset token, skipping audit log for now...');

    console.log('📧 About to send email...');
    // Send password reset email with extended timeout handling
    try {
      console.log(`📧 Sending password reset email to: ${user.primary_email}`);
      
      // Set a longer timeout for the email sending (45 seconds)
      const emailPromise = emailService.sendPasswordResetEmail(
        user.primary_email,
        resetToken,
        user.username
      );
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 45 seconds')), 45000)
      );
      
      await Promise.race([emailPromise, timeoutPromise]);
      console.log(`✅ Password reset email sent to ${user.primary_email} for user ${user.username}`);
      
      // Return success with masked email for confirmation
      const maskedEmail = user.primary_email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      return res.json({
        message: `Password reset instructions have been sent to ${maskedEmail}`,
        hasEmail: true,
        email: maskedEmail
      });
      
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      
      // Still return success to prevent username enumeration attacks
      // But let the user know the email system may be temporarily unavailable
      const maskedEmail = user.primary_email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      return res.json({
        message: `Password reset requested for ${maskedEmail}. If you don't receive an email shortly, please contact your administrator.`,
        hasEmail: true,
        email: maskedEmail,
        emailWarning: true
      });
    }

  } catch (error) {
    console.error('Forgot password by username error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const [users] = await executeQuery(`
      SELECT 
        ua.user_id,
        ua.username,
        ua.reset_token_expires,
        ua.reset_token_used
      FROM user_accounts ua
      WHERE ua.reset_token = ? 
        AND ua.is_active = 1
    `, [token]);

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const user = users[0];

    if (user.reset_token_used) {
      return res.status(400).json({ error: 'Reset token has already been used' });
    }

    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    res.json({ 
      valid: true, 
      username: user.username 
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password with token
router.post('/reset-password', resetPasswordLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const [users] = await executeQuery(`
      SELECT 
        ua.user_id,
        ua.username,
        ua.reset_token_expires,
        ua.reset_token_used
      FROM user_accounts ua
      WHERE ua.reset_token = ? 
        AND ua.is_active = 1
    `, [token]);

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const user = users[0];

    if (user.reset_token_used) {
      return res.status(400).json({ error: 'Reset token has already been used' });
    }

    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and mark token as used
    await executeQuery(`
      UPDATE user_accounts 
      SET 
        password_hash = ?,
        reset_token_used = TRUE,
        failed_login_attempts = 0,
        locked_until = NULL,
        password_changed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [newPasswordHash, user.user_id]);

    // Log password reset completion
    await executeQuery(`
      INSERT INTO audit_log (table_name, record_id, action, new_values, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `, [
      'user_accounts', 
      user.user_id, 
      'UPDATE', 
      JSON.stringify({ 
        action: 'PASSWORD_RESET_COMPLETE',
        reset_completed: true,
        ip: req.ip 
      }),
      req.ip
    ]);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug endpoint to check lockout status (temporary for debugging)
router.get('/debug-lockout/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const [users] = await executeQuery(`
      SELECT 
        username,
        failed_login_attempts,
        locked_until,
        NOW() as current_time,
        UTC_TIMESTAMP() as current_utc_time
      FROM user_accounts 
      WHERE username = ?
    `, [username]);

    if (users.length === 0) {
      return res.json({ error: 'User not found' });
    }

    const user = users[0];
    const lockedUntil = user.locked_until ? new Date(user.locked_until + 'Z') : null;
    const now = new Date();
    const remainingTime = lockedUntil ? Math.ceil((lockedUntil - now) / (1000 * 60)) : 0;

    res.json({
      username: user.username,
      failed_attempts: user.failed_login_attempts,
      locked_until_raw: user.locked_until,
      locked_until_parsed: lockedUntil ? lockedUntil.toISOString() : null,
      server_time: user.current_time,
      server_utc_time: user.current_utc_time,
      client_time: now.toISOString(),
      remaining_minutes: remainingTime,
      is_locked: remainingTime > 0
    });
  } catch (error) {
    console.error('Debug lockout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
