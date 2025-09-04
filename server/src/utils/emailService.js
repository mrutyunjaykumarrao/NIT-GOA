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
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      console.log('✅ Gmail transporter initialized');
      return;
    }

    console.warn('⚠️  Gmail not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env');
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    if (!this.transporter) {
      throw new Error('Gmail not configured. Please set up GMAIL_USER and GMAIL_APP_PASSWORD in .env');
    }

    const mailOptions = {
      from: `"NIT Goa" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '')
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', info.messageId);
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

  async sendPasswordResetEmail(email, resetToken, userName = 'User') {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset - NIT Goa</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #2c5aa0;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                color: #2c5aa0;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            .content {
                margin-bottom: 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #2c5aa0;
            }
            .message {
                font-size: 16px;
                margin-bottom: 25px;
                line-height: 1.5;
            }
            .reset-button {
                display: inline-block;
                background-color: #2c5aa0;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }
            .security-note {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                border-top: 1px solid #ddd;
                padding-top: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">NIT GOA</div>
                <div class="subtitle">National Institute of Technology Goa</div>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${userName},</div>
                
                <div class="message">
                    We received a request to reset your password for your NIT Goa account. 
                    If you made this request, please click the button below to reset your password:
                </div>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="reset-button">Reset My Password</a>
                </div>
                
                <div class="message">
                    Or copy and paste this link in your browser:<br>
                    <a href="${resetUrl}" style="color: #2c5aa0; word-break: break-all;">${resetUrl}</a>
                </div>
                
                <div class="security-note">
                    <strong>Security Information:</strong><br>
                    • This link will expire in 1 hour for security reasons<br>
                    • If you didn't request this reset, please ignore this email<br>
                    • For security concerns, contact IT support immediately
                </div>
            </div>
            
            <div class="footer">
                <div>
                    This is an automated message from NIT Goa Faculty Management System.<br>
                    Please do not reply to this email.
                </div>
                <div style="margin-top: 15px;">
                    <strong>IT Support:</strong> support@nitgoa.ac.in
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const textContent = `
    Password Reset Request - NIT Goa
    
    Hello ${userName},
    
    We received a request to reset your password for your NIT Goa account.
    
    Please click on the following link to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour for security reasons.
    
    If you didn't request this reset, please ignore this email.
    
    For any security concerns, contact IT support at support@nitgoa.ac.in
    
    Best regards,
    NIT Goa IT Team
    `;

    return await this.sendEmail(
      email,
      'Password Reset Request - NIT Goa',
      htmlContent,
      textContent
    );
  }

  async testConnection() {
    if (!this.transporter) {
      throw new Error('Gmail not configured');
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'Gmail connection successful' };
    } catch (error) {
      throw new Error(`Gmail connection failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
