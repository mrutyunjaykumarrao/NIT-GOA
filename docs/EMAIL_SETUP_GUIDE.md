# Email Configuration Guide for NIT Goa Password Reset System

## 📧 **Email Setup for Different Environments**

### 🧪 **1. Testing Environment (Personal Gmail)**

**What you need:**
1. Your personal Gmail account
2. Enable 2-Factor Authentication
3. Generate an App Password

**Steps:**
1. Go to Gmail → Settings → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords → Generate new app password
4. Use the 16-character app password (not your regular password)

**Environment Variables:**
```env
EMAIL_PROVIDER=gmail
GMAIL_USER=your_personal_email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # 16-character app password
EMAIL_FROM="NIT Goa Testing <your_personal_email@gmail.com>"
CLIENT_URL=http://localhost:3000
```

**Pros:** Easy setup, free, immediate testing
**Cons:** Gmail rate limits (500 emails/day), not professional

---

### 🏢 **2. Production Environment (Institutional Email Server)**

**What NIT Goa IT team needs to provide:**
1. SMTP server details (usually `smtp.nitgoa.ac.in`)
2. Dedicated email account (e.g., `noreply@nitgoa.ac.in`)
3. SMTP credentials
4. Port and security settings

**Environment Variables:**
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.nitgoa.ac.in
SMTP_PORT=587                    # or 465 for SSL, 25 for basic
SMTP_SECURE=false               # true for port 465, false for others
SMTP_USER=noreply@nitgoa.ac.in
SMTP_PASSWORD=institutional_password
EMAIL_FROM="NIT Goa <noreply@nitgoa.ac.in>"
CLIENT_URL=https://nitgoa.ac.in
```

**Pros:** Professional, institutional branding, no external dependencies
**Cons:** Requires IT department setup, might have firewall restrictions

---

### ☁️ **3. Cloud Email Service (Recommended for Production)**

**Option A: SendGrid (Recommended)**
- **Cost:** Free tier: 100 emails/day, Paid: $14.95/month for 50,000 emails
- **Setup:** Sign up at sendgrid.com, get API key
- **Benefits:** High deliverability, detailed analytics, scalable

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_sendgrid_api_key
EMAIL_FROM="NIT Goa <noreply@nitgoa.ac.in>"
CLIENT_URL=https://nitgoa.ac.in
```

**Option B: Amazon SES**
- **Cost:** $0.10 per 1,000 emails
- **Setup:** AWS account required, domain verification needed

**Option C: Mailgun**
- **Cost:** Free tier: 5,000 emails for 3 months, then $35/month
- **Setup:** Similar to SendGrid

---

### 🏫 **4. Real-World Production Setup for 100s of Employees**

**Recommended Architecture:**

1. **Primary Email Service:** Institutional SMTP + SendGrid backup
2. **Email Queue System:** Implement Redis/Bull queue for large batches
3. **Rate Limiting:** Prevent spam, respect provider limits
4. **Email Templates:** Branded, responsive templates
5. **Monitoring:** Email delivery tracking and failure alerts

**Complete Production .env:**
```env
# Primary email service
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.nitgoa.ac.in
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@nitgoa.ac.in
SMTP_PASSWORD=secure_institutional_password

# Backup email service (SendGrid)
SENDGRID_API_KEY=SG.your_backup_sendgrid_key

# Email settings
EMAIL_FROM="NIT Goa <noreply@nitgoa.ac.in>"
EMAIL_REPLY_TO="support@nitgoa.ac.in"
CLIENT_URL=https://faculty.nitgoa.ac.in

# Email queue settings (for high volume)
REDIS_URL=redis://localhost:6379
EMAIL_QUEUE_CONCURRENCY=5
EMAIL_BATCH_SIZE=50

# Rate limiting
EMAIL_RATE_LIMIT=100  # emails per hour
EMAIL_BURST_LIMIT=10  # emails per minute
```

---

### 🔧 **Implementation Considerations for Scale**

**1. Email Queue System (for 100+ users):**
```javascript
// server/src/utils/emailQueue.js
const Queue = require('bull');
const emailQueue = new Queue('email processing');

emailQueue.process('password-reset', async (job) => {
  const { email, username, resetToken } = job.data;
  await emailService.sendPasswordResetEmail(email, username, resetToken);
});

// Usage: Add to queue instead of sending immediately
emailQueue.add('password-reset', {
  email: user.primary_email,
  username: user.username,
  resetToken: resetToken
});
```

**2. Email Templates Management:**
- Store templates in database
- Support multiple languages
- A/B testing capabilities
- Brand customization

**3. Delivery Monitoring:**
```javascript
// Track email delivery status
const emailLog = {
  user_id: user.user_id,
  email_type: 'password_reset',
  recipient: user.primary_email,
  status: 'sent', // sent, delivered, failed, bounced
  sent_at: new Date(),
  message_id: emailResult.messageId
};
```

**4. Fallback Strategy:**
```javascript
// Try institutional SMTP first, fallback to SendGrid
try {
  await institutionalEmailService.send(emailData);
} catch (error) {
  console.warn('Institutional email failed, using backup service');
  await sendGridService.send(emailData);
}
```

---

### 🚀 **Quick Start for Testing**

1. **Set up Gmail App Password** (5 minutes)
2. **Update .env file** with Gmail credentials
3. **Test with your email:**

```bash
# Test email sending
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"your_test_email@gmail.com"}'
```

4. **Create test users in database:**
```sql
-- Add email to existing admin user
UPDATE user_accounts SET email = 'your_test_email@gmail.com' WHERE username = 'admin';
```

---

### 📋 **Production Deployment Checklist**

- [ ] Obtain institutional SMTP credentials
- [ ] Set up backup email service (SendGrid/SES)
- [ ] Configure proper DNS records (SPF, DKIM, DMARC)
- [ ] Implement email queue system
- [ ] Set up monitoring and alerting
- [ ] Test email deliverability
- [ ] Configure rate limiting
- [ ] Set up email template management
- [ ] Implement delivery status tracking
- [ ] Configure automatic retry for failed emails

Would you like me to help you set up the Gmail testing configuration first, or do you want to explore any specific production setup option?
