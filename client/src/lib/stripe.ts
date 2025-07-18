import { loadStripe } from '@stripe/stripe-js';
import { config } from '@/lib/config';

// Initialize Stripe with publishable key
export const getStripe = () => {
  return loadStripe(config.STRIPE_PUBLISHABLE_KEY);
};

// Stripe related API calls
export const stripeApi = {
  createCheckoutSession: async (token: string) => {
    const response = await fetch(`${config.API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  },

  getSubscriptionStatus: async (token: string) => {
    const response = await fetch(`${config.API_URL}/subscription-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription status');
    }

    return response.json();
  },

  cancelSubscription: async (token: string) => {
    const response = await fetch(`${config.API_URL}/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return response.json();
  },
};