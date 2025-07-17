const nodemailer = require('nodemailer');
const { passwordResetTemplate } = require('./emailTemplates');

// Create email transporter
const createTransporter = () => {
  // For development, you can use Gmail with app password
  // For production, use services like SendGrid, Mailgun, or AWS SES
  
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Gmail configuration
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  } else if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    // Generic SMTP configuration
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } else {
    // For development/testing - use Ethereal Email (fake SMTP)
    console.log('No email configuration found. Using test account...');
    return nodemailer.createTransporter({
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
    
    return nodemailer.createTransporter({
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
    let transporter;
    
    // Try to create transporter with existing config
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      transporter = createTransporter();
    } else {
      // Create test account for development
      transporter = await createTestAccount();
    }
    
    const template = passwordResetTemplate(resetToken, userEmail);
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'Web3Radar <noreply@web3radar.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset email sent successfully');
    console.log('Message ID:', info.messageId);
    
    // For test accounts, log the preview URL
    if (info.messageId && !process.env.GMAIL_USER) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  verifyEmailConfig
};