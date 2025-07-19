const Stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe with secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Subscription configuration
const STRIPE_CONFIG = {
  PRICE_ID: 'price_1234567890', // You'll need to create this in Stripe Dashboard
  SUBSCRIPTION_NAME: 'Web3Radar Pro',
  SUBSCRIPTION_DESCRIPTION: 'Premium access to Web3 project leads and contact information',
  MONTHLY_PRICE: 9900, // $99.00 in cents
  CURRENCY: 'usd',
  SUCCESS_URL: `${process.env.CLIENT_URL}/dashboard?success=true`,
  CANCEL_URL: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
  FREE_TRIAL_DAYS: 7, // 7-day free trial
  DISCOUNT_CODES: {
    'ProspectingGOAT12': {
      percentage: 70, // 70% off
      duration: 'once', // Apply discount only for first month
      description: '70% off first month'
    }
  }
};

module.exports = {
  stripe,
  STRIPE_CONFIG
};