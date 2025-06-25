//const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhxV8cBojuQf0at-eHcTBQ9EHVI-3tJnhd7lBLPsDlFLRsZ00n0n2jNQWLfDLoTHqC/exec';
// const axios = require('axios');

// const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBiNzCgtKTmW7LIf6WNMH6lMtcNRP7OQJMqiXxy0JXc_ByZcZkXMrAf8jVs7JsNtw2/exec';

// const sqFt = async (req, res) => {
//   try {
//     const { sqFt, address } = req.body;
//     if (!sqFt || !address) {
//       return res.status(400).json({ error: 'Missing sqFt or address' });
//     }

//     // Step 1: Geocode
//     const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
//       params: { q: address, format: 'json', addressdetails: 1, limit: 1 },
//       headers: { 'User-Agent': 'QuickQuoteBot/1.0' }
//     });

//     const geoData = geoRes.data[0];
//     if (!geoData || !geoData.address) {
//       return res.status(400).json({ error: 'Could not geocode address' });
//     }

//     const state = geoData.address.state || 'Unknown';
//     const zip = geoData.address.postcode || 'Unknown';
//     let county = geoData.address.county || 'Unknown';

//     // Normalize county name to match FEMA format
//     county = county.replace(/( County| Parish)$/i, '');

//     // Step 2: Check FEMA flood declaration by state & county
//     const femaRes = await axios.get('https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries', {
//       params: {
//         $filter: `state eq '${state}' and incidentType eq 'Flood' and designatedArea eq '${county}'`,
//         $top: 1,
//         $orderby: 'declarationDate desc'
//       }
//     });

//     const floodData = femaRes.data?.DisasterDeclarationsSummaries ?? [];
//     const floodZone = floodData.length > 0 ? 'Yes' : 'No';

//     // Step 3: Send to Google Apps Script
//     const payload = { sqFt, state, zip, county, floodZone };
//     const scriptRes = await axios.post(GOOGLE_SCRIPT_URL, payload);

//     if (scriptRes.data.status === 'success') {
//       res.status(200).json({ message: 'Data saved to Google Sheet', floodZone });
//     } else {
//       res.status(500).json({ error: scriptRes.data.message || 'Failed to write to Google Sheet' });
//     }
//   } catch (err) {
//     console.error('[CATCH ERROR]', err.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = { sqFt };


// const axios = require('axios');

// const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzScU55V19pK_y_e2PX2SicpSOXKvO6CsY8sGaR38OjN1WtLJ65bNXCOaKaBuHLgqRx/exec';

// const sqFt = async (req, res) => {
//   try {
//     const { sqFt, address, mandatoryCoverages, disasterCoverages } = req.body;
//     if (!sqFt || !address) {
//       return res.status(400).json({ error: 'Missing sqFt or address' });
//     }

//     // Step 1: Geocode
//     const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
//       params: { q: address, format: 'json', addressdetails: 1, limit: 1 },
//       headers: { 'User-Agent': 'QuickQuoteBot/1.0' }
//     });

//     const geoData = geoRes.data[0];
//     if (!geoData || !geoData.address) {
//       return res.status(400).json({ error: 'Could not geocode address' });
//     }

//     const state = geoData.address.state || 'Unknown';
//     const zip = geoData.address.postcode || 'Unknown';
//     let county = geoData.address.county || 'Unknown';
//     county = county.replace(/( County| Parish)$/i, '');

//     // Step 2: FEMA Flood Zone (fallback if needed)
//     const femaRes = await axios.get('https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries', {
//       params: {
//         $filter: `state eq '${state}' and incidentType eq 'Flood' and designatedArea eq '${county}'`,
//         $top: 1,
//         $orderby: 'declarationDate desc'
//       }
//     });

//     const floodData = femaRes.data?.DisasterDeclarationsSummaries ?? [];
//     const floodZone = floodData.length > 0 ? 'Yes' : 'No';

//     // Step 3: Send to Google Sheet
//     const payload = {
//       address,
//       sqFt,
//       state,
//       zip,
//       county,
//       floodZone,
//       mandatoryCoverages: Array.isArray(mandatoryCoverages) ? mandatoryCoverages.join(', ') : '',
//       disasterCoverages: Array.isArray(disasterCoverages) ? disasterCoverages.join(', ') : ''
//     };

//     console.log('[Payload to Google Sheet]', payload);

//     const scriptRes = await axios.post(GOOGLE_SCRIPT_URL, payload);

//     if (scriptRes.data.status === 'success') {
//       const { premium, breakdown } = scriptRes.data;
//       res.status(200).json({
//         message: 'Data saved to Google Sheet',
//         floodZone,
//         premium,
//         breakdown
//       });
//     }
//     else {
//       res.status(500).json({ error: scriptRes.data.message || 'Failed to write to Google Sheet' });
//     }
//   } catch (err) {
//     console.error('[CATCH ERROR]', err.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = { sqFt };


const axios = require('axios');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzScU55V19pK_y_e2PX2SicpSOXKvO6CsY8sGaR38OjN1WtLJ65bNXCOaKaBuHLgqRx/exec';

const sqFt = async (req, res) => {
  try {
    const { sqFt, address, mandatoryCoverages, disasterCoverages } = req.body;

    if (!sqFt || !address) {
      return res.status(400).json({ error: 'Missing sqFt or address' });
    }

    // Step 1: Geocode
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', addressdetails: 1, limit: 1 },
      headers: { 'User-Agent': 'QuickQuoteBot/1.0' }
    });

    const geoData = geoRes.data[0];
    if (!geoData || !geoData.address) {
      return res.status(400).json({ error: 'Could not geocode address' });
    }

    const state = geoData.address.state || 'Unknown';
    const zip = geoData.address.postcode || 'Unknown';
    let county = geoData.address.county || 'Unknown';
    county = county.replace(/( County| Parish)$/i, '');

    // Step 2: FEMA Flood Zone
    const femaRes = await axios.get('https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries', {
      params: {
        $filter: `state eq '${state}' and incidentType eq 'Flood' and designatedArea eq '${county}'`,
        $top: 1,
        $orderby: 'declarationDate desc'
      }
    });

    const floodData = femaRes.data?.DisasterDeclarationsSummaries ?? [];
    const floodZone = floodData.length > 0 ? 'Yes' : 'No';

    // Step 3: Prepare Payload for Google Script
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

    console.log('[Payload to Google Sheet]', payload);

    // Step 4: Send to Google Sheet with proper Content-Type
    const scriptRes = await axios.post(GOOGLE_SCRIPT_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('[Google Script Response]', scriptRes.data);

    if (scriptRes.data.status === 'success') {
      const { premium, breakdown } = scriptRes.data;

      if (!breakdown) {
        console.warn('⚠️ Premium calculated but breakdown missing');
      }

      res.status(200).json({
        message: 'Data saved to Google Sheet',
        floodZone,
        premium,
        breakdown
      });
    } else {
      console.error('[Script Error]', scriptRes.data);
      res.status(500).json({ error: scriptRes.data.message || 'Failed to write to Google Sheet' });
    }

  } catch (err) {
    console.error('[CATCH ERROR]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { sqFt };
