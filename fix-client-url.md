# Quick Fix for OAuth Redirect Issue

## Problem
Server is redirecting to wrong CLIENT_URL after OAuth success.

## Current Issue
- Server redirects to: `https://rawfreedomai.com/auth-success`
- Your frontend is probably on: Netlify or different domain

## Quick Fix Options

### Option 1: Update CLIENT_URL in server/.env
```bash
CLIENT_URL="https://your-actual-frontend-url.netlify.app"
```

### Option 2: Test with different URLs
Based on CORS config, try one of these:
- `https://web3-prospector.netlify.app`
- `https://dulcet-madeleine-2018aa.netlify.app`
- Local: `http://localhost:5173`

## Steps to Fix:
1. Determine your actual frontend URL
2. Update `CLIENT_URL` in `/server/.env`
3. Restart your server
4. Test OAuth again

## Environment Variables to Check:
```bash
# In server/.env
CLIENT_URL="https://your-frontend-domain.com"
API_BASE_URL="https://your-backend-domain.com"

# In client/.env  
VITE_API_URL="https://your-backend-domain.com"
```

## Manual Test:
1. Go to your frontend login page
2. Click Google OAuth
3. After Google auth, should redirect to: `YOUR_FRONTEND/auth-success?token=...`
4. AuthSuccess component should then redirect to dashboard