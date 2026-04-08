const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const VALID_ROLES = ['donor', 'ngo', 'volunteer', 'admin'];

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    console.log('📥 Signup REQ BODY:', req.body);

    const { name, email, password, role, phone, lat, lng } = req.body;

    // Required field validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required (name, email, password, role)' });
    }

    // Role validation
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: `Invalid role "${role}". Must be one of: ${VALID_ROLES.join(', ')}` });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({
      name, email, password, role,
      phone: phone || '',
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0]
      }
    });

    const token = signToken(user._id);
    console.log('✅ User created:', user.email, '| Role:', user.role);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    console.log('📥 Login REQ BODY:', req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Update location if provided
    if (req.body.lat != null && req.body.lng != null) {
      user.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };
      await user.save();
    }

    const token = signToken(user._id);
    console.log('✅ Login success:', user.email, '| Role:', user.role);
    res.json({ token, user });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// PATCH /api/auth/location
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    req.user.location = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generic message – never reveal whether the email exists
    const genericMsg = 'If an account exists with that email, a password reset link has been sent.';

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return same message so attackers can't enumerate emails
      return res.json({ message: genericMsg });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before saving (only the hash is stored in DB)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // Build reset URL with the UNHASHED token
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="max-width:520px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">
        <div style="background:linear-gradient(135deg,#10b981,#059669);padding:32px 24px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:-0.5px;">🍽️ ShareBite</h1>
          <p style="margin:8px 0 0;color:#d1fae5;font-size:14px;">Password Reset Request</p>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#d1d5db;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Hi <strong style="color:#f9fafb;">${user.name}</strong>,<br/>
            We received a request to reset your password. Click the button below to choose a new one:
          </p>
          <div style="text-align:center;margin:0 0 24px;">
            <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:16px;font-weight:600;border-radius:12px;text-decoration:none;">
              Reset Password
            </a>
          </div>
          <p style="color:#9ca3af;font-size:13px;line-height:1.5;margin:0 0 16px;">
            ⏰ This link will expire in <strong style="color:#fbbf24;">15 minutes</strong>.
          </p>
          <p style="color:#6b7280;font-size:12px;line-height:1.5;margin:0;">
            If you didn't request this, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
        <div style="background:#0d1117;padding:16px 24px;text-align:center;">
          <p style="margin:0;color:#4b5563;font-size:11px;">© ${new Date().getFullYear()} ShareBite. Connecting food donors with those in need.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'ShareBite Password Reset',
      html,
    });

    console.log('✅ Password reset email sent to:', user.email);
    res.json({ message: genericMsg });
  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
  }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Strong password validation: ≥ 8 chars, uppercase, lowercase, digit
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters with uppercase, lowercase, and a number',
      });
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password (bcrypt pre-save hook handles hashing)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);
    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    console.error('❌ Reset password error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
