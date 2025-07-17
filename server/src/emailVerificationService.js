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
            color: #f0f0f0;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, #0F0F23 50%);
            background-size: 100% 100%;
            min-height: 100vh;
          }
          .container {
            background: #1A1A2E;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px -10px rgba(15, 15, 35, 0.5);
            border: 1px solid rgba(0, 255, 255, 0.3);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            justify-content: center;
          }
          .logo-container {
            position: relative;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-main {
            width: 35px;
            height: 35px;
            background: linear-gradient(135deg, #00FFFF 0%, #40E0D0 100%);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
          }
          .logo-float {
            position: absolute;
            top: 0;
            right: 0;
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg, #00FFFF 0%, #40E0D0 100%);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
            animation: slowFloat 4s ease-in-out infinite;
          }
          @keyframes slowFloat {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-3px) translateX(1px);
            }
            50% {
              transform: translateY(-6px) translateX(0px);
            }
            75% {
              transform: translateY(-3px) translateX(-1px);
            }
          }
          .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: #f0f0f0;
            letter-spacing: -0.5px;
          }
          .logo-text .highlight {
            color: #00FFFF;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
          h1 {
            color: #f0f0f0;
            margin-bottom: 20px;
            font-size: 32px;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
          }
          .content {
            margin-bottom: 30px;
            color: #d0d0d0;
          }
          .verification-code {
            background: linear-gradient(135deg, #00FFFF 0%, #40E0D0 100%);
            color: #0F0F23;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            border: 2px solid rgba(0, 255, 255, 0.5);
          }
          .security-notice {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            color: #FFD700;
            padding: 18px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(0, 255, 255, 0.2);
            color: #888;
            font-size: 14px;
          }
          .footer a {
            color: #00FFFF;
            text-decoration: none;
          }
          .footer a:hover {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
          }
          .expiry-info {
            color: #aaa;
            font-size: 14px;
            margin-top: 15px;
          }
          .expiry-info strong {
            color: #00FFFF;
          }
          .tagline {
            color: #888;
            font-size: 12px;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <div class="logo-container">
                <div class="logo-main"></div>
                <div class="logo-float"></div>
              </div>
              <div class="logo-text">Web3<span class="highlight">Radar</span></div>
            </div>
            <div class="tagline">Automated Lead Discovery</div>
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
            <p>Need help? Contact our support team at <a href="mailto:support@rawfreedomai.com">support@rawfreedomai.com</a></p>
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
      
      Need help? Contact our support team at support@rawfreedomai.com
      
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
        
        // Check if it's a domain verification issue
        if (resendError.message.includes('verify a domain')) {
          console.log('⚠️  Resend requires domain verification for external emails');
          console.log('📧 Using test email service as fallback');
        }
        
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