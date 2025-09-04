const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Gmail configuration
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 10000, // 10 seconds  
        socketTimeout: 30000, // 30 seconds
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      console.log('✅ Gmail transporter initialized with extended timeouts');
      return;
    }

    console.warn('⚠️  Gmail not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env');
  }

  async sendPasswordResetEmail(email, resetToken, userName = 'User') {
    console.log(`📧 Attempting to send password reset email to ${email} for user ${userName}`);
    
    if (!this.transporter) {
      throw new Error('Gmail not configured. Please set up GMAIL_USER and GMAIL_APP_PASSWORD in .env');
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset - NIT Goa</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2c5aa0;">Password Reset Request</h1>
            <p>Hello ${userName},</p>
            <p>You have requested to reset your password. Please click the link below to reset your password:</p>
            <p><a href="${resetUrl}" style="color: #2c5aa0; text-decoration: none;">${resetUrl}</a></p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <hr>
            <p><small>National Institute of Technology Goa</small></p>
        </div>
    </body>
    </html>`;

    const mailOptions = {
      from: `"NIT Goa" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - NIT Goa',
      html: htmlContent
    };

    try {
      console.log('📧 Sending email with options:', { to: email, from: mailOptions.from, subject: mailOptions.subject });
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  }

  async testConnection() {
    if (!this.transporter) {
      throw new Error('Transporter not initialized');
    }
    
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
