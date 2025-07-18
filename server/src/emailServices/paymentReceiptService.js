const { Resend } = require('resend');
const { generatePaymentReceiptEmail } = require('../emailTemplates/paymentReceiptTemplate');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Web3Radar <noreply@rawfreedomai.com>';

const sendPaymentReceipt = async (userDetails, paymentDetails, subscriptionDetails) => {
  try {
    console.log('Sending payment receipt email to:', userDetails.email);
    
    const htmlContent = generatePaymentReceiptEmail(userDetails, paymentDetails, subscriptionDetails);
    
    const emailData = {
      from: FROM_EMAIL,
      to: [userDetails.email],
      subject: `Payment Receipt - Web3Radar Premium Subscription`,
      html: htmlContent,
    };

    console.log('Sending payment receipt via Resend to:', userDetails.email);
    console.log('From:', FROM_EMAIL);
    console.log('Using API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

    const response = await resend.emails.send(emailData);
    
    console.log('Payment receipt email sent successfully via Resend');
    console.log('Full Resend response:', JSON.stringify(response, null, 2));
    
    return {
      success: true,
      messageId: response.data?.id,
      response: response
    };
  } catch (error) {
    console.error('Error sending payment receipt email:', error);
    
    if (error.name === 'ValidationError') {
      throw new Error('Email validation failed: ' + error.message);
    }
    
    throw new Error('Failed to send payment receipt email: ' + error.message);
  }
};

// Test function to send a sample receipt
const sendTestReceipt = async (testEmail) => {
  const mockUserDetails = {
    firstName: 'John',
    lastName: 'Doe',
    email: testEmail
  };

  const mockPaymentDetails = {
    amount: 2997, // $29.97 in cents
    currency: 'usd',
    paymentMethod: 'Credit Card ending in 4242',
    transactionId: 'txn_test_' + Date.now(),
    date: new Date().toISOString()
  };

  const mockSubscriptionDetails = {
    planName: 'Web3Radar Premium',
    billingCycle: 'Monthly',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  };

  return await sendPaymentReceipt(mockUserDetails, mockPaymentDetails, mockSubscriptionDetails);
};

module.exports = { 
  sendPaymentReceipt, 
  sendTestReceipt 
};