const router = require('express').Router();
const { signup, login, getMe, updateLocation } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/location', protect, updateLocation);

module.exports = router;
