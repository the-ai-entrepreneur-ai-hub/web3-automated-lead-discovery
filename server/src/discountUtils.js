const { STRIPE_CONFIG } = require('./stripe');

// Utility functions for discount code validation and management
const discountUtils = {
  // Sanitize and validate discount code input
  sanitizeDiscountCode: (code) => {
    if (!code || typeof code !== 'string') {
      return { valid: false, error: 'Discount code must be a valid string' };
    }
    
    const sanitized = code.trim().toUpperCase();
    
    // Check length constraints
    if (sanitized.length < 3 || sanitized.length > 50) {
      return { valid: false, error: 'Discount code must be between 3 and 50 characters' };
    }
    
    // Check for valid characters (alphanumeric only)
    if (!/^[A-Z0-9]+$/.test(sanitized)) {
      return { valid: false, error: 'Discount code can only contain letters and numbers' };
    }
    
    return { valid: true, code: sanitized };
  },

  // Validate discount code against configuration
  validateDiscountCode: (code) => {
    const sanitized = discountUtils.sanitizeDiscountCode(code);
    if (!sanitized.valid) {
      return sanitized;
    }

    const discountConfig = STRIPE_CONFIG.DISCOUNT_CODES[sanitized.code];
    if (!discountConfig) {
      return { valid: false, error: 'Invalid discount code' };
    }

    // Check if discount is active
    if (!discountConfig.active) {
      return { valid: false, error: 'This discount code is no longer active' };
    }

    // Check expiration date
    if (discountConfig.expiresAt && new Date() > new Date(discountConfig.expiresAt)) {
      return { valid: false, error: 'This discount code has expired' };
    }

    return {
      valid: true,
      code: sanitized.code,
      config: discountConfig
    };
  },

  // Check if discount code can be used (usage limits, etc.)
  canUseDiscountCode: async (code, userId = null) => {
    const validation = discountUtils.validateDiscountCode(code);
    if (!validation.valid) {
      return validation;
    }

    // For now, we don't track usage per user, but this is where you'd add that logic
    // You could check against a database of used codes per user
    
    return {
      valid: true,
      code: validation.code,
      config: validation.config
    };
  },

  // Generate coupon ID for Stripe (ensures consistency)
  generateCouponId: (code) => {
    const sanitized = discountUtils.sanitizeDiscountCode(code);
    if (!sanitized.valid) {
      throw new Error(sanitized.error);
    }
    return `discount_${sanitized.code.toLowerCase()}`;
  },

  // Get discount details for response
  getDiscountDetails: (code) => {
    const validation = discountUtils.validateDiscountCode(code);
    if (!validation.valid) {
      return validation;
    }

    return {
      valid: true,
      percentage: validation.config.percentage,
      description: validation.config.description,
      duration: validation.config.duration,
      maxUses: validation.config.maxUses,
      expiresAt: validation.config.expiresAt
    };
  }
};

module.exports = discountUtils;