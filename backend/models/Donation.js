const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  foodType: { type: String, enum: ['veg'], default: 'veg' },
  quantity: { type: String, required: true },
  expiryTime: { type: Date, required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },   // [lng, lat]
    address: { type: String, default: '' }
  },
  deliveryLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },  // [lng, lat]
    address: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked', 'in_transit', 'delivered'],
    default: 'pending'
  },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

donationSchema.index({ pickupLocation: '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);
