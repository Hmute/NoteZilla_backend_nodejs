const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const User = require("../models/User");

// Simple upload route that just increments API calls
router.post("/upload", requireAuth, async (req, res) => {
  try {
    // Check if user has remaining API calls
    const hasCallsRemaining = await User.hasApiCallsRemaining(req.user.id);

    if (!hasCallsRemaining) {
      const currentCalls = await User.getApiCallsCount(req.user.id);
      return res.status(403).json({
        error: "API call limit exceeded",
        message: "You have reached your maximum of 20 API calls",
        currentCalls: currentCalls,
        maxCalls: 20,
      });
    }

    // Increment API calls
    await User.incrementApiCalls(req.user.id);
    const updatedCalls = await User.getApiCallsCount(req.user.id);

    res.json({
      message: "Upload successful, API call tracked",
      apiCalls: updatedCalls,
      remainingCalls: 20 - updatedCalls,
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
