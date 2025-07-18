// Payment Receipt Email Template for Web3Radar
// Using brand colors and styling from the website

const generatePaymentReceiptEmail = (userDetails, paymentDetails, subscriptionDetails) => {
  const { firstName, lastName, email } = userDetails;
  const { amount, currency, paymentMethod, transactionId, date } = paymentDetails;
  const { planName, billingCycle, nextBillingDate } = subscriptionDetails;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - Web3Radar</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0f1c 0%, #1a1a2e 100%);
            min-height: 100vh;
            padding: 20px;
            color: #e2e8f0;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .header {
            background: linear-gradient(135deg, #00ffff 0%, #00cccc 100%);
            color: #0a0f1c;
            padding: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            z-index: 1;
            position: relative;
        }
        
        .tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 500;
            z-index: 1;
            position: relative;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #00ffff;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #cbd5e1;
        }
        
        .receipt-card {
            background: rgba(30, 41, 59, 0.8);
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 30px;
            border: 1px solid rgba(0, 255, 255, 0.2);
        }
        
        .receipt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        }
        
        .receipt-title {
            font-size: 18px;
            font-weight: 600;
            color: #00ffff;
        }
        
        .receipt-id {
            font-size: 12px;
            color: #94a3b8;
            font-family: 'Monaco', monospace;
        }
        
        .receipt-row {
            display: table;
            width: 100%;
            padding: 12px 0;
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .receipt-row:last-child {
            border-bottom: none;
        }
        
        .receipt-label {
            display: table-cell;
            width: 40%;
            font-size: 14px;
            color: #94a3b8;
            font-weight: 500;
            vertical-align: middle;
            padding-right: 16px;
        }
        
        .receipt-value {
            display: table-cell;
            width: 60%;
            font-size: 14px;
            color: #e2e8f0;
            font-weight: 600;
            text-align: right;
            vertical-align: middle;
        }
        
        .amount {
            font-size: 24px;
            font-weight: 700;
            color: #00ffff;
        }
        
        .subscription-info {
            background: rgba(16, 185, 129, 0.1);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .subscription-title {
            font-size: 16px;
            font-weight: 600;
            color: #10b981;
            margin-bottom: 12px;
        }
        
        .subscription-details {
            font-size: 14px;
            color: #cbd5e1;
            line-height: 1.5;
        }
        
        .footer {
            background: #0f172a;
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(0, 255, 255, 0.2);
        }
        
        .footer-text {
            font-size: 12px;
            color: #64748b;
            line-height: 1.5;
            margin-bottom: 16px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-bottom: 20px;
        }
        
        .social-link {
            display: inline-block;
            padding: 8px 16px;
            background: rgba(0, 255, 255, 0.1);
            color: #00ffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background: rgba(0, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        .brand-footer {
            font-size: 10px;
            color: #475569;
            margin-top: 16px;
        }
        
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #00ffff 0%, #00cccc 100%);
            color: #0a0f1c;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            margin: 16px 0;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 255, 255, 0.3);
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .receipt-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            
            .receipt-row {
                display: block;
                padding: 8px 0;
            }
            
            .receipt-label {
                display: block;
                width: 100%;
                margin-bottom: 4px;
                padding-right: 0;
            }
            
            .receipt-value {
                display: block;
                width: 100%;
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Web3Radar</div>
            <div class="tagline">AI-Powered Web3 Prospecting</div>
        </div>
        
        <div class="content">
            <div class="greeting">Thank you, ${firstName}!</div>
            <div class="message">
                Your payment has been processed successfully. You now have access to all premium features of Web3Radar. 
                Start discovering high-quality Web3 projects and supercharge your prospecting efforts.
            </div>
            
            <div class="receipt-card">
                <div class="receipt-header">
                    <div class="receipt-title">Payment Receipt</div>
                    <div class="receipt-id">ID: ${transactionId}</div>
                </div>
                
                <div class="receipt-row">
                    <div class="receipt-label">Amount</div>
                    <div class="receipt-value amount">$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}</div>
                </div>
                
                <div class="receipt-row">
                    <div class="receipt-label">Date</div>
                    <div class="receipt-value">${new Date(date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</div>
                </div>
                
                <div class="receipt-row">
                    <div class="receipt-label">Payment Method</div>
                    <div class="receipt-value">${paymentMethod}</div>
                </div>
                
                <div class="receipt-row">
                    <div class="receipt-label">Email</div>
                    <div class="receipt-value">${email}</div>
                </div>
            </div>
            
            <div class="subscription-info">
                <div class="subscription-title">🚀 Premium Subscription Active</div>
                <div class="subscription-details">
                    <strong>Plan:</strong> ${planName}<br>
                    <strong>Billing Cycle:</strong> ${billingCycle}<br>
                    <strong>Next Billing Date:</strong> ${new Date(nextBillingDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}<br><br>
                    You now have unlimited access to our Web3 project database, advanced filtering, 
                    and premium export features. Happy prospecting!
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="https://rawfreedomai.com/dashboard" class="button">Access Your Dashboard</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://rawfreedomai.com" class="social-link">Visit Website</a>
                <a href="https://rawfreedomai.com/settings" class="social-link">Manage Subscription</a>
                <a href="mailto:support@rawfreedomai.com" class="social-link">Support</a>
            </div>
            
            <div class="footer-text">
                Need help? Contact us at <a href="mailto:support@rawfreedomai.com" style="color: #00ffff;">support@rawfreedomai.com</a><br>
                This is an automated email. Please do not reply to this message.
            </div>
            
            <div class="brand-footer">
                Web3Radar - AI-Powered Web3 Prospecting Platform<br>
                © 2024 Web3Radar. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = { generatePaymentReceiptEmail };