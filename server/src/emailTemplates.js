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
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .reset-button:hover {
            transform: translateY(-2px);
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
            <p>Need help? Contact our support team at <a href="mailto:support@web3radar.com">support@web3radar.com</a></p>
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
      
      Need help? Contact our support team at support@web3radar.com
      
      © 2024 Web3Radar. All rights reserved.
      Automated Lead Discovery for Web3 Projects
    `
  };
};

module.exports = {
  passwordResetTemplate
};