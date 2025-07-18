# 🚀 Railway Deployment Guide

## ✅ Code is Ready for Railway!

Your server is now optimized for Railway deployment with:
- ✅ Proper `package.json` with Node.js 18.x
- ✅ Railway configuration (`railway.json`)
- ✅ Environment variables support
- ✅ Health check endpoint
- ✅ Ignore file for unnecessary files

## 🎯 Railway Deployment Steps

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click **"Deploy from GitHub repo"**
4. Select repository: `web3-automated-lead-discovery`
5. **Root Directory**: Select `server` folder
6. Click **"Deploy"**

### Step 2: Set Environment Variables
In Railway dashboard → Variables, add:

```bash
AIRTABLE_API_TOKEN=your_airtable_token_here
JWT_SECRET=your-super-secret-jwt-key-here
RESEND_API_KEY=your_resend_key_here
FROM_EMAIL=Web3Radar <noreply@rawfreedomai.com>
STRIPE_SECRET_KEY=REDACTED
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NODE_ENV=production
```

### Step 3: Get Your Railway URL
After deployment, Railway will provide a URL like:
`https://web3-prospector-production-xxxx.up.railway.app`

### Step 4: Test Your Backend
Visit your Railway URL - you should see:
"Hello from the Web3 Prospector server!"

## 🔧 After Railway Deployment

### Update Frontend Configuration

#### 1. Update Netlify Environment Variables:
```bash
VITE_API_URL=https://your-railway-url.up.railway.app
```

#### 2. Update netlify.toml:
Replace all instances of:
`https://web3-prospector-backend.herokuapp.com`

With your Railway URL:
`https://your-railway-url.up.railway.app`

#### 3. Update client/public/_redirects:
Replace all instances of:
`https://your-backend-url.com`

With your Railway URL:
`https://your-railway-url.up.railway.app`

## 🎉 Complete Setup Commands

```bash
# 1. Code is already pushed to GitHub (done!)

# 2. Deploy to Railway:
# - Go to railway.app
# - Deploy from GitHub repo
# - Set root directory to "server"
# - Set environment variables
# - Deploy!

# 3. Update frontend with Railway URL:
# - Update Netlify environment variables
# - Update netlify.toml redirects
# - Update _redirects file
# - Push changes to trigger rebuild

# 4. Test your live app!
```

## 🔍 Troubleshooting

### If deployment fails:
- Check build logs in Railway dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility

### If backend responds but frontend can't connect:
- Check CORS settings in `src/index.js`
- Verify Railway URL in frontend configuration
- Check browser console for CORS errors

### If Stripe webhook fails:
- Update webhook URL in Stripe dashboard to your Railway URL + `/stripe-webhook`

## 🚨 Important Notes

1. **Free Tier Limits**: Railway free tier gives you 500 hours/month
2. **Auto-Sleep**: App may sleep after inactivity (30 seconds cold start)
3. **Logs**: Check Railway dashboard for real-time logs
4. **Custom Domain**: You can add custom domain in Railway settings

## ✅ Railway Advantages

- ✅ **Zero configuration** - Just works with Express
- ✅ **GitHub integration** - Auto-deploys on push
- ✅ **Built-in metrics** - CPU, memory, network usage
- ✅ **Easy environment variables** - Web UI management
- ✅ **Automatic HTTPS** - SSL certificates included
- ✅ **No cold starts** for active apps

Your backend will be live in under 2 minutes! 🎉