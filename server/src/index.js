const express = require('express');
const Airtable = require('airtable');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');
const compression = require('compression');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { sendPasswordResetEmail, verifyEmailConfig } = require('./emailService');
const { sendEmailVerification } = require('./emailVerificationService');
const { sendPaymentReceipt, sendTestReceipt } = require('./emailServices/paymentReceiptService');
const { stripe, STRIPE_CONFIG } = require('./stripe');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3006;

// Trust proxy for Railway deployment (enables proper HTTPS detection)
app.set('trust proxy', 1);

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base('app32Pwdg1yJPDRA7');
const userTable = base('Users');
const waitlistTable = base('Service Waitlist');

// Simple in-memory cache for projects (5 minutes TTL)
let projectsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes
};

const getCachedProjects = () => {
  if (projectsCache.data && projectsCache.timestamp && 
      (Date.now() - projectsCache.timestamp) < projectsCache.ttl) {
    return projectsCache.data;
  }
  return null;
};

const setCachedProjects = (data) => {
  projectsCache.data = data;
  projectsCache.timestamp = Date.now();
};

// Performance optimizations
app.use(compression()); // Compress responses

// Configure CORS to allow credentials
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://rawfreedomai.com',
  'https://www.rawfreedomai.com',
  'https://web3-automated-lead-discovery.netlify.app',
  'https://web3-prospector.netlify.app',
  'https://dulcet-madeleine-2018aa.netlify.app',
  'https://dulcet-modelsine-2018aa.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration for OAuth
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production' || !!process.env.RAILWAY_PROJECT_ID;
console.log('🔧 Environment check:', { NODE_ENV: process.env.NODE_ENV, RAILWAY_PROJECT_ID: !!process.env.RAILWAY_PROJECT_ID, isProduction });

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret_here',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction, // Use secure cookies in production/Railway
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Validate OAuth configuration
const validateOAuthConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.error('❌ Missing Google OAuth credentials');
    return false;
  }
  
  if (clientId.includes('your_') || clientId.includes('http')) {
    console.error('❌ Invalid Google Client ID format. Should end with .apps.googleusercontent.com');
    return false;
  }
  
  if (!clientId.endsWith('.apps.googleusercontent.com')) {
    console.error('❌ Google Client ID should end with .apps.googleusercontent.com');
    return false;
  }
  
  return true;
};

const isOAuthConfigValid = validateOAuthConfig();
console.log('🔐 OAuth Configuration:', {
  isValid: isOAuthConfigValid,
  hasClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  clientIdFormat: process.env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com') ? 'Valid' : 'Invalid',
  callbackURL: `${process.env.API_BASE_URL || 'https://web3-automated-lead-discovery-production.up.railway.app'}/auth/google/callback`,
  clientUrl: process.env.CLIENT_URL
});

// Enhanced Passport configuration with proper validation
if (!isOAuthConfigValid) {
  console.error('❌ Google OAuth not properly configured. Authentication will be disabled.');
  console.error('Please ensure GOOGLE_CLIENT_ID ends with .apps.googleusercontent.com');
  console.error('And GOOGLE_CLIENT_SECRET is properly set from Google Cloud Console');
} else {
  console.log('✅ Google OAuth credentials properly configured');
}

