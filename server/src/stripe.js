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
};

module.exports = {
  stripe,
  STRIPE_CONFIG
};