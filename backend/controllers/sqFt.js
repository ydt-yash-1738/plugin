const axios = require('axios');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzScU55V19pK_y_e2PX2SicpSOXKvO6CsY8sGaR38OjN1WtLJ65bNXCOaKaBuHLgqRx/exec';

const sqFt = async (req, res) => {
  try {
    console.log('📥 Incoming request body:', req.body); // Log everything from client

    const { sqFt, address, mandatoryCoverages, disasterCoverages } = req.body;

    // Log field-level validation
    if (!sqFt || isNaN(sqFt) || Number(sqFt) <= 0) {
      console.error('❌ Invalid sqFt received:', sqFt);
      return res.status(400).json({ error: 'Missing or invalid sqFt' });
    }
    if (!address || typeof address !== 'string' || address.trim() === '') {
      console.error('❌ Invalid address received:', address);
      return res.status(400).json({ error: 'Missing or invalid address' });
    }

    // Step 1: Geocode
    console.log('🌍 Geocoding address:', address);
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', addressdetails: 1, limit: 1 },
      headers: { 'User-Agent': 'QuickQuoteBot/1.0' }
    });

    const geoData = geoRes.data[0];
    if (!geoData || !geoData.address) {
      console.error('❌ Failed to geocode address:', address);
      return res.status(400).json({ error: 'Could not geocode address' });
    }

    const state = geoData.address.state || 'Unknown';
    const zip = geoData.address.postcode || 'Unknown';
    let county = geoData.address.county || 'Unknown';
    county = county.replace(/( County| Parish)$/i, '');

    console.log(`📌 Geocode result → State: ${state}, County: ${county}, Zip: ${zip}`);

    // Step 2: FEMA Flood Zone
    console.log(`🌀 Checking FEMA flood zone for: ${county}, ${state}`);
    const femaRes = await axios.get('https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries', {
      params: {
        $filter: `state eq '${state}' and incidentType eq 'Flood' and designatedArea eq '${county}'`,
        $top: 1,
        $orderby: 'declarationDate desc'
      }
    });

    const floodData = femaRes.data?.DisasterDeclarationsSummaries ?? [];
    const floodZone = floodData.length > 0 ? 'Yes' : 'No';
    console.log(`🌊 Flood zone status: ${floodZone}`);

    // Step 3: Prepare Payload for Google Sheet
    const payload = {
      address,
      sqFt,
      state,
      zip,
      county,
      floodZone,
      mandatoryCoverages: Array.isArray(mandatoryCoverages) ? mandatoryCoverages.join(', ') : '',
      disasterCoverages: Array.isArray(disasterCoverages) ? disasterCoverages.join(', ') : ''
    };

    console.log('[📤 Payload to Google Sheet]', payload);

    // Step 4: Send to Google Sheet
    const scriptRes = await axios.post(GOOGLE_SCRIPT_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('[📬 Google Script Response]', scriptRes.data);

    if (scriptRes.data.status === 'success') {
      const { premium, breakdown } = scriptRes.data;
      res.status(200).json({
        message: 'Data saved to Google Sheet',
        floodZone,
        premium,
        breakdown
      });
    } else {
      console.error('[❌ Script Error]', scriptRes.data);
      res.status(500).json({ error: scriptRes.data.message || 'Failed to write to Google Sheet' });
    }

  } catch (err) {
    console.error('[🔥 CATCH ERROR]', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { sqFt };
