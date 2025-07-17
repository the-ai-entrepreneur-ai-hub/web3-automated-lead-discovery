const { Resend } = require('resend');
const { passwordResetTemplate } = require('./emailTemplates');

// Initialize Resend dynamically
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// Send password reset email using Resend
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const resend = getResendClient();
    if (!resend) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const template = passwordResetTemplate(resetToken, userEmail);
    
    const emailData = {
      from: process.env.FROM_EMAIL || 'Web3Radar <support@rawfreedomai.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html,
    };

    const result = await resend.emails.send(emailData);
    
    console.log('Password reset email sent successfully via Resend');
    console.log('Email ID:', result.data?.id);
    
    return {
      success: true,
      messageId: result.data?.id,
      provider: 'resend'
    };
    
  } catch (error) {
    console.error('Error sending password reset email via Resend:', error);
    throw error;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const resend = getResendClient();
    if (!resend) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Test by sending a test email to the configured FROM_EMAIL
    const testResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Web3Radar <support@rawfreedomai.com>',
      to: 'test@example.com', // This won't actually send, just validates API key
      subject: 'Test Email Configuration',
      html: '<p>This is a test email to verify Resend configuration.</p>',
    });

    console.log('✅ Resend email configuration verified successfully!');
    return true;
  } catch (error) {
    console.error('❌ Resend email configuration verification failed:', error.message);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  testEmailConfig
};