// Only configure Passport if OAuth is properly set up
if (isOAuthConfigValid) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_BASE_URL || 'https://web3-automated-lead-discovery-production.up.railway.app'}/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
  console.log('🔍 Google Strategy callback triggered');
  console.log('📧 Profile email:', profile.emails?.[0]?.value);
  console.log('👤 Profile data:', { id: profile.id, name: profile.name });
  try {
    console.log('🔍 Google OAuth callback received for user:', profile.emails[0].value);
    
    // Check if user already exists
    const existingUser = await userTable.select({
      filterByFormula: `{email} = "${profile.emails[0].value}"`
    }).firstPage();

    if (existingUser.length > 0) {
      console.log('✅ Existing user found:', existingUser[0].fields.email);
      return done(null, existingUser[0]);
    } else {
      console.log('👤 Creating new user for:', profile.emails[0].value);
      
      // Prepare user fields (excluding googleId if field doesn't exist)
      const userFields = {
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        company: '', // Will be filled later
        tier: 'free',
        isVerified: true, // Google accounts are pre-verified
        termsAccepted: true,
        termsAcceptedDate: new Date().toISOString()
      };
      
      // Try to add googleId, but handle case where field doesn't exist
      try {
        const newUser = await userTable.create([
          {
            fields: {
              ...userFields,
              googleId: profile.id
            }
          }
        ]);
        console.log('✅ New user created with googleId:', newUser[0].fields.email);
        return done(null, newUser[0]);
      } catch (googleIdError) {
        if (googleIdError.message.includes('googleId')) {
          console.log('⚠️ googleId field not found in Airtable, creating user without it');
          // Create user without googleId field
          const newUser = await userTable.create([
            {
              fields: userFields
            }
          ]);
          console.log('✅ New user created without googleId:', newUser[0].fields.email);
          return done(null, newUser[0]);
        } else {
          throw googleIdError;
        }
      }
    }
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('⚠️ Skipping Google OAuth strategy configuration due to invalid credentials');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userTable.find(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Store processed webhook events to prevent duplicate processing
const processedWebhooks = new Set();

// Stripe webhook endpoint needs raw body, so place it before JSON middleware
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Prevent duplicate webhook processing
  const eventKey = `${event.id}-${event.type}`;
  if (processedWebhooks.has(eventKey)) {
    console.log(`✅ Already processed webhook ${event.id}`);
    return res.status(200).json({ received: true });
  }
  processedWebhooks.add(eventKey);

  console.log(`🔔 Processing webhook: ${event.type} (${event.id})`);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💳 Checkout session completed:', session.id);
        console.log('📋 Session details:', {
          customer: session.customer,
          subscription: session.subscription,
          payment_status: session.payment_status,
          mode: session.mode,
          metadata: session.metadata
        });
        
        // Validate required metadata
        if (!session.metadata?.userId) {
          console.error('❌ Missing userId in session metadata');
          throw new Error('Missing userId in session metadata');
        }
        
        // Update user with customer ID and subscription info
        try {
          // Get subscription details if available
          let subscriptionUpdate = {};
          if (session.subscription) {
            try {
              const subscription = await stripe.subscriptions.retrieve(session.subscription);
              console.log(`📋 Retrieved subscription details:`, {
                id: subscription.id,
                status: subscription.status,
                trial_end: subscription.trial_end
              });
              
              subscriptionUpdate = {
                tier: 'paid', // Give access immediately (for trials or active)
                subscriptionStatus: subscription.status,
                trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
              };
            } catch (subError) {
              console.error('❌ Error retrieving subscription:', subError);
            }
          }
          
          const updateResult = await userTable.update([
            {
              id: session.metadata.userId,
              fields: {
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription || null,
                lastCheckoutSession: session.id,
                lastPaymentDate: new Date().toISOString(),
                ...subscriptionUpdate
              }
            }
          ]);
          
          console.log(`✅ User ${session.metadata.userEmail} checkout completed`);
          console.log('📊 Database update result:', updateResult[0]?.id);
          
          // Send payment receipt email
          try {
            const userDetails = {
              firstName: session.metadata.firstName || 'Valued Customer',
              lastName: session.metadata.lastName || '',
              email: session.metadata.userEmail
            };
            
            const paymentDetails = {
              amount: session.amount_total,
              currency: session.currency,
              paymentMethod: 'Credit Card',
              transactionId: session.payment_intent,
              date: new Date(session.created * 1000).toISOString()
            };
            
            const subscriptionDetails = {
              planName: 'Web3Radar Premium',
              billingCycle: 'Monthly',
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            
            await sendPaymentReceipt(userDetails, paymentDetails, subscriptionDetails);
            console.log(`📧 Payment receipt sent to ${session.metadata.userEmail}`);
          } catch (emailError) {
            console.error('❌ Error sending payment receipt:', emailError);
          }
        } catch (dbError) {
          console.error('❌ Critical: Failed to update user tier in database:', dbError);
          throw dbError;
        }
        break;
    
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        console.log('🚫 Subscription cancelled:', subscription.id);
        
        try {
          const users = await userTable.select({
            filterByFormula: `{stripeSubscriptionId} = "${subscription.id}"`
          }).firstPage();
          
          if (users.length > 0) {
            await userTable.update([
              {
                id: users[0].id,
                fields: {
                  tier: 'free',
                  stripeSubscriptionId: '',
                  subscriptionStatus: 'cancelled',
                  cancellationDate: new Date().toISOString()
                }
              }
            ]);
            console.log(`✅ User subscription cancelled: ${users[0].fields.email}`);
          } else {
            console.log(`⚠️ No user found for subscription ${subscription.id}`);
          }
        } catch (error) {
          console.error('❌ Error updating user tier on cancellation:', error);
          throw error;
        }
        break;
      
      
      case 'customer.subscription.updated':
        const updatedSub = event.data.object;
        console.log(`🔄 Subscription updated: ${updatedSub.id} - Status: ${updatedSub.status}`);
        
        try {
          const users = await userTable.select({
            filterByFormula: `{stripeSubscriptionId} = "${updatedSub.id}"`
          }).firstPage();
          
          if (users.length > 0) {
            const newTier = updatedSub.status === 'active' ? 'paid' : 'free';
            await userTable.update([
              {
                id: users[0].id,
                fields: {
                  tier: newTier,
                  subscriptionStatus: updatedSub.status
                }
              }
            ]);
            console.log(`✅ User tier updated to ${newTier}: ${users[0].fields.email}`);
          }
        } catch (error) {
          console.error('❌ Error updating subscription status:', error);
        }
        break;
      
      case 'customer.subscription.created':
        const newSubscription = event.data.object;
        console.log(`🆕 New subscription created: ${newSubscription.id} - Status: ${newSubscription.status}`);
        console.log(`📋 Subscription details:`, {
          customer: newSubscription.customer,
          status: newSubscription.status,
          trial_end: newSubscription.trial_end,
          current_period_start: newSubscription.current_period_start,
          current_period_end: newSubscription.current_period_end
        });
        
        try {
          const users = await userTable.select({
            filterByFormula: `{stripeCustomerId} = "${newSubscription.customer}"`
          }).firstPage();
          
          console.log(`🔍 Found ${users.length} users for customer ${newSubscription.customer}`);
          
          if (users.length > 0) {
            // For trial subscriptions, set tier to paid immediately (trial access)
            const isTrialing = newSubscription.status === 'trialing';
            const updateData = {
              tier: 'paid', // Give access during trial
              stripeSubscriptionId: newSubscription.id,
              subscriptionStatus: newSubscription.status,
              trialEnd: isTrialing ? new Date(newSubscription.trial_end * 1000).toISOString() : null
            };
            
            console.log(`📝 Updating user with data:`, updateData);
            
            const updateResult = await userTable.update([
              {
                id: users[0].id,
                fields: updateData
              }
            ]);
            
            console.log(`✅ User subscription created ${isTrialing ? '(trialing)' : '(active)'}: ${users[0].fields.email}`);
            console.log(`📊 Update result:`, updateResult[0]?.id);
          } else {
            console.error(`❌ No user found for Stripe customer: ${newSubscription.customer}`);
          }
        } catch (error) {
          console.error('❌ Error handling subscription creation:', error);
          console.error('Error details:', error.message);
        }
        break;
      
      case 'invoice.payment_succeeded':
        const paidInvoice = event.data.object;
        console.log(`💰 Payment succeeded for invoice: ${paidInvoice.id}`);
        
        try {
          const users = await userTable.select({
            filterByFormula: `{stripeCustomerId} = "${paidInvoice.customer}"`
          }).firstPage();
          
          if (users.length > 0) {
            await userTable.update([
              {
                id: users[0].id,
                fields: {
                  tier: 'paid',
                  subscriptionStatus: 'active',
                  lastPaymentDate: new Date().toISOString()
                }
              }
            ]);
            console.log(`✅ User payment succeeded (trial converted): ${users[0].fields.email}`);
          }
        } catch (error) {
          console.error('❌ Error handling payment success:', error);
        }
        break;
      
      case 'customer.subscription.trial_will_end':
        const trialEnding = event.data.object;
        console.log(`⏰ Trial ending soon for subscription: ${trialEnding.id}`);
        
        try {
          const users = await userTable.select({
            filterByFormula: `{stripeSubscriptionId} = "${trialEnding.id}"`
          }).firstPage();
          
          if (users.length > 0) {
            console.log(`📧 Trial ending notification for user: ${users[0].fields.email}`);
            // You can send an email here if needed
          }
        } catch (error) {
          console.error('❌ Error handling trial ending notification:', error);
        }
        break;
      
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log(`💸 Payment failed for invoice: ${failedInvoice.id}`);
        
        // If this is a trial conversion failure, downgrade user
        try {
          const users = await userTable.select({
            filterByFormula: `{stripeCustomerId} = "${failedInvoice.customer}"`
          }).firstPage();
          
          if (users.length > 0) {
            await userTable.update([
              {
                id: users[0].id,
                fields: {
                  tier: 'free', // Downgrade when trial payment fails
                  subscriptionStatus: 'payment_failed',
                  lastPaymentFailure: new Date().toISOString()
                }
              }
            ]);
            console.log(`⬇️ User downgraded due to payment failure: ${users[0].fields.email}`);
          }
        } catch (error) {
          console.error('❌ Error handling payment failure:', error);
        }
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    
    // Clean up old processed webhooks (keep last 1000)
    if (processedWebhooks.size > 1000) {
      const webhooksArray = Array.from(processedWebhooks);
      processedWebhooks.clear();
      webhooksArray.slice(-500).forEach(id => processedWebhooks.add(id));
    }
    
  } catch (webhookError) {
    console.error('❌ Critical webhook processing error:', webhookError);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.status(200).json({ received: true, processed: true });
});

// JSON middleware for all other routes
app.use(express.json({ limit: '10mb' }));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Web3 Prospector server is running',
    timestamp: new Date().toISOString(),
    oauth_configured: isOAuthConfigValid,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check OAuth configuration
app.get('/debug/oauth', (req, res) => {
  res.json({
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    fullClientId: process.env.GOOGLE_CLIENT_ID,
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
    callbackUrl: 'https://web3-automated-lead-discovery-production.up.railway.app/auth/google/callback',
    detectedUrl: `${req.protocol}://${req.get('host')}/auth/google/callback`,
    isConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    trustProxy: app.get('trust proxy'),
    googleConsoleInstructions: {
      clientIdToFind: process.env.GOOGLE_CLIENT_ID,
      redirectUriToAdd: 'https://web3-automated-lead-discovery-production.up.railway.app/auth/google/callback',
      consoleUrl: 'https://console.cloud.google.com/apis/credentials'
    }
  });
});

// Debug endpoint to check environment variables
app.get('/debug/env', (req, res) => {
  const rawClientUrl = process.env.CLIENT_URL;
  const hasDoubleUrl = rawClientUrl && rawClientUrl.includes('https://') && 
                      rawClientUrl.indexOf('https://') !== rawClientUrl.lastIndexOf('https://');
  
  res.json({
    CLIENT_URL_RAW: rawClientUrl,
    CLIENT_URL_HAS_DOUBLE_URL: hasDoubleUrl,
    CLIENT_URL_SHOULD_BE: 'https://rawfreedomai.com',
    API_BASE_URL: process.env.API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    RAILWAY_PROJECT_ID: !!process.env.RAILWAY_PROJECT_ID,
    allClientEnvVars: Object.keys(process.env).filter(key => key.includes('CLIENT')),
    CRITICAL_ISSUE: hasDoubleUrl ? 'CLIENT_URL contains duplicate URLs - FIX IMMEDIATELY' : 'CLIENT_URL format looks OK',
    FIX_INSTRUCTION: hasDoubleUrl ? 'Set CLIENT_URL to: https://rawfreedomai.com' : 'Environment variable format is correct'
  });
});

// Test endpoint to manually generate OAuth URL
app.get('/debug/oauth-url', (req, res) => {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: 'https://web3-automated-lead-discovery-production.up.railway.app/auth/google/callback',
    response_type: 'code',
    scope: 'profile email',
    access_type: 'offline',
    prompt: 'consent'
  });
  
  const oauthUrl = `${baseUrl}?${params.toString()}`;
  
  res.json({
    message: 'Manual OAuth URL for testing',
    oauthUrl: oauthUrl,
    params: Object.fromEntries(params.entries()),
    instructions: 'Copy the oauthUrl and paste it in your browser to test Google OAuth directly'
  });
});

