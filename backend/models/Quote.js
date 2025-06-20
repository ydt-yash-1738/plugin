const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quoteRef: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stage: { type: String, enum: ['quick', 'full', 'final'], default: 'quick' },

  location: {
    city: String,
    state: String,
    zip: String,
    lat: Number,
    lng: Number
  },

  residenceAge: Number,
  material: String,
  pastClaimHistory: Boolean,
  squareFeet: Number,
  ownershipStatus: String,
  securityDevices: [String],

  apiData: {
    fema: {
      floodZone: Boolean,
      history: [{ type: String, year: Number }]
    },
    weather: {
      avgRainfall: String,
      avgWindSpeed: String
    },
    buildingCodes: {
      earthquakeResistantRequired: Boolean
    },
    locationRiskScore: Number
  },

  model: {
    quickEstimate: {
      premiumRange: [Number],
      suggestedCoverage: [String],
      modelVersion: String,
      timestamp: Date
    },
    fullEstimate: {
      finalPremium: Number,
      breakdown: {
        basePremium: Number,
        disasterMultiplier: Number,
        locationAdjustment: Number
      },
      riskScore: Number
    }
  },

  isFinalized: { type: Boolean, default: false },
  quoteCreatedAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);






































// {
//   "_id": "666b6c9fda13467f9f99a123",
//   "quoteRef": "QX20240612A001",
//   "userId": "666b6c5fda13467f9f99a111",
//   "stage": "full",
//   "location": {
//     "city": "Los Angeles",
//     "state": "CA",
//     "zip": "90001",
//     "lat": 34.0522,
//     "lng": -118.2437
//   },
//   "residenceAge": 12,
//   "material": "Wood",
//   "pastClaimHistory": true,
//   "squareFeet": 1800,
//   "ownershipStatus": "Owned",
//   "securityDevices": ["fireAlarm", "cctv"],

//   "apiData": {
//     "fema": {
//       "floodZone": true,
//       "history": [
//         { "type": "earthquake", "year": 2019 },
//         { "type": "flood", "year": 2021 }
//       ]
//     },
//     "weather": {
//       "avgRainfall": "380mm",
//       "avgWindSpeed": "18mph"
//     },
//     "buildingCodes": {
//       "earthquakeResistantRequired": true
//     },
//     "locationRiskScore": 8.2
//   },

//   "model": {
//     "quickEstimate": {
//       "premiumRange": [1050, 1250],
//       "suggestedCoverage": ["Flood", "Earthquake"],
//       "modelVersion": "v1.2",
//       "timestamp": "2025-06-12T07:45:12.000Z"
//     },
//     "fullEstimate": {
//       "finalPremium": 1175,
//       "breakdown": {
//         "basePremium": 950,
//         "disasterMultiplier": 1.18,
//         "locationAdjustment": 35
//       },
//       "riskScore": 0.74
//     }
//   },

//   "isFinalized": false,
//   "quoteCreatedAt": "2025-06-12T07:45:00.000Z",
//   "lastUpdatedAt": "2025-06-12T08:12:00.000Z"
// }
