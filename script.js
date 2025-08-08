const axios = require('axios');
require('dotenv').config();
const multiShotPrompt = require('./multiShotPrompt');

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  console.error('Error: API key not found in .env file');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};


async function sendPrompt(promptType, content) {
  try {
    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content }],
        temperature: 0.7,
      },
      { headers }
    );
    console.log(`\n=== ${promptType} Response ===`);
    console.log(data.choices[0].message.content);
  } catch (error) {
    if (error.response) {
      console.error(`Error in ${promptType}:`, error.response.data);
    } else {
      console.error(`Error in ${promptType}:`, error.message);
    }
  }
}


sendPrompt('Zero-shot', 'Can you give me a chocolate cake recipe?');


sendPrompt('Multi-shot', multiShotPrompt);
