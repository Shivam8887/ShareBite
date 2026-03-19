const Request = require('../models/Request');
const Donation = require('../models/Donation');

// POST /api/requests  –  NGO creates a food request
exports.createRequest = async (req, res) => {
  try {
    const { foodNeeded, urgency, lat, lng } = req.body;
    if (!foodNeeded || lat == null || lng == null)
      return res.status(400).json({ message: 'foodNeeded, lat, lng required' });

    const request = await Request.create({
      ngoId: req.user._id,
      foodNeeded,
      urgency: urgency || 'medium',
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    const io = req.app.get('io');
    if (io) io.emit('newRequest', request);

    res.status(201).json({ request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests/nearby?lat=&lng=&radius=
exports.getNearbyRequests = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: 'lat and lng required' });

    const requests = await Request.find({
      status: 'active',
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000
        }
      }
    }).populate('ngoId', 'name phone location');

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests/my  –  NGO's own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ ngoId: req.user._id }).sort('-createdAt');
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests  –  All requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('ngoId', 'name email')
      .sort('-createdAt');
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests/match?lat=&lng=&radius=  –  Auto match: nearby donations for an NGO location
exports.matchNearbyDonations = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: 'lat and lng required' });

    const donations = await Donation.find({
      status: 'pending',
      pickupLocation: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000
        }
      }
    }).populate('donorId', 'name phone location');

    res.json({ donations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
