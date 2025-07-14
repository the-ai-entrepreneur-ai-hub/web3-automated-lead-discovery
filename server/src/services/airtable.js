const Airtable = require('airtable');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
const leadsTable = base('Leads');

/**
 * Extracts domain from URL for deduplication
 * @param {string} url - The website URL
 * @returns {string|null} The normalized domain or null if invalid
 */
const extractDomain = (url) => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  } catch {
    return null;
  }
};

/**
 * Checks for duplicate leads based on the website domain and creates a new lead if no duplicate is found.
 * @param {object} leadData - The data for the new lead.
 * @returns {Promise<object>} The created Airtable record.
 */
const createLead = async (leadData) => {
  const { Website } = leadData;

  if (!Website || Website === 'N/A') {
    throw new Error('Website is required for deduplication.');
  }

  const domain = extractDomain(Website);
  if (!domain) {
    throw new Error(`Invalid website URL: ${Website}`);
  }

  // Clean the lead data before sending it to Airtable
  const cleanedLeadData = { ...leadData };
  for (const key in cleanedLeadData) {
    if (typeof cleanedLeadData[key] === 'string') {
      cleanedLeadData[key] = cleanedLeadData[key].trim().replace(/\n/g, ' ');
    }
  }

  // Create Airtable formula for domain-based deduplication
  // This formula normalizes the Website field by removing protocol, www, and trailing slashes
  const formula = `LOWER(
    SUBSTITUTE(
      SUBSTITUTE(
        SUBSTITUTE(
          SUBSTITUTE({Website}, "https://", ""),
          "http://", ""),
        "www.", ""),
      "/", "")
  ) = "${domain}"`;

  try {
    // Check for duplicates using domain-based matching
    const existingRecords = await leadsTable.select({
      filterByFormula: formula
    }).firstPage();

    if (existingRecords.length > 0) {
      console.log(`[Airtable] Duplicate found for ${cleanedLeadData['Project Name']} (domain: ${domain}). Skipping creation.`);
      return existingRecords[0]; // Return the existing record
    }

    // Create new lead if no duplicate is found
    const records = await leadsTable.create([
      {
        fields: {
          ...cleanedLeadData,
          Status: 'New Lead' // Set default status as per PRD
        }
      }
    ]);
    console.log(`[Airtable] Successfully created new lead: ${cleanedLeadData['Project Name']} (domain: ${domain})`);
    return records[0];
  } catch (err) {
    console.error('[Airtable] Error creating lead:', err.message);
    throw err;
  }
};

/**
 * Gets all leads from Airtable for reporting/analytics
 * @returns {Promise<Array>} Array of lead records
 */
const getAllLeads = async () => {
  try {
    const records = [];
    await leadsTable.select({
      view: "Grid view"
    }).eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords.map(record => ({
        id: record.id,
        ...record.fields
      })));
      fetchNextPage();
    });
    return records;
  } catch (err) {
    console.error('[Airtable] Error fetching leads:', err.message);
    throw err;
  }
};

// Note: The Airtable.js client library does not support creating tables directly.
// This would typically be done via the Airtable UI or the Metadata API.
// For this project, we will assume the 'Leads' table is pre-configured as per the PRD.

module.exports = {
  createLead,
  getAllLeads,
};