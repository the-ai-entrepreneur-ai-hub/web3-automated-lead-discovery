const { Queue } = require('bullmq');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const leadQueue = new Queue('lead-processing', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

const addJobToQueue = async (jobName, data = {}) => {
  try {
    await leadQueue.add(jobName, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 10, // Keep only last 10 completed jobs
      removeOnFail: 5, // Keep only last 5 failed jobs
    });
    console.log(`[Queue] Added job: ${jobName}`);
  } catch (error) {
    console.error(`[Queue] Error adding job ${jobName}:`, error.message);
    throw error;
  }
};

leadQueue.on('error', err => {
  console.error('[Queue] Redis connection error:', err);
  console.error('[Queue] Please ensure Redis is running and accessible.');
});

// Export the queue for monitoring purposes
module.exports = {
  addJobToQueue,
  leadQueue,
};