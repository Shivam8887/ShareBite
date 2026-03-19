const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodNeeded: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }    // [lng, lat]
  },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['active', 'fulfilled'], default: 'active' }
}, { timestamps: true });

requestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Request', requestSchema);
