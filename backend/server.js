require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');
const initSocket = require('./socket/socket');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const compression = require('compression');
const errorHandler = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const requestRoutes = require('./routes/requestRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const mapRoutes = require('./routes/mapRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://sharebite-sigma.vercel.app"
    ],
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  }
});
app.set('io', io);
initSocket(io);

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Production logging
  app.use(morgan('combined'));
  
  // Set security headers
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        "img-src": ["'self'", "data:", "https://a.tile.openstreetmap.org", "https://b.tile.openstreetmap.org", "https://c.tile.openstreetmap.org", "https://unpkg.com"],
      },
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api', limiter);

  // Prevent XSS attacks
  app.use(xss());

  // Prevent http param pollution
  app.use(hpp());

  // Compression
  app.use(compression());
}

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sharebite-sigma.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Sanitize MongoDB data
app.use(mongoSanitize());

// Request logger (debug)
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'production') {
     console.log(`➡️  ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/map', mapRoutes);

// Health check
app.get('/api', (_req, res) => res.json({ status: 'ShareBite API running 🚀' }));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => res.json({ status: 'ShareBite API running 🚀' }));
}

// Error Handler Middleware
app.use(errorHandler);

// Connect DB & start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
