const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');

// GET /api/map/map-data — Combined map data for all markers
router.get('/map-data', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    // ── Fetch all active donations ──
    let donations = [];
    try {
      // If valid coordinates provided, try geo-query first
      if (lat && lng && parseFloat(lat) !== 0 && parseFloat(lng) !== 0) {
        donations = await Donation.find({
          status: { $in: ['pending', 'accepted'] },
          pickupLocation: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: parseFloat(radius) * 1000
            }
          }
        })
          .populate('donorId', 'name phone email')
          .lean();
      } else {
        // No coordinates — just fetch all pending/accepted
        donations = await Donation.find({ status: { $in: ['pending', 'accepted'] } })
          .populate('donorId', 'name phone email')
          .lean();
      }
    } catch (geoErr) {
      // Geo-query failed (bad index, invalid docs, etc.) — fallback to non-geo query
      console.warn('⚠️ Geo-query failed for donations, falling back:', geoErr.message);
      donations = await Donation.find({ status: { $in: ['pending', 'accepted'] } })
        .populate('donorId', 'name phone email')
        .lean();
    }

    // Normalize: frontend expects `donor` field, schema has `donorId`
    donations = donations.map(d => ({
      ...d,
      donor: d.donorId || null,
    }));

    // ── Fetch all active requests ──
    let requests = [];
    try {
      if (lat && lng && parseFloat(lat) !== 0 && parseFloat(lng) !== 0) {
        requests = await Request.find({
          status: 'active',
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: parseFloat(radius) * 1000
            }
          }
        })
          .populate('ngoId', 'name phone email')
          .lean();
      } else {
        requests = await Request.find({ status: 'active' })
          .populate('ngoId', 'name phone email')
          .lean();
      }
    } catch (geoErr) {
      console.warn('⚠️ Geo-query failed for requests, falling back:', geoErr.message);
      requests = await Request.find({ status: 'active' })
        .populate('ngoId', 'name phone email')
        .lean();
    }

    // Normalize: frontend expects `ngo` field, schema has `ngoId`
    requests = requests.map(r => ({
      ...r,
      ngo: r.ngoId || null,
    }));

    // ── Fetch all volunteers ──
    let volunteers = [];
    try {
      if (lat && lng && parseFloat(lat) !== 0 && parseFloat(lng) !== 0) {
        volunteers = await User.find({
          role: 'volunteer',
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: parseFloat(radius) * 1000
            }
          }
        }).lean();
      } else {
        volunteers = await User.find({ role: 'volunteer' }).lean();
      }
    } catch (geoErr) {
      console.warn('⚠️ Geo-query failed for volunteers, falling back:', geoErr.message);
      volunteers = await User.find({ role: 'volunteer' }).lean();
    }

    console.log(`✅ Map data: ${donations.length} donations, ${requests.length} requests, ${volunteers.length} volunteers`);

    res.status(200).json({
      success: true,
      donations,
      requests,
      volunteers
    });
  } catch (error) {
    console.error('❌ Map Data Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching map data',
      error: error.message
    });
  }
});

module.exports = router;
