const { Resend } = require('resend');
const crypto = require('crypto');

// Initialize Resend dynamically
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email verification template
const emailVerificationTemplate = (verificationCode, userEmail) => {
  return {
    subject: 'Verify Your Web3Radar Account',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Web3Radar</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
          }
          .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .logo-text .highlight {
            color: #667eea;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 28px;
          }
          .content {
            margin-bottom: 30px;
          }
          .verification-code {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            font-family: 'Courier New', monospace;
          }
          .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
          }
          .expiry-info {
            color: #666;
            font-size: 14px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <div class="logo-icon">W3</div>
              <div class="logo-text">Web3<span class="highlight">Radar</span></div>
            </div>
            <h1>Verify Your Email</h1>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>Thank you for registering with Web3Radar! To complete your registration and secure your account, please use the verification code below:</p>
            
            <div class="verification-code">
              ${verificationCode}
            </div>
            
            <p>Enter this code on the verification page to activate your account.</p>
            
            <div class="security-notice">
              <strong>🔒 Security Notice:</strong> This verification code will expire in 10 minutes. If you didn't create an account with Web3Radar, please ignore this email.
            </div>
            
            <div class="expiry-info">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This verification code will expire in 10 minutes</li>
                <li>You can only use this code once</li>
                <li>If you didn't register, please ignore this email</li>
                <li>Don't share this code with anyone</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:support@web3radar.com">support@web3radar.com</a></p>
            <p>© 2024 Web3Radar. All rights reserved.</p>
            <p>Automated Lead Discovery for Web3 Projects</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Web3Radar - Email Verification
      
      Hello,
      
      Thank you for registering with Web3Radar! To complete your registration and secure your account, please use the verification code below:
      
      Verification Code: ${verificationCode}
      
      Enter this code on the verification page to activate your account.
      
      SECURITY NOTICE: This verification code will expire in 10 minutes. If you didn't create an account with Web3Radar, please ignore this email.
      
      Important:
      - This verification code will expire in 10 minutes
      - You can only use this code once
      - If you didn't register, please ignore this email
      - Don't share this code with anyone
      
      Need help? Contact our support team at support@web3radar.com
      
      © 2024 Web3Radar. All rights reserved.
      Automated Lead Discovery for Web3 Projects
    `
  };
};

// Send verification email using Resend
const sendVerificationEmail = async (userEmail, verificationCode) => {
  try {
    const resend = getResendClient();
    if (!resend) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const template = emailVerificationTemplate(verificationCode, userEmail);
    
    const emailData = {
      from: process.env.FROM_EMAIL || 'Web3Radar <support@rawfreedomai.com>',
      to: [userEmail],
      subject: template.subject,
      html: template.html,
    };

    console.log('Sending verification email via Resend to:', userEmail);
    console.log('From:', emailData.from);
    console.log('Using API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

    const result = await resend.emails.send(emailData);
    
    console.log('Verification email sent successfully via Resend');
    console.log('Full Resend response:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('Resend API error:', result.error);
      throw new Error(`Resend API error: ${result.error.message}`);
    }
    
    return {
      success: true,
      messageId: result.data?.id,
      provider: 'resend'
    };
    
  } catch (error) {
    console.error('Error sending verification email via Resend:', error);
    throw error;
  }
};

// Fallback to nodemailer if Resend is not available
const sendVerificationEmailFallback = async (userEmail, verificationCode) => {
  const nodemailer = require('nodemailer');
  
  try {
    // Create test account for development
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const template = emailVerificationTemplate(verificationCode, userEmail);
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'Web3Radar <support@rawfreedomai.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Verification email sent successfully via test account');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
      provider: 'test'
    };
    
  } catch (error) {
    console.error('Error sending verification email via fallback:', error);
    throw error;
  }
};

// Main function to send verification email
const sendEmailVerification = async (userEmail) => {
  const verificationCode = generateVerificationCode();
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
  try {
    // Try Resend first
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await sendVerificationEmail(userEmail, verificationCode);
        return {
          ...result,
          verificationCode,
          expiryTime
        };
      } catch (resendError) {
        console.log('Resend failed, falling back to test email:', resendError.message);
        // Fallback to test email if Resend fails
        const result = await sendVerificationEmailFallback(userEmail, verificationCode);
        return {
          ...result,
          verificationCode,
          expiryTime
        };
      }
    } else {
      // Fallback to test email
      const result = await sendVerificationEmailFallback(userEmail, verificationCode);
      return {
        ...result,
        verificationCode,
        expiryTime
      };
    }
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

module.exports = {
  sendEmailVerification,
  generateVerificationCode
};