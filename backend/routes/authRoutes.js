const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { signup, login, getMe, updateLocation, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiter for forgot-password (5 requests per 15 min per IP)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many password reset requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/location', protect, updateLocation);

// Password reset routes
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
