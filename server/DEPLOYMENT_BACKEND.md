# Backend Deployment Guide - Free Hosting Options

## 🚀 Free Hosting Alternatives

### Option 1: Railway (Recommended)
**Why Railway?**
- ✅ Free tier with 500 hours/month
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variables
- ✅ Automatic HTTPS
- ✅ No credit card required

**Deployment Steps:**
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `web3-automated-lead-discovery`
5. Select the `server` folder as root directory
6. Railway will auto-detect Node.js and deploy

**Environment Variables to set in Railway:**
```
AIRTABLE_API_TOKEN=your_airtable_token
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_key
FROM_EMAIL=Web3Radar <noreply@rawfreedomai.com>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=3000
NODE_ENV=production
```

### Option 2: Render (Alternative)
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Create "Web Service"
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Set environment variables

### Option 3: Cyclic (Simple)
1. Go to [Cyclic.sh](https://cyclic.sh)
2. Connect GitHub
3. Deploy automatically
4. Set environment variables in dashboard

### Option 4: Vercel (Serverless)
**Note:** Requires converting to serverless functions

## 🔧 Quick Railway Deployment

### 1. Prepare Repository
Your server is already configured with:
- `package.json` with correct scripts
- `Procfile` for process management
- `railway.json` for Railway configuration
- Environment variables ready

### 2. Deploy to Railway
```bash
# Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect Railway to your GitHub repo
3. Select server folder as root
4. Set environment variables
5. Deploy!

# Option B: Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

### 3. Get Your Railway URL
After deployment, Railway will provide a URL like:
`https://your-project-name-production.up.railway.app`

### 4. Update Frontend Configuration
Update these files with your Railway URL:

**client/.env.production:**
```
VITE_API_URL=https://your-project-name-production.up.railway.app
```

**netlify.toml:**
Replace all `https://web3-prospector-backend.herokuapp.com` with your Railway URL

**client/public/_redirects:**
Replace all `https://your-backend-url.com` with your Railway URL

## 🎯 Complete Deployment Checklist

### Railway Setup:
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Deploy server folder
- [ ] Set all environment variables
- [ ] Verify deployment is running

### Frontend Update:
- [ ] Update VITE_API_URL in environment variables
- [ ] Update netlify.toml redirects
- [ ] Update _redirects file
- [ ] Push changes to trigger Netlify rebuild

### Testing:
- [ ] Test backend endpoint directly
- [ ] Test frontend API calls
- [ ] Verify registration/login flow
- [ ] Test Stripe integration
- [ ] Verify email verification

## 🔒 Environment Variables Required

```bash
# Database
AIRTABLE_API_TOKEN=your_token_here

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email Service
RESEND_API_KEY=your_resend_key
FROM_EMAIL=Web3Radar <noreply@rawfreedomai.com>

# Stripe
STRIPE_SECRET_KEY=sk_live_51RlQ0ZC1BQAlOs1Z...
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server
PORT=3000
NODE_ENV=production
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot read Username for git"
**Solution:** Use Railway's GitHub integration instead of CLI

### Issue: Build fails
**Solution:** Ensure `package.json` has correct Node version:
```json
{
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

### Issue: Environment variables not loading
**Solution:** Set them in Railway dashboard, not in .env files

### Issue: CORS errors
**Solution:** Add your Netlify domain to CORS origins in `src/index.js`

## 📱 Alternative: Local Backend Testing

If you want to test locally first:

```bash
# Start backend locally
cd server
npm install
npm start

# Update frontend to use localhost
# In client/.env.local:
VITE_API_URL=http://localhost:3006
```

## 🎉 Quick Start Commands

```bash
# 1. Push server changes
git add server/
git commit -m "Prepare server for Railway deployment"
git push origin master

# 2. Deploy to Railway (via GitHub integration)
# - Go to railway.app
# - Connect GitHub repo
# - Select server folder
# - Deploy

# 3. Update frontend with Railway URL
# - Get Railway URL from dashboard
# - Update environment variables
# - Push to trigger Netlify rebuild
```

Your backend will be live and accessible within minutes! 🚀