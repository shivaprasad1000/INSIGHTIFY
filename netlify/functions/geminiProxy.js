const axios = require('axios');

exports.handler = async function (event) {
  const { prompt } = JSON.parse(event.body || '{}');
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prompt || !apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing prompt or API key' })
    };
  }

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
