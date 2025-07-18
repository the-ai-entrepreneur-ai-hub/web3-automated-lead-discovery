# 🚀 Quick Backend Deployment - Vercel (Easiest Option)

## Step 1: Deploy Backend to Vercel (2 minutes)

### Option A: Vercel Web Interface (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "Add New" → "Project"
4. Import your GitHub repository: `web3-automated-lead-discovery`
5. **IMPORTANT**: Set root directory to `server`
6. Vercel will auto-detect Node.js
7. Click "Deploy"

### Your Backend URL will be:
`https://your-project-name.vercel.app`

## Step 2: Set Environment Variables in Vercel
After deployment, go to your project dashboard → Settings → Environment Variables:

```
AIRTABLE_API_TOKEN=your_airtable_token_here
JWT_SECRET=your-super-secret-jwt-key
RESEND_API_KEY=your_resend_key_here
FROM_EMAIL=Web3Radar <noreply@rawfreedomai.com>
STRIPE_SECRET_KEY=sk_live_51RlQ0ZC1BQAlOs1Z...
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=production
```

## Step 3: Update Frontend Configuration

Once you get your Vercel URL (e.g., `https://web3-prospector-backend.vercel.app`), update:

### Update Netlify Environment Variables:
```
VITE_API_URL=https://your-project-name.vercel.app
```

### Update netlify.toml:
Replace all instances of:
`https://web3-prospector-backend.herokuapp.com`

With your Vercel URL:
`https://your-project-name.vercel.app`

### Update client/public/_redirects:
Replace all instances of:
`https://your-backend-url.com`

With your Vercel URL:
`https://your-project-name.vercel.app`

## Step 4: Test Your Deployment

1. Test backend directly: `https://your-project-name.vercel.app`
2. Should return: "Hello from the Web3 Prospector server!"
3. Push frontend changes to trigger Netlify rebuild
4. Test your live app!

## 🔧 Alternative: One-Click Deploy

### Railway (If Vercel doesn't work)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Render (Another option)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🎯 Complete 5-Minute Setup

```bash
# 1. Ensure code is pushed to GitHub
git add .
git commit -m "Add deployment configurations"
git push origin master

# 2. Deploy to Vercel
- Go to vercel.com
- Import GitHub repo
- Set root directory to "server"
- Deploy

# 3. Set environment variables in Vercel dashboard

# 4. Get your Vercel URL

# 5. Update frontend files with your URL

# 6. Push changes to trigger Netlify rebuild
git add .
git commit -m "Update backend URL to Vercel"
git push origin master
```

## 🚨 If You Get Errors

### Error: "Cannot find module"
**Solution:** Vercel should auto-install dependencies, but if not, check that `package.json` is in the `server` folder.

### Error: "Environment variables not found"
**Solution:** Set them in Vercel dashboard → Project Settings → Environment Variables

### Error: "CORS issues"
**Solution:** Your CORS is already configured for Netlify domains.

### Error: "Function timeout"
**Solution:** Vercel free tier has 10s timeout, should be enough for your API.

---

**Your backend will be live in under 5 minutes!** 🎉

After deployment, your full stack app will be:
- **Frontend**: `https://your-domain.netlify.app` 
- **Backend**: `https://your-project.vercel.app`
- **Database**: Airtable (already configured)
- **Email**: Resend (already configured)
- **Payments**: Stripe (already configured)