// Comprehensive OAuth flow debugging endpoint
app.get('/debug/oauth-flow', (req, res) => {
  res.json({
    flow_analysis: {
      step1_initiation: {
        endpoint: '/auth/google',
        expected_redirect: 'https://accounts.google.com/o/oauth2/v2/auth',
        client_id: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
        callback_url: 'https://web3-automated-lead-discovery-production.up.railway.app/auth/google/callback'
      },
      step2_google_auth: {
        user_authorizes: 'Google handles this step',
        google_redirects_to: 'https://web3-automated-lead-discovery-production.up.railway.app/auth/google/callback?code=...'
      },
      step3_callback_processing: {
        endpoint: '/auth/google/callback',
        passport_exchanges_code: 'for access token',
        creates_user_or_finds_existing: 'in Airtable',
        generates_jwt: 'with user ID'
      },
      step4_frontend_redirect: {
        backend_redirects_to: `${process.env.CLIENT_URL}/auth-success?token=...`,
        expected_client_url: process.env.CLIENT_URL,
        frontend_should_store_token: 'in localStorage',
        frontend_should_redirect_to: '/dashboard'
      },
      potential_failure_points: [
        'AuthSuccess component not loading',
        'localStorage not storing token',
        'Dashboard checking token too early',
        'React Router navigation issues',
        'JWT token invalid or expired',
        'CORS/browser security blocking',
        'Environment variable mismatch',
        'Component timing race conditions',
        'JavaScript errors in console',
        'URL parameter parsing failures'
      ],
      debug_urls: {
        oauth_config: '/debug/oauth',
        oauth_manual_url: '/debug/oauth-url',
        profile_test: '/profile (with Bearer token)',
        direct_oauth: '/auth/google'
      }
    }
  });
});

// Google OAuth routes
app.get('/auth/google', (req, res, next) => {
  console.log('🔄 Google OAuth initiated');
  console.log('🔗 Callback URL will be: https://web3-automated-lead-discovery-production.up.railway.app/auth/google/callback');
  console.log('🌐 CLIENT_URL:', process.env.CLIENT_URL);
  console.log('🔑 Client ID status:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('🔐 Client secret status:', !!process.env.GOOGLE_CLIENT_SECRET);
  
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes('your_')) {
    console.error('❌ Cannot initiate Google OAuth: Missing or invalid credentials');
    let frontendUrl = process.env.CLIENT_URL || 'https://web3-prospector.netlify.app';
    frontendUrl = frontendUrl.replace(/\/+$/, '');
    return res.redirect(`${frontendUrl}/#/login?error=oauth_not_configured`);
  }
  
  try {
    console.log('🔧 OAuth params:', { 
      scope: ['openid', 'profile', 'email'],
      clientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
      fullClientId: process.env.GOOGLE_CLIENT_ID
    });
    
    console.log('🚀 Attempting to authenticate with Google...');
    passport.authenticate('google', { 
      scope: ['openid', 'profile', 'email']
    })(req, res, next);
  } catch (error) {
    console.error('❌ Error during Google OAuth initiation:', error);
    let frontendUrl = process.env.CLIENT_URL || 'https://web3-prospector.netlify.app';
    frontendUrl = frontendUrl.replace(/\/+$/, '');
    res.redirect(`${frontendUrl}/#/login?error=oauth_initiation_failed`);
  }
});

