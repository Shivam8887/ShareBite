const Donation = require('../models/Donation');
const Request = require('../models/Request');
const Delivery = require('../models/Delivery');

// ── Haversine distance (km) between two {lat,lng} points ──
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Estimate travel time (minutes) at ~25 km/h avg city speed
function estimateMinutes(distKm) {
  return Math.round((distKm / 25) * 60);
}

// Urgency multiplier (lower = more urgent = higher priority)
function urgencyFactor(donation) {
  const hoursLeft = (new Date(donation.expiryTime) - Date.now()) / 3600000;
  if (hoursLeft <= 1) return 0.2;
  if (hoursLeft <= 3) return 0.5;
  if (hoursLeft <= 6) return 0.8;
  return 1.0;
}

/**
 * GET /api/volunteer/smart-requests?lat=&lng=&radius=10&sort=smart
 * Returns prioritized donation+request pairs for the volunteer.
 */
exports.getSmartRequests = async (req, res) => {
  try {
    const { lat, lng, radius = 10, sort = 'smart' } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: 'lat and lng are required' });

    const vLat = parseFloat(lat);
    const vLng = parseFloat(lng);
    const radiusM = parseFloat(radius) * 1000;

    // 1. Fetch pending donations near the volunteer
    const donations = await Donation.find({
      status: 'pending',
      pickupLocation: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [vLng, vLat] },
          $maxDistance: radiusM
        }
      }
    })
      .populate('donorId', 'name phone email location')
      .lean();

    // 2. Fetch all active NGO requests (potential delivery destinations)
    const requests = await Request.find({ status: 'active' })
      .populate('ngoId', 'name phone email location')
      .lean();

    // 3. For each donation, pair with the nearest active request
    const smartList = donations.map((donation) => {
      const pickupCoords = donation.pickupLocation?.coordinates || [0, 0];
      const pickupLat = pickupCoords[1];
      const pickupLng = pickupCoords[0];

      // Distance from volunteer to pickup
      const pickupDistance = haversineKm(vLat, vLng, pickupLat, pickupLng);

      // Find nearest active request as delivery destination
      let nearestRequest = null;
      let deliveryDistance = Infinity;

      for (const req of requests) {
        const reqCoords = req.location?.coordinates || [0, 0];
        const dist = haversineKm(pickupLat, pickupLng, reqCoords[1], reqCoords[0]);
        if (dist < deliveryDistance) {
          deliveryDistance = dist;
          nearestRequest = req;
        }
      }

      if (deliveryDistance === Infinity) deliveryDistance = 0;

      const totalDistance = pickupDistance + deliveryDistance;
      const estimatedTime = estimateMinutes(totalDistance);
      const uf = urgencyFactor(donation);
      const ageHours = (Date.now() - new Date(donation.createdAt)) / 3600000;

      // Smart score: lower = better priority
      // Weight: 40% distance, 30% urgency, 30% age (older = higher priority)
      const score =
        0.4 * pickupDistance +
        0.3 * (uf * 10) +
        0.3 * Math.max(0, 10 - ageHours); // invert age so older = lower score

      return {
        donation: {
          ...donation,
          donor: donation.donorId || null,
        },
        matchedRequest: nearestRequest
          ? { ...nearestRequest, ngo: nearestRequest.ngoId || null }
          : null,
        pickupDistance: Math.round(pickupDistance * 10) / 10,
        deliveryDistance: Math.round(deliveryDistance * 10) / 10,
        totalDistance: Math.round(totalDistance * 10) / 10,
        estimatedTime,
        score: Math.round(score * 100) / 100,
      };
    });

    // 4. Sort based on requested strategy
    if (sort === 'nearest') {
      smartList.sort((a, b) => a.pickupDistance - b.pickupDistance);
    } else if (sort === 'oldest') {
      smartList.sort(
        (a, b) => new Date(a.donation.createdAt) - new Date(b.donation.createdAt)
      );
    } else if (sort === 'urgent') {
      smartList.sort(
        (a, b) => new Date(a.donation.expiryTime) - new Date(b.donation.expiryTime)
      );
    } else {
      // 'smart' — default composite score
      smartList.sort((a, b) => a.score - b.score);
    }

    // 5. Mark top item as recommended
    if (smartList.length > 0) {
      smartList[0].isRecommended = true;
    }

    res.json({
      total: smartList.length,
      radius: parseFloat(radius),
      sort,
      requests: smartList,
    });
  } catch (err) {
    console.error('❌ Smart requests error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/volunteer/history
 * Returns completed deliveries for the authenticated volunteer.
 */
exports.getDeliveryHistory = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      volunteerId: req.user._id,
      currentStatus: 'delivered',
    })
      .populate('donationId', 'title quantity pickupLocation deliveryLocation')
      .populate('requestId', 'foodNeeded location')
      .sort('-updatedAt')
      .lean();

    res.json({ deliveries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
