# Google OAuth Setup Guide

## Critical Issues Fixed

### 1. Missing Google OAuth Credentials
**Problem**: Placeholder values in `.env` file
**Fix**: Added proper environment variable structure

### 2. Environment URL Mismatches  
**Problem**: Hardcoded production URLs
**Fix**: Dynamic URL configuration using environment variables

### 3. OAuth Scope Issues
**Problem**: Missing `openid` scope
**Fix**: Added complete OAuth scope: `['openid', 'profile', 'email']`

### 4. Timing and Race Conditions
**Problem**: AuthSuccess component redirected too quickly
**Fix**: Fetch user data before redirect, proper async handling

### 5. Navigation Logic
**Problem**: Mixed navigation methods causing conflicts
**Fix**: Consistent use of React Router navigate with proper cleanup

## Step-by-Step Setup

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add Authorized redirect URIs:
   - Development: `http://localhost:3006/auth/google/callback`
   - Production: `https://your-domain.com/auth/google/callback`

### Step 2: Update Server Environment Variables
Replace in `/server/.env`:
```bash
GOOGLE_CLIENT_ID="your_actual_google_client_id_from_console"
GOOGLE_CLIENT_SECRET="your_actual_google_client_secret_from_console"
```

### Step 3: Update URLs for Production
For production deployment, update:
```bash
CLIENT_URL="https://your-frontend-domain.com"
API_BASE_URL="https://your-backend-domain.com"
```

### Step 4: Test the Flow
1. Start server: `cd server && npm start`
2. Start client: `cd client && npm run dev`
3. Go to `http://localhost:5173/login`
4. Click "Google" button
5. Should redirect to Google OAuth
6. After authorization, should redirect back to dashboard

## Debugging Tools

### Server Debug Endpoints
- `/debug/oauth` - Check OAuth configuration
- `/debug/oauth-url` - Generate manual OAuth URL
- `/debug/oauth-flow` - Complete flow analysis

### Console Logs to Monitor
- `🔐 OAuth Configuration:` - Shows config status
- `🔄 Google OAuth initiated` - OAuth start
- `🔍 Google Strategy callback triggered` - Google callback received
- `✅ User authenticated successfully` - User creation/login success
- `🔄 Redirecting to:` - Final redirect URL

## Common Issues and Solutions

### Issue 1: "OAuth not configured" error
- Check if GOOGLE_CLIENT_ID contains "your_"
- Verify credentials are properly set in .env
- Restart server after changing .env

### Issue 2: "Network error" in AuthSuccess
- Check API_URL in client config
- Ensure server is running on correct port
- Check CORS configuration

### Issue 3: Redirect loops
- Clear localStorage: `localStorage.clear()`
- Check CLIENT_URL in server .env
- Verify callback URL in Google Console matches server

### Issue 4: "Invalid credentials" from Google
- Double-check Client ID and Secret
- Ensure callback URL is exactly the same in Google Console
- Check if project has Google+ API enabled

## Security Checklist
- [ ] Never commit real credentials to git
- [ ] Use environment variables for all sensitive data
- [ ] Set proper CORS origins
- [ ] Use HTTPS in production
- [ ] Implement proper session security
- [ ] Validate JWT tokens properly

## Production Deployment Notes
1. Update Google Console with production callback URL
2. Set production environment variables
3. Ensure HTTPS is enabled
4. Test OAuth flow thoroughly
5. Monitor error logs for OAuth failures