const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateContent(prompt) {
  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // Trim whitespace and remove newline characters to ensure it's a single-line string for Airtable.
      return text.trim().replace(/\n/g, ' ');
    } catch (error) {
      if (error.status === 503 && retries > 0) {
        console.log(`  [AI] Gemini API is overloaded. Retrying in ${delay}ms...`);
        await sleep(delay);
        retries--;
        delay *= 2;
      } else {
        console.error('Error generating content with Gemini:', error);
        if (error.message.includes('API key not valid')) {
          throw new Error('The provided Gemini API key is not valid.');
        }
        throw error;
      }
    }
  }
  throw new Error('Failed to generate content with Gemini after multiple retries.');
}

const generateLeadSummary = async (leadData) => {
  const prompt = `Generate a concise summary for the following Web3 project:\n\nProject Name: ${leadData['Project Name']}\nWebsite: ${leadData.Website}\nTwitter: ${leadData.Twitter}\n\nFocus on its core value proposition and target audience.`;
  return generateContent(prompt);
};

const generateCompetitorAnalysis = async (leadData) => {
  const prompt = `Identify and list the key competitors for the following Web3 project:\n\nProject Name: ${leadData['Project Name']}\nWebsite: ${leadData.Website}\n\nProvide a brief analysis of each competitor's strengths and weaknesses.`;
  return generateContent(prompt);
};

const analyzeLead = async (lead) => {
  try {
    const [summary, competitors] = await Promise.all([
      generateLeadSummary(lead),
      generateCompetitorAnalysis(lead)
    ]);

    return {
      ...lead,
      'Lead Summary': summary,
      'Competitor Analysis': competitors,
    };
  } catch (error) {
    console.error(`Failed to analyze lead for ${lead['Project Name']}:`, error);
    // Return the lead without AI insights in case of an error
    return {
      ...lead,
      'Lead Summary': 'Error generating summary.',
      'Competitor Analysis': 'Error generating competitor analysis.',
    };
  }
};

module.exports = {
  analyzeLead,
};