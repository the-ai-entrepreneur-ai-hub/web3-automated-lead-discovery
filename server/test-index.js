const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3006;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://web3-automated-lead-discovery.netlify.app'],
  credentials: true
}));

app.use(express.json());

// Simple health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from Web3 Prospector Railway backend!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: port,
      hasAirtableToken: !!process.env.AIRTABLE_API_TOKEN,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasResendKey: !!process.env.RESEND_API_KEY
    }
  });
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Railway backend is working!', success: true });
});

app.listen(port, () => {
  console.log(`🚀 Test server listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Has Airtable Token: ${!!process.env.AIRTABLE_API_TOKEN}`);
});

module.exports = app;