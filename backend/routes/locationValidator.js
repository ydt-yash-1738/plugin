const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  try {
    const geoRes = await axios.get('https://geo.fcc.gov/api/census/block/find', {
      params: {
        latitude: lat,
        longitude: lon,
        format: 'json'
      }
    });

    const geoData = geoRes.data;
    const stateCode = geoData?.State?.code;

    if (!stateCode) {
      return res.status(400).json({ valid: false, message: 'Address not within the US.' });
    }

    return res.status(200).json({ valid: true, stateCode, stateName: geoData.State.name });
  } catch (err) {
    console.error('[FCC API ERROR]', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
