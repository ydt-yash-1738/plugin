const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true, unique: true },
  quoteRef: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverage: [String],
  premium: Number,
  paymentDate: Date,
  policyStart: Date,
  policyEnd: Date,
  policyDocUrl: String
});

module.exports = mongoose.model('Policy', policySchema);