app.get('/auth/google/callback',
  (req, res, next) => {
    console.log('🔄 Google OAuth callback received');
    console.log('📥 Callback query params:', req.query);
    console.log('📋 Callback URL called:', req.url);
    
    // Check for error in callback
    if (req.query.error) {
      console.error('❌ Google OAuth error in callback:', req.query.error);
      console.error('📄 Error description:', req.query.error_description);
      let frontendUrl = process.env.CLIENT_URL || 'https://dulcet-madeleine-2018aa.netlify.app';
      frontendUrl = frontendUrl.replace(/\/+$/, '');
      return res.redirect(`${frontendUrl}/#/login?error=google_oauth_error&details=${encodeURIComponent(req.query.error_description || req.query.error)}`);
    }
    
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${(process.env.CLIENT_URL || 'https://rawfreedomai.com').replace(/\/+$/, '')}/#/login?error=oauth_failed`
    })(req, res, next);
  },
  async (req, res) => {
    try {
      console.log('🔍 Processing OAuth callback...');
      console.log('👤 User object:', req.user);
      console.log('🔑 User ID:', req.user?.id);
      console.log('📧 User fields:', req.user?.fields);
      
      if (!req.user) {
        console.error('❌ No user data received from Google');
        let frontendUrl = process.env.CLIENT_URL || 'https://dulcet-madeleine-2018aa.netlify.app';
        frontendUrl = frontendUrl.replace(/\/+$/, '');
        return res.redirect(`${frontendUrl}/#/login?error=no_user_data`);
      }

      console.log('✅ User authenticated successfully:', req.user.fields?.email || req.user.email);
      
      // Generate JWT token for the authenticated user
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
      console.log('🎫 Generated JWT token for user:', req.user.id);
      
      // Redirect to frontend with token - CRITICAL URL CONSTRUCTION FIX
      let frontendUrl = process.env.CLIENT_URL || 'https://rawfreedomai.com';
      console.log('🌐 Raw CLIENT_URL from env:', JSON.stringify(process.env.CLIENT_URL));
      console.log('🔧 Before cleanup:', JSON.stringify(frontendUrl));
      
      // CRITICAL FIX: Handle malformed CLIENT_URL that might contain double URLs
      if (frontendUrl.includes('https://') && frontendUrl.indexOf('https://') !== frontendUrl.lastIndexOf('https://')) {
        // Extract the first valid URL if CLIENT_URL contains multiple URLs
        const firstHttpsIndex = frontendUrl.indexOf('https://');
        const secondHttpsIndex = frontendUrl.indexOf('https://', firstHttpsIndex + 1);
        if (secondHttpsIndex !== -1) {
          frontendUrl = frontendUrl.substring(secondHttpsIndex);
          console.log('🔧 Fixed duplicate URL issue:', frontendUrl);
        }
      }
      
      // Clean up trailing slashes and whitespace
      frontendUrl = frontendUrl.replace(/\/+$/, '').trim();
      
      // Validate URL format
      if (!frontendUrl.startsWith('http')) {
        frontendUrl = 'https://rawfreedomai.com';
        console.log('🔧 Invalid URL detected, using fallback:', frontendUrl);
      }
      
      console.log('🔧 After cleanup:', JSON.stringify(frontendUrl));
      // CRITICAL FIX: Use hash routing for React app
      const redirectUrl = `${frontendUrl}/#/auth-success?token=${encodeURIComponent(token)}`;
      console.log('🔄 Final redirect URL (with hash routing):', redirectUrl);
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      console.error('📋 Error stack:', error.stack);
      let frontendUrl = process.env.CLIENT_URL || 'https://dulcet-madeleine-2018aa.netlify.app';
      frontendUrl = frontendUrl.replace(/\/+$/, '');
      res.redirect(`${frontendUrl}/#/login?error=oauth_callback_failed`);
    }
  }
);

// Registration endpoint - Step 1: Send verification code
app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, company, acceptTerms } = req.body;
  
  // Validate required fields
  if (!email || !password || !firstName || !lastName || !company) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate terms acceptance
  if (!acceptTerms) {
    return res.status(400).json({ error: 'You must accept the Terms of Service and Privacy Policy to create an account' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const existingUser = await userTable.select({
      filterByFormula: `{email} = "${email}"`
    }).firstPage();

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Send verification email
    console.log('Attempting to send verification email to:', email);
    let verificationResult;
    try {
      verificationResult = await sendEmailVerification(email);
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }
    
    // Try to store verification data in Airtable, fallback to memory if fields don't exist
    let usingAirtable = false;
    try {
      // Create pending user record in Airtable with verification data
      const pendingUser = await userTable.create([
        {
          fields: {
            email: email,
            verificationCode: verificationResult.verificationCode,
            verificationCodeExpiry: verificationResult.expiryTime.toISOString(),
            isVerified: false,
            pendingRegistration: JSON.stringify({
              password,
              firstName,
              lastName,
              company,
              acceptTerms,
              timestamp: new Date()
            })
          }
        }
      ]);
      
      console.log(`Verification data stored in Airtable for ${email}`);
      console.log('Airtable record ID:', pendingUser[0].id);
      usingAirtable = true;
    } catch (airtableError) {
      console.log('Airtable verification fields not available, using in-memory storage');
      console.log('Airtable error:', airtableError.message);
      usingAirtable = false;
    }

    if (!usingAirtable) {
      // Fallback to in-memory storage
      global.pendingRegistrations = global.pendingRegistrations || {};
      global.pendingRegistrations[email] = {
        email,
        password,
        firstName,
        lastName,
        company,
        acceptTerms,
        verificationCode: verificationResult.verificationCode,
        expiryTime: verificationResult.expiryTime,
        timestamp: new Date()
      };
      console.log('Stored verification data in memory');
    }
    
    console.log(`Verification code sent to ${email}`);
    console.log('Verification data stored:', {
      email: email,
      verificationCode: verificationResult.verificationCode,
      verificationCodeType: typeof verificationResult.verificationCode,
      expiryTime: verificationResult.expiryTime,
      storage: usingAirtable ? 'Airtable' : 'Memory'
    });
    
    // For development, log the preview URL
    if (verificationResult.previewUrl) {
      console.log('Email preview URL:', verificationResult.previewUrl);
    }

    res.json({ 
      message: 'Verification code sent to your email. Please check your inbox.',
      success: true,
      requiresVerification: true
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Registration endpoint - Step 2: Verify email and complete registration
app.post('/verify-email', async (req, res) => {
  const { email, verificationCode } = req.body;
  
  // Validate required fields
  if (!email || !verificationCode) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  try {
    // Try to check if pending registration exists in Airtable first
    let pendingUsers = [];
    let usingAirtable = false;
    
    try {
      pendingUsers = await userTable.select({
        filterByFormula: `AND({email} = "${email}", {verificationCode} != "", {isVerified} = FALSE())`
      }).firstPage();
      usingAirtable = true;
    } catch (airtableError) {
      console.log('Airtable verification fields not available, using in-memory storage');
      usingAirtable = false;
    }

    if (!usingAirtable || pendingUsers.length === 0) {
      // Fall back to in-memory storage
      global.pendingRegistrations = global.pendingRegistrations || {};
      const pendingReg = global.pendingRegistrations[email];

      if (!pendingReg) {
        console.log('No pending registration found for email:', email);
        return res.status(400).json({ 
          error: 'No pending registration found for this email. Please try registering again.' 
        });
      }

      // Handle in-memory verification (fallback)
      const storedCode = String(pendingReg.verificationCode);
      const receivedCode = String(verificationCode);
      
      if (storedCode !== receivedCode) {
        return res.status(400).json({ error: 'Invalid verification code. Please check the code and try again.' });
      }

      if (new Date() > pendingReg.expiryTime) {
        delete global.pendingRegistrations[email];
        return res.status(400).json({ error: 'Verification code has expired. Please register again.' });
      }

      // Create user account from memory
      const hashedPassword = await bcrypt.hash(pendingReg.password, 10);
      const records = await userTable.create([
        {
          fields: {
            email: pendingReg.email,
            password: hashedPassword,
            tier: 'free',
            firstName: pendingReg.firstName,
            lastName: pendingReg.lastName,
            company: pendingReg.company,
            isVerified: true,
            termsAccepted: pendingReg.acceptTerms,
            termsAcceptedDate: new Date().toISOString()
          }
        }
      ]);

      delete global.pendingRegistrations[email];
      
      // Generate JWT token
      const token = jwt.sign({ id: records[0].id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
      
      return res.json({ 
        token, 
        user: {
          id: records[0].id,
          email: records[0].fields.email,
          firstName: records[0].fields.firstName,
          lastName: records[0].fields.lastName,
          company: records[0].fields.company,
          tier: records[0].fields.tier,
          isVerified: records[0].fields.isVerified
        },
        message: 'Email verified successfully! Account created.'
      });
    }

    // Handle Airtable verification
    const pendingUser = pendingUsers[0];
    const storedCode = String(pendingUser.fields.verificationCode);
    const receivedCode = String(verificationCode);

    console.log('Verification attempt from Airtable:', {
      email: email,
      receivedCode: receivedCode,
      storedCode: storedCode,
      match: storedCode === receivedCode
    });

    if (storedCode !== receivedCode) {
      console.log('Verification code mismatch!');
      return res.status(400).json({ error: 'Invalid verification code. Please check the code and try again.' });
    }

    // Check if code has expired
    const now = new Date();
    const expiryTime = new Date(pendingUser.fields.verificationCodeExpiry);
    
    if (now > expiryTime) {
      console.log('Verification code expired:', {
        email: email,
        now: now,
        expiryTime: expiryTime,
        expired: now > expiryTime
      });
      
      // Clean up expired registration
      await userTable.destroy([pendingUser.id]);
      return res.status(400).json({ error: 'Verification code has expired. Please register again.' });
    }

    // Get the pending registration data
    const pendingData = JSON.parse(pendingUser.fields.pendingRegistration);
    const hashedPassword = await bcrypt.hash(pendingData.password, 10);

    // Update the user record to complete registration
    const updatedUser = await userTable.update([
      {
        id: pendingUser.id,
        fields: {
          password: hashedPassword,
          tier: 'free',
          firstName: pendingData.firstName,
          lastName: pendingData.lastName,
          company: pendingData.company,
          isVerified: true,
          termsAccepted: pendingData.acceptTerms,
          termsAcceptedDate: new Date().toISOString(),
          verificationCode: '', // Clear the verification code
          verificationCodeExpiry: null,
          pendingRegistration: '' // Clear pending data
        }
      }
    ]);

    // Generate JWT token
    const token = jwt.sign({ id: updatedUser[0].id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
    
    console.log(`Email verified and account created for ${email}`);
    
    res.json({ 
      token, 
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].fields.email,
        firstName: updatedUser[0].fields.firstName,
        lastName: updatedUser[0].fields.lastName,
        company: updatedUser[0].fields.company,
        tier: updatedUser[0].fields.tier,
        isVerified: updatedUser[0].fields.isVerified
      },
      message: 'Email verified successfully! Account created.'
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ error: 'Server error during email verification' });
  }
});

// Resend verification code endpoint
app.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Try to check if pending registration exists in Airtable first
    let pendingUsers = [];
    let usingAirtable = false;
    
    try {
      pendingUsers = await userTable.select({
        filterByFormula: `AND({email} = "${email}", {verificationCode} != "", {isVerified} = FALSE())`
      }).firstPage();
      usingAirtable = true;
    } catch (airtableError) {
      console.log('Airtable verification fields not available, using in-memory storage');
      usingAirtable = false;
    }

    if (!usingAirtable || pendingUsers.length === 0) {
      // Fall back to in-memory storage
      global.pendingRegistrations = global.pendingRegistrations || {};
      const pendingReg = global.pendingRegistrations[email];

      if (!pendingReg) {
        return res.status(400).json({ error: 'No pending registration found for this email' });
      }

      // Send new verification email
      const verificationResult = await sendEmailVerification(email);
      
      // Update pending registration with new code
      global.pendingRegistrations[email] = {
        ...pendingReg,
        verificationCode: verificationResult.verificationCode,
        expiryTime: verificationResult.expiryTime,
        timestamp: new Date()
      };

      console.log(`New verification code sent to ${email} (memory)`);
      
      if (verificationResult.previewUrl) {
        console.log('Email preview URL:', verificationResult.previewUrl);
      }

      return res.json({ 
        message: 'New verification code sent to your email.',
        success: true
      });
    }

    // Handle Airtable resend
    const pendingUser = pendingUsers[0];
    const verificationResult = await sendEmailVerification(email);
    
    // Update the record with new verification code
    await userTable.update([
      {
        id: pendingUser.id,
        fields: {
          verificationCode: verificationResult.verificationCode,
          verificationCodeExpiry: verificationResult.expiryTime.toISOString()
        }
      }
    ]);

    console.log(`New verification code sent to ${email} (Airtable)`);
    
    // For development, log the preview URL
    if (verificationResult.previewUrl) {
      console.log('Email preview URL:', verificationResult.previewUrl);
    }

    res.json({ 
      message: 'New verification code sent to your email.',
      success: true
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ error: 'Server error sending verification code' });
  }
});

app.post('/login', async (req, res) => {
  console.log('Login attempt received');
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const records = await userTable.select({
      filterByFormula: `{email} = "${email}"`
    }).firstPage();

    if (records.length === 0) {
      console.error('Login error: User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = records[0];
    const passwordMatch = await bcrypt.compare(password, user.fields.password);

    if (!passwordMatch) {
      console.error('Login error: Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
    
    console.log('Login successful for user:', user.fields.email);
    console.log('Login - User ID:', user.id);
    console.log('Login - Full user record:', user.fields);
    
    const userResponse = {
      id: user.id,
      email: user.fields.email,
      firstName: user.fields.firstName,
      lastName: user.fields.lastName,
      company: user.fields.company,
      tier: user.fields.tier
    };
    
    console.log('Login - Returning user data:', userResponse);
    res.json({ 
      token,
      user: userResponse
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Forgot password endpoint
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check if user exists
    const existingUser = await userTable.select({
      filterByFormula: `{email} = "${email}"`
    }).firstPage();

    if (existingUser.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Try to update user with reset token (fields may not exist in Airtable)
    try {
      await userTable.update([
        {
          id: existingUser[0].id,
          fields: {
            resetToken: resetToken,
            resetTokenExpiry: resetTokenExpiry.toISOString()
          }
        }
      ]);
    } catch (updateError) {
      // If fields don't exist in Airtable, we'll use in-memory storage for demo
      console.log('Note: resetToken fields not found in Airtable schema. Using in-memory storage for demo.');
      // Store in memory for demo (in production, use proper database)
      global.resetTokens = global.resetTokens || {};
      global.resetTokens[email] = { token: resetToken, expiry: resetTokenExpiry };
    }

    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(email, resetToken);
      console.log(`Password reset email sent to ${email}`);
      
      // For development, log the preview URL
      if (emailResult.previewUrl) {
        console.log('Email preview URL:', emailResult.previewUrl);
      }
      
      res.json({ 
        message: 'If the email exists, a reset link has been sent.',
        success: true
      });
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      
      // Still respond with success message for security (don't reveal email sending errors)
      res.json({ 
        message: 'If the email exists, a reset link has been sent.',
        success: true
      });
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password endpoint
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    let user = null;
    let userEmail = null;

    // First try to find user by token in Airtable
    try {
      const users = await userTable.select({
        filterByFormula: `{resetToken} = "${token}"`
      }).firstPage();

      if (users.length > 0) {
        user = users[0];
        userEmail = user.fields.email;
        const tokenExpiry = new Date(user.fields.resetTokenExpiry);
        
        if (tokenExpiry < new Date()) {
          return res.status(400).json({ error: 'Reset token has expired' });
        }
      }
    } catch (airtableError) {
      // Fallback to in-memory storage
      global.resetTokens = global.resetTokens || {};
      for (const [email, tokenData] of Object.entries(global.resetTokens)) {
        if (tokenData.token === token) {
          if (tokenData.expiry < new Date()) {
            return res.status(400).json({ error: 'Reset token has expired' });
          }
          userEmail = email;
          // Find user by email
          const users = await userTable.select({
            filterByFormula: `{email} = "${email}"`
          }).firstPage();
          if (users.length > 0) {
            user = users[0];
          }
          break;
        }
      }
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await userTable.update([
      {
        id: user.id,
        fields: {
          password: hashedPassword
        }
      }
    ]);

    // Clear reset token from memory if it exists there
    if (global.resetTokens && global.resetTokens[userEmail]) {
      delete global.resetTokens[userEmail];
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join service waitlist
app.post('/join-waitlist', async (req, res) => {
  const { email, serviceTag } = req.body;

  if (!email || !serviceTag) {
    return res.status(400).json({ error: 'Email and service tag are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate service tag
  const validServiceTags = ['market-intelligence', 'competitor-analysis', 'contact-enrichment'];
  if (!validServiceTags.includes(serviceTag)) {
    return res.status(400).json({ error: 'Invalid service tag' });
  }

  try {
    // Check if email already exists for this service
    const existingEntry = await waitlistTable.select({
      filterByFormula: `AND({Email} = "${email}", {Service Tag} = "${serviceTag}")`
    }).firstPage();

    if (existingEntry.length > 0) {
      return res.status(400).json({ error: 'Email already registered for this service' });
    }

    // Add to waitlist
    await waitlistTable.create([
      {
        fields: {
          Email: email,
          'Service Tag': serviceTag,
          'Date Added': new Date().toISOString().split('T')[0],
          Status: 'active',
          Notified: false
        }
      }
    ]);

    console.log(`Added ${email} to waitlist for ${serviceTag}`);
    res.json({ message: 'Successfully joined waitlist!' });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    res.status(500).json({ error: 'Failed to join waitlist. Please try again.' });
  }
});

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const records = await userTable.find(req.user.id);
    console.log('Profile API - User ID:', req.user.id);
    console.log('Profile API - User record:', records.fields);
    const userData = {
      id: records.id,
      email: records.fields.email,
      firstName: records.fields.firstName,
      lastName: records.fields.lastName,
      company: records.fields.company,
      tier: records.fields.tier
    };
    console.log('Profile API - Returning user data:', userData);
    res.json(userData);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.get('/projects', authenticateToken, (req, res) => {
  // Check cache first
  const cachedProjects = getCachedProjects();
  if (cachedProjects) {
    console.log('Returning cached projects');
    return res.json(cachedProjects);
  }

  const projects = [];
  base('Leads').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
      projects.push(record.fields);
    });
    fetchNextPage();
  }, function done(err) {
    if (err) { 
      console.error('Airtable error:', err); 
      return res.status(500).json({ error: 'Failed to fetch projects from Airtable' });
    }
    console.log(`Successfully fetched ${projects.length} projects from Airtable`);
    
    // Cache the results
    setCachedProjects(projects);
    
    res.json(projects);
  });
});

// Export endpoint for premium users
app.get('/export-premium', authenticateToken, async (req, res) => {
  try {
    // Check if user is premium
    const userRecord = await userTable.find(req.user.id);
    if (userRecord.fields.tier !== 'paid') {
      return res.status(403).json({ error: 'Premium access required' });
    }

    console.log('Fetching ALL projects for premium export...');
    const projects = [];
    
    await new Promise((resolve, reject) => {
      base('Leads').select({
        view: "Grid view"
      }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
          projects.push(record.fields);
        });
        fetchNextPage();
      }, function done(err) {
        if (err) {
          console.error('Airtable error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log(`Total projects fetched: ${projects.length}`);
    
    // Filter projects that have at least one social media link
    const projectsWithSocials = projects.filter(p => 
      (p.Twitter && p.Twitter.trim() !== '') || 
      (p.LinkedIn && p.LinkedIn.trim() !== '') || 
      (p.Telegram && p.Telegram.trim() !== '')
    );

    console.log(`Projects with social media: ${projectsWithSocials.length}`);

    // Prepare CSV data
    const csvData = projectsWithSocials.map(p => ({
      "Project Name": p["Project Name"] || '',
      "Website": p.Website || '',
      "Twitter": p.Twitter || '',
      "LinkedIn": p.LinkedIn || '',
      "Telegram": p.Telegram || ''
    }));

    res.json({
      total: projects.length,
      withSocials: projectsWithSocials.length,
      data: csvData
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Logout endpoint (mainly for server-side token invalidation if needed)
app.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT setup, logout is typically handled client-side
  // But we can log the action for security monitoring
  console.log('User logged out:', req.user.id);
  res.json({ message: 'Logged out successfully' });
});

// Debug endpoint to check for duplicate users
app.get('/debug-users', async (req, res) => {
  try {
    const users = await userTable.select().firstPage();
    console.log('All users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Email: ${user.fields.email}, Name: ${user.fields.firstName} ${user.fields.lastName}`);
    });
    res.json(users.map(user => ({
      id: user.id,
      email: user.fields.email,
      firstName: user.fields.firstName,
      lastName: user.fields.lastName,
      company: user.fields.company,
      tier: user.fields.tier
    })));
  } catch (err) {
    console.error('Debug users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/seed', async (req, res) => {
  const email = 'paid@example.com';
  const password = 'password';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const records = await userTable.create([
      {
        fields: {
          email: email,
          password: hashedPassword,
          tier: 'paid',
          firstName: 'Paid',
          lastName: 'User',
          company: 'Example Inc.'
        }
      }
    ]);
    res.json({ user: records[0].fields });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Email already registered' });
  }
});

// Stripe Payment Endpoints

// Create checkout session for subscription
app.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { discountCode } = req.body;
    
    // Validate Stripe configuration
    if (!STRIPE_CONFIG.IS_CONFIGURED) {
      console.error('❌ Stripe not properly configured');
      return res.status(500).json({ error: 'Payment system not configured' });
    }
    
    const user = await userTable.find(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already subscribed
    if (user.fields.tier === 'paid' && user.fields.subscriptionStatus === 'active') {
      return res.status(400).json({ error: 'User already has active subscription' });
    }

    console.log(`💳 Creating checkout session for user: ${user.fields.email}`);
    console.log(`📋 User fields available:`, Object.keys(user.fields));
    console.log(`🔑 Current user data:`, {
      tier: user.fields.tier,
      stripeCustomerId: user.fields.stripeCustomerId || 'MISSING',
      subscriptionStatus: user.fields.subscriptionStatus || 'MISSING'
    });
    
    // Create or get existing Stripe customer
    let customerId = user.fields.stripeCustomerId || null;
    if (!customerId) {
      console.log(`👤 Creating new Stripe customer for: ${user.fields.email}`);
      const customer = await stripe.customers.create({
        email: user.fields.email,
        name: `${user.fields.firstName || ''} ${user.fields.lastName || ''}`.trim(),
        metadata: {
          userId: req.user.id,
          airtableId: req.user.id
        }
      });
      customerId = customer.id;
      
      // Update user with customer ID immediately
      await userTable.update([
        {
          id: req.user.id,
          fields: {
            stripeCustomerId: customerId
          }
        }
      ]);
      console.log(`✅ Created Stripe customer: ${customerId}`);
    } else {
      console.log(`♻️ Using existing Stripe customer: ${customerId}`);
    }

    // Create session configuration - use Price ID if available, otherwise create price dynamically
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        STRIPE_CONFIG.PRICE_ID ? {
          // Use existing Price ID from Stripe Dashboard
          price: STRIPE_CONFIG.PRICE_ID,
          quantity: 1,
        } : {
          // Create price dynamically
          price_data: {
            currency: STRIPE_CONFIG.CURRENCY,
            product_data: {
              name: STRIPE_CONFIG.SUBSCRIPTION_NAME,
              description: STRIPE_CONFIG.SUBSCRIPTION_DESCRIPTION,
            },
            unit_amount: STRIPE_CONFIG.MONTHLY_PRICE,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        }
      ],
      mode: 'subscription',
      success_url: STRIPE_CONFIG.SUCCESS_URL,
      cancel_url: STRIPE_CONFIG.CANCEL_URL,
      customer: customerId, // Use the customer ID we created/retrieved
      metadata: {
        userId: req.user.id,
        userEmail: user.fields.email,
        firstName: user.fields.firstName || '',
        lastName: user.fields.lastName || '',
      },
      // Only add subscription_data if we have trial days
      ...(STRIPE_CONFIG.FREE_TRIAL_DAYS && STRIPE_CONFIG.FREE_TRIAL_DAYS > 0 ? {
        subscription_data: {
          trial_period_days: STRIPE_CONFIG.FREE_TRIAL_DAYS,
        }
      } : {}),
      allow_promotion_codes: true, // Allow users to enter promo codes
      billing_address_collection: 'required',
    };
    
    console.log(`🏷️ Using ${STRIPE_CONFIG.PRICE_ID ? 'existing Price ID' : 'dynamic pricing'}: $${STRIPE_CONFIG.MONTHLY_PRICE / 100}/month`);
    console.log(`📦 Request body:`, req.body);
    console.log(`🏷️ Discount code received:`, discountCode || 'NONE');

    // Apply discount code if provided (case-insensitive)
    if (discountCode) {
      console.log(`🏷️ Discount code provided: ${discountCode}`);
      console.log(`🏷️ Available codes:`, Object.keys(STRIPE_CONFIG.DISCOUNT_CODES));
      
      const normalizedCode = discountCode.toUpperCase();
      const configCode = Object.keys(STRIPE_CONFIG.DISCOUNT_CODES).find(
        code => code.toUpperCase() === normalizedCode
      );
      
      console.log(`🏷️ Normalized code: ${normalizedCode}`);
      console.log(`🏷️ Matched config code: ${configCode || 'NONE'}`);
      
      if (configCode) {
        try {
          // Create or retrieve discount coupon
          let coupon;
          try {
            coupon = await stripe.coupons.retrieve(configCode);
            console.log(`🏷️ Retrieved existing coupon: ${configCode}`);
          } catch (couponError) {
            // Create new coupon if it doesn't exist
            const discountInfo = STRIPE_CONFIG.DISCOUNT_CODES[configCode];
          coupon = await stripe.coupons.create({
            id: configCode,
            percent_off: discountInfo.percentage,
            duration: discountInfo.duration,
            name: discountInfo.description,
          });
          console.log(`✨ Created new coupon: ${configCode}`);
        }

        sessionConfig.discounts = [{
          coupon: coupon.id,
        }];
        
        console.log(`🏷️ Applied discount code: ${configCode} (${coupon.percent_off}% off)`);
        } catch (couponError) {
          console.error('❌ Error applying discount code:', couponError);
          return res.status(400).json({ error: 'Invalid discount code' });
        }
      } else {
        console.log(`❌ Invalid discount code provided: ${discountCode}`);
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    console.log(`✅ Checkout session created: ${session.id}`);
    console.log(`🔗 Redirect URL: ${session.url}`);

    res.json({ 
      url: session.url,
      sessionId: session.id,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create checkout session';
    if (error.message.includes('price')) {
      errorMessage = 'Invalid price configuration. Please contact support.';
    } else if (error.message.includes('customer')) {
      errorMessage = 'Customer information error. Please try again.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message,
      success: false 
    });
  }
});

// Validate discount code endpoint
app.post('/validate-discount-code', authenticateToken, async (req, res) => {
  try {
    const { discountCode } = req.body;
    
    if (!discountCode) {
      return res.status(400).json({ error: 'Discount code is required' });
    }

    console.log(`🏷️ Validating discount code: ${discountCode}`);
    console.log(`🏷️ Available codes:`, Object.keys(STRIPE_CONFIG.DISCOUNT_CODES));
    
    // Check if discount code exists in our configuration (case-insensitive)
    const normalizedCode = discountCode.toUpperCase();
    const configCode = Object.keys(STRIPE_CONFIG.DISCOUNT_CODES).find(
      code => code.toUpperCase() === normalizedCode
    );
    
    console.log(`🏷️ Normalized: ${normalizedCode}, Found: ${configCode || 'NONE'}`);
    
    if (configCode) {
      const discountInfo = STRIPE_CONFIG.DISCOUNT_CODES[configCode];
      return res.json({
        valid: true,
        percentage: discountInfo.percentage,
        description: discountInfo.description,
        duration: discountInfo.duration
      });
    } else {
      return res.json({
        valid: false,
        message: 'Invalid discount code'
      });
    }
  } catch (error) {
    console.error('Error validating discount code:', error);
    res.status(500).json({ error: 'Failed to validate discount code' });
  }
});

// Get user's subscription status with real-time Stripe data
app.get('/subscription-status', authenticateToken, async (req, res) => {
  try {
    const user = await userTable.find(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let subscriptionStatus = {
      tier: user.fields.tier || 'free',
      subscriptionStatus: user.fields.subscriptionStatus || 'none',
      lastPaymentDate: user.fields.lastPaymentDate || null,
      stripeCustomerId: user.fields.stripeCustomerId || null,
      stripeSubscriptionId: user.fields.stripeSubscriptionId || null,
      isActive: user.fields.tier === 'paid' && user.fields.subscriptionStatus === 'active',
    };

    // If user has a subscription, get details from Stripe
    if (user.fields.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.fields.stripeSubscriptionId);
        subscriptionStatus = {
          ...subscriptionStatus,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        };
      } catch (stripeError) {
        console.error('Error fetching subscription from Stripe:', stripeError);
      }
    }

    res.json(subscriptionStatus);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// Cancel subscription
app.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const user = await userTable.find(req.user.id);
    
    if (!user || !user.fields.stripeSubscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel the subscription at the end of the current period
    const subscription = await stripe.subscriptions.update(user.fields.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ 
      message: 'Subscription will be cancelled at the end of the current period',
      cancelAt: subscription.current_period_end 
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});


// Test payment receipt email endpoint
app.post('/test-payment-receipt', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    const result = await sendTestReceipt(email);
    res.json({ 
      success: true, 
      message: 'Test payment receipt sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending test receipt:', error);
    res.status(500).json({ error: 'Failed to send test receipt' });
  }
});

// Cleanup function for expired verification codes
const cleanupExpiredVerificationCodes = async () => {
  try {
    console.log('Cleaning up expired verification codes...');
    
    // Get all pending registrations with expired codes
    const now = new Date().toISOString();
    
    // Try to find expired records, but handle case where fields might not exist
    try {
      const expiredRecords = await userTable.select({
        filterByFormula: `AND({verificationCode} != "", {isVerified} = FALSE(), {verificationCodeExpiry} < "${now}")`
      }).firstPage();

      if (expiredRecords.length > 0) {
        console.log(`Found ${expiredRecords.length} expired verification codes to clean up`);
        
        // Delete expired records
        const recordIds = expiredRecords.map(record => record.id);
        await userTable.destroy(recordIds);
        
        console.log(`Cleaned up ${recordIds.length} expired verification codes`);
      } else {
        console.log('No expired verification codes found');
      }
    } catch (airtableError) {
      if (airtableError.message.includes('Unknown field names')) {
        console.log('⚠️  Airtable verification fields not found. Please add these fields to your Users table:');
        console.log('   - verificationCode (Single line text)');
        console.log('   - verificationCodeExpiry (Date/time)');
        console.log('   - isVerified (Checkbox)');
        console.log('   - pendingRegistration (Long text)');
        console.log('   Skipping cleanup for now...');
      } else {
        throw airtableError;
      }
    }
  } catch (error) {
    console.error('Error cleaning up expired verification codes:', error);
  }
};

// Run cleanup every 30 minutes
setInterval(cleanupExpiredVerificationCodes, 30 * 60 * 1000);

// Run cleanup on startup
cleanupExpiredVerificationCodes();

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
  console.log('🚀 Server started successfully');
  console.log('🔧 Environment:', process.env.NODE_ENV);
  console.log('🔧 Platform:', process.platform);
  console.log('🔧 Node version:', process.version);
});

// Graceful shutdown handling for Railway
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📋 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Keep the process alive and handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  console.error('Stack trace:', err.stack);
  // Don't exit immediately, let Railway handle restart
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit immediately, log and continue
});
