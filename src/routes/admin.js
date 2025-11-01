const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const dash = require('../controllers/admin/dashboardController');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

// Admin dashboard - get all users
router.get('/users', dash.getAllUsers);

module.exports = router;
