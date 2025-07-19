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
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://the-ai-entrepreneur-ai-hub.github.io', 'https://web3-automated-lead-discovery.netlify.app', 'https://web3-prospector.netlify.app', 'https://6879cee60f4492000841f687--dulcet-madeleine-2018aa.netlify.app', 'https://dulcet-madeleine-2018aa.netlify.app', 'https://rawfreedomai.com'],
  credentials: true
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

// Debug OAuth configuration
console.log('🔐 OAuth Configuration:', {
  hasClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
  clientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
  isPlaceholder: process.env.GOOGLE_CLIENT_ID?.includes('your_') || false,
  callbackURL: `${process.env.API_BASE_URL || 'https://web3-automated-lead-discovery-production.up.railway.app'}/auth/google/callback`,
  clientUrl: process.env.CLIENT_URL,
  apiBaseUrl: process.env.API_BASE_URL
});

// Passport configuration
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
} else if (process.env.GOOGLE_CLIENT_ID.includes('your_')) {
  console.error('❌ Google OAuth credentials are still placeholder values. Please replace with real credentials from Google Cloud Console.');
} else {
  console.log('✅ Google OAuth credentials configured');
}

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
        isVerified: true // Google accounts are pre-verified
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

// Stripe webhook endpoint needs raw body, so place it before JSON middleware
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded:', session.id);
      
      // Update user tier to paid
      try {
        await userTable.update([
          {
            id: session.metadata.userId,
            fields: {
              tier: 'paid',
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
            }
          }
        ]);
        console.log(`User ${session.metadata.userEmail} upgraded to paid tier`);
        
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
          console.log(`Payment receipt sent to ${session.metadata.userEmail}`);
        } catch (emailError) {
          console.error('Error sending payment receipt:', emailError);
        }
      } catch (error) {
        console.error('Error updating user tier:', error);
      }
      break;
    
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      // Update user tier to free
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
              }
            }
          ]);
          console.log(`User subscription cancelled: ${users[0].fields.email}`);
        }
      } catch (error) {
        console.error('Error updating user tier on cancellation:', error);
      }
      break;
    
    case 'invoice.payment_failed':
      const invoice = event.data.object;
      console.log('Payment failed:', invoice.id);
      // Handle failed payment (send email, etc.)
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
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
  res.send('Hello from the Web3 Prospector server!');
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
    return res.redirect(`${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/login?error=oauth_not_configured`);
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
    res.redirect(`${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/login?error=oauth_initiation_failed`);
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
      return res.redirect(`${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/login?error=google_oauth_error&details=${encodeURIComponent(req.query.error_description || req.query.error)}`);
    }
    
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/login?error=oauth_failed`
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
        return res.redirect(`${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/login?error=no_user_data`);
      }

      console.log('✅ User authenticated successfully:', req.user.fields?.email || req.user.email);
      
      // Generate JWT token for the authenticated user
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
      console.log('🎫 Generated JWT token for user:', req.user.id);
      
      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/auth-success?token=${token}`;
      console.log('🔄 Redirecting to:', redirectUrl);
      console.log('🌐 CLIENT_URL from env:', process.env.CLIENT_URL);
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      console.error('📋 Error stack:', error.stack);
      res.redirect(`${process.env.CLIENT_URL || 'https://web3-prospector.netlify.app'}/login?error=oauth_callback_failed`);
    }
  }
);

// Registration endpoint - Step 1: Send verification code
app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, company } = req.body;
  
  // Validate required fields
  if (!email || !password || !firstName || !lastName || !company) {
    return res.status(400).json({ error: 'All fields are required' });
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
            isVerified: true
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
    const user = await userTable.find(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already subscribed
    if (user.fields.tier === 'paid') {
      return res.status(400).json({ error: 'User already has active subscription' });
    }

    // Create session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
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
        },
      ],
      mode: 'subscription',
      success_url: STRIPE_CONFIG.SUCCESS_URL,
      cancel_url: STRIPE_CONFIG.CANCEL_URL,
      customer_email: user.fields.email,
      metadata: {
        userId: req.user.id,
        userEmail: user.fields.email,
        firstName: user.fields.firstName,
        lastName: user.fields.lastName,
      },
      subscription_data: {
        trial_period_days: STRIPE_CONFIG.FREE_TRIAL_DAYS, // Add 7-day free trial
      },
    };

    // Apply discount code if provided
    if (discountCode && STRIPE_CONFIG.DISCOUNT_CODES[discountCode]) {
      try {
        // Create or retrieve discount coupon
        let coupon;
        try {
          coupon = await stripe.coupons.retrieve(discountCode);
        } catch (couponError) {
          // Create new coupon if it doesn't exist
          const discountInfo = STRIPE_CONFIG.DISCOUNT_CODES[discountCode];
          coupon = await stripe.coupons.create({
            id: discountCode,
            percent_off: discountInfo.percentage,
            duration: discountInfo.duration,
            name: discountInfo.description,
          });
        }

        sessionConfig.discounts = [{
          coupon: coupon.id,
        }];
        
        console.log(`Applied discount code: ${discountCode} (${coupon.percent_off}% off)`);
      } catch (couponError) {
        console.error('Error applying discount code:', couponError);
        return res.status(400).json({ error: 'Invalid discount code' });
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Validate discount code endpoint
app.post('/validate-discount-code', authenticateToken, async (req, res) => {
  try {
    const { discountCode } = req.body;
    
    if (!discountCode) {
      return res.status(400).json({ error: 'Discount code is required' });
    }

    // Check if discount code exists in our configuration
    if (STRIPE_CONFIG.DISCOUNT_CODES[discountCode]) {
      const discountInfo = STRIPE_CONFIG.DISCOUNT_CODES[discountCode];
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

// Get user's subscription status
app.get('/subscription-status', authenticateToken, async (req, res) => {
  try {
    const user = await userTable.find(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let subscriptionStatus = {
      tier: user.fields.tier || 'free',
      isActive: user.fields.tier === 'paid',
      stripeCustomerId: user.fields.stripeCustomerId || null,
      stripeSubscriptionId: user.fields.stripeSubscriptionId || null,
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
