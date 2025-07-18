# 🔧 Railway Environment Variables Setup

## ✅ Correct Environment Variables for Railway

**In Railway Dashboard → Your Project → Variables tab, set these:**

```bash
# Airtable Configuration (IMPORTANT: Use AIRTABLE_API_TOKEN, not AIRTABLE_BASE_ID)
AIRTABLE_API_TOKEN=your_actual_airtable_api_token_here

# Authentication
JWT_SECRET=web3-prospector-super-secret-key-2024-secure-random-string

# Email Service
RESEND_API_KEY=re_QmBPJuba_6zbixDqUqEqGCLbD8vxXzgZ3
FROM_EMAIL=Web3Radar <noreply@rawfreedomai.com>

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Environment
NODE_ENV=production
```

## 🚨 Critical Issues to Fix:

### 1. **AIRTABLE_API_TOKEN Missing**
- You set `AIRTABLE_BASE_ID` but the server needs `AIRTABLE_API_TOKEN`
- Get your Airtable API token from: https://airtable.com/account
- Set: `AIRTABLE_API_TOKEN=your_actual_token`

### 2. **STRIPE_WEBHOOK_SECRET**
- Current value: `whsec_your_webhook_secret_here` (placeholder)
- Need to set up Stripe webhook and get real secret

## 🎯 Quick Fix Steps:

### Step 1: Fix Airtable
1. Go to https://airtable.com/account
2. Copy your Personal Access Token
3. In Railway: `AIRTABLE_API_TOKEN=pat_your_token_here`

### Step 2: Set up Stripe Webhook
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://web3-automated-lead-discovery-production.up.railway.app/stripe-webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy webhook secret: `whsec_...`
5. In Railway: `STRIPE_WEBHOOK_SECRET=whsec_actual_secret`

### Step 3: Test Backend
After setting correct variables, test:
`https://web3-automated-lead-discovery-production.up.railway.app/`

Should return: "Hello from the Web3 Prospector server!"

## 🔍 Debugging

If still getting 502 error:
1. Check Railway logs in dashboard
2. Verify all environment variables are set
3. Ensure no typos in variable names
4. Check that Airtable token has proper permissions

## ✅ Once Working

Your full-stack app will be:
- **Frontend**: Your Netlify domain
- **Backend**: https://web3-automated-lead-discovery-production.up.railway.app
- **Database**: Airtable
- **Email**: Resend  
- **Payments**: Stripe