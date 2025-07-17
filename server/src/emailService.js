const nodemailer = require('nodemailer');
const { passwordResetTemplate } = require('./emailTemplates');
const { sendPasswordResetEmail: resendPasswordReset, testEmailConfig: testResendConfig } = require('./resendService');

// Create email transporter
const createTransporter = () => {
  // For development, you can use Gmail with app password
  // For production, use services like SendGrid, Mailgun, or AWS SES
  
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Gmail configuration
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  } else if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    // Generic SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else {
    // For development/testing - use Ethereal Email (fake SMTP)
    console.log('No email configuration found. Using test account...');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

// Create a test account for Ethereal Email
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test email account created:');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    // Priority 1: Use Resend if API key is configured
    if (process.env.RESEND_API_KEY) {
      return await resendPasswordReset(userEmail, resetToken);
    }
    
    // Priority 2: Use Gmail if configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = createTransporter();
      const template = passwordResetTemplate(resetToken, userEmail);
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'Web3Radar <support@rawfreedomai.com>',
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      };
      
      const info = await transporter.sendMail(mailOptions);
      
      console.log('Password reset email sent successfully via Gmail');
      console.log('Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'gmail'
      };
    }
    
    // Priority 3: Use SMTP if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const transporter = createTransporter();
      const template = passwordResetTemplate(resetToken, userEmail);
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'Web3Radar <support@rawfreedomai.com>',
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      };
      
      const info = await transporter.sendMail(mailOptions);
      
      console.log('Password reset email sent successfully via SMTP');
      console.log('Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'smtp'
      };
    }
    
    // Fallback: Use test account for development
    console.log('No email service configured, using test account...');
    const transporter = await createTestAccount();
    const template = passwordResetTemplate(resetToken, userEmail);
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'Web3Radar <support@rawfreedomai.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset email sent successfully via test account');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
      provider: 'test'
    };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    // Priority 1: Test Resend if API key is configured
    if (process.env.RESEND_API_KEY) {
      return await testResendConfig();
    }
    
    // Priority 2: Test Gmail if configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = createTransporter();
      await transporter.verify();
      console.log('✅ Gmail email configuration verified successfully');
      return true;
    }
    
    // Priority 3: Test SMTP if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const transporter = createTransporter();
      await transporter.verify();
      console.log('✅ SMTP email configuration verified successfully');
      return true;
    }
    
    // If no real email service is configured, use test account
    console.log('⚠️  No email service configured, using test account');
    return true;
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  verifyEmailConfig
};