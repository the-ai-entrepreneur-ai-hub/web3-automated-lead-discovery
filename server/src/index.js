const express = require('express');
const Airtable = require('airtable');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');
const compression = require('compression');
const { sendPasswordResetEmail, verifyEmailConfig } = require('./emailService');
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
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit

// Configure CORS to allow credentials
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://the-ai-entrepreneur-ai-hub.github.io'],
  credentials: true
}));

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const records = await userTable.create([
      {
        fields: {
          email: email,
          password: hashedPassword,
          tier: 'free',
          firstName: firstName,
          lastName: lastName,
          company: company
        }
      }
    ]);
    
    // Generate JWT token
    const token = jwt.sign({ id: records[0].id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: {
        id: records[0].id,
        email: records[0].fields.email,
        firstName: records[0].fields.firstName,
        lastName: records[0].fields.lastName,
        company: records[0].fields.company,
        tier: records[0].fields.tier
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
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
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.fields.email,
        firstName: user.fields.firstName,
        lastName: user.fields.lastName,
        company: user.fields.company,
        tier: user.fields.tier
      }
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
    res.json({
      id: records.id,
      email: records.fields.email,
      firstName: records.fields.firstName,
      lastName: records.fields.lastName,
      company: records.fields.company,
      tier: records.fields.tier
    });
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

// Logout endpoint (mainly for server-side token invalidation if needed)
app.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT setup, logout is typically handled client-side
  // But we can log the action for security monitoring
  console.log('User logged out:', req.user.id);
  res.json({ message: 'Logged out successfully' });
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


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
