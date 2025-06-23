// server.js or weatherRouter.js
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const WEATHER_API_KEY = 'a163b02442f842648f864802250406';

router.get('/', async (req, res) => {
  const { location } = req.query;
  console.log('Received location:', location); 

  try {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=no`;
    console.log('Calling:', apiUrl); 

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('Weather API error:', data); 
      return res.status(500).json({ error: 'Weather API error', details: data });
    }

    res.json(data);
  } catch (error) {
    console.error('Internal server error:', error); // ✅ Catch unexpected issues
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


module.exports = router;
