const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');

// Simple upload route that just increments API calls
router.post('/upload', requireAuth, async (req, res) => {
  try {
    await User.incrementApiCalls(req.user.id);
    res.json({ message: 'Upload successful, API call tracked' });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;