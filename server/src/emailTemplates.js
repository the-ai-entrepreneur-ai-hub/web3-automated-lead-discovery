const passwordResetTemplate = (resetToken, userEmail) => {
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  return {
    subject: 'Reset Your Web3Radar Password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Web3Radar</title>
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
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #00FFFF 0%, #40E0D0 100%);
            color: #0F0F23;
            padding: 18px 36px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            border: 2px solid rgba(0, 255, 255, 0.5);
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
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
            <h1>Reset Your Password</h1>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>We received a request to reset the password for your Web3Radar account associated with <strong>${userEmail}</strong>.</p>
            
            <p>If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="security-notice">
              <strong>🔒 Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this reset, please ignore this email or contact our support team if you have concerns.
            </div>
            
            <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 14px;">${resetLink}</p>
            
            <div class="expiry-info">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This reset link will expire in 1 hour</li>
                <li>You can only use this link once</li>
                <li>If you didn't request this reset, please ignore this email</li>
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
      Web3Radar - Password Reset Request
      
      Hello,
      
      We received a request to reset the password for your Web3Radar account associated with ${userEmail}.
      
      If you made this request, click the following link to reset your password:
      ${resetLink}
      
      SECURITY NOTICE: This link will expire in 1 hour for your security. If you didn't request this reset, please ignore this email or contact our support team if you have concerns.
      
      Important:
      - This reset link will expire in 1 hour
      - You can only use this link once
      - If you didn't request this reset, please ignore this email
      
      Need help? Contact our support team at support@rawfreedomai.com
      
      © 2024 Web3Radar. All rights reserved.
      Automated Lead Discovery for Web3 Projects
    `
  };
};

module.exports = {
  passwordResetTemplate
};