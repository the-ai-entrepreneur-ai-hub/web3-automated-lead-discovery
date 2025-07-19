# Update Production Environment Variables

## Problem
Your production server is still redirecting to `rawfreedomai.com` instead of your actual frontend URL.

## Solution
You need to update the environment variables on your production server (Railway).

## Steps to Fix:

### 1. Update Railway Environment Variables
Go to your Railway dashboard and update these environment variables:

```bash
CLIENT_URL=https://web3-prospector.netlify.app
# OR if using different Netlify URL:
CLIENT_URL=https://dulcet-madeleine-2018aa.netlify.app
```

### 2. Check Your Actual Frontend URL
Based on the CORS config, your frontend could be on:
- `https://web3-prospector.netlify.app`
- `https://dulcet-madeleine-2018aa.netlify.app` 
- `https://web3-automated-lead-discovery.netlify.app`

### 3. Set Production Environment Variables in Railway
1. Go to Railway dashboard
2. Select your project
3. Go to Variables tab
4. Update or add: `CLIENT_URL=https://your-actual-frontend-url.netlify.app`
5. Redeploy or restart the service

### 4. Quick Test
After updating, the OAuth flow should redirect to:
`https://your-frontend-url.netlify.app/auth-success?token=...`

Instead of:
`https://rawfreedomai.com/auth-success?token=...`

## Alternative Quick Fix
If you can't access Railway right now, you can temporarily update the fallback URL in the code:

In `/server/src/index.js`, change:
```javascript
const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-success?token=${token}`;
```

To:
```javascript
const redirectUrl = `${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/auth-success?token=${token}`;
```

This will make it redirect to your frontend even if CLIENT_URL isn't set properly.