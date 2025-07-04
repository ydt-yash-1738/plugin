const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      }
    );

    const reply = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ response: reply || 'No response.' });
  } catch (error) {
    console.error('[Gemini API ERROR]', error?.response?.data || error.message);
    res.status(500).json({ response: 'Gemini API error.' });
  }
});

module.exports = router;
