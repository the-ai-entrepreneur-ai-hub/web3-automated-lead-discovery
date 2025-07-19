# Netlify Environment Variables Setup

## Required Environment Variables

To fix the "Network error" issue, set these environment variables in your Netlify dashboard:

### Go to: https://app.netlify.com/sites/dulcet-madeleine-2018aa/settings/env

Add the following variables:

```
VITE_API_URL = https://web3-automated-lead-discovery-production.up.railway.app
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_51RlQ0ZC1BQAlOs1ZJAlFZgbciKe0xFPBOkYhNlAbwP0FezYKthOrpMukNLzgbg26nAWlw8uFIYhe6uHEEpmTw6lK00AoGgCxoF
NODE_ENV = production
```

## Steps:
1. Go to Site settings → Environment variables
2. Click "Add variable" for each one above
3. After adding all variables, go to Deploys
4. Click "Trigger deploy" → "Deploy site"

## Debug Info
The frontend console will now log the API URL to help verify the environment variables are loaded correctly.