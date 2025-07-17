# Web3 Prospector - Netlify Deployment Guide

## 🚀 Netlify Deployment Setup

### Prerequisites
- Netlify account connected to your GitHub repository
- Custom domain connected to Netlify (already done)
- Backend server deployed and accessible

### 1. Repository Configuration
Your repository is already configured with:
- `netlify.toml` - Main Netlify configuration
- `client/public/_redirects` - SPA routing and API redirects
- `client/.env.production` - Production environment variables
- `build.sh` - Build script

### 2. Netlify Environment Variables
In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
VITE_API_URL=https://your-backend-url.com
VITE_STRIPE_PUBLIC_KEY=pk_live_51RlQ0ZC1BQAlOs1ZJAlFZgbciKe0xFPBOkYhNlAbwP0FezYKthOrpMukNLzgbg26nAWlw8uFIYhe6uHEEpmTw6lK00AoGgCxoF
NODE_ENV=production
```

### 3. Build Configuration
Netlify will automatically use the settings from `netlify.toml`:
- **Build command**: `cd client && npm ci && npm run build`
- **Publish directory**: `client/dist`
- **Node version**: 18

### 4. Backend Server Deployment
Your backend server needs to be deployed separately. Options:
- **Heroku**: Easy deployment with `git push heroku master`
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **Vercel**: Serverless functions

### 5. Required Updates After Deployment

#### Update API URLs
Replace `https://your-backend-url.com` in these files with your actual backend URL:
- `netlify.toml` (API redirects)
- `client/public/_redirects` (API redirects)
- `client/.env.production` (VITE_API_URL)

#### Update Domain References
Replace `https://your-domain.com` with your actual domain in:
- `client/.env.production` (VITE_APP_URL)

### 6. Stripe Configuration
Ensure your Stripe webhook endpoint is set to:
`https://your-backend-url.com/stripe-webhook`

### 7. CORS Configuration
Update your backend server's CORS settings to include your domain:
```javascript
app.use(cors({
  origin: ['https://your-domain.com', 'http://localhost:5173'],
  credentials: true
}));
```

### 8. Testing Deployment
After deployment, test these key features:
1. ✅ Registration and email verification
2. ✅ Login functionality
3. ✅ Dashboard and projects loading
4. ✅ Stripe payment integration
5. ✅ Settings and profile management

### 9. Troubleshooting

#### Common Issues:
1. **404 on page refresh**: Check `_redirects` file
2. **API calls failing**: Verify backend URL and CORS settings
3. **Stripe not working**: Check environment variables and webhook URL
4. **Build failing**: Check Node version and dependencies

#### Debug Steps:
1. Check Netlify build logs
2. Test API endpoints directly
3. Verify environment variables
4. Check browser console for errors

### 10. Performance Optimization
- Static assets are cached for 1 year
- Gzip compression enabled
- Security headers configured
- SPA routing optimized

## 📱 Mobile Responsiveness
The app is fully responsive and works on:
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🔒 Security Features
- XSS Protection
- Content Security Policy
- HTTPS enforcement
- Secure headers configuration

## 🎯 Production Checklist
- [ ] Backend server deployed and accessible
- [ ] Environment variables configured
- [ ] Domain SSL certificate active
- [ ] Stripe webhook configured
- [ ] CORS settings updated
- [ ] Email service configured
- [ ] Airtable integration working
- [ ] All features tested

## 📞 Support
For deployment issues, check:
1. Netlify build logs
2. Backend server logs
3. Browser console errors
4. Network tab in DevTools

---

**Ready to deploy!** 🚀 Your Web3 Prospector app is configured for seamless Netlify deployment with your custom domain.