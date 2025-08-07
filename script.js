const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  console.error('Error: API key not found in .env file');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};

const data = {
  model: 'llama3-8b-8192',
  messages: [
    {
      role: 'user',
      content: 'Can you give me a chocolate cake recipe?', 
    }
  ],
  temperature: 0.7,
};

axios.post('https://api.groq.com/openai/v1/chat/completions', data, { headers })
  .then((response) => {
    const answer = response.data.choices[0].message.content;
    console.log(' Groq Response:', answer);
  })
  .catch((error) => {
    if (error.response) {
      console.error(' Error:', error.response.data);
    } else {
      console.error(' Error:', error.message);
    }
  });
