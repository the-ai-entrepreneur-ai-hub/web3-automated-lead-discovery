const { Worker } = require('bullmq');
const puppeteer = require('puppeteer');
const { runAllScrapers } = require('./scrapers');
const { enrichLead } = require('./enrichment');
const { analyzeLead } = require('./ai');
const { createLead } = require('./airtable');
const { addJobToQueue } = require('./queue');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Global browser instance for efficiency
let globalBrowser = null;

const getBrowser = async () => {
  if (!globalBrowser) {
    console.log('[Worker] Launching browser...');
    globalBrowser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return globalBrowser;
};

const worker = new Worker('lead-processing', async job => {
  if (job.name === 'start-ingestion') {
    console.log(`[Worker] Starting lead ingestion process... (Type: ${job.data?.type || 'unknown'})`);
    
    try {
      const allProjects = await runAllScrapers();
      let validProjects = 0;
      
      for (const project of allProjects) {
        if (project.Website && project.Website !== 'N/A') {
          await addJobToQueue('process-lead', project);
          validProjects++;
        }
      }
      
      console.log(`[Worker] Added ${validProjects} valid projects out of ${allProjects.length} total to the processing queue.`);
    } catch (error) {
      console.error('[Worker] Error during ingestion:', error.message);
      throw error;
    }
  }

  if (job.name === 'process-lead') {
    const browser = await getBrowser();
    
    try {
      console.log(`[Worker] Processing lead: ${job.data['Project Name']}`);
      
      // Enrich lead with LinkedIn and email data
      const enrichedLead = await enrichLead(job.data, browser);
      console.log(`[Worker] Enriched lead: ${job.data['Project Name']}`);
      
      // Analyze lead with AI
      const analyzedLead = await analyzeLead(enrichedLead);
      console.log(`[Worker] Analyzed lead: ${job.data['Project Name']}`);
      
      // Create lead in Airtable
      await createLead(analyzedLead);
      console.log(`[Worker] Successfully processed and stored lead: ${job.data['Project Name']}`);
      
    } catch (error) {
      console.error(`[Worker] Failed to process lead ${job.data['Project Name']}:`, error.message);
      throw error;
    }
  }
}, {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  concurrency: 3 // Process up to 3 leads simultaneously
});

console.log('[Worker] Worker is listening for jobs...');

worker.on('completed', job => {
  console.log(`[Worker] Job ${job.id} (${job.name}) completed successfully`);
});

worker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job.id} (${job.name}) failed: ${err.message}`);
});

worker.on('error', err => {
  console.error('[Worker] Redis connection error:', err);
  console.error('[Worker] Please ensure Redis is running and accessible.');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('[Worker] Shutting down gracefully...');
  await worker.close();
  if (globalBrowser) {
    await globalBrowser.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[Worker] Shutting down gracefully...');
  await worker.close();
  if (globalBrowser) {
    await globalBrowser.close();
  }
  process.exit(0);
});