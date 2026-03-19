const router = require('express').Router();
const {
  createDonation,
  getNearbyDonations,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
  matchNearbyRequests
} = require('../controllers/donationController');
const { protect, roleGuard } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', roleGuard('donor'), createDonation);
router.get('/nearby', getNearbyDonations);
router.get('/match', matchNearbyRequests);
router.get('/my', roleGuard('donor'), getMyDonations);
router.get('/', getAllDonations);
router.patch('/:id/status', updateDonationStatus);

module.exports = router;
