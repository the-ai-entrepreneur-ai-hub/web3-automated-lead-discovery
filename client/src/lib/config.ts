// Configuration file with fallback for environment variables
export const config = {
  // Hardcoded fallback if environment variables aren't loaded
  API_URL: import.meta.env.VITE_API_URL || 'https://web3-automated-lead-discovery-production.up.railway.app',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51RlQ0ZC1BQAlOs1ZJAlFZgbciKe0xFPBOkYhNlAbwP0FezYKthOrpMukNLzgbg26nAWlw8uFIYhe6uHEEpmTw6lK00AoGgCxoF',
  IS_PRODUCTION: import.meta.env.NODE_ENV === 'production' || import.meta.env.PROD || true,
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development' || import.meta.env.DEV || false,
  CLIENT_DOMAIN: 'https://rawfreedomai.com'
};

// Debug logging
console.log('🔧 Config loaded:', {
  API_URL: config.API_URL,
  STRIPE_KEY: config.STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...',
  IS_PRODUCTION: config.IS_PRODUCTION,
  ENV_VARS: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    NODE_ENV: import.meta.env.NODE_ENV,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  }
});

// Test API connectivity immediately
console.log('🚀 Testing API connectivity...');
fetch(config.API_URL)
  .then(response => response.text())
  .then(data => {
    console.log('✅ API connection test successful:', data);
  })
  .catch(error => {
    console.error('❌ API connection test failed:', error);
    console.error('This might explain the Network errors!');
  });