const router = require('express').Router();
const {
  getSmartRequests,
  getDeliveryHistory,
} = require('../controllers/volunteerController');
const { protect, roleGuard } = require('../middleware/authMiddleware');

router.use(protect);
router.use(roleGuard('volunteer'));

router.get('/smart-requests', getSmartRequests);
router.get('/history', getDeliveryHistory);

module.exports = router;
