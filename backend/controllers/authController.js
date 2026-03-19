const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
