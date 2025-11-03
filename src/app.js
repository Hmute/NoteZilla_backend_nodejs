// src/app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { migrate } = require('./db/db');

// ✅ Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT; // Railway provides this automatically

// ✅ Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ✅ Routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/videos', videoRoutes);
app.use('/admin', adminRoutes);

// ✅ Default root route for sanity checks
app.get('/', (req, res) => {
  res.json({
    message: '✅ Backend is running successfully!',
    routes: {
      auth: '/auth',
      videos: '/videos',
      admin: '/admin'
    }
  });
});

// ✅ Global error handler
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

// ✅ Start server only after DB migrations
migrate()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT} and accessible externally`);
    });
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    setTimeout(() => process.exit(1), 3000);
  });
