/**
 * Enhanced Auth Routes with Email Queue Support
 * This version uses email queue for production-scale email sending
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../utils/emailService');

// Import email queue for production (optional)
let emailQueue = null;
try {
  emailQueue = require('../utils/emailQueue');
} catch (error) {
  console.log('📧 Email queue not available, using direct email sending');
}

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to send email (with queue fallback)
const sendEmailSafely = async (type, emailData) => {
  const useQueue = process.env.EMAIL_USE_QUEUE === 'true' && emailQueue;
  
  try {
    if (useQueue) {
      // Use queue system for production
      switch (type) {
        case 'password-reset':
          return await emailQueue.addPasswordResetEmail(
            emailData.email,
            emailData.username,
            emailData.resetToken
          );
        case 'account-unlock':
          return await emailQueue.addAccountUnlockEmail(
            emailData.email,
            emailData.username,
            emailData.adminName
          );
      }
    } else {
      // Direct sending for development/testing
      switch (type) {
        case 'password-reset':
          return await emailService.sendPasswordResetEmail(
            emailData.email,
            emailData.username,
            emailData.resetToken
          );
        case 'account-unlock':
          return await emailService.sendAccountUnlockedEmail(
            emailData.email,
            emailData.username,
            emailData.adminName
          );
      }
    }
  } catch (error) {
    console.error(`❌ Email sending failed (${type}):`, error.message);
    throw error;
  }
};

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

// Request password reset
router.post('/forgot-password', authLimiter, async (req, res) => {
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
      'PASSWORD_RESET_REQUEST', 
      JSON.stringify({ 
        email: user.primary_email,
        reset_token_expires: resetExpiry 
      }),
      req.ip
    ]);

    // Send password reset email (with queue or direct)
    try {
      await sendEmailSafely('password-reset', {
        email: user.primary_email,
        username: user.username,
        resetToken: resetToken
      });
      
      console.log(`✅ Password reset email ${emailQueue ? 'queued' : 'sent'} for ${user.username}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      // Log error but don't reveal it to prevent email enumeration
      await executeQuery(`
        INSERT INTO audit_log (table_name, record_id, action, new_values, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'user_accounts', 
        user.user_id, 
        'EMAIL_SEND_FAILED', 
        JSON.stringify({ 
          error: emailError.message,
          email: user.primary_email,
          reset_token: resetToken 
        }),
        req.ip
      ]);
    }

    res.json(successResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (rest of the routes remain the same)

module.exports = router;
