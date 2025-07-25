import { loadStripe } from '@stripe/stripe-js';
import { config } from '@/lib/config';

// Initialize Stripe with publishable key
export const getStripe = () => {
  return loadStripe(config.STRIPE_PUBLISHABLE_KEY);
};

// Stripe related API calls
export const stripeApi = {
  createCheckoutSession: async (token: string, discountCode?: string) => {
    const response = await fetch(`${config.API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ discountCode }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  },

  validateDiscountCode: async (token: string, discountCode: string) => {
    // Input validation
    if (!discountCode || typeof discountCode !== 'string') {
      throw new Error('Discount code must be a valid string');
    }
    
    const trimmedCode = discountCode.trim();
    if (trimmedCode.length < 3 || trimmedCode.length > 50) {
      throw new Error('Discount code must be between 3 and 50 characters');
    }
    
    const response = await fetch(`${config.API_URL}/validate-discount-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ discountCode: trimmedCode }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to validate discount code';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error, use the default message
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch subscription status';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to cancel subscription';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use the default message
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
};