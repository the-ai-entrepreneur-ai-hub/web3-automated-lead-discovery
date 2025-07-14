require('dotenv').config();
const axios = require('axios');

const validateCryptoRank = async () => {
  try {
    await axios.get(`https://api.cryptorank.io/v1/currencies?api_key=${process.env.CRYPTORANK_API_KEY}&limit=1`);
    console.log('CryptoRank API key is valid.');
  } catch (error) {
    console.error('CryptoRank API key is invalid or has expired.');
  }
};

const validateDappRadar = async () => {
  try {
    await axios.get('https://dappradar.com/api/v2/dapps', {
      headers: {
        'X-BLOBR-KEY': process.env.DAPPRADAR_API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      }
    });
    console.log('DappRadar API key is valid.');
  } catch (error) {
    console.error('DappRadar API key is invalid or the request was blocked.');
  }
};

const validateAllKeys = async () => {
  await validateCryptoRank();
  await validateDappRadar();
  process.exit(0);
};

validateAllKeys();