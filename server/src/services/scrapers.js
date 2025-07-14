const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const normalizeData = (project, source) => {
  // Build a plausible website if missing
  const website = project.website ||
                  (project.slug ? `https://${project.slug}.com` : 'N/A');
  const twitter = project.twitter ||
                  (project.twitterUsername ? `https://twitter.com/${project.twitterUsername}` : 'N/A');
  
  return {
    'Project Name': project.name || 'N/A',
    Website: website,
    Twitter: twitter,
    Telegram: project.telegram || 'N/A',
    Source: source,
  };
};

const scrapeCryptoRank = async () => {
  try {
    console.log('[CryptoRank] Starting scrape...');
    const url = `https://api.cryptorank.io/v1/currencies?api_key=${process.env.CRYPTORANK_API_KEY}&limit=100`;
    const response = await axios.get(url);
    const projects = response.data.data.map(project => normalizeData({
      name: project.name,
      slug: project.slug,
      twitterUsername: project.twitterUsername,
      telegram: project.telegram,
      website: project.website
    }, 'CryptoRank'));
    console.log(`[CryptoRank] Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[CryptoRank] Error:', error.message);
    return [];
  }
};

const scrapeCoinMarketCap = async () => {
  try {
    console.log('[CoinMarketCap] Starting scrape...');
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100',
      { 
        headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY },
        timeout: 30000
      }
    );
    const projects = response.data.data.map(project => normalizeData({
      name: project.name,
      slug: project.slug,
      twitterUsername: project.twitter_username,
      website: project.urls?.website?.[0],
      telegram: project.urls?.telegram?.[0]
    }, 'CoinMarketCap'));
    console.log(`[CoinMarketCap] Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[CoinMarketCap] Error:', error.message);
    return [];
  }
};

const scrapeDappRadar = async () => {
  try {
    console.log('[DappRadar] Starting scrape...');
    const response = await axios.get('https://dappradar.com/api/v2/dapps', {
      headers: {
        'X-BLOBR-KEY': process.env.DAPPRADAR_API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      },
      timeout: 30000
    });
    const projects = response.data.data.map(project => normalizeData({
      name: project.name,
      slug: project.slug,
      twitterUsername: project.twitterUsername,
      website: project.website,
      telegram: project.telegram
    }, 'DappRadar'));
    console.log(`[DappRadar] Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[DappRadar] Error:', error.message);
    return [];
  }
};

const scrapeICODrops = async () => {
  try {
    console.log('[ICODrops] Starting scrape...');
    const response = await axios.get('https://icodrops.com/category/upcoming-ico/?filter_category=upcoming', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      },
      timeout: 30000
    });
    const $ = cheerio.load(response.data);
    const projects = [];
    
    $('.card-entity').each((_, element) => {
      const name = $('.title a', element).text().trim();
      const website = $('.links a.link-link', element).attr('href') || 'N/A';
      const twitter = $('.links a.link-twitter', element).attr('href') || 'N/A';
      const telegram = $('.links a.link-telegram', element).attr('href') || 'N/A';
      
      if (name) {
        projects.push(normalizeData({ name, website, twitter, telegram }, 'ICODrops'));
      }
    });
    console.log(`[ICODrops] Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[ICODrops] Error:', error.message);
    return [];
  }
};

const scrapeZealy = async () => {
  try {
    console.log('[Zealy] Starting scrape...');
    const response = await axios.get('https://zealy.io/leaderboards', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      },
      timeout: 30000
    });
    const $ = cheerio.load(response.data);
    const projects = [];
    
    $('.campaign-card, .leaderboard-card').each((_, element) => {
      const name = $('.campaign-card__title, .leaderboard-title', element).text().trim();
      const website = $('.campaign-card__website a', element).attr('href') || 'N/A';
      
      if (name) {
        projects.push(normalizeData({ 
          name, 
          website, 
          twitter: 'N/A', 
          telegram: 'N/A' 
        }, 'Zealy'));
      }
    });
    console.log(`[Zealy] Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[Zealy] Error:', error.message);
    return [];
  }
};

const scrapeDAOMaker = async () => {
  try {
    console.log('[DAO Maker] Starting scrape...');
    const response = await axios.get('https://daomaker.com/launchpad', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      },
      timeout: 30000
    });
    const $ = cheerio.load(response.data);
    const projects = [];
    
    $('.project-card, .launchpad-card').each((_, element) => {
      const name = $('.project-card__title, .project-title', element).text().trim();
      const website = $('.project-card__website a, .project-link', element).attr('href') || 'N/A';
      
      if (name) {
        projects.push(normalizeData({ 
          name, 
          website, 
          twitter: 'N/A', 
          telegram: 'N/A' 
        }, 'DAO Maker'));
      }
    });
    console.log(`[DAO Maker] Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[DAO Maker] Error:', error.message);
    return [];
  }
};

const scrapePolkastarter = async () => {
  try {
    console.log('[Polkastarter] Starting scrape...');
    const response = await axios.get('https://www.polkastarter.com/launchpad', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      },
      timeout: 30000
    });
    const $ = cheerio.load(response.data);
    const projects = [];
    
    $('.projects-list__item, .project-card').each((_, element) => {
      const name = $('.projects-list__title, .project-title', element).text().trim();
      const website = $('.projects-list__link, .project-link', element).attr('href') || 'N/A';
      
      if (name) {
        projects.push(normalizeData({ 
          name, 
          website, 
          twitter: 'N/A', 
          telegram: 'N/A' 
        }, 'Polkastarter'));
      }
    });
    console.log(`[Polkastarter] Found ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('[Polkastarter] Error:', error.message);
    return [];
  }
};

const runAllScrapers = async () => {
  console.log('Starting all scrapers...');
  const results = await Promise.all([
    scrapeCryptoRank(),
    scrapeCoinMarketCap(),
    scrapeDappRadar(),
    scrapeICODrops(),
    scrapeZealy(),
    scrapeDAOMaker(),
    scrapePolkastarter()
  ]);
  
  const allProjects = results.flat();
  console.log(`Total projects found across all scrapers: ${allProjects.length}`);
  return allProjects;
};

module.exports = {
  runAllScrapers,
};
