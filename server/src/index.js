const express = require('express');
const Airtable = require('airtable');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const { addLeadToQueue } = require('./services/queue');
const { scheduleIngestion, triggerManualIngestion, getScheduleStatus } = require('./services/scheduler');

const app = express();
const port = 3006;

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base('app32Pwdg1yJPDRA7');
const userTable = base('Users');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the Web3 Prospector server!');
});

app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, company } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
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
    res.json({ user: records[0].fields });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/login', async (req, res) => {
  console.log('Login attempt received');
  const { email, password } = req.body;

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

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const records = await userTable.find(decoded.id);
    res.json(records.fields);
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/projects', (req, res) => {
  const projects = [];
  base('Leads').select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
      projects.push(record.fields);
    });
    fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
    console.log('Projects from Airtable:', projects);
    res.json(projects);
  });
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
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/api/v1/leads/start-ingestion', async (req, res) => {
  try {
    // This job will be picked up by the worker to start the scraping process
    await addLeadToQueue('start-ingestion', { 
      type: 'manual-api',
      timestamp: new Date().toISOString()
    });
    res.status(202).json({ message: 'Lead ingestion process started.' });
  } catch (error) {
    console.error('Error starting lead ingestion:', error);
    res.status(500).json({ error: 'Failed to start lead ingestion.' });
  }
});

// New endpoint for manual ingestion trigger
app.post('/api/v1/leads/trigger-manual', async (req, res) => {
  try {
    await triggerManualIngestion();
    res.status(202).json({ message: 'Manual lead ingestion triggered.' });
  } catch (error) {
    console.error('Error triggering manual ingestion:', error);
    res.status(500).json({ error: 'Failed to trigger manual ingestion.' });
  }
});

// New endpoint for scheduler status
app.get('/api/v1/scheduler/status', (req, res) => {
  try {
    const status = getScheduleStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    res.status(500).json({ error: 'Failed to get scheduler status.' });
  }
});

// Initialize scheduler
scheduleIngestion();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log('🤖 Automated scheduling is active');
});