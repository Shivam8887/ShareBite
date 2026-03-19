const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');

// POST /api/delivery/accept  –  Volunteer accepts a donation (atomic)
exports.acceptDelivery = async (req, res) => {
  try {
    const { donationId } = req.body;
    if (!donationId)
      return res.status(400).json({ message: 'donationId required' });

    // Atomic update – only grab if still pending
    const donation = await Donation.findOneAndUpdate(
      { _id: donationId, status: 'pending' },
      { status: 'accepted', assignedVolunteer: req.user._id },
      { new: true }
    );
    if (!donation)
      return res.status(409).json({ message: 'Donation already taken or not found' });

    const delivery = await Delivery.create({
      donationId: donation._id,
      volunteerId: req.user._id,
      currentStatus: 'accepted',
      statusTimeline: { accepted: new Date() },
      liveLocation: {
        type: 'Point',
        coordinates: req.user.location?.coordinates || [0, 0]
      }
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('donationStatusUpdate', donation);
      io.emit('deliveryCreated', delivery);
    }

    res.status(201).json({ delivery, donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/delivery/status  –  Volunteer updates delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    const validStatuses = ['picked', 'in_transit', 'delivered'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    if (delivery.volunteerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your delivery' });

    delivery.currentStatus = status;
    delivery.statusTimeline[status] = new Date();
    await delivery.save();

    // Update donation status too
    await Donation.findByIdAndUpdate(delivery.donationId, { status });

    const io = req.app.get('io');
    if (io) io.to(`delivery_${deliveryId}`).emit('statusUpdate', { deliveryId, status, delivery });

    res.json({ delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/delivery/location  –  Volunteer pushes live GPS
exports.updateLiveLocation = async (req, res) => {
  try {
    const { deliveryId, lat, lng } = req.body;
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.liveLocation = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };
    await delivery.save();

    const io = req.app.get('io');
    if (io) io.to(`delivery_${deliveryId}`).emit('locationUpdate', {
      deliveryId, lat: parseFloat(lat), lng: parseFloat(lng)
    });

    res.json({ delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/delivery/active  –  Volunteer's active delivery
exports.getActiveDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      volunteerId: req.user._id,
      currentStatus: { $ne: 'delivered' }
    })
      .populate('donationId')
      .sort('-createdAt');
    res.json({ delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/delivery/donation/:donationId  –  Get delivery by donation
exports.getDeliveryByDonation = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ donationId: req.params.donationId })
      .populate('volunteerId', 'name phone location');
    res.json({ delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/delivery  –  All deliveries (admin)
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('donationId')
      .populate('volunteerId', 'name email phone')
      .sort('-createdAt');
    res.json({ deliveries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
