require('dotenv').config();
const axios = require('axios');

const testCryptoRank = async () => {
  try {
    console.log('Testing CryptoRank API...');
    const response = await axios.get(`https://api.cryptorank.io/v1/currencies?api_key=${process.env.CRYPTORANK_API_KEY}&limit=10`);
    console.log('CryptoRank API Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing CryptoRank API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  } finally {
    process.exit(0);
  }
};

testCryptoRank();