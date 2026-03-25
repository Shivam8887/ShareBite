const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', default: null },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentStatus: {
    type: String,
    enum: ['accepted', 'picked', 'in_transit', 'delivered'],
    default: 'accepted'
  },
  statusTimeline: {
    accepted:   { type: Date, default: null },
    picked:     { type: Date, default: null },
    in_transit: { type: Date, default: null },
    delivered:  { type: Date, default: null }
  },
  liveLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

deliverySchema.index({ liveLocation: '2dsphere' });

module.exports = mongoose.model('Delivery', deliverySchema);
