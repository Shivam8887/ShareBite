const router = require('express').Router();
const {
  acceptDelivery,
  updateDeliveryStatus,
  updateLiveLocation,
  getActiveDelivery,
  getDeliveryByDonation,
  getAllDeliveries
} = require('../controllers/deliveryController');
const { protect, roleGuard } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/accept', roleGuard('volunteer'), acceptDelivery);
router.patch('/status', roleGuard('volunteer'), updateDeliveryStatus);
router.patch('/location', roleGuard('volunteer'), updateLiveLocation);
router.get('/active', roleGuard('volunteer'), getActiveDelivery);
router.get('/donation/:donationId', getDeliveryByDonation);
router.get('/', getAllDeliveries);

module.exports = router;
