const express = require('express');
const Airtable = require('airtable');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');
const compression = require('compression');
const { sendPasswordResetEmail, verifyEmailConfig } = require('./emailService');
const { sendEmailVerification } = require('./emailVerificationService');
const { stripe, STRIPE_CONFIG } = require('./stripe');
require('dotenv').config();

const app = express();
const port = 3006;

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base('app32Pwdg1yJPDRA7');
const userTable = base('Users');

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
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://the-ai-entrepreneur-ai-hub.github.io'],
  credentials: true
}));

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
    
    // Store registration data temporarily in memory with verification code
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

    console.log(`Verification code sent to ${email}`);
    console.log('Stored verification data:', {
      email: email,
      verificationCode: verificationResult.verificationCode,
      verificationCodeType: typeof verificationResult.verificationCode,
      expiryTime: verificationResult.expiryTime
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
    // Check if pending registration exists
    global.pendingRegistrations = global.pendingRegistrations || {};
    const pendingReg = global.pendingRegistrations[email];

    if (!pendingReg) {
      console.log('No pending registration found for email:', email);
      console.log('Available pending registrations:', Object.keys(global.pendingRegistrations));
      return res.status(400).json({ 
        error: 'No pending registration found for this email. The server may have restarted. Please try registering again.' 
      });
    }

    // Check if verification code matches
    console.log('Verification attempt:', {
      email: email,
      receivedCode: verificationCode,
      receivedCodeType: typeof verificationCode,
      storedCode: pendingReg.verificationCode,
      storedCodeType: typeof pendingReg.verificationCode,
      match: pendingReg.verificationCode === verificationCode
    });
    
    // Convert both to strings for comparison (in case of type issues)
    const storedCode = String(pendingReg.verificationCode);
    const receivedCode = String(verificationCode);
    
    if (storedCode !== receivedCode) {
      console.log('Verification code mismatch!');
      return res.status(400).json({ error: 'Invalid verification code. Please check the code and try again.' });
    }

    // Check if code has expired
    const now = new Date();
    if (now > pendingReg.expiryTime) {
      console.log('Verification code expired:', {
        email: email,
        now: now,
        expiryTime: pendingReg.expiryTime,
        expired: now > pendingReg.expiryTime
      });
      // Clean up expired registration
      delete global.pendingRegistrations[email];
      return res.status(400).json({ error: 'Verification code has expired. Please register again.' });
    }

    // Create the user account
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

    // Clean up pending registration
    delete global.pendingRegistrations[email];

    // Generate JWT token
    const token = jwt.sign({ id: records[0].id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
    
    console.log(`Email verified and account created for ${email}`);
    
    res.json({ 
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
    // Check if pending registration exists
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

    console.log(`New verification code sent to ${email}`);
    
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
    const user = await userTable.find(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already subscribed
    if (user.fields.tier === 'paid') {
      return res.status(400).json({ error: 'User already has active subscription' });
    }

    const session = await stripe.checkout.sessions.create({
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
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
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


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
