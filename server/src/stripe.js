const Stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe with secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Validate required environment variables
const validateStripeConfig = () => {
  const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required Stripe environment variables:', missing);
    return false;
  }
  
  // STRIPE_PRICE_ID is optional - we can create prices dynamically
  if (process.env.STRIPE_PRICE_ID && process.env.STRIPE_PRICE_ID === 'price_1234567890') {
    console.warn('⚠️ STRIPE_PRICE_ID is placeholder. Using dynamic pricing instead.');
  }
  
  return true;
};

// Subscription configuration
const STRIPE_CONFIG = {
  PRICE_ID: process.env.STRIPE_PRICE_ID || null, // Optional - we can create dynamically
  SUBSCRIPTION_NAME: 'Web3Radar Pro',
  SUBSCRIPTION_DESCRIPTION: 'Premium access to Web3 project leads and contact information',
  CURRENCY: 'usd',
  MONTHLY_PRICE: 9900, // $99.00 in cents
  SUCCESS_URL: `${process.env.CLIENT_URL || 'https://rawfreedomai.com'}/#/dashboard?payment=success`,
  CANCEL_URL: `${process.env.CLIENT_URL || 'https://rawfreedomai.com'}/#/dashboard?payment=canceled`,
  FREE_TRIAL_DAYS: 0, // Remove trial for immediate upgrade
  DISCOUNT_CODES: {
    'ProspectingGOAT12': {
      percentage: 70,
      duration: 'once',
      description: '70% off first month'
    }
  },
  IS_CONFIGURED: validateStripeConfig()
};

module.exports = {
  stripe,
  STRIPE_CONFIG
};