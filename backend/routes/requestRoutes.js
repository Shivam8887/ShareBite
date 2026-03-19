const router = require('express').Router();
const {
  createRequest,
  getNearbyRequests,
  getMyRequests,
  getAllRequests,
  matchNearbyDonations
} = require('../controllers/requestController');
const { protect, roleGuard } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', roleGuard('ngo'), createRequest);
router.get('/nearby', getNearbyRequests);
router.get('/match', matchNearbyDonations);
router.get('/my', roleGuard('ngo'), getMyRequests);
router.get('/', getAllRequests);

module.exports = router;
