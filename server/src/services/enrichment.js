const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const findLinkedInProfile = async (projectName, browser) => {
  console.log(`  [Enrichment] Searching for LinkedIn profile for: ${projectName}`);
  let page;
  try {
    page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(projectName + ' linkedin')}`, { timeout: 60000 });

    const linkedInUrl = await page.evaluate(() => {
      const searchResult = document.querySelector('a[href*="linkedin.com/company"]');
      return searchResult ? searchResult.href : null;
    });

    console.log(`  [Enrichment] Found LinkedIn URL: ${linkedInUrl}`);
    return linkedInUrl;
  } catch (error) {
    console.error(`  [Enrichment] Error finding LinkedIn profile for ${projectName}:`, error.message);
    return null;
  } finally {
    if (page) {
      await page.close();
    }
  }
};

const findEmail = async (domain) => {
  console.log(`  [Enrichment] Searching for email on domain: ${domain}`);
  let retries = 3;
  let delay = 1000; // Start with a 1-second delay

  while (retries > 0) {
    try {
      const response = await axios.get(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${process.env.HUNTER_IO_API_KEY}`);
      if (response.data.data.emails.length > 0) {
        const email = response.data.data.emails[0].value;
        console.log(`  [Enrichment] Found email: ${email}`);
        return email;
      }
      console.log(`  [Enrichment] No email found for domain: ${domain}`);
      return null;
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 0) {
        console.log(`  [Enrichment] Hunter.io rate limit hit. Retrying in ${delay}ms...`);
        await sleep(delay);
        retries--;
        delay *= 2; // Exponential backoff
      } else {
        console.error('  [Enrichment] Error enriching email with Hunter.io:', error.message);
        return null;
      }
    }
  }
  console.log(`  [Enrichment] Failed to find email for ${domain} after multiple retries.`);
  return null;
};

const enrichLead = async (lead, browser) => {
  console.log(`  [Enrichment] Starting enrichment for: ${lead['Project Name']}`);
  if (!lead.Website || lead.Website === 'N/A') {
    console.log(`  [Enrichment] Skipping enrichment for ${lead['Project Name']} due to missing website.`);
    return lead;
  }

  let domain;
  try {
    domain = new URL(lead.Website).hostname;
  } catch (error) {
    console.error(`  [Enrichment] Invalid URL for ${lead['Project Name']}: ${lead.Website}`);
    return { ...lead, LinkedIn: null, Email: null };
  }

  const [linkedInUrl, email] = await Promise.all([
    findLinkedInProfile(lead['Project Name'], browser),
    findEmail(domain)
  ]);

  return {
    ...lead,
    LinkedIn: linkedInUrl,
    Email: email,
  };
};

module.exports = {
  enrichLead,
};