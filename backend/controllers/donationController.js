const Donation = require('../models/Donation');
const Request = require('../models/Request');

// POST /api/donations  –  Donor creates a donation
exports.createDonation = async (req, res) => {
  try {
    const { title, description, quantity, expiryTime, lat, lng } = req.body;
    if (!title || !quantity || !expiryTime || lat == null || lng == null)
      return res.status(400).json({ message: 'title, quantity, expiryTime, lat, lng required' });

    const donation = await Donation.create({
      title,
      description,
      quantity,
      expiryTime,
      donorId: req.user._id,
      pickupLocation: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    // Emit socket event for new donation
    const io = req.app.get('io');
    if (io) io.emit('newDonation', donation);

    res.status(201).json({ donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/donations/nearby?lat=&lng=&radius=  –  Volunteer sees nearby pending donations
exports.getNearbyDonations = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: 'lat and lng are required' });

    const donations = await Donation.find({
      status: 'pending',
      pickupLocation: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000  // km → m
        }
      }
    }).populate('donorId', 'name phone location');

    res.json({ donations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/donations/my  –  Donor's own donations
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id })
      .populate('assignedVolunteer', 'name phone')
      .sort('-createdAt');
    res.json({ donations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/donations  –  All donations (admin / general)
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donorId', 'name email')
      .populate('assignedVolunteer', 'name email')
      .sort('-createdAt');
    res.json({ donations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/donations/:id/status  –  Update donation status
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    const io = req.app.get('io');
    if (io) io.emit('donationStatusUpdate', donation);

    res.json({ donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/donations/match?lat=&lng=&radius=  –  Auto match: nearby NGO requests for a donation's location
exports.matchNearbyRequests = async (req, res) => {
